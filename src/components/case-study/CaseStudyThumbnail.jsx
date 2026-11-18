"use client";

import { useEffect, useId, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import AcquiaAIReel from "@/components/case-study/reels/AcquiaAIReel";
import AcquiaSourceReel from "@/components/case-study/reels/AcquiaSourceReel";
import DrupalCanvasReel from "@/components/case-study/reels/DrupalCanvasReel";
import EvenUIReel from "@/components/case-study/reels/EvenUIReel";
import SiteStudioReel from "@/components/case-study/reels/SiteStudioReel";
import UnionRoastedReel from "@/components/case-study/reels/UnionRoastedReel";

// Card thumbnails. A card is a label (the project's logo and name) stuck over its reel: a short
// loop of that product being used (see ./reels and the rules for them in CLAUDE.md). The label's
// bottom right corner is peeled back, so a little of the reel shows and moves underneath.
// Hovering the card, or tabbing to it, peels the label back across the card to show the reel. It
// ends up lifted along the card's left edge, standing a little proud of the card, and lies back
// down when you leave. A phone has no hover, so there the label peels when the card is on screen.
//
// The label is drawn as a physical thing: it is the card's own colour on the front and darker
// on the back, it is not clipped by the card, and the card's surface is cut away wherever
// the lifted label lies, so the label reads as one solid piece inside the card and out.
//
// Every reel is drawn at its product's real pixel sizes on an 800 x 640 canvas that scales with
// the card (ProductFrame in ./reels/source.jsx), which is why the thumbnail is a size container.
// The peel is drawn in the same container units (cqw, 1% of the card's width), so it scales too.
const REELS = {
  "acquia-ai": AcquiaAIReel,
  "drupal-canvas": DrupalCanvasReel,
  "acquia-source": AcquiaSourceReel,
  evenui: EvenUIReel,
  "site-studio-cohesion": SiteStudioReel,
  "union-roasted": UnionRoastedReel,
};

// The same logos the case study heroes use, all white. `width` is a share of the card's width.
const ACQUIA = { src: "/images/logos/acquia-logo.svg", width: "21cqw" };
const LOGOS = {
  "acquia-ai": ACQUIA,
  "drupal-canvas": ACQUIA,
  "acquia-source": ACQUIA,
  "site-studio-cohesion": ACQUIA,
  evenui: { src: "/images/logos/evenui-logo.svg", width: "8cqw" },
  "union-roasted": { src: "/images/logos/union-logo.png", width: "18cqw" },
};

/* ------------------------------ how the label curls ------------------------------ */

// The card is 100 wide and 80 tall (in cqw). `t` runs from 0, the corner peeled a little, to 1,
// the label pulled right back.
const W = 100;
const H = 80;
const CORNER = 23; // how much of the corner is up at rest

// The label lifts along a straight line. At rest that line cuts the bottom right corner at 45
// degrees. As the label is pulled it swings round and travels across the card, the way a hand
// peels: by the end it runs nearly straight up the left edge.
const LINE = {
  angle: [45, 3], // which way the line faces, in degrees from pointing right
  x: [W - CORNER / 2, 3], // a point the line passes through
  y: [H - CORNER / 2, 40],
};

// Past the line the label doesn't fold flat. It bends up and over the way paper does: sharply
// at first, then less and less, until it is heading back at `turn`. At rest it goes most of the
// way over (168 degrees) and lies back on itself; pulled right back it comes most of the way
// over too (about 142), so nearly all of it lies off the card's edge, over whatever is beside
// it, as if it were being peeled off. Seen from above, a point of the
// label `d` past the line shows up `across(d)` past it: further out while the label climbs, then
// back over the line as it comes over the top. The label's edges trace that same curve, which
// is what makes them curl.
const TURN = [168, 142];
const BEND = [3.2, 2.4]; // how far the tight part of the bend runs (pulled back, each pull picks its own)
const STEP = 0.02;
const LIMIT = 8;

// Where the label ends up when it's pulled back. Each pull picks its own: how far round the line
// swings, where it stops, and how far back the label leans, so no two openings are the same.
const between = (from, to) => from + Math.random() * (to - from);
// What stays stuck varies as well, but it is always a good length of the card's left side, so
// the label still reads as attached to its card: the whole side, or a part of it (a quarter
// to three quarters) running down from the top corner or up from the bottom one. That is just
// the way the line faces when the pull ends. A degree or two is enough: the stuck strip is
// only about 20px deep, so a steeper line would leave the label hanging by a corner.
const HOLDS = [
  () => between(-0.5, 0.5), // the whole left side
  () => between(1.4, 4.2), // part of it, from the top corner
  () => between(-4.2, -1.4), // or from the bottom one
];

// An opened label must leave the reel clear. The reel's pieces start 40px in from the card's
// sides, and Callum's rule is that the label never sits more than about 20px into the card
// (3cqw). So what is still on the card (the stuck part, and the curl standing up from it)
// stays inside that. The rest of the label lies off the card.
const PAD = 3;

// The shape of the curl for a given `turn` (in radians) and `bend`: `across(d)` is where a point
// of the label `d` past the line shows up, seen from above; `crestAt` is how far past the line
// the label stands straight up, and `crest` how far out that is, the furthest its curl reaches.
function curl(turn, bend) {
  const table = [0];
  let sum = 0;
  for (let i = 1; i <= LIMIT / STEP; i++) {
    sum += Math.cos(turn * (1 - Math.exp(-(i - 0.5) * STEP))) * STEP;
    table.push(sum);
  }
  const across = d => {
    const u = Math.max(0, d) / bend;
    if (u >= LIMIT) return bend * (table[table.length - 1] + Math.cos(turn) * (u - LIMIT));
    const i = u / STEP;
    const j = Math.floor(i);
    return bend * (table[j] + (table[j + 1] - table[j]) * (i - j));
  };
  const crestAt = -Math.log(1 - Math.PI / 2 / turn) * bend;
  return { across, crestAt, crest: across(crestAt) };
}

// Each pull also differs in how it gets there and how the label sits at the end, because the
// place it ends up can't vary much (it has to stay in the card's padding). `turn` is how far
// back the label leans, from standing well up to lying nearly flat off the card. `bend` is how
// tight its curl is. `sway` is the way the hand goes: the line swings round early (the corner
// is pulled up the card) or late (it is pulled straight across first), in degrees at the middle
// of the pull. `pace` is how briskly it is pulled. A pull never picks the same kind of hold as
// the one before it.
let lastHold = -1;
function anOpening(angle) {
  if (angle === undefined) {
    let hold = Math.floor(Math.random() * (HOLDS.length - 1));
    if (hold >= lastHold) hold += 1;
    if (lastHold < 0) hold = Math.floor(Math.random() * HOLDS.length);
    lastHold = hold;
    angle = HOLDS[hold]();
  }
  const turn = between(120, 158);
  const bend = between(1.9, 3);
  const sway = (Math.random() < 0.5 ? -1 : 1) * between(6, 16);
  const pace = between(46, 72);
  const rad = (angle * Math.PI) / 180;
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  // As far in as the line can sit with the curl still short of the nearest piece of the reel.
  // Pieces can run off the top and bottom of the card, so only the side padding is free.
  // It is measured from the corner the line is nearest: the top one, or the bottom one.
  const { across, crestAt, crest } = curl((turn * Math.PI) / 180, bend);
  const m = Math.min(0, H * ny) + Math.max(0.5, PAD * nx - crest - between(0.1, 0.5));
  // The point on that line nearest the middle of the card's left edge.
  const off = m - (H / 2) * ny;
  // How long the label's neck is (see `outline`): long enough that, with the label lying back,
  // its shoulders come to rest just clear of the card's left edge. `inside` is how far into the
  // card the line is at whichever end of it is still on the card.
  const inside = Math.max(0.5, m / nx, (m - H * ny) / nx);
  let past = crestAt;
  while (past < 30 && across(past) > -inside - 0.8) past += 0.05;
  return { angle, x: off * nx, y: H / 2 + off * ny, turn, bend, sway, pace, neck: inside + past };
}

// With no pull to pick one (the first draw), the label opens along its side.
const OPEN = { ...anOpening(0), sway: 0 };

// Part of the way from one opening to another. A pull that starts before the label has lain
// back down moves from the opening it had to its new one, instead of jumping to it.
const SHAPE = ["angle", "x", "y", "turn", "bend", "sway", "neck"];
const blend = (from, to, k) =>
  Object.fromEntries(SHAPE.map(key => [key, from[key] + (to[key] - from[key]) * k]));

const mix = ([from, to], t) => from + (to - from) * t;
const n = value => value.toFixed(2);
const cq = points => points.map(([x, y]) => `${n(x)}cqw ${n(y)}cqw`).join(", ");
const path = (there, back) =>
  there.length
    ? `M${[...there, ...[...back].reverse()].map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`
    : "";

// The card's outline, with its rounded corners, and the label's. The label is the same shape as
// the card it is stuck to, so the part that lifts has rounded corners too. The card's corners
// are 16px whatever its size, so `radius` is that in the card's own units (cqw).
//
// The label differs from the card at its two left corners, the ones nearest where it stays
// stuck. A label the card's exact shape, folded back along the left side, lies over the card's
// left corners and squares them off: Callum saw the corners go from round to nothing as the pull
// finished. So the label has a neck there. Its top and bottom edges stop `neck` in from the left
// with a rounded shoulder, and step in by a little more than the corner's radius the rest of
// the way to the edge. Folded back, the shoulders sit just off the card and the neck is all
// that crosses its edge, between the corners, so the card keeps its round corners and the label
// reads as a rounded piece of its own, joined to it. With `neck` 0 this is the card itself.
const RADIUS = 2.4; // 16px on a card about 670px wide, until the real card is measured
const FILLET = 0.8; // the inside corner where a shoulder meets the neck
const outlines = new Map();
function outline(radius, neck = 0) {
  const key = `${radius.toFixed(2)} ${neck.toFixed(2)}`;
  if (!outlines.has(key)) {
    if (outlines.size > 300) outlines.clear();
    const r = Math.min(radius, H / 4);
    const points = [];
    // An arc round (cx, cy), from one angle to another, in degrees.
    const arc = (cx, cy, size, from, to) => {
      for (let i = 0; i <= 8; i++) {
        const turn = ((from + ((to - from) * i) / 8) * Math.PI) / 180;
        points.push([cx + size * Math.cos(turn), cy + size * Math.sin(turn)]);
      }
    };
    arc(W - r, r, r, -90, 0);
    arc(W - r, H - r, r, 0, 90);
    if (neck > 0) {
      const step = r + FILLET; // how far the neck is in from the top and bottom
      arc(neck + r, H - r, r, 90, 180);
      arc(neck - FILLET, H - r, FILLET, 0, -90);
      points.push([0, H - step], [0, step]);
      arc(neck - FILLET, r, FILLET, 90, 0);
      arc(neck + r, r, r, 180, 270);
    } else {
      arc(r, H - r, r, 90, 180);
      arc(r, r, r, 180, 270);
    }
    outlines.set(key, points);
  }
  return outlines.get(key);
}

// The card, cut by the line: the lifted side of it, or the side still stuck down.
function cut(nx, ny, m, lifted, card) {
  const side = ([x, y]) => (lifted ? 1 : -1) * (x * nx + y * ny - m);
  const out = [];
  for (let i = 0; i < card.length; i++) {
    const p = card[i];
    const q = card[(i + 1) % card.length];
    const dp = side(p);
    const dq = side(q);
    if (dp >= 0) out.push(p);
    if (dp >= 0 !== dq >= 0) {
      const k = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]);
    }
  }
  return out;
}

// Everything the peel needs to draw itself at one moment.
function measure(t, open = OPEN, radius = RADIUS) {
  const card = outline(radius);
  const label = outline(radius, open.neck);
  const e = Math.max(0, t);
  // The sway is greatest in the middle of the pull and gone by either end.
  const sway = open.sway * Math.sin(Math.PI * Math.min(1, e)) ** 2;
  const angle = ((mix([LINE.angle[0], open.angle], e) + sway) * Math.PI) / 180;
  // Out from the line, towards the lifted side, and along it.
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const ux = Math.sin(angle);
  const uy = -Math.cos(angle);
  const m = mix([LINE.x[0], open.x], e) * nx + mix([LINE.y[0], open.y], e) * ny;
  const along = mix([LINE.x[0], open.x], e) * ux + mix([LINE.y[0], open.y], e) * uy;

  const turn = (mix([TURN[0], open.turn], Math.min(1, e)) * Math.PI) / 180;
  const bend = mix([BEND[0], open.bend], Math.min(1, e));
  const { across, crestAt, crest } = curl(turn, bend);

  // A point `a` along the line and `out` from it, back in the card's own x and y.
  const at = (a, out) => [(m + out) * nx + a * ux, (m + out) * ny + a * uy];

  // The lifted part of a shape, as how far out from the line it runs (from `near` to `far`) at
  // each point `a` along the line.
  const spans = shape => {
    const lifted = cut(nx, ny, m, true, shape).map(([x, y]) => [
      x * ux + y * uy,
      x * nx + y * ny - m,
    ]);
    const from = Math.min(...lifted.map(p => p[0]));
    const to = Math.max(...lifted.map(p => p[0]));
    const stops = new Set(lifted.map(p => p[0]));
    for (let i = 0; i <= 64; i++) stops.add(from + ((to - from) * i) / 64);
    const out = [];
    for (const a of [...stops].sort((x, y) => x - y)) {
      let near = Infinity;
      let far = -Infinity;
      for (let i = 0; i < lifted.length; i++) {
        const p = lifted[i];
        const q = lifted[(i + 1) % lifted.length];
        if (p[0] === q[0] || a < Math.min(p[0], q[0]) || a > Math.max(p[0], q[0])) continue;
        const d = p[1] + ((q[1] - p[1]) * (a - p[0])) / (q[0] - p[0]);
        near = Math.min(near, d);
        far = Math.max(far, d);
      }
      if (far < near) continue;
      near = Math.max(0, near);
      out.push({ a, near, far: Math.max(near, far) });
    }
    return out;
  };

  const riseTop = []; // the label's front, where it climbs away from the card
  const riseFoot = [];
  const backTop = []; // the label's back, where it has come over
  const backEnd = [];
  for (const { a, near, far } of spans(label)) {
    const lo = across(near);
    const hi = across(far);
    if (far <= crestAt) {
      riseFoot.push(at(a, lo));
      riseTop.push(at(a, hi));
    } else if (near >= crestAt) {
      backTop.push(at(a, lo));
      backEnd.push(at(a, hi));
    } else {
      backTop.push(at(a, crest));
      backEnd.push(at(a, hi));
      riseFoot.push(at(a, lo));
      riseTop.push(at(a, Math.max(lo, Math.min(hi, crest))));
    }
  }

  // What the lifted label leaves showing of the reel. This is worked out from the whole card,
  // not the label's own outline, so the reel shows right into the card's corners.
  const reelNear = [];
  const reelFar = [];
  for (const { a, near, far } of spans(card)) {
    const top = near <= crestAt && far >= crestAt ? crest : Math.max(across(near), across(far));
    reelNear.push(at(a, Math.max(top, near)));
    reelFar.push(at(a, far));
  }

  // The part of the label that has come over, back side up. Only this part is a separate
  // piece: where the label is still climbing it is the card's own surface, shaded.
  const over = [...backTop, ...[...backEnd].reverse()];
  const point = out => at(along, out).map(n);

  return {
    rise: path(riseTop, riseFoot),
    back: path(backTop, backEnd),
    // The card's surface, with the turned-over label cut out of it.
    surface: over.length
      ? `polygon(evenodd, 0cqw 0cqw, ${W}cqw 0cqw, ${W}cqw ${H}cqw, 0cqw ${H}cqw, 0cqw 0cqw, ${cq(over)}, ${cq([over[0]])}, 0cqw 0cqw)`
      : "none",
    reel: `polygon(${cq([...reelNear, ...[...reelFar].reverse()])})`,
    // The label's front: the part still stuck down. Its print fades as it lifts, so the
    // label's back never passes over the logo.
    front: `polygon(${cq(cut(nx, ny, m, false, card))})`,
    print: Math.max(0, Math.min(1, 1 - e / 0.26)),
    // Where the shading runs, measured out from the line.
    foot: point(0),
    crest: point(crest),
    flat: point(crest - bend * 3),
  };
}

const REST = measure(0);

export default function CaseStudyThumbnail({ slug, title, surface }) {
  const ref = useRef(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const peel = useMotionValue(0);
  // The opening in use is somewhere between the last one and the one this pull picked.
  const shift = useMotionValue(1);
  const openings = useRef({ from: OPEN, to: OPEN });
  const pulled = useRef(false);
  const reduced = useReducedMotion();
  const onScreen = useInView(ref, { amount: 0.8 });
  const touch = useRef(false);
  const Reel = REELS[slug];
  const logo = LOGOS[slug];

  const opening = () => blend(openings.current.from, openings.current.to, shift.get());

  // Every part of the peel is redrawn together, straight onto the page, each time it moves, so
  // the label and the hole it leaves never drift a frame apart.
  const draw = () => {
    const root = ref.current;
    if (!root) return;
    // The card's 16px corners, in its own units.
    const radius = root.clientWidth ? 1600 / root.clientWidth : RADIUS;
    const now = measure(peel.get(), opening(), radius);
    const set = (name, apply) => root.querySelectorAll(`[data-peel="${name}"]`).forEach(apply);
    set("surface", el => (el.style.clipPath = now.surface));
    set("reel", el => (el.style.clipPath = now.reel));
    set("front", el => {
      el.style.clipPath = now.front;
      el.style.opacity = now.print;
    });
    set("rise", el => el.setAttribute("d", now.rise));
    set("back", el => el.setAttribute("d", now.back));
    const line = (el, [x1, y1], [x2, y2]) => {
      el.setAttribute("x1", x1);
      el.setAttribute("y1", y1);
      el.setAttribute("x2", x2);
      el.setAttribute("y2", y2);
    };
    set("climb", el => line(el, now.foot, now.crest));
    set("over", el => line(el, now.crest, now.flat));
  };
  useMotionValueEvent(peel, "change", draw);
  useMotionValueEvent(shift, "change", draw);

  const move = open => {
    if (open === pulled.current) return;
    pulled.current = open;
    let pace = 80;
    if (open) {
      // A fresh way of opening for every pull. If the label is still partly up from the last
      // one, it moves across from where it is.
      const next = anOpening();
      pace = next.pace;
      openings.current = { from: opening(), to: next };
      shift.set(0);
      if (reduced) shift.set(1);
      else animate(shift, 1, { duration: 0.5, ease: "easeInOut" });
    }
    if (reduced) peel.set(open ? 1 : 0);
    else {
      animate(peel, open ? 1 : 0, {
        type: "spring",
        stiffness: pace,
        // Just past critical, so it settles without springing back.
        damping: 2.25 * Math.sqrt(pace),
        // The spring is over when the label is within a fraction of a pixel of its place and
        // all but still. The defaults stop it about half a percent short and then put it in
        // place, which showed as a small jump at the end of the pull.
        restDelta: 0.0002,
        restSpeed: 0.0005,
      });
    }
  };

  // The label's corners follow the card's, which depend on how wide the card is.
  useEffect(() => {
    if (!ref.current) return undefined;
    const sized = new ResizeObserver(draw);
    sized.observe(ref.current);
    return () => sized.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The whole card is the link, so listen on it: the caption under the thumbnail counts too.
  useEffect(() => {
    const card = ref.current?.closest("a");
    if (!card) return undefined;
    touch.current = window.matchMedia("(hover: none)").matches;
    if (touch.current) return undefined;
    const on = () => move(true);
    const off = () => move(false);
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focus", on);
    card.addEventListener("blur", off);
    return () => {
      card.removeEventListener("pointerenter", on);
      card.removeEventListener("pointerleave", off);
      card.removeEventListener("focus", on);
      card.removeEventListener("blur", off);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // With nothing to hover with, the card being on screen is what peels it.
  useEffect(() => {
    if (touch.current) move(onScreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScreen]);

  if (!Reel) return null;

  return (
    <div ref={ref} className="absolute inset-0 [container-type:inline-size]" aria-hidden="true">
      {/* The card itself, with its rounded corners. Only the label is allowed outside it. */}
      <div className="absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_1px_3px_rgba(0,9,58,0.28)]">
        <div
          data-peel="surface"
          className="absolute inset-0"
          style={{ background: surface, clipPath: REST.surface }}
        />

        {/* Under the label: the reel, where the label has come away from it. */}
        <div data-peel="reel" className="absolute inset-0" style={{ clipPath: REST.reel }}>
          <Reel />
        </div>

        {/* The front of the label, where it is still stuck down. */}
        <div
          data-peel="front"
          className="absolute inset-0 flex flex-col items-center justify-center gap-[2.6cqw]"
          style={{ clipPath: REST.front }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={logo.src} alt="" style={{ width: logo.width }} />}
          {/* The same type as the caption under the card. */}
          <span className="text-[14px] leading-none font-medium text-white">{title}</span>
        </div>
      </div>

      {/* The lifted label: its front in shade where it climbs, its back, darker than its front and matt,
          where it comes over, and the faint shadow it leaves around itself. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient
            data-peel="climb"
            id={`${id}-climb`}
            gradientUnits="userSpaceOnUse"
            x1={REST.foot[0]}
            y1={REST.foot[1]}
            x2={REST.crest[0]}
            y2={REST.crest[1]}
          >
            <stop offset="0" stopColor="#001669" stopOpacity="0" />
            <stop offset="1" stopColor="#001669" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient
            data-peel="over"
            id={`${id}-over`}
            gradientUnits="userSpaceOnUse"
            x1={REST.crest[0]}
            y1={REST.crest[1]}
            x2={REST.flat[0]}
            y2={REST.flat[1]}
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* The turned-over label. It is solid (a base in the wall's blue under its own colour), so
            it hides whatever it lies over, and it drops a small, faint shadow to sit above it. */}
        <g style={{ filter: "drop-shadow(0 0.5cqw 0.7cqw rgba(0, 9, 58, 0.28))" }}>
          <path data-peel="back" d={REST.back} fill="#0a52e8" />
          <path data-peel="back" d={REST.back} fill="rgba(0, 22, 105, 0.5)" />
          <path data-peel="back" d={REST.back} fill={`url(#${id}-over)`} />
        </g>
        <path data-peel="rise" d={REST.rise} fill={`url(#${id}-climb)`} />
      </svg>
    </div>
  );
}
