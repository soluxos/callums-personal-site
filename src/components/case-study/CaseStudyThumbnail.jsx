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
// The label is drawn as a physical thing: it is the card's own colour on the front and a shade
// paler on the back, it is not clipped by the card, and the card's surface is cut away wherever
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
  angle: [45, 9], // which way the line faces, in degrees from pointing right
  x: [W - CORNER / 2, 9], // a point the line passes through
  y: [H - CORNER / 2, 40],
};

// Past the line the label doesn't fold flat. It bends up and over the way paper does: sharply
// at first, then less and less, until it is heading back at `turn`. At rest it goes most of the
// way over (162 degrees) and lies back on itself; pulled right back it is held up, just past
// upright (108), leaning back over the card's edge and whatever is beside it. Seen from above, a point of the
// label `d` past the line shows up `across(d)` past it: further out while the label climbs, then
// back over the line as it comes over the top. The label's edges trace that same curve, which
// is what makes them curl.
const TURN = [162, 108];
const BEND = [6, 5]; // how far the tight part of the bend runs
const STEP = 0.02;
const LIMIT = 8;

const mix = ([from, to], t) => from + (to - from) * t;
const n = value => value.toFixed(2);
const cq = points => points.map(([x, y]) => `${n(x)}cqw ${n(y)}cqw`).join(", ");
const path = (there, back) =>
  there.length
    ? `M${[...there, ...[...back].reverse()].map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`
    : "";

// The card, cut by the line: the side where `keep` is true.
function cut(nx, ny, m, lifted) {
  const card = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  const side = ([x, y]) => (lifted ? 1 : -1) * (x * nx + y * ny - m);
  const out = [];
  for (let i = 0; i < 4; i++) {
    const p = card[i];
    const q = card[(i + 1) % 4];
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
function measure(t) {
  const e = Math.max(0, t);
  const angle = (mix(LINE.angle, e) * Math.PI) / 180;
  // Out from the line, towards the lifted side, and along it.
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const ux = Math.sin(angle);
  const uy = -Math.cos(angle);
  const m = mix(LINE.x, e) * nx + mix(LINE.y, e) * ny;
  const along = mix(LINE.x, e) * ux + mix(LINE.y, e) * uy;

  const turn = (mix(TURN, Math.min(1, e)) * Math.PI) / 180;
  const bend = mix(BEND, Math.min(1, e));
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
  // Where the label stands straight up: the furthest out its curl reaches.
  const crestAt = -Math.log(1 - Math.PI / 2 / turn) * bend;
  const crest = across(crestAt);

  // A point `a` along the line and `out` from it, back in the card's own x and y.
  const at = (a, out) => [(m + out) * nx + a * ux, (m + out) * ny + a * uy];

  // The lifted part of the label, measured along the line (a) and out from it (d).
  const lifted = cut(nx, ny, m, true).map(([x, y]) => [x * ux + y * uy, x * nx + y * ny - m]);
  const from = Math.min(...lifted.map(p => p[0]));
  const to = Math.max(...lifted.map(p => p[0]));
  const stops = new Set(lifted.map(p => p[0]));
  for (let i = 0; i <= 64; i++) stops.add(from + ((to - from) * i) / 64);

  const outer = []; // the lifted label's outline, on the side the reel shows
  const inner = []; // and on the side still stuck down
  const riseTop = []; // the label's front, where it climbs away from the card
  const riseFoot = [];
  const backTop = []; // the label's back, where it has come over
  const backEnd = [];
  const reelNear = []; // what the lifted label leaves showing of the reel
  const reelFar = [];

  for (const a of [...stops].sort((x, y) => x - y)) {
    // How much label there is at this point along the line.
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
    far = Math.max(near, far);

    const lo = across(near);
    const hi = across(far);
    const top = near <= crestAt && far >= crestAt ? crest : Math.max(lo, hi);
    outer.push(at(a, top));
    inner.push(at(a, Math.min(lo, hi)));
    reelNear.push(at(a, Math.max(top, near)));
    reelFar.push(at(a, far));

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

  const whole = [...outer, ...[...inner].reverse()];
  const point = out => at(along, out).map(n);

  return {
    whole: path(outer, inner),
    rise: path(riseTop, riseFoot),
    back: path(backTop, backEnd),
    // The card's surface, with the lifted label's outline cut out of it.
    surface: `polygon(evenodd, 0cqw 0cqw, ${W}cqw 0cqw, ${W}cqw ${H}cqw, 0cqw ${H}cqw, 0cqw 0cqw, ${cq(whole)}, ${cq([whole[0]])}, 0cqw 0cqw)`,
    reel: `polygon(${cq([...reelNear, ...[...reelFar].reverse()])})`,
    // The label's front: the part still stuck down. Its print fades as it lifts, so the
    // label's back never passes over the logo.
    front: `polygon(${cq(cut(nx, ny, m, false))})`,
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
  const reduced = useReducedMotion();
  const onScreen = useInView(ref, { amount: 0.8 });
  const touch = useRef(false);
  const Reel = REELS[slug];
  const logo = LOGOS[slug];

  // Every part of the peel is redrawn together, straight onto the page, each time it moves, so
  // the label and the hole it leaves never drift a frame apart.
  useMotionValueEvent(peel, "change", t => {
    const root = ref.current;
    if (!root) return;
    const now = measure(t);
    const set = (name, apply) => root.querySelectorAll(`[data-peel="${name}"]`).forEach(apply);
    set("surface", el => (el.style.clipPath = now.surface));
    set("reel", el => (el.style.clipPath = now.reel));
    set("front", el => {
      el.style.clipPath = now.front;
      el.style.opacity = now.print;
    });
    set("whole", el => el.setAttribute("d", now.whole));
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
  });

  const move = open => {
    if (reduced) peel.set(open ? 1 : 0);
    else {
      animate(peel, open ? 1 : 0, {
        type: "spring",
        stiffness: open ? 58 : 80,
        damping: open ? 17 : 20,
      });
    }
  };

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
      <div className="absolute inset-0 overflow-hidden rounded-[16px]">
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
          <span
            className="leading-none font-medium text-white"
            style={{ fontSize: "clamp(13px, 2.5cqw, 17px)" }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* The lifted label: its front in shade where it climbs, its back, a shade paler and matt,
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
            <stop offset="0" stopColor="#00093a" stopOpacity="0" />
            <stop offset="1" stopColor="#00093a" stopOpacity="0.26" />
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
            <stop offset="0" stopColor="#00093a" stopOpacity="0.2" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.07" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
          </linearGradient>
          <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <mask
            id={`${id}-around`}
            maskUnits="userSpaceOnUse"
            x="-60"
            y="-60"
            width="220"
            height="200"
          >
            <rect x="-60" y="-60" width="220" height="200" fill="#fff" />
            <path data-peel="whole" d={REST.whole} fill="#000" />
          </mask>
        </defs>
        <g mask={`url(#${id}-around)`}>
          <path
            data-peel="whole"
            d={REST.whole}
            fill="#00093a"
            fillOpacity="0.16"
            filter={`url(#${id}-soft)`}
          />
        </g>
        {/* A solid base in the wall's blue, so the label hides whatever it lies over. */}
        <path data-peel="whole" d={REST.whole} fill="#0a52e8" />
        <path data-peel="rise" d={REST.rise} fill={surface} />
        <path data-peel="rise" d={REST.rise} fill={`url(#${id}-climb)`} />
        <path data-peel="back" d={REST.back} fill="rgba(0, 22, 105, 0.16)" />
        <path data-peel="back" d={REST.back} fill={`url(#${id}-over)`} />
      </svg>
    </div>
  );
}
