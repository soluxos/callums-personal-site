"use client";

// Self-healing cuts. Drag across bare mat with the craft knife and a slit opens in
// it: pointed at both ends, with a lit lower lip and the surface shadowed where it
// has parted, and the mat's grid pushed aside around it. Through it you see what's
// under the mat: another cutting mat, dark green with its own grid, as if two were
// stacked on the desk. Let go and it holds open for a moment, then closes from the
// ends inwards while the grid settles back and a faint scar fades, like a real
// self-healing mat.
//
// A cut only starts where nothing but the mat is under the pointer: never on text,
// links, buttons, media or any surface with its own background, so reading,
// selecting and clicking work exactly as before. Once started it can run anywhere,
// and the press that started it never selects text. Mouse and pen only, and off
// while edit mode is on (it has its own dragging). Cuts are drawn into the mat
// layer, so a slit that runs under a card or a paragraph disappears beneath it.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useEditMode } from "@/contexts/EditModeContext";
import { MAJOR, MAJOR_LINE, MAT_SURFACE, MINOR, MINOR_LINE } from "./CuttingMat";

const LAYER_ID = "mat-cuts";
const MIN_STEP = 3; // px between recorded points
const POINT_SPACING = 2; // px between points once smoothed; plenty for a clean outline
const FILTER_MARGIN = 30; // px of room around a cut for its blurs
const MAX_CUTS = 20;

const HALF_WIDTH = 6; // px; the slit is twice this at its widest
const FULL_WIDTH_LENGTH = 140; // shorter cuts open less, like a nick rather than a slice

// How the grid is pushed aside: by PUSH_AMOUNT times the slit's width at its edge,
// easing off to nothing PUSH_REACH px beyond it (scaled down for short cuts and
// towards the tips). The reach is always more than twice the push, so lines bend
// smoothly and never fold over each other.
const PUSH_AMOUNT = 1.8;
const PUSH_REACH = 28;
const SAMPLE_STEP = 2; // px between samples along each pushed grid line

const HOLD_MS = 900; // how long a finished cut stays open
const HEAL_MS = 1800; // how long it takes to close
const SCAR_MS = 1200; // how long the scar takes to fade afterwards
const SCAR_OPACITY = 0.18;

// What's under the mat: a classic dark green cutting mat. Its grid is finer than the
// top mat's and fixed to the page, so every cut looks down onto the same board.
const UNDER_SURFACE = "#1f4a38";
const UNDER_MINOR = 10;
const UNDER_MAJOR = 50;
const UNDER_MINOR_LINE = "rgba(255, 255, 255, 0.12)";
const UNDER_MAJOR_LINE = "rgba(240, 222, 140, 0.45)";

const BLOCKING =
  "a, button, input, textarea, select, label, summary, img, video, canvas, svg, iframe, [contenteditable], [role=button], [role=link], [role=img], [data-no-cut]";

// A small craft knife, tip at the hotspot, shown only while a cut is being made.
const KNIFE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="translate(3 29) rotate(-45)"><path d="M0 0 L12 -3.4 L12 1.6 Z" fill="#e4e7eb" stroke="#7d848c" stroke-width="0.7" stroke-linejoin="round"/><rect x="12" y="-3.6" width="3.2" height="5.4" rx="0.6" fill="#a3a9b0" stroke="#6b7179" stroke-width="0.6"/><rect x="15" y="-3.9" width="17" height="6" rx="2.6" fill="#3a3a3a" stroke="#1f1f1f" stroke-width="0.6"/></g></svg>`;
const KNIFE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(KNIFE_SVG)}") 3 29, crosshair`;

const clamp01 = t => Math.min(1, Math.max(0, t));
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = t => 1 - (1 - t) ** 3;

// Walk everything under the pointer, topmost first, down to the mat's own surface.
// Anything interactive, any text, or anything with a background means "not bare mat".
function isBareMat(x, y, layer) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.contains(layer)) return true; // reached the surface the mat is drawn on
    if (el.matches(BLOCKING)) return false;
    const style = getComputedStyle(el);
    if (style.backgroundColor !== "rgba(0, 0, 0, 0)" || style.backgroundImage !== "none") {
      return false;
    }
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return false;
    }
  }
  return false;
}

// Chaikin smoothing, so a shaky hand still leaves a clean blade line.
function smooth(points, iterations = 2) {
  let pts = points;
  for (let k = 0; k < iterations && pts.length > 2; k++) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      out.push(
        { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
        { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 }
      );
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

// Even spacing along the line, so a long cut doesn't carry thousands of points.
function resample(pts, spacing) {
  const out = [pts[0]];
  let carry = 0; // distance travelled since the last point placed
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const segment = Math.hypot(b.x - a.x, b.y - a.y);
    if (!segment) continue;
    let along = spacing - carry;
    for (; along <= segment; along += spacing) {
      const t = along / segment;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
    carry = segment - (along - spacing);
  }
  const last = pts[pts.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

// Everything a cut needs that only changes when its points do: the smoothed line,
// the normal and taper at each point, the area its blurs need, and how it pushes
// the grid aside.
function buildGeometry(points) {
  const pts = resample(smooth(points), POINT_SPACING);
  const n = pts.length;
  const lengths = [0];
  for (let i = 1; i < n; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = lengths[n - 1];
  if (n < 2 || total < 1) return null;

  // Short cuts open less, and every cut tapers to a point at both ends.
  const lengthScale = Math.min(1, total / FULL_WIDTH_LENGTH);
  const normals = [];
  const taper = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    normals.push({ x: -(b.y - a.y) / len, y: (b.x - a.x) / len });
    taper.push(lengthScale * Math.sqrt(Math.sin(Math.PI * (lengths[i] / total))));
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of pts) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const bounds = {
    x: minX - FILTER_MARGIN,
    y: minY - FILTER_MARGIN,
    width: maxX - minX + FILTER_MARGIN * 2,
    height: maxY - minY + FILTER_MARGIN * 2,
  };

  const geometry = { pts, normals, taper, bounds };
  return Object.assign(geometry, buildPush(geometry));
}

// Cached per points array, so a cut that isn't changing is never rebuilt.
const geometryCache = new WeakMap();
function geometryFor(points) {
  if (!geometryCache.has(points)) geometryCache.set(points, buildGeometry(points));
  return geometryCache.get(points);
}

// The outline of a band around the cut, `halfWidth(i)` either side of point i.
function outline({ pts, normals }, halfWidth) {
  const left = [];
  const right = [];
  for (let i = 0; i < pts.length; i++) {
    const w = halfWidth(i);
    const { x, y } = pts[i];
    const { x: nx, y: ny } = normals[i];
    left.push(`${(x + nx * w).toFixed(1)} ${(y + ny * w).toFixed(1)}`);
    right.push(`${(x - nx * w).toFixed(1)} ${(y - ny * w).toFixed(1)}`);
  }
  return `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;
}

// The slit, or a band around it, at a given opening (px at the widest point).
const slitPath = (geometry, width) => outline(geometry, i => width * geometry.taper[i]);

// How a cut pushes the mat aside: away from the slit, most at its edge and easing
// to nothing at the edge of a band around it, so pushed lines meet the real grid
// exactly. Returns the push as a function, the band, and the band's bounds.
function buildPush(geometry) {
  const { pts, normals, taper } = geometry;
  const slit = i => HALF_WIDTH * taper[i];
  const reach = i => slit(i) * 3 + PUSH_REACH * taper[i];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxReach = 0;
  pts.forEach((p, i) => {
    const r = reach(i);
    maxReach = Math.max(maxReach, r);
    minX = Math.min(minX, p.x - r);
    minY = Math.min(minY, p.y - r);
    maxX = Math.max(maxX, p.x + r);
    maxY = Math.max(maxY, p.y + r);
  });

  // Bucket the line's points by area, so each grid sample only checks the handful
  // of points near it rather than the whole cut.
  const cell = Math.max(8, maxReach);
  const key = (cx, cy) => cx * 65536 + cy;
  const buckets = new Map();
  pts.forEach((p, i) => {
    const k = key(Math.floor(p.x / cell), Math.floor(p.y / cell));
    const bucket = buckets.get(k);
    if (bucket) bucket.push(i);
    else buckets.set(k, [i]);
  });

  // How far the mat at (x, y) moves at full opening, or null if it stays put.
  function push(x, y) {
    if (x < minX || x > maxX || y < minY || y > maxY) return null;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    let best = Infinity;
    let at = -1;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const i of buckets.get(key(cx + dx, cy + dy)) ?? []) {
          const d = (x - pts[i].x) ** 2 + (y - pts[i].y) ** 2;
          if (d < best) {
            best = d;
            at = i;
          }
        }
      }
    }
    if (at < 0) return null;
    const distance = Math.sqrt(best);
    const r = reach(at);
    if (r <= 0 || distance >= r) return null;
    const { x: nx, y: ny } = normals[at];
    const side = (x - pts[at].x) * nx + (y - pts[at].y) * ny >= 0 ? 1 : -1;
    const amount = side * PUSH_AMOUNT * slit(at) * (1 - distance / r) ** 2;
    return [nx * amount, ny * amount];
  }

  return { push, band: outline(geometry, reach), reachBounds: { minX, minY, maxX, maxY } };
}

// One grid for every cut at once. Where cuts overlap, their pushes add up, so
// crossing cuts bend the same lines instead of each drawing its own copy. Each grid
// line is sampled once across the stretch any cut touches; a sample keeps, per cut,
// how far it moves at full opening, so a frame only has to scale by each opening.
function buildCombinedGrid(geometries) {
  const cuts = [];
  geometries.forEach((g, i) => g && cuts.push({ i, g }));

  const spans = new Map();
  const addSpan = (vertical, at, from, to) => {
    const key = `${vertical ? "x" : "y"}${at}`;
    if (!spans.has(key)) spans.set(key, { vertical, at, ranges: [] });
    spans.get(key).ranges.push([from, to]);
  };
  for (const { g } of cuts) {
    const { minX, minY, maxX, maxY } = g.reachBounds;
    for (let gx = Math.ceil(minX / MINOR) * MINOR; gx <= maxX; gx += MINOR) {
      addSpan(true, gx, minY, maxY);
    }
    for (let gy = Math.ceil(minY / MINOR) * MINOR; gy <= maxY; gy += MINOR) {
      addSpan(false, gy, minX, maxX);
    }
  }

  // Grid lines are 1px wide starting on each multiple of MINOR, so their centres
  // sit half a pixel in. Lines no cut moves are left to the real grid.
  const lines = [];
  for (const { vertical, at, ranges } of spans.values()) {
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const [from, to] of ranges) {
      const last = merged[merged.length - 1];
      if (last && from <= last[1]) last[1] = Math.max(last[1], to);
      else merged.push([from, to]);
    }
    for (const [from, to] of merged) {
      const samples = sampleLine(vertical, at + 0.5, Math.floor(from), to + SAMPLE_STEP, cuts);
      if (samples.length) lines.push({ major: at % MAJOR === 0, samples });
    }
  }
  return lines;
}

// Walk one grid line, keeping the samples that move plus the still ones either
// side, so the line runs straight up to each bend.
function sampleLine(vertical, fixed, from, to, cuts) {
  const samples = [];
  let still = null;
  let moving = false;
  for (let v = from; v <= to; v += SAMPLE_STEP) {
    const x = vertical ? fixed : v;
    const y = vertical ? v : fixed;
    const moves = [];
    for (const { i, g } of cuts) {
      const moved = g.push(x, y);
      if (moved) moves.push(i, moved[0], moved[1]);
    }
    const sample = { x, y, moves };
    if (moves.length) {
      if (!moving && still) samples.push(still);
      samples.push(sample);
      moving = true;
    } else {
      if (moving) samples.push(sample);
      moving = false;
      still = sample;
    }
  }
  return samples;
}

function gridPath(lines, opens, majorOnly) {
  let d = "";
  for (const { major, samples } of lines) {
    if (majorOnly && !major) continue;
    samples.forEach(({ x, y, moves }, k) => {
      let px = x;
      let py = y;
      for (let j = 0; j < moves.length; j += 3) {
        px += moves[j + 1] * opens[moves[j]];
        py += moves[j + 2] * opens[moves[j]];
      }
      d += `${k === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    });
  }
  return d;
}

// The lower mat as a repeating tile: one major square with its minor lines inside.
// Lines sit on half pixels so they stay crisp.
function UnderMat({ id }) {
  const minor = [];
  for (let v = UNDER_MINOR; v < UNDER_MAJOR; v += UNDER_MINOR) {
    minor.push(`M${v + 0.5} 0V${UNDER_MAJOR}M0 ${v + 0.5}H${UNDER_MAJOR}`);
  }
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={UNDER_MAJOR} height={UNDER_MAJOR}>
      <rect width={UNDER_MAJOR} height={UNDER_MAJOR} fill={UNDER_SURFACE} />
      <path d={minor.join("")} stroke={UNDER_MINOR_LINE} />
      <path d={`M0.5 0V${UNDER_MAJOR}M0 0.5H${UNDER_MAJOR}`} stroke={UNDER_MAJOR_LINE} />
    </pattern>
  );
}

// Blurs sized to this cut alone. A filter's cost grows with its area, and the
// default (a margin around the whole bounding box) was many times bigger.
function CutFilters({ id, bounds }) {
  const region = { filterUnits: "userSpaceOnUse", ...bounds };
  return (
    <>
      <filter id={`mat-cut-soften-${id}`} {...region}>
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <filter id={`mat-cut-wall-${id}`} {...region}>
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
    </>
  );
}

// How open a cut is (1 = fully) and how visible its scar is. The scar fades in as
// the slit closes, so there's no jump between them, then fades away.
function timeline(releasedAt, now) {
  if (releasedAt == null) return { open: 1, scar: 0 };
  const t = now - releasedAt;
  const healed = easeInOut(clamp01((t - HOLD_MS) / HEAL_MS));
  const faded = easeOut(clamp01((t - HOLD_MS - HEAL_MS) / SCAR_MS));
  return { open: 1 - healed, scar: SCAR_OPACITY * healed * (1 - faded) };
}

// Everything is drawn a layer at a time across every cut, so a second cut never
// paints over the first: the mat and its pushed grid first, then the scars, then
// each part of the slits. Light comes from the top left, as it does on most desks,
// so the wall under each slit's near edge falls into shadow and the far wall
// catches the light. Everything scales with `open`, so it all closes together.
function CutLayers({ cuts, geometries, grid, now }) {
  const states = cuts.map((cut, i) => ({
    id: cut.id,
    g: geometries[i],
    ...timeline(cut.releasedAt, now),
  }));
  const opens = states.map(s => (s.g ? s.open : 0));
  const open = states
    .filter(s => s.g && s.open > 0.005)
    .map(s => {
      const width = HALF_WIDTH * s.open;
      return {
        ...s,
        width,
        fade: Math.min(1, s.open * 4),
        hole: slitPath(s.g, width),
        filter: name => `url(#mat-cut-${name}-${s.id})`,
      };
    });

  return (
    <>
      <defs>
        {open.map(s => (
          <CutFilters key={s.id} id={s.id} bounds={s.g.bounds} />
        ))}
        <clipPath id="mat-cut-bands">
          {open.map(s => (
            <path key={s.id} d={s.g.band} />
          ))}
        </clipPath>
        {open.map(s => (
          <clipPath key={s.id} id={`mat-cut-hole-${s.id}`}>
            <path d={s.hole} />
          </clipPath>
        ))}
      </defs>

      {/* The real grid covered over around each cut. The cover fades out over the
          end of healing, when the push is already tiny, so the real grid (and
          anything else printed on the mat, like the angle guides) comes back
          smoothly instead of popping in. */}
      {open.map(s => (
        <path key={s.id} d={s.g.band} fill={MAT_SURFACE} opacity={Math.min(1, s.open * 6)} />
      ))}
      {open.length > 0 && (
        <g clipPath="url(#mat-cut-bands)">
          <path d={gridPath(grid, opens, false)} fill="none" stroke={MINOR_LINE} />
          <path d={gridPath(grid, opens, true)} fill="none" stroke={MAJOR_LINE} />
        </g>
      )}

      {states.map(
        s =>
          s.g &&
          s.scar > 0.005 && (
            <path
              key={s.id}
              d={`M ${s.g.pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`}
              fill="none"
              stroke={`rgba(72, 72, 72, ${s.scar})`}
              strokeWidth="0.75"
            />
          )
      )}

      {/* The surface dipping and shadowed around each opening. */}
      {open.map(s => (
        <path
          key={s.id}
          d={slitPath(s.g, s.width + 3 * s.open)}
          fill="rgba(0, 0, 0, 0.1)"
          opacity={s.fade}
          filter={s.filter("soften")}
        />
      ))}
      {/* The far rim, lit where it meets the surface. */}
      {open.map(s => (
        <path
          key={s.id}
          d={s.hole}
          transform="translate(0.6 1.2)"
          fill="rgba(255, 255, 255, 0.8)"
          opacity={s.fade}
        />
      ))}
      {/* The insides last, so where cuts cross they read as one opening. */}
      {open.map(s => (
        <g key={s.id} clipPath={`url(#mat-cut-hole-${s.id})`} opacity={s.fade}>
          <path d={s.hole} fill="url(#mat-cut-under)" />
          {/* The near wall's shadow, so it reads as a hole rather than a sticker. */}
          <path
            d={s.hole}
            transform={`translate(${-s.width * 0.35} ${-s.width * 1.05})`}
            fill="#000"
            opacity="0.3"
            filter={s.filter("wall")}
          />
        </g>
      ))}
    </>
  );
}

export default function MatCuts() {
  const { editMode } = useEditMode();
  const pathname = usePathname();
  const [layer, setLayer] = useState(null);
  const [cuts, setCuts] = useState([]);
  const [now, setNow] = useState(0);
  const activeRef = useRef(null);
  const nextId = useRef(0);

  // The mat (and its cut layer) isn't on every page, so look for it per route.
  useEffect(() => {
    setLayer(document.getElementById(LAYER_ID));
    setCuts([]);
  }, [pathname]);

  useEffect(() => {
    if (!layer || editMode) return;

    // True from a press that starts a cut until the button comes up. That whole
    // press must never select text, even where the cut crosses it.
    let cutPress = false;

    // Safari only honours the prefixed property.
    function lockSelection(locked) {
      const value = locked ? "none" : "";
      document.body.style.userSelect = value;
      document.body.style.webkitUserSelect = value;
      if (locked) window.getSelection()?.removeAllRanges();
    }

    function onPointerDown(e) {
      if (e.button !== 0 || e.pointerType === "touch") return;
      if (!isBareMat(e.clientX, e.clientY, layer)) return;
      e.preventDefault();
      cutPress = true;
      lockSelection(true);

      const id = nextId.current++;
      activeRef.current = { id, points: [{ x: e.pageX, y: e.pageY }], frame: 0 };
      document.body.style.cursor = KNIFE_CURSOR;
      setCuts(prev => [
        ...prev.slice(-(MAX_CUTS - 1)),
        { id, points: [...activeRef.current.points], releasedAt: null },
      ]);
    }

    function onPointerMove(e) {
      const active = activeRef.current;
      if (!active) return;
      const last = active.points[active.points.length - 1];
      if (Math.hypot(e.pageX - last.x, e.pageY - last.y) < MIN_STEP) return;
      active.points.push({ x: e.pageX, y: e.pageY });
      // Mice can fire far more often than the screen refreshes, so rebuild the cut
      // at most once a frame.
      if (!active.frame) {
        active.frame = requestAnimationFrame(() => {
          active.frame = 0;
          const points = [...active.points];
          setCuts(prev => prev.map(cut => (cut.id === active.id ? { ...cut, points } : cut)));
        });
      }
    }

    function finishCut() {
      const active = activeRef.current;
      if (!active) return;
      activeRef.current = null;
      document.body.style.cursor = "";

      // A click without a drag leaves nothing worth healing.
      if (active.points.length < 2) {
        cancelAnimationFrame(active.frame);
        setCuts(prev => prev.filter(cut => cut.id !== active.id));
        return;
      }
      cancelAnimationFrame(active.frame);
      const points = [...active.points];
      const releasedAt = performance.now();
      setNow(releasedAt);
      setCuts(prev =>
        prev.map(cut => (cut.id === active.id ? { ...cut, points, releasedAt } : cut))
      );
    }

    function onPointerUp() {
      finishCut();
      if (cutPress) {
        cutPress = false;
        lockSelection(false);
      }
    }

    // Belt and braces for browsers that still start a selection, or a native drag,
    // from a press whose pointerdown was cancelled.
    function blockDuringCut(e) {
      if (cutPress) e.preventDefault();
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("mousedown", blockDuringCut, true);
    document.addEventListener("selectstart", blockDuringCut, true);
    document.addEventListener("dragstart", blockDuringCut, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("mousedown", blockDuringCut, true);
      document.removeEventListener("selectstart", blockDuringCut, true);
      document.removeEventListener("dragstart", blockDuringCut, true);
      onPointerUp();
    };
  }, [layer, editMode]);

  // Drive the healing animation while any released cut is still visible.
  const healing = cuts.some(cut => cut.releasedAt != null);
  useEffect(() => {
    if (!healing) return;
    let frame;
    const lifetime = HOLD_MS + HEAL_MS + SCAR_MS;
    const tick = () => {
      const t = performance.now();
      setNow(t);
      setCuts(prev => {
        const alive = prev.filter(cut => cut.releasedAt == null || t - cut.releasedAt < lifetime);
        return alive.length === prev.length ? prev : alive;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [healing]);

  // Geometry is cached per cut; the combined grid only rebuilds when a cut changes.
  const geometries = useMemo(() => cuts.map(cut => geometryFor(cut.points)), [cuts]);
  const grid = useMemo(() => buildCombinedGrid(geometries), [geometries]);

  if (!layer || cuts.length === 0) return null;
  return createPortal(
    <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <UnderMat id="mat-cut-under" />
      </defs>
      <CutLayers cuts={cuts} geometries={geometries} grid={grid} now={now} />
    </svg>,
    layer
  );
}
