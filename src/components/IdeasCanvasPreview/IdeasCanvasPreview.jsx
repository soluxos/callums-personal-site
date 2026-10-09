"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ideas from "@/data/ideas";

const FONT = "var(--font-satoshi), Satoshi, sans-serif";
const NOTE_W = 200;
const NOTE_H = 200;
const MOBILE_BREAKPOINT = 768;

const STICKY_COLORS = {
  yellow: { bg: "oklch(0.92 0.18 82.45 / 1)", shadow: "rgba(249,207,0,0.25)" },
  pink: { bg: "oklch(0.92 0.18 2.45 / 1)", shadow: "rgba(233,30,140,0.18)" },
  blue: { bg: "oklch(0.92 0.18 -100.55 / 1)", shadow: "rgba(33,150,243,0.18)" },
  green: { bg: "oklch(0.92 0.18 151.45 / 1)", shadow: "rgba(76,175,80,0.18)" },
  orange: { bg: "oklch(0.92 0.18 51.45 / 1)", shadow: "rgba(255,152,0,0.22)" },
  purple: { bg: "oklch(0.92 0.18 290.45 / 1)", shadow: "rgba(156,39,176,0.18)" },
};

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

function StaticNote({ note }) {
  const colors = STICKY_COLORS[note.color] ?? STICKY_COLORS.yellow;
  return (
    <div
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: NOTE_W,
        minHeight: NOTE_H,
        background: colors.bg,
        borderRadius: 4,
        padding: "32px 16px 28px",
        boxShadow: `0 4px 18px ${colors.shadow}, 0 1px 3px rgba(0,0,0,0.10)`,
        transform: `rotate(${note.rotation}deg)`,
        transformOrigin: "center center",
        fontFamily: FONT,
        userSelect: "none",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      <TapeStrip />
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
          }}
        >
          {note.author}
        </div>
      )}
    </div>
  );
}

/**
 * IdeasCanvasPreview
 *
 * A full-width, read-only snapshot of the ideas canvas. Clicking takes you to /ideas.
 *
 * Viewport props — these control what you see inside the card.
 *   focusPoint      { x, y }  Canvas coordinate to centre the desktop view on.
 *                             Matches the x/y values in ideas.js.
 *                             Default: { x: 60, y: 110 } (cluster centre).
 *   zoom            number    Scale factor for desktop. Default: 0.4
 *   mobileFocusPoint { x, y } Optional separate focus point for mobile widths.
 *                             Defaults to focusPoint.
 *   mobileZoom      number    Scale factor for mobile. Default: 0.28
 */
export default function IdeasCanvasPreview({
  focusPoint = { x: 120, y: 200 },
  zoom = 0.8,
  mobileFocusPoint,
  mobileZoom = 0.6,
}) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState(null); // null = not yet computed

  // Store props in refs so the ResizeObserver callback never needs to be recreated
  const propsRef = useRef({ focusPoint, mobileFocusPoint, zoom, mobileZoom });
  useEffect(() => {
    propsRef.current = { focusPoint, mobileFocusPoint, zoom, mobileZoom };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function compute() {
      const { focusPoint, mobileFocusPoint, zoom, mobileZoom } = propsRef.current;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const isMobile = w < MOBILE_BREAKPOINT;
      const fp = isMobile ? (mobileFocusPoint ?? focusPoint) : focusPoint;
      const z = isMobile ? mobileZoom : zoom;
      setTransform({
        x: w / 2 - fp.x * z,
        y: h / 2 - fp.y * z,
        z,
      });
    }

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ready = transform !== null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Ideas</h2>
        <Link
          href="/ideas"
          className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#2a2a2a] transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Canvas preview card */}
      <Link href="/ideas" className="block group">
        <div
          ref={containerRef}
          className="relative w-full h-[400px] md:h-[540px] rounded-xl overflow-hidden cursor-pointer"
          style={{ background: "#e2e6e7" }}
        >
          {/* Notes layer — pointer-events: none so all clicks reach the Link */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: ready
                  ? `translate(${transform.x}px, ${transform.y}px) scale(${transform.z})`
                  : "none",
                transformOrigin: "0 0",
                width: 0,
                height: 0,
              }}
            >
              {ideas.map(note => (
                <StaticNote key={note.id} note={note} />
              ))}
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-200 z-10 pointer-events-none" />
        </div>
      </Link>
    </section>
  );
}
