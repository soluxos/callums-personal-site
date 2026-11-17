"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate } from "motion/react";
import { canvasPanX, canvasPanY, canvasZoom } from "@/lib/ideasTransform";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 3;
const ZOOM_SENSITIVITY = 0.001;
const FONT = "var(--font-satoshi), Satoshi, sans-serif";

const STICKY_COLORS = {
  yellow: {
    bg: "oklch(0.92 0.18 82.45 / 1)",
    border: "oklch(0.6 0.18 82.45 / 1)",
    shadow: "rgba(249,207,0,0.25)",
  },
  pink: {
    bg: "oklch(0.92 0.18 2.45 / 1)",
    border: "oklch(0.6 0.18 2.45 / 1)",
    shadow: "rgba(233,30,140,0.18)",
  },
  blue: {
    bg: "oklch(0.92 0.18 -100.55 / 1)",
    border: "oklch(0.6 0.18 -100.55 / 1)",
    shadow: "rgba(33,150,243,0.18)",
  },
  green: {
    bg: "oklch(0.92 0.18 151.45 / 1)",
    border: "oklch(0.6 0.18 151.45 / 1)",
    shadow: "rgba(76,175,80,0.18)",
  },
  orange: {
    bg: "oklch(0.92 0.18 51.45 / 1)",
    border: "oklch(0.6 0.18 51.45 / 1)",
    shadow: "rgba(255,152,0,0.22)",
  },
  purple: {
    bg: "oklch(0.92 0.18 290.45 / 1)",
    border: "oklch(0.6 0.18 290.45 / 1)",
    shadow: "rgba(156,39,176,0.18)",
  },
};

const COLOR_KEYS = Object.keys(STICKY_COLORS);
const NOTE_W = 200;
const NOTE_H = 200;

function TapeStrip() {
  return (
    <div
      style={{
        position: "absolute",
        top: -9,
        left: "50%",
        transform: "translateX(-50%)",
        width: 52,
        height: 18,
        background: "rgba(255,255,255,0.55)",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    />
  );
}

function StickyNote({
  note,
  isEditing,
  isSelected,
  onPointerDown,
  onDoubleClick,
  onTextChange,
  onTextBlur,
}) {
  const { bg, border, shadow } = STICKY_COLORS[note.color] ?? STICKY_COLORS.yellow;
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      resizeTextarea();
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      onMouseDown={e => {
        if (isEditing || e.button !== 0) return;
        e.stopPropagation();
        onPointerDown(e, note.id);
      }}
      onTouchStart={e => {
        if (isEditing) return;
        e.stopPropagation();
        // Single tap → select; movement is handled at canvas level if needed
        const touch = e.touches[0];
        onPointerDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 }, note.id);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        onDoubleClick(note.id);
      }}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: NOTE_W,
        minHeight: NOTE_H,
        background: bg,
        border: isSelected ? `1px solid ${border}` : `1px solid ${bg}`,
        borderRadius: 4,
        padding: "32px 16px 28px",
        boxShadow: `0 4px 18px ${shadow}, 0 1px 3px rgba(0,0,0,0.10)`,
        transform: `rotate(${note.rotation}deg)`,
        transformOrigin: "center center",
        fontFamily: FONT,
        cursor: isEditing ? "text" : "grab",
        userSelect: isEditing ? "text" : "none",
        pointerEvents: "all",
        transition: "border 0.1s, box-shadow 0.1s",
      }}
    >
      <TapeStrip />
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={note.text}
          onChange={e => {
            onTextChange(note.id, e.target.value);
            resizeTextarea();
          }}
          onBlur={() => onTextBlur(note.id)}
          onKeyDown={e => {
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              textareaRef.current?.blur();
            }
          }}
          style={{
            display: "block",
            width: "100%",
            minHeight: NOTE_H - 48,
            height: NOTE_H - 48,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            overflow: "hidden",
            fontSize: 13,
            lineHeight: "1.55",
            color: "#2a2a2a",
            fontFamily: FONT,
            fontWeight: 500,
            boxSizing: "border-box",
          }}
          spellCheck={false}
        />
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: "1.55",
            color: "#2a2a2a",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontWeight: 500,
          }}
        >
          {note.text}
        </p>
      )}
      {note.author && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 16,
            fontSize: 10,
            fontWeight: 500,
            color: "rgba(0,0,0,0.45)",
            fontFamily: FONT,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {note.author}
        </div>
      )}
    </div>
  );
}

export default function IdeasCanvas({ notes: initialNotes, isDev }) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [ghost, setGhost] = useState(null);
  const [swatchHovered, setSwatchHovered] = useState(false);

  const canvasRef = useRef(null);
  const noteDragRef = useRef(null);
  const toolbarDragRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0, z: 1 });
  const midPanRef = useRef(null);
  const touchRef = useRef(null); // touch pan/pinch state
  const notesRef = useRef(notes);
  const editingIdRef = useRef(null);
  const selectedIdRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Module-level motion values, so anything outside the canvas can read pan/zoom for
  // canvas-space cursor positioning without prop-drilling.
  const panX = canvasPanX;
  const panY = canvasPanY;
  const zoom = canvasZoom;

  // Reset transform when this page is left
  useEffect(() => {
    return () => {
      canvasPanX.set(0);
      canvasPanY.set(0);
      canvasZoom.set(1);
    };
  }, []);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  useEffect(() => {
    editingIdRef.current = editingId;
  }, [editingId]);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // Centre view on mount using canvas element dimensions
  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2 - 200;
    panX.set(cx);
    panY.set(cy);
    panRef.current = { x: cx, y: cy, z: 1 };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel events attached only to the canvas element
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    function onWheel(e) {
      e.preventDefault();
      const p = panRef.current;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (e.ctrlKey) {
        const delta = -e.deltaY * ZOOM_SENSITIVITY * (e.deltaMode === 1 ? 8 : 1);
        const newZ = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, p.z * (1 + delta * 3)));
        const newPX = mx - (mx - p.x) * (newZ / p.z);
        const newPY = my - (my - p.y) * (newZ / p.z);
        panRef.current = { x: newPX, y: newPY, z: newZ };
        panX.set(newPX);
        panY.set(newPY);
        zoom.set(newZ);
      } else {
        const dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        const newPX = p.x - dx;
        const newPY = p.y - dy;
        panRef.current = { x: newPX, y: newPY, z: p.z };
        panX.set(newPX);
        panY.set(newPY);
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [panX, panY, zoom]);

  // Touch: single-finger pan, two-finger pinch-zoom
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    function dist(a, b) {
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onTouchStart(e) {
      // Don't hijack taps on notes (they have their own handlers)
      if (e.target !== el) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        touchRef.current = {
          type: "pan",
          startMX: e.touches[0].clientX,
          startMY: e.touches[0].clientY,
          startPX: panRef.current.x,
          startPY: panRef.current.y,
        };
      } else if (e.touches.length === 2) {
        const d = dist(e.touches[0], e.touches[1]);
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        touchRef.current = {
          type: "pinch",
          startDist: d,
          startZ: panRef.current.z,
          startPX: panRef.current.x,
          startPY: panRef.current.y,
          midX: mx,
          midY: my,
        };
      }
    }

    function onTouchMove(e) {
      const t = touchRef.current;
      if (!t) return;
      e.preventDefault();
      const p = panRef.current;
      if (t.type === "pan" && e.touches.length === 1) {
        const newPX = t.startPX + (e.touches[0].clientX - t.startMX);
        const newPY = t.startPY + (e.touches[0].clientY - t.startMY);
        panRef.current = { ...p, x: newPX, y: newPY };
        panX.set(newPX);
        panY.set(newPY);
      } else if (t.type === "pinch" && e.touches.length === 2) {
        const d = dist(e.touches[0], e.touches[1]);
        const newZ = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.startZ * (d / t.startDist)));
        const mx = t.midX;
        const my = t.midY;
        const newPX = mx - (mx - t.startPX) * (newZ / t.startZ);
        const newPY = my - (my - t.startPY) * (newZ / t.startZ);
        panRef.current = { x: newPX, y: newPY, z: newZ };
        panX.set(newPX);
        panY.set(newPY);
        zoom.set(newZ);
      }
    }

    function onTouchEnd() {
      touchRef.current = null;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [panX, panY, zoom]);

  // Window-level mouse + keyboard events
  useEffect(() => {
    function onMouseDown(e) {
      if (e.button === 1) {
        e.preventDefault();
        midPanRef.current = {
          startMX: e.clientX,
          startMY: e.clientY,
          startPX: panRef.current.x,
          startPY: panRef.current.y,
        };
      }
    }

    function onMouseMove(e) {
      if (noteDragRef.current) {
        isDraggingRef.current = true;
        const nd = noteDragRef.current;
        const z = panRef.current.z;
        const dx = (e.clientX - nd.startMX) / z;
        const dy = (e.clientY - nd.startMY) / z;
        setNotes(prev =>
          prev.map(n =>
            n.id === nd.id
              ? { ...n, x: Math.round(nd.startNX + dx), y: Math.round(nd.startNY + dy) }
              : n
          )
        );
        return;
      }
      if (toolbarDragRef.current) {
        setGhost({ x: e.clientX, y: e.clientY, color: toolbarDragRef.current.color });
        return;
      }
      if (midPanRef.current) {
        const mp = midPanRef.current;
        const newPX = mp.startPX + (e.clientX - mp.startMX);
        const newPY = mp.startPY + (e.clientY - mp.startMY);
        panRef.current = { ...panRef.current, x: newPX, y: newPY };
        panX.set(newPX);
        panY.set(newPY);
      }
    }

    async function onMouseUp(e) {
      if (toolbarDragRef.current) {
        const color = toolbarDragRef.current.color;
        toolbarDragRef.current = null;
        setGhost(null);
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const overCanvas =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (overCanvas) {
            const p = panRef.current;
            const x = Math.round((e.clientX - rect.left - p.x) / p.z - NOTE_W / 2);
            const y = Math.round((e.clientY - rect.top - p.y) / p.z - NOTE_H / 2);
            const rotation = parseFloat((Math.random() * 6 - 3).toFixed(1));
            const id = Date.now().toString();
            const newNote = { id, x, y, color, rotation, text: "New note" };
            setNotes(prev => [...prev, newNote]);
            setSelectedId(id);
            setEditingId(id);
            if (isDev) {
              try {
                await fetch("/api/ideas", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newNote),
                });
              } catch {}
            }
          }
        }
        return;
      }
      if (noteDragRef.current) {
        if (isDev && isDraggingRef.current) {
          const nd = noteDragRef.current;
          const moved = notesRef.current.find(n => n.id === nd.id);
          if (moved) {
            try {
              await fetch("/api/ideas", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: moved.id, x: moved.x, y: moved.y }),
              });
            } catch {}
          }
        }
        noteDragRef.current = null;
        isDraggingRef.current = false;
        return;
      }
      if (e.button === 1) midPanRef.current = null;
    }

    async function onKeyDown(e) {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedIdRef.current &&
        !editingIdRef.current
      ) {
        const id = selectedIdRef.current;
        setNotes(prev => prev.filter(n => n.id !== id));
        setSelectedId(null);
        if (isDev) {
          try {
            await fetch("/api/ideas", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
          } catch {}
        }
        return;
      }
      if (e.key === "Escape") {
        setEditingId(null);
        setSelectedId(null);
      }
      if ((e.key === "r" || e.key === "R") && !editingIdRef.current) {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2 - 200;
        animate(panX, cx, { type: "spring", stiffness: 280, damping: 34 });
        animate(panY, cy, { type: "spring", stiffness: 280, damping: 34 });
        animate(zoom, 1, { type: "spring", stiffness: 280, damping: 34 });
        panRef.current = { x: cx, y: cy, z: 1 };
      }
    }

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [panX, panY, zoom, isDev]);

  const handleNoteDragStart = (e, id) => {
    setSelectedId(id);
    const note = notesRef.current.find(n => n.id === id);
    if (!note) return;
    noteDragRef.current = {
      id,
      startMX: e.clientX,
      startMY: e.clientY,
      startNX: note.x,
      startNY: note.y,
    };
    isDraggingRef.current = false;
  };

  const handleTextChange = (id, text) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, text } : n)));
  };

  const handleTextBlur = async id => {
    setEditingId(null);
    if (!isDev) return;
    const note = notesRef.current.find(n => n.id === id);
    if (!note) return;
    try {
      await fetch("/api/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note.id, text: note.text }),
      });
    } catch {}
  };

  const ghostColors = ghost ? (STICKY_COLORS[ghost.color] ?? STICKY_COLORS.yellow) : null;

  return (
    <>
      {/* Canvas — position:fixed so it fills the full viewport */}
      <motion.div
        ref={canvasRef}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: 1,
        }}
        onMouseDown={e => {
          if (e.target === canvasRef.current) setSelectedId(null);
        }}
      >
        <motion.div
          style={{
            x: panX,
            y: panY,
            scale: zoom,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
        >
          {notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              isSelected={selectedId === note.id}
              onPointerDown={handleNoteDragStart}
              onDoubleClick={id => {
                setSelectedId(id);
                setEditingId(id);
              }}
              onTextChange={handleTextChange}
              onTextBlur={handleTextBlur}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Toolbar — visible to all; API calls (persistence) are dev-only */}
      {
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderRadius: 40,
            padding: "10px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
            zIndex: 1000,
            userSelect: "none",
            fontFamily: FONT,
          }}
        >
          {/* Draggable post-it swatch */}
          <div
            onMouseEnter={() => setSwatchHovered(true)}
            onMouseLeave={() => setSwatchHovered(false)}
            onMouseDown={e => {
              if (e.button !== 0) return;
              e.preventDefault();
              setSwatchHovered(false);
              toolbarDragRef.current = { color: selectedColor };
              setGhost({ x: e.clientX, y: e.clientY, color: selectedColor });
            }}
            style={{
              position: "relative",
              width: 32,
              height: 32,
              borderRadius: 3,
              background: STICKY_COLORS[selectedColor].bg,
              border: `1.5px solid ${STICKY_COLORS[selectedColor].border}`,
              cursor: "grab",
              flexShrink: 0,
              boxShadow: `0 2px 8px ${STICKY_COLORS[selectedColor].shadow}`,
              transition: "background 0.12s, border 0.12s, box-shadow 0.12s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 14,
                height: 6,
                background: "rgba(255,255,255,0.75)",
                borderRadius: 1,
              }}
            />
            {/* Tooltip — AvatarPill style, appears above the toolbar */}
            {swatchHovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 10px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#333",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  padding: "3px 8px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  fontFamily: FONT,
                  zIndex: 9999,
                }}
              >
                {/* Triangle pointing down toward the swatch */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid #333",
                  }}
                />
                Click and drag a post-it to add
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 22, background: "#e5e5e5", flexShrink: 0 }} />

          {COLOR_KEYS.map(c => (
            <button
              key={c}
              title={c}
              onClick={() => setSelectedColor(c)}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: STICKY_COLORS[c].bg,
                border:
                  selectedColor === c
                    ? `2.5px solid ${STICKY_COLORS[c].border}`
                    : "2px solid rgba(0,0,0,0.10)",
                cursor: "pointer",
                transform: selectedColor === c ? "scale(1.22)" : "scale(1)",
                transition: "transform 0.1s, border 0.1s",
                flexShrink: 0,
                padding: 0,
              }}
            />
          ))}
        </div>
      }

      {/* Ghost note following cursor during toolbar drag */}
      {ghost && ghostColors && (
        <div
          style={{
            position: "fixed",
            left: ghost.x - NOTE_W / 2,
            top: ghost.y - NOTE_H / 2,
            width: NOTE_W,
            height: NOTE_H,
            background: ghostColors.bg,
            border: `1.5px solid ${ghostColors.border}`,
            borderRadius: 4,
            padding: "32px 16px 16px",
            boxShadow: `0 12px 40px ${ghostColors.shadow}, 0 2px 8px rgba(0,0,0,0.12)`,
            opacity: 0.88,
            pointerEvents: "none",
            zIndex: 9999,
            fontFamily: FONT,
            transform: "rotate(-1.5deg) scale(1.02)",
            transformOrigin: "center center",
          }}
        >
          <TapeStrip />
          <p style={{ margin: 0, fontSize: 13, color: "#2a2a2a80", fontStyle: "italic" }}>
            Drop to place
          </p>
        </div>
      )}
    </>
  );
}
