"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "./CaseStudySection";

const N_BETWEEN = 8;
// px width of each tick slot (1px line + gap) on mobile
const MOBILE_TICK_SPACING = 14;
const MOBILE_BREAKPOINT = 768;

function normalise(section) {
  if (typeof section === "string") return { label: section, id: slugify(section) };
  return section;
}

export default function CaseStudyTableOfContents({ sections = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const railRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(null);
  const items = sections.map(normalise);

  // Track viewport size
  useEffect(() => {
    function checkSize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

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

  // Auto-scroll rail to keep active section centred on mobile
  useEffect(() => {
    if (!isMobile || !railRef.current) return;
    const rail = railRef.current;
    // Each section tick lives at tickIndex = activeIndex * (N_BETWEEN + 1)
    // With paddingLeft = 50vw, scrollLeft = tickIndex * MOBILE_TICK_SPACING centres it
    const tickIndex = activeIndex * (N_BETWEEN + 1);
    rail.scrollTo({ left: tickIndex * MOBILE_TICK_SPACING, behavior: "smooth" });
  }, [activeIndex, isMobile]);

  function onPointerDown(e) {
    e.preventDefault();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    scrollStartLeftRef.current = railRef.current.scrollLeft;
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    railRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = now - lastTRef.current;
    if (dt > 0) {
      velocityRef.current = (lastXRef.current - e.clientX) / dt;
    }
    lastXRef.current = e.clientX;
    lastTRef.current = now;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) hasDraggedRef.current = true;
    railRef.current.scrollLeft = scrollStartLeftRef.current - dx;
  }

  function onPointerUp() {
    isDraggingRef.current = false;
    // Fling with momentum
    let v = velocityRef.current * 16; // px per frame approx
    function fling() {
      if (Math.abs(v) < 0.5) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 0);
        return;
      }
      railRef.current.scrollLeft += v;
      v *= 0.92; // friction
      rafRef.current = requestAnimationFrame(fling);
    }
    rafRef.current = requestAnimationFrame(fling);
  }

  function handleClick(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!items.length) return null;

  const n = items.length;
  const totalTicks = n + (n - 1) * N_BETWEEN;

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

  // ── Mobile layout ────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <nav
        aria-label="Page sections"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          pointerEvents: "none",
          background: "linear-gradient(to top, rgba(245,245,245,1) 0%, rgba(245,245,245,0) 100%)",
          padding: "40px 0 0",
        }}
      >
        <style>{`.toc-rail::-webkit-scrollbar{display:none}`}</style>
        <div
          ref={railRef}
          className="toc-rail"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{
            overflowX: "scroll",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            pointerEvents: "auto",
            touchAction: "none",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          {/* Padding wrapper centres the ruler; inner div uses absolute labels */}
          <div
            style={{
              paddingLeft: `calc(50vw - ${MOBILE_TICK_SPACING / 2}px)`,
              paddingRight: `calc(50vw - ${MOBILE_TICK_SPACING / 2}px)`,
            }}
          >
            {/* Relative container — labels absolutely positioned, tick row at bottom */}
            <div
              style={{
                position: "relative",
                width: totalTicks * MOBILE_TICK_SPACING,
                height: 66, // 14 top-row label + 4 gap + 14 bottom-row label + 6 gap + 28 tick
              }}
            >
              {/* Absolutely positioned labels — even sections top row, odd sections lower row */}
              {ticks.map((tick, i) => {
                if (tick.type !== "section") return null;
                const { label, id } = items[tick.sectionIndex];
                const isActive = tick.sectionIndex === activeIndex;
                const isEven = tick.sectionIndex % 2 === 0;
                return (
                  <button
                    key={`lbl-${i}`}
                    onClick={() => {
                      if (!hasDraggedRef.current) handleClick(id);
                    }}
                    aria-label={`Jump to ${label}`}
                    style={{
                      position: "absolute",
                      top: isEven ? 0 : 18,
                      left: i * MOBILE_TICK_SPACING + MOBILE_TICK_SPACING / 2,
                      transform: "translateX(-50%)",
                      height: 14,
                      display: "flex",
                      alignItems: "flex-end",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: 1,
                      color: isActive ? "#2a2a2a" : filled[i] ? "#888" : "#c9c9c9",
                      whiteSpace: "nowrap",
                      transition: "color 200ms ease",
                      pointerEvents: "auto",
                    }}
                  >
                    {label}
                  </button>
                );
              })}

              {/* Tick row pinned to bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  height: 28,
                }}
              >
                {ticks.map((tick, i) => {
                  const isTall = tick.type === "section";
                  const isEven = isTall && tick.sectionIndex % 2 === 0;
                  const height = isTall ? (isEven ? 28 : 20) : 10;
                  const color = filled[i]
                    ? isTall
                      ? "#656565"
                      : "#b0b0b0"
                    : isTall
                      ? "#d0d0d0"
                      : "#e5e5e5";
                  return (
                    <div
                      key={`tick-${i}`}
                      style={{
                        width: MOBILE_TICK_SPACING,
                        height: 28,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 1,
                          height,
                          background: color,
                          transition: "background 200ms ease",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ── Desktop layout ───────────────────────────────────────────────────────────
  return (
    <nav
      aria-label="Page sections"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        pointerEvents: "none",
        background: "linear-gradient(to top, rgba(245,245,245,1) 0%, rgba(245,245,245,0) 100%)",
        padding: "40px 80px 0",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Labels row */}
      <div style={{ position: "relative", height: 20, marginBottom: 6 }}>
        {ticks.map((tick, i) => {
          if (tick.type !== "section") return null;
          const pct = (i / (totalTicks - 1)) * 100;
          const { label, id } = items[tick.sectionIndex];
          const isActive = tick.sectionIndex === activeIndex;
          const isHovered = hoveredSection === tick.sectionIndex;

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => {
                e.preventDefault();
                handleClick(id);
              }}
              onMouseEnter={() => setHoveredSection(tick.sectionIndex)}
              onMouseLeave={() => setHoveredSection(null)}
              aria-current={isActive ? "location" : undefined}
              style={{
                position: "absolute",
                bottom: 0,
                left: `${pct}%`,
                transform: "translateX(-50%)",
                fontSize: 12,
                fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1,
                color: isActive ? "#2a2a2a" : filled[i] ? "#888" : "#c9c9c9",
                textDecoration: "none",
                whiteSpace: "nowrap",
                opacity: isActive || isHovered ? 1 : 0.6,
                transition: "color 200ms ease, opacity 200ms ease",
                pointerEvents: "auto",
              }}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Ruler */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 20,
        }}
      >
        {ticks.map((tick, i) => {
          const isTall = tick.type === "section";
          const height = isTall ? 20 : 10;
          const color = filled[i]
            ? isTall
              ? "#656565"
              : "#b0b0b0"
            : isTall
              ? "#d0d0d0"
              : "#e5e5e5";

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
                  width: 1,
                  height,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  flexShrink: 0,
                  pointerEvents: "auto",
                  outline: "none",
                  margin: "0 -4px",
                  paddingInline: 4,
                  boxSizing: "content-box",
                  background: "none",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 1,
                    height,
                    background: color,
                    transition: "background 200ms ease",
                    margin: "0 auto",
                  }}
                />
              </button>
            );
          }

          return (
            <div
              key={`tick-${i}`}
              style={{
                width: 1,
                height,
                background: color,
                flexShrink: 0,
                transition: "background 200ms ease",
              }}
            />
          );
        })}
      </div>
    </nav>
  );
}
