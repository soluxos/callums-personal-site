"use client";

// Sites using Drupal Canvas each week, from drupal.org. One series, so no legend:
// the title names it. The 1.0 release and the latest week are labelled directly,
// hovering (or arrow keys, once focused) shows any week, and a hidden table gives
// screen readers the same numbers.

import { useEffect, useRef, useState } from "react";
import {
  CANVAS_RELEASE,
  CANVAS_USAGE,
  CANVAS_USAGE_AS_OF,
  CANVAS_USAGE_SOURCE,
} from "@/data/canvasUsage";

const HEIGHT = 320;
const PAD = { top: 28, right: 64, bottom: 32, left: 44 };
const LINE = "#0077d6"; // passes 3:1 against the card surface; the site's #0090ff doesn't
const FILL = "rgba(0, 119, 214, 0.1)";
const SURFACE = "#ededed";
const INK_MUTED = "#6b6b6b";
const GRID = "#d9d9d9";

const points = CANVAS_USAGE.map(([week, sites]) => ({
  week,
  time: Date.parse(`${week}T00:00:00Z`),
  sites,
}));
const first = points[0].time;
const last = points[points.length - 1].time;
const yMax = Math.ceil(Math.max(...points.map(p => p.sites)) / 5000) * 5000;
const yTicks = Array.from({ length: yMax / 5000 + 1 }, (_, i) => i * 5000);

// Formatted by hand rather than with toLocaleString, so the server and the browser
// always produce identical text (ICU versions disagree on things like "Sep"/"Sept").
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const day = iso => {
  const [year, month, date] = iso.split("-").map(Number);
  return `${date} ${MONTHS[month - 1]} ${year}`;
};
const count = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function CanvasUsageChart() {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(800);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const plotW = Math.max(1, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const x = time => PAD.left + ((time - first) / (last - first)) * plotW;
  const y = sites => PAD.top + plotH - (sites / yMax) * plotH;

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(p.time).toFixed(1)} ${y(p.sites).toFixed(1)}`)
    .join("");
  const area = `${line}L${x(last).toFixed(1)} ${y(0)}L${x(first).toFixed(1)} ${y(0)}Z`;

  // Quarterly month labels, or half-yearly when the chart is narrow.
  const months = [];
  const step = width < 520 ? 6 : 3;
  for (
    let d = new Date(Date.UTC(2025, 8, 1));
    d.getTime() <= last;
    d.setUTCMonth(d.getUTCMonth() + step)
  ) {
    months.push({
      time: d.getTime(),
      label: `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`,
    });
  }

  const release = Date.parse(`${CANVAS_RELEASE.date}T00:00:00Z`);
  const latest = points[points.length - 1];
  const shown = active == null ? null : points[active];

  function nearest(clientX) {
    const rect = wrapRef.current.getBoundingClientRect();
    const time = first + ((clientX - rect.left - PAD.left) / plotW) * (last - first);
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(p.time - time) < Math.abs(points[best].time - time)) best = i;
    });
    return best;
  }

  function onKeyDown(e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const from = active ?? points.length - 1;
    const next = from + (e.key === "ArrowRight" ? 1 : -1);
    setActive(Math.min(points.length - 1, Math.max(0, next)));
  }

  return (
    <figure className="flex flex-col gap-4 rounded-[8px] bg-[#ededed] p-5 md:p-8">
      <p className="text-[14px] font-medium leading-[1.5] text-[#484848]">
        Sites using Drupal Canvas each week
      </p>

      <div ref={wrapRef} className="relative w-full">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`Weekly sites using Drupal Canvas, rising from ${count(points[0].sites)} in early September 2025 to ${count(latest.sites)} in the week of ${day(latest.week)}. Use the left and right arrow keys to read each week.`}
          tabIndex={0}
          className="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-[#0077d6] rounded-[4px]"
          onPointerMove={e => setActive(nearest(e.clientX))}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
        >
          {/* Recessive grid and axis labels. */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={PAD.left} x2={PAD.left + plotW} y1={y(tick)} y2={y(tick)} stroke={GRID} />
              <text
                x={PAD.left - 10}
                y={y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill={INK_MUTED}
              >
                {tick === 0 ? "0" : `${tick / 1000}k`}
              </text>
            </g>
          ))}
          {months.map(m => (
            <text
              key={m.time}
              x={x(m.time)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize="12"
              fill={INK_MUTED}
            >
              {m.label}
            </text>
          ))}

          {/* The 1.0 release. */}
          <line
            x1={x(release)}
            x2={x(release)}
            y1={PAD.top - 6}
            y2={y(0)}
            stroke={INK_MUTED}
            strokeDasharray="3 4"
          />
          <text x={x(release) + 6} y={PAD.top} fontSize="12" fill="#656565">
            {CANVAS_RELEASE.label}
          </text>

          <path d={area} fill={FILL} />
          <path
            d={line}
            fill="none"
            stroke={LINE}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* The latest week, labelled directly. */}
          <circle
            cx={x(latest.time)}
            cy={y(latest.sites)}
            r="4"
            fill={LINE}
            stroke={SURFACE}
            strokeWidth="2"
          />
          <text
            x={x(latest.time) + 8}
            y={y(latest.sites)}
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="600"
            fill="#484848"
          >
            {count(latest.sites)}
          </text>

          {/* Hover crosshair. */}
          {shown && (
            <g pointerEvents="none">
              <line
                x1={x(shown.time)}
                x2={x(shown.time)}
                y1={PAD.top}
                y2={y(0)}
                stroke="#484848"
                strokeOpacity="0.35"
              />
              <circle
                cx={x(shown.time)}
                cy={y(shown.sites)}
                r="5"
                fill={LINE}
                stroke={SURFACE}
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {shown && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[6px] bg-[#25292e] px-2 py-1 text-[12px] leading-[1.5] text-white"
            style={{
              left: Math.min(Math.max(x(shown.time), 70), width - 70),
              top: y(shown.sites) - 12,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="font-semibold">{count(shown.sites)} sites</span> · week of{" "}
            {day(shown.week)}
          </div>
        )}
      </div>

      <figcaption className="text-[13px] font-medium leading-[1.5] text-[#6b6b6b]">
        From{" "}
        <a href={CANVAS_USAGE_SOURCE} className="underline">
          drupal.org&apos;s usage statistics
        </a>
        , as of {CANVAS_USAGE_AS_OF}. Each point is one week.
      </figcaption>

      <table className="sr-only">
        <caption>Sites using Drupal Canvas each week</caption>
        <thead>
          <tr>
            <th scope="col">Week starting</th>
            <th scope="col">Sites</th>
          </tr>
        </thead>
        <tbody>
          {points.map(p => (
            <tr key={p.week}>
              <td>{day(p.week)}</td>
              <td>{count(p.sites)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
