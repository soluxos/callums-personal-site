"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { slugify } from "./CaseStudySection";

const N_BETWEEN = 14;
const TICK_SPACING = 20;
const TICK_H = 20;
const LABEL_H = 20;
const SIDE_PAD = 120;

function normalise(section) {
  if (typeof section === "string") return { label: section, id: slugify(section) };
  return section;
}

export default function CaseStudyTableOfContents({ sections = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredSection, setHoveredSection] = useState(null);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const items = sections.map(normalise);

  const n = items.length;
  const totalTicks = n > 0 ? n + (n - 1) * N_BETWEEN : 0;
  const rulerWidth = totalTicks * TICK_SPACING + SIDE_PAD * 2;

  // Track scroll progress + active section
  useEffect(() => {
    if (!items.length) return;
    function update() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0);

      const threshold = window.innerHeight * 0.4;
      let best = 0;
      let bestDist = Infinity;
      items.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dist = threshold - el.getBoundingClientRect().top;
        if (dist >= 0 && dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // Pan ruler continuously with page scroll — ruler travels from x=0 to x=minX
  useEffect(() => {
    if (!containerRef.current || !n) return;
    const vw = containerRef.current.offsetWidth;
    const minX = Math.min(0, -(rulerWidth - vw));
    x.set(minX * scrollProgress);
  }, [scrollProgress, n, rulerWidth, x]);

  function handleClick(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!n) return null;

  const ticks = [];
  for (let s = 0; s < n; s++) {
    ticks.push({ type: "section", sectionIndex: s });
    if (s < n - 1) {
      for (let t = 0; t < N_BETWEEN; t++) {
        ticks.push({ type: "small" });
      }
    }
  }

  const filled = ticks.map((_, i) => scrollProgress >= i / (totalTicks - 1));

  return (
    <nav
      aria-label="Page sections"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 80,
        background: "linear-gradient(to top, rgba(245,245,245,1) 0%, rgba(245,245,245,0) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Clipping viewport — the "window" into the wider ruler */}
      <div ref={containerRef} style={{ overflow: "hidden", width: "100%", height: "100%" }}>
        {/* Draggable ruler */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.08}
          dragTransition={{ power: 0.4, timeConstant: 300 }}
          style={{
            x,
            width: rulerWidth,
            height: "100%",
            cursor: "grab",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 12,
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {/* Labels row */}
          <div style={{ position: "relative", height: LABEL_H, marginBottom: 6 }}>
            {ticks.map((tick, i) => {
              if (tick.type !== "section") return null;
              const { label, id } = items[tick.sectionIndex];
              const isActive = tick.sectionIndex === activeIndex;
              const isHovered = hoveredSection === tick.sectionIndex;
              const centreX = SIDE_PAD + i * TICK_SPACING + TICK_SPACING / 2;
              return (
                <button
                  key={`lbl-${i}`}
                  onClick={() => handleClick(id)}
                  onMouseEnter={() => setHoveredSection(tick.sectionIndex)}
                  onMouseLeave={() => setHoveredSection(null)}
                  aria-current={isActive ? "location" : undefined}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: centreX,
                    transform: "translateX(-50%)",
                    fontSize: 12,
                    fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: 1,
                    color: isActive ? "#2a2a2a" : filled[i] ? "#888" : "#c9c9c9",
                    background: "none",
                    border: "none",
                    padding: "0 4px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    opacity: isActive || isHovered ? 1 : 0.7,
                    transition: "color 200ms ease, opacity 200ms ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tick row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: TICK_H,
              paddingInline: SIDE_PAD,
            }}
          >
            {ticks.map((tick, i) => {
              const isTall = tick.type === "section";
              const height = isTall ? TICK_H : Math.round(TICK_H / 2);
              const color = filled[i]
                ? isTall
                  ? "#656565"
                  : "#b0b0b0"
                : isTall
                  ? "#d0d0d0"
                  : "#e5e5e5";

              const line = (
                <div
                  style={{
                    width: 1,
                    height,
                    background: color,
                    transition: "background 200ms ease",
                  }}
                />
              );

              if (isTall) {
                const { label, id } = items[tick.sectionIndex];
                return (
                  <button
                    key={`tick-${i}`}
                    onClick={() => handleClick(id)}
                    onMouseEnter={() => setHoveredSection(tick.sectionIndex)}
                    onMouseLeave={() => setHoveredSection(null)}
                    aria-label={`Jump to ${label}`}
                    style={{
                      width: TICK_SPACING,
                      height: TICK_H,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    {line}
                  </button>
                );
              }

              return (
                <div
                  key={`tick-${i}`}
                  style={{
                    width: TICK_SPACING,
                    height: TICK_H,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
