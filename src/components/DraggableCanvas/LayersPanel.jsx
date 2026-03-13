"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  StretchHorizontal,
  StretchVertical,
  LayoutGrid,
  Square,
  Minus,
  Circle,
} from "lucide-react";

const FONT = "var(--font-satoshi), Satoshi, sans-serif";
const ACCENT = "#1a6cf1";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "HEAD"]);

function getDisplayInfo(el) {
  try {
    const cs = window.getComputedStyle(el);
    const d = cs.display;
    const dir = cs.flexDirection;
    if (d === "flex" || d === "inline-flex") {
      const isCol = dir === "column" || dir === "column-reverse";
      return { Icon: isCol ? StretchVertical : StretchHorizontal, color: "#7c5cbf" };
    }
    if (d === "grid" || d === "inline-grid") return { Icon: LayoutGrid, color: "#bf7c1a" };
    if (d === "block") return { Icon: Square, color: "#aaa" };
    if (d === "inline-block") return { Icon: Minus, color: "#bbb" };
    return { Icon: Circle, color: "#ddd" };
  } catch {
    return { Icon: Circle, color: "#ddd" };
  }
}

function nodeLabel(el) {
  const tag = el.tagName.toLowerCase();
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function getVisibleChildren(el) {
  return Array.from(el.children).filter(
    c => !c.hasAttribute("data-canvas-ui") && !SKIP_TAGS.has(c.tagName)
  );
}

function TreeNode({
  el,
  depth,
  expandedSet,
  onToggle,
  selEl,
  onSelect,
  ancestorSet,
  panelHovered,
  connectTop = false,
}) {
  const isSelected = el === selEl;
  const isAncestor = ancestorSet.has(el);
  const isHighlighted = isSelected || isAncestor;
  const isExpanded = expandedSet.has(el);
  const children = getVisibleChildren(el);
  const hasKids = children.length > 0;
  const { Icon, color } = getDisplayInfo(el);
  const [rowHovered, setRowHovered] = useState(false);

  // Connect bottom edge when this row is highlighted, expanded, and the first child is also highlighted
  const firstChild = hasKids ? children[0] : null;
  const connectBottom =
    isHighlighted &&
    isExpanded &&
    !!firstChild &&
    (firstChild === selEl || ancestorSet.has(firstChild));

  const borderTopLeftRadius = connectTop ? 0 : 4;
  const borderTopRightRadius = connectTop ? 0 : 4;
  const borderBottomLeftRadius = connectBottom ? 0 : 4;
  const borderBottomRightRadius = connectBottom ? 0 : 4;

  return (
    <div>
      <motion.div
        onClick={e => {
          e.stopPropagation();
          onSelect(el);
        }}
        onHoverStart={() => setRowHovered(true)}
        onHoverEnd={() => setRowHovered(false)}
        animate={{
          backgroundColor: isSelected
            ? ACCENT
            : isAncestor
              ? "#eef3ff"
              : rowHovered
                ? "#f5f5f5"
                : "transparent",
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
        }}
        transition={{ duration: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          paddingLeft: 8 + depth * 14,
          paddingRight: 8,
          paddingTop: 6,
          paddingBottom: 6,
          cursor: "pointer",
          color: isSelected ? "#fff" : "#222",
          fontSize: 11,
          fontFamily: FONT,
          fontWeight: isSelected ? 600 : 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Expand chevron — visible only when panel is hovered and node has children */}
        <motion.span
          onClick={e => {
            e.stopPropagation();
            if (hasKids) onToggle(el);
          }}
          animate={{
            opacity: panelHovered && hasKids ? 1 : 0,
            rotate: isExpanded ? 90 : 0,
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: 10,
            height: 10,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: hasKids ? "auto" : "none",
          }}
        >
          <span
            style={{
              fontSize: 6,
              lineHeight: 1,
              color: isSelected ? "rgba(255,255,255,0.6)" : "#bbb",
            }}
          >
            ▶
          </span>
        </motion.span>

        {/* Display-type icon */}
        <Icon
          size={12}
          color={isSelected ? "rgba(255,255,255,0.75)" : color}
          style={{ flexShrink: 0 }}
        />

        {/* Label */}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
          {nodeLabel(el)}
        </span>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && hasKids && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {children.map((child, i) => {
              const prev = i > 0 ? children[i - 1] : null;
              const prevHighlighted = prev && (prev === selEl || ancestorSet.has(prev));
              const prevCollapsed = prev && !expandedSet.has(prev);
              const childConnectTop =
                (i === 0 && isHighlighted) || (i > 0 && !!prevHighlighted && !!prevCollapsed);
              return (
                <TreeNode
                  key={i}
                  el={child}
                  depth={depth + 1}
                  expandedSet={expandedSet}
                  onToggle={onToggle}
                  selEl={selEl}
                  onSelect={onSelect}
                  ancestorSet={ancestorSet}
                  panelHovered={panelHovered}
                  connectTop={childConnectTop}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LayersPanel({ selEl, onSelect }) {
  const PANEL_W = 220;
  const [expanded, setExpanded] = useState(new Set());
  const [panelHovered, setPanelHovered] = useState(false);
  const [, forceUpdate] = useState(0);

  // Watch DOM mutations scoped to #page-content
  useEffect(() => {
    let timer;
    const obs = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => forceUpdate(n => n + 1), 150);
    });
    const obsTarget = document.getElementById("page-content") ?? document.body;
    obs.observe(obsTarget, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Auto-expand ancestors when selection changes (scoped to #page-content)
  useEffect(() => {
    if (!selEl) return;
    const root = document.getElementById("page-content");
    const toExpand = [];
    let node = selEl.parentElement;
    while (node && node !== document.body && node !== root) {
      toExpand.push(node);
      node = node.parentElement;
    }
    if (!toExpand.length) return;
    setExpanded(prev => {
      const next = new Set(prev);
      toExpand.forEach(el => next.add(el));
      return next;
    });
  }, [selEl]);

  const handleToggle = el => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(el) ? next.delete(el) : next.add(el);
      return next;
    });
  };

  const root = document.getElementById("page-content");
  const ancestorSet = new Set();
  if (selEl) {
    let node = selEl.parentElement;
    while (node && node !== document.body && node !== root) {
      ancestorSet.add(node);
      node = node.parentElement;
    }
  }

  const topLevel = root ? getVisibleChildren(root) : [];

  return createPortal(
    <motion.div
      data-canvas-ui
      data-no-drag
      initial={{ x: -PANEL_W }}
      animate={{ x: 0 }}
      exit={{ x: -PANEL_W }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setPanelHovered(true)}
      onMouseLeave={() => setPanelHovered(false)}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: PANEL_W,
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #e4e4e4",
        borderRadius: 0,
        // boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        zIndex: 99997,
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <span className="text-[16px] font-ppmondwest font-medium leading-[1.25] text-[#484848]">
          Layers
        </span>
        {/* <span
          style={{ fontSize: 9, color: "#bbb", fontFamily: "monospace", letterSpacing: "0.05em" }}
        >
          DOM
        </span> */}
      </div>

      {/* Tree */}
      <div style={{ overflowY: "auto", padding: "4px", flex: 1 }}>
        {topLevel.map((el, i) => {
          const prev = i > 0 ? topLevel[i - 1] : null;
          const prevHighlighted = prev && (prev === selEl || ancestorSet.has(prev));
          const prevCollapsed = prev && !expanded.has(prev);
          const connectTop = i > 0 && !!prevHighlighted && !!prevCollapsed;
          return (
            <TreeNode
              key={i}
              el={el}
              depth={0}
              expandedSet={expanded}
              onToggle={handleToggle}
              selEl={selEl}
              onSelect={onSelect}
              ancestorSet={ancestorSet}
              panelHovered={panelHovered}
              connectTop={connectTop}
            />
          );
        })}
      </div>
    </motion.div>,
    document.body
  );
}
