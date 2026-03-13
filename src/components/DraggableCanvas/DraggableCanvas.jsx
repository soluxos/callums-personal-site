"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useEditMode } from "@/contexts/EditModeContext";
import LayersPanel from "./LayersPanel";

const ACCENT = "#1a6cf1";
const DRAG_THRESHOLD = 4;
const HANDLE_SIZE = 8;
const MIN_SIZE = 20;
const SPRING_STIFF = 0.22;
const SPRING_DAMP = 0.78;

// Module-level: survives SPA navigation, resets on hard browser refresh
const txStore = new Map();
const sizeStore = new Map();

// Undo / redo stacks — each entry: { el, before, after }
// before/after: { tx, ty, w?, h? }
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 50;

// entry shapes:
//   { type: "transform", el, before: { tx, ty, w?, h? }, after: { tx, ty, w?, h? } }
//   { type: "delete",    el, parent, nextSibling, before: { tx, ty, w?, h? } }
function pushHistory(entry) {
  redoStack.length = 0;
  undoStack.push(entry);
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
}

function applyHistoryEntry(el, state) {
  txStore.set(el, { tx: state.tx, ty: state.ty });
  el.style.transform = `translate(${state.tx}px, ${state.ty}px)`;
  if (state.w != null) {
    sizeStore.set(el, { w: state.w, h: state.h });
    el.style.width = `${state.w}px`;
    el.style.height = `${state.h}px`;
    el.style.maxWidth = "none";
    el.style.maxHeight = "none";
  }
}

const SKIP_TAGS = new Set(["HTML", "BODY", "SCRIPT", "STYLE", "NOSCRIPT", "HEAD"]);

const HANDLES = [
  { id: "nw", ax: 0, ay: 0, cursor: "nw-resize", dw: -1, dh: -1 },
  { id: "n", ax: 0.5, ay: 0, cursor: "n-resize", dw: 0, dh: -1 },
  { id: "ne", ax: 1, ay: 0, cursor: "ne-resize", dw: 1, dh: -1 },
  { id: "e", ax: 1, ay: 0.5, cursor: "e-resize", dw: 1, dh: 0 },
  { id: "se", ax: 1, ay: 1, cursor: "se-resize", dw: 1, dh: 1 },
  { id: "s", ax: 0.5, ay: 1, cursor: "s-resize", dw: 0, dh: 1 },
  { id: "sw", ax: 0, ay: 1, cursor: "sw-resize", dw: -1, dh: 1 },
  { id: "w", ax: 0, ay: 0.5, cursor: "w-resize", dw: -1, dh: 0 },
];

// Uses elementsFromPoint to find the topmost meaningful element under the cursor.
// Skips the canvas UI overlay, any opt-out elements, and anything outside #page-content.
function pickTarget(clientX, clientY) {
  const root = document.getElementById("page-content");
  const els = document.elementsFromPoint(clientX, clientY);
  for (const el of els) {
    if (el === document.body || el === document.documentElement) continue;
    if (SKIP_TAGS.has(el.tagName)) continue;
    if (el.closest("[data-canvas-ui]")) continue;
    if (el.hasAttribute("data-no-drag") || el.closest("[data-no-drag]")) continue;
    if (root && !root.contains(el)) continue;
    const d = window.getComputedStyle(el).display;
    if (d === "none" || d === "contents" || d === "inline") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 4) continue;
    return el;
  }
  return null;
}

function tagLabel(el) {
  const tag = el.tagName.toLowerCase();
  if (el.id) return `${tag}#${el.id}`;
  const first =
    el.className && typeof el.className === "string"
      ? el.className
          .trim()
          .split(/\s+/)
          .find(c => c && !c.includes(":") && c.length < 24)
      : null;
  return first ? `${tag}.${first}` : tag;
}

function getRect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

// When dragging starts, temporarily unlock overflow:hidden on all ancestors so
// the element isn't clipped when moved outside its container. Restores on drop.
function unlockAncestorOverflow(el, ref) {
  const list = [];
  let node = el.parentElement;
  while (node && node !== document.body) {
    const cs = window.getComputedStyle(node);
    if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
      list.push({
        node,
        ov: node.style.overflow,
        ox: node.style.overflowX,
        oy: node.style.overflowY,
      });
      node.style.overflow = "visible";
      node.style.overflowX = "visible";
      node.style.overflowY = "visible";
    }
    node = node.parentElement;
  }
  ref.current = list;
}

function restoreAncestorOverflow(ref) {
  for (const { node, ov, ox, oy } of ref.current) {
    node.style.overflow = ov;
    node.style.overflowX = ox;
    node.style.overflowY = oy;
  }
  ref.current = [];
}

function ResizeHandle({ id, vx, vy, cursor, active }) {
  return (
    <div
      data-canvas-ui
      data-handle={id}
      style={{
        position: "fixed",
        left: vx - HANDLE_SIZE / 2,
        top: vy - HANDLE_SIZE / 2,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        background: active ? ACCENT : "#fff",
        border: `2px solid ${ACCENT}`,
        borderRadius: 1,
        boxSizing: "border-box",
        cursor,
        zIndex: 99999,
        pointerEvents: "all",
      }}
    />
  );
}

export default function DraggableCanvas({ children }) {
  const { editMode } = useEditMode();
  const [mounted, setMounted] = useState(false);
  const [hoverRect, setHoverRect] = useState(null);
  const [selRect, setSelRect] = useState(null);
  const [activeHandle, setActiveHandle] = useState(null);
  const [phase, setPhase] = useState("idle"); // "idle" | "dragging" | "resizing"

  const hoverElRef = useRef(null);
  const selElRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const rafRef = useRef(null);
  const springRef = useRef({ cx: 0, cy: 0, tx: 0, ty: 0, vx: 0, vy: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0, t: 0 });
  const overflowRef = useRef([]);
  const textEditElRef = useRef(null);
  const textBeforeRef = useRef("");

  // Called from the Layers panel to select an element programmatically
  const handleLayerSelect = useCallback(el => {
    selElRef.current = el;
    setSelRect({ el, ...getRect(el) });
  }, []);

  useEffect(() => setMounted(true), []);

  // Intercept link/button clicks in edit mode so navigation is blocked but
  // pointer events (hover, drag) still work normally.
  useEffect(() => {
    if (!editMode) return;
    const block = e => {
      if (e.target.closest("a[href]")) e.preventDefault();
    };
    document.addEventListener("click", block, true);
    return () => document.removeEventListener("click", block, true);
  }, [editMode]);

  // Keep overlays in sync during scroll / resize
  useEffect(() => {
    const update = () => {
      if (selElRef.current) setSelRect({ el: selElRef.current, ...getRect(selElRef.current) });
      if (hoverElRef.current)
        setHoverRect({ el: hoverElRef.current, ...getRect(hoverElRef.current) });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!editMode) {
      restoreAncestorOverflow(overflowRef);
      cancelAnimationFrame(rafRef.current);
      dragRef.current = null;
      resizeRef.current = null;
      setHoverRect(null);
      setSelRect(null);
      setPhase("idle");
      setActiveHandle(null);
      hoverElRef.current = null;
      selElRef.current = null;
      if (textEditElRef.current) {
        textEditElRef.current.contentEditable = "inherit";
        textEditElRef.current.style.outline = "";
        textEditElRef.current = null;
        textBeforeRef.current = "";
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      return;
    }

    function getHandleId(el) {
      let node = el;
      while (node) {
        if (node.dataset?.handle) return node.dataset.handle;
        node = node.parentElement;
      }
      return null;
    }

    function exitTextEdit(pushUndo = true) {
      const el = textEditElRef.current;
      if (!el) return;
      el.contentEditable = "inherit";
      el.style.outline = "";
      if (pushUndo) {
        const after = el.innerText;
        if (after !== textBeforeRef.current) {
          pushHistory({ type: "text", el, before: textBeforeRef.current, after });
        }
      }
      textEditElRef.current = null;
      textBeforeRef.current = "";
      setPhase("idle");
    }

    function enterTextEdit(el) {
      // Only edit leaf elements — elements with no child elements (only text nodes).
      // Editing containers with element children risks deleting React-managed DOM nodes.
      if (el.children.length > 0) return;
      exitTextEdit();
      textEditElRef.current = el;
      textBeforeRef.current = el.innerText;
      el.contentEditable = "plaintext-only";
      el.style.outline = "none";
      el.addEventListener("blur", () => setTimeout(() => exitTextEdit(), 50), { once: true });
      selElRef.current = el;
      setSelRect({ el, ...getRect(el) });
      el.focus();
      setPhase("editing");
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    function onMouseMove(e) {
      const now = performance.now();
      const dt = now - prevMouseRef.current.t;
      if (dt > 0 && dt < 100) {
        velRef.current.x = (e.clientX - prevMouseRef.current.x) / dt;
        velRef.current.y = (e.clientY - prevMouseRef.current.y) / dt;
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY, t: now };

      // Active drag
      if (dragRef.current) {
        const ds = dragRef.current;
        const dx = e.clientX - ds.startMX;
        const dy = e.clientY - ds.startMY;
        if (!ds.moved && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
          ds.moved = true;
          setPhase("dragging");
          document.body.style.cursor = "grabbing";
          document.body.style.userSelect = "none";
          ds.el.style.zIndex = "9000";
          unlockAncestorOverflow(ds.el, overflowRef);
          const s = springRef.current;
          s.cx = ds.startTX;
          s.cy = ds.startTY;
          s.tx = ds.startTX;
          s.ty = ds.startTY;
          s.vx = 0;
          s.vy = 0;
          const loop = () => {
            const s = springRef.current;
            s.vx = s.vx * SPRING_DAMP + (s.tx - s.cx) * SPRING_STIFF;
            s.vy = s.vy * SPRING_DAMP + (s.ty - s.cy) * SPRING_STIFF;
            s.cx += s.vx;
            s.cy += s.vy;
            if (dragRef.current?.el) {
              dragRef.current.el.style.transform = `translate(${s.cx}px, ${s.cy}px)`;
              setSelRect({ el: dragRef.current.el, ...getRect(dragRef.current.el) });
            }
            if (dragRef.current?.moved) rafRef.current = requestAnimationFrame(loop);
          };
          rafRef.current = requestAnimationFrame(loop);
        }
        if (ds.moved) {
          springRef.current.tx = ds.startTX + dx;
          springRef.current.ty = ds.startTY + dy;
        }
        return;
      }

      // Active resize
      if (resizeRef.current) {
        const rs = resizeRef.current;
        const dx = e.clientX - rs.startMX;
        const dy = e.clientY - rs.startMY;
        const h = HANDLES.find(h => h.id === rs.handle);
        if (!h) return;
        let newW = rs.startW,
          newH = rs.startH,
          newTX = rs.startTX,
          newTY = rs.startTY;
        if (h.dw === 1) newW = Math.max(MIN_SIZE, rs.startW + dx);
        if (h.dw === -1) {
          newW = Math.max(MIN_SIZE, rs.startW - dx);
          newTX = rs.startTX + (rs.startW - newW);
        }
        if (h.dh === 1) newH = Math.max(MIN_SIZE, rs.startH + dy);
        if (h.dh === -1) {
          newH = Math.max(MIN_SIZE, rs.startH - dy);
          newTY = rs.startTY + (rs.startH - newH);
        }
        const el = rs.el;
        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;
        el.style.maxWidth = "none";
        el.style.maxHeight = "none";
        el.style.overflow = "hidden";
        el.style.transition = "none";
        el.style.transform = `translate(${newTX}px, ${newTY}px)`;
        sizeStore.set(el, { w: newW, h: newH });
        txStore.set(el, { tx: newTX, ty: newTY });
        setSelRect({ el, ...getRect(el) });
        return;
      }

      // Hover — skip if in text editing mode, or mousing over a handle or any canvas UI element
      if (textEditElRef.current) return;
      if (getHandleId(e.target)) return;
      if (e.target.closest("[data-canvas-ui]") && !e.target.closest("[data-handle]")) {
        if (hoverElRef.current) {
          hoverElRef.current = null;
          setHoverRect(null);
          document.body.style.cursor = "";
        }
        return;
      }
      const target = pickTarget(e.clientX, e.clientY);
      if (target !== hoverElRef.current) {
        hoverElRef.current = target;
        setHoverRect(target ? { el: target, ...getRect(target) } : null);
        document.body.style.cursor = target ? "grab" : "";
      } else if (target) {
        setHoverRect({ el: target, ...getRect(target) });
      }
    }

    function onMouseDown(e) {
      if (e.button !== 0) return;
      // Let canvas UI elements (layers panel, etc.) handle their own mouse events —
      // but still allow resize handle mousedowns through.
      if (e.target.closest("[data-canvas-ui]") && !e.target.closest("[data-handle]")) return;
      // If text editing, allow clicks within the element (cursor positioning) but exit on outside clicks
      if (textEditElRef.current) {
        if (textEditElRef.current.contains(e.target)) return;
        exitTextEdit();
      }
      // Prevent the browser from starting its own link/image drag or text selection
      if (e.target.closest("a, img")) e.preventDefault();

      const handleId = getHandleId(e.target);
      if (handleId && selElRef.current) {
        e.preventDefault();
        const el = selElRef.current;
        const stored = txStore.get(el) ?? { tx: 0, ty: 0 };
        const size = sizeStore.get(el);
        const r = el.getBoundingClientRect();
        const startW = size?.w ?? r.width;
        const startH = size?.h ?? r.height;
        resizeRef.current = {
          el,
          handle: handleId,
          startMX: e.clientX,
          startMY: e.clientY,
          startW,
          startH,
          startTX: stored.tx,
          startTY: stored.ty,
          before: { tx: stored.tx, ty: stored.ty, w: startW, h: startH },
        };
        setPhase("resizing");
        setActiveHandle(handleId);
        document.body.style.cursor = HANDLES.find(h => h.id === handleId)?.cursor ?? "default";
        document.body.style.userSelect = "none";
        return;
      }

      const target = pickTarget(e.clientX, e.clientY);
      if (!target) {
        selElRef.current = null;
        setSelRect(null);
        return;
      }
      selElRef.current = target;
      setSelRect({ el: target, ...getRect(target) });
      const stored = txStore.get(target) ?? { tx: 0, ty: 0 };
      dragRef.current = {
        el: target,
        startMX: e.clientX,
        startMY: e.clientY,
        startTX: stored.tx,
        startTY: stored.ty,
        moved: false,
        before: { tx: stored.tx, ty: stored.ty },
      };
      prevMouseRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    }

    function onMouseUp(e) {
      if (resizeRef.current) {
        const rs = resizeRef.current;
        const finalTX = txStore.get(rs.el)?.tx ?? rs.startTX;
        const finalTY = txStore.get(rs.el)?.ty ?? rs.startTY;
        const finalW = sizeStore.get(rs.el)?.w ?? rs.startW;
        const finalH = sizeStore.get(rs.el)?.h ?? rs.startH;
        if (
          finalTX !== rs.startTX ||
          finalTY !== rs.startTY ||
          finalW !== rs.startW ||
          finalH !== rs.startH
        ) {
          pushHistory({
            type: "transform",
            el: rs.el,
            before: rs.before,
            after: { tx: finalTX, ty: finalTY, w: finalW, h: finalH },
          });
        }
        resizeRef.current = null;
        setPhase("idle");
        setActiveHandle(null);
        document.body.style.cursor = "grab";
        document.body.style.userSelect = "";
        return;
      }
      const ds = dragRef.current;
      if (!ds) return;
      cancelAnimationFrame(rafRef.current);
      if (!ds.moved) {
        dragRef.current = null;
        setPhase("idle");
        return;
      }

      const tx = ds.startTX + (e.clientX - ds.startMX);
      const ty = ds.startTY + (e.clientY - ds.startMY);
      const el = ds.el;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      el.style.zIndex = "";

      pushHistory({ type: "transform", el, before: ds.before, after: { tx, ty } });

      const ivx = velRef.current.x * 12;
      const ivy = velRef.current.y * 12;
      if (Math.hypot(ivx, ivy) > 1.5) {
        let cvx = ivx,
          cvy = ivy,
          cx = tx,
          cy = ty;
        const inertia = () => {
          cvx *= 0.88;
          cvy *= 0.88;
          cx += cvx;
          cy += cvy;
          el.style.transform = `translate(${cx}px, ${cy}px)`;
          txStore.set(el, { tx: cx, ty: cy });
          if (Math.hypot(cvx, cvy) > 0.4) requestAnimationFrame(inertia);
          else if (selElRef.current === el) setSelRect({ el, ...getRect(el) });
        };
        requestAnimationFrame(inertia);
      } else {
        txStore.set(el, { tx, ty });
      }

      restoreAncestorOverflow(overflowRef);
      dragRef.current = null;
      setPhase("idle");
      document.body.style.cursor = "grab";
      document.body.style.userSelect = "";
      setTimeout(() => {
        if (selElRef.current === el) setSelRect({ el, ...getRect(el) });
      }, 400);
    }

    function onKeyDown(e) {
      // While in text editing mode, only intercept Escape; everything else is handled by the browser
      if (textEditElRef.current) {
        if (e.key === "Escape") {
          exitTextEdit();
          e.preventDefault();
        }
        return;
      }
      // Undo: Cmd/Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const entry = undoStack.pop();
        if (!entry) return;
        redoStack.push(entry);
        if (entry.type === "text") {
          entry.el.innerText = entry.before;
        } else if (entry.type === "delete") {
          entry.parent.insertBefore(entry.el, entry.nextSibling);
          applyHistoryEntry(entry.el, entry.before);
        } else {
          applyHistoryEntry(entry.el, entry.before);
        }
        // Select the affected element and refresh the overlay once the browser has repainted
        selElRef.current = entry.el;
        requestAnimationFrame(() => setSelRect({ el: entry.el, ...getRect(entry.el) }));
        return;
      }
      // Redo: Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        const entry = redoStack.pop();
        if (!entry) return;
        undoStack.push(entry);
        if (entry.type === "text") {
          entry.el.innerText = entry.after;
          selElRef.current = entry.el;
          requestAnimationFrame(() => setSelRect({ el: entry.el, ...getRect(entry.el) }));
        } else if (entry.type === "delete") {
          entry.el.remove();
          selElRef.current = null;
          hoverElRef.current = null;
          setSelRect(null);
          setHoverRect(null);
        } else {
          applyHistoryEntry(entry.el, entry.after);
          selElRef.current = entry.el;
          requestAnimationFrame(() => setSelRect({ el: entry.el, ...getRect(entry.el) }));
        }
        return;
      }
      // Delete / Backspace — remove selected element and its children
      if ((e.key === "Backspace" || e.key === "Delete") && selElRef.current) {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)
        )
          return;
        e.preventDefault();
        const el = selElRef.current;
        const storedTx = txStore.get(el) ?? { tx: 0, ty: 0 };
        const storedSize = sizeStore.get(el) ?? null;
        pushHistory({
          type: "delete",
          el,
          parent: el.parentElement,
          nextSibling: el.nextSibling,
          before: { tx: storedTx.tx, ty: storedTx.ty, ...(storedSize ?? {}) },
        });
        el.remove();
        selElRef.current = null;
        hoverElRef.current = null;
        setSelRect(null);
        setHoverRect(null);
        return;
      }
      if (e.key === "Escape") {
        restoreAncestorOverflow(overflowRef);
        cancelAnimationFrame(rafRef.current);
        dragRef.current = null;
        resizeRef.current = null;
        selElRef.current = null;
        setSelRect(null);
        setPhase("idle");
        setActiveHandle(null);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    function onDblClick(e) {
      if (e.target.closest("[data-canvas-ui]")) return;
      const root = document.getElementById("page-content");
      if (root && !root.contains(e.target)) return;
      if (e.target.closest("[data-no-drag]")) return;
      const tag = e.target.tagName;
      if (["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME"].includes(tag)) return;
      // Cancel any drag that started from the preceding mousedown
      if (dragRef.current && !dragRef.current.moved) {
        dragRef.current = null;
        setPhase("idle");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
      enterTextEdit(e.target);
    }

    // Suppress native browser drag on links/images so our custom drag takes over
    const blockDragStart = e => e.preventDefault();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("dblclick", onDblClick);
    window.addEventListener("dragstart", blockDragStart);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("dragstart", blockDragStart);
      restoreAncestorOverflow(overflowRef);
      cancelAnimationFrame(rafRef.current);
      if (textEditElRef.current) {
        textEditElRef.current.contentEditable = "inherit";
        textEditElRef.current.style.outline = "";
        textEditElRef.current = null;
        textBeforeRef.current = "";
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [editMode]);

  const showHover = editMode && hoverRect && hoverRect.el !== selElRef.current;
  const showSel = editMode && selRect;

  return (
    <>
      <motion.div
        animate={{ paddingLeft: mounted && editMode ? 220 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
      {mounted && editMode && <LayersPanel selEl={selRect?.el} onSelect={handleLayerSelect} />}
      {mounted &&
        editMode &&
        createPortal(
          <div
            data-canvas-ui
            style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }}
          >
            {/* Hover outline */}
            {showHover && (
              <div
                style={{
                  position: "fixed",
                  left: hoverRect.x - 1,
                  top: hoverRect.y - 1,
                  width: hoverRect.w + 2,
                  height: hoverRect.h + 2,
                  outline: `1.5px solid ${ACCENT}`,
                  borderRadius: 2,
                  boxSizing: "border-box",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Selection outline + handles + label */}
            {showSel && (
              <>
                <div
                  style={{
                    position: "fixed",
                    left: selRect.x - 2,
                    top: selRect.y - 2,
                    width: selRect.w + 4,
                    height: selRect.h + 4,
                    outline: `2px solid ${ACCENT}`,
                    borderRadius: 2,
                    boxSizing: "border-box",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "fixed",
                    left: selRect.x - 2,
                    top: Math.max(0, selRect.y - 22),
                    background: ACCENT,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 3,
                    fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                    pointerEvents: "none",
                    zIndex: 99999,
                  }}
                >
                  {phase === "dragging"
                    ? "moving…"
                    : phase === "resizing"
                      ? "resizing…"
                      : phase === "editing"
                        ? "editing text…"
                        : tagLabel(selRect.el)}
                </div>
                {phase !== "dragging" && phase !== "editing" && (
                  <div style={{ pointerEvents: "all" }}>
                    {HANDLES.map(h => (
                      <ResizeHandle
                        key={h.id}
                        id={h.id}
                        vx={selRect.x + h.ax * selRect.w}
                        vy={selRect.y + h.ay * selRect.h}
                        cursor={h.cursor}
                        active={activeHandle === h.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
