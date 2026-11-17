"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Caret, useCount, useReel, useTicker, useTyped } from "./shared";
import { Pointer, ProductFrame, module, soft, swift } from "./source";

// EvenUI: type an address, scan it, watch the issues land on the page, then pick one for its fix.
//
// Everything is the real app (version 1.7) scanning its own sample page: the composer, the scan
// progress card and its eight stages with the scanner's own messages, the score, the issue rows
// and the boxes it draws on the page are built from the app's computed styles and source, in
// Satoshi and JetBrains Mono. The page is the scan's own screenshot, the boxes sit where the app
// put them, and the fix card is a 2x capture. The page is shown at a smaller zoom than the app's
// 41% so it fits beside the issues.
//
// Every piece has a fixed place on the 800 x 640 canvas and the whole thing fills the card: 40px
// in from the sides, running off the bottom. The scan card and the report share the space under
// the composer and swap in place, as the two screens do in the app. The scan card is as wide as
// the composer here (it is 520 in the app, centred on a wide screen).
const STEPS = [700, 500, 250, 1100, 600, 260, 2900, 2300, 700, 260, 2500, 600];
const S = {
  idle: 0,
  toField: 1,
  focus: 2,
  type: 3,
  toScan: 4,
  press: 5,
  scan: 6,
  found: 7,
  toIssue: 8,
  pick: 9,
  picked: 10,
  reset: 11,
};

const TARGET = "localhost:4499";
const MONO = '"JetBrains Mono Reel", ui-monospace, Menlo, monospace';

const HIGH = "#e5484d";
const MEDIUM = "#f5a524";

// The app's own icons: 24 x 24, drawn with a 1.75 stroke.
const ICONS = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  page: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M8 12h8" />
    </>
  ),
  site: (
    <>
      <rect x="9" y="3.5" width="6" height="5" rx="1.25" />
      <rect x="3.5" y="15.5" width="6" height="5" rx="1.25" />
      <rect x="14.5" y="15.5" width="6" height="5" rx="1.25" />
      <path d="M12 8.5V12M6.5 15.5V12h11v3.5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  options: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  spacing: (
    <>
      <path d="M4 4v16M20 4v16" />
      <path d="M8 12h8M10.5 9.5L8 12l2.5 2.5M13.5 9.5L16 12l-2.5 2.5" />
    </>
  ),
  colour: <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" />,
  radius: <path d="M5 19V12a7 7 0 0 1 7-7h7" />,
  borders: <rect x="4.5" y="4.5" width="15" height="15" rx="2" strokeDasharray="3 2.5" />,
};

function Icon({ name, size = 14, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {ICONS[name]}
    </svg>
  );
}

// The severity glyph: three bars for high.
function Bars() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" fill={HIGH} className="shrink-0">
      <rect x="1" y="9" width="3" height="4" rx="1" />
      <rect x="5.5" y="5.5" width="3" height="7.5" rx="1" />
      <rect x="10" y="2" width="3" height="11" rx="1" />
    </svg>
  );
}

/* ------------------------------ the composer ------------------------------ */

function Composer({ text, focused, cleared, hover, press }) {
  return (
    <div
      className="absolute top-[36px] left-[40px] h-[110px] w-[720px] rounded-[12px] border bg-white transition-[border-color] duration-150"
      style={{
        borderColor: focused ? "rgba(9,9,11,0.36)" : "rgba(9,9,11,0.14)",
        boxShadow:
          "0 0 0 4px rgba(9,9,11,0.05), 0 22px 48px -22px rgba(12,24,44,0.42), 0 2px 6px -2px rgba(12,24,44,0.08)",
      }}
    >
      <div className="flex h-[60px] items-center gap-[12px] px-[16px] text-[#71717a]">
        <Icon name="globe" size={18} />
        <div className="relative flex h-full flex-1 items-center pl-[2px] text-[17px] leading-[20px]">
          <motion.span
            className="absolute"
            initial={false}
            animate={{ opacity: text && !cleared ? 0 : 1 }}
            transition={{ duration: cleared ? 0.3 : 0.08, delay: cleared ? 0.16 : 0 }}
          >
            https://example.com, localhost:3000 or ./page.html
          </motion.span>
          <motion.span
            className="relative text-[#09090b]"
            initial={false}
            animate={{ opacity: cleared ? 0 : 1 }}
            transition={{ duration: 0.16 }}
          >
            {text}
          </motion.span>
          {focused && <Caret height={21} color="#09090b" className="relative ml-px" />}
        </div>
      </div>

      <div className="flex h-[48px] items-center gap-[4px] px-[12px] pb-[12px] text-[13px] leading-[20px] font-medium text-[#52525b]">
        <div className="mr-[4px] flex h-[28px] items-center gap-[2px] rounded-[8px] bg-[rgba(9,9,11,0.04)] p-[2px]">
          <span className="flex h-[24px] items-center gap-[8px] rounded-[6px] bg-white px-[8px] text-[#09090b] shadow-[0_1px_2px_rgba(9,9,11,0.05),0_1px_1px_rgba(9,9,11,0.02)]">
            <Icon name="page" />
            Page
          </span>
          <span className="flex h-[24px] items-center gap-[8px] px-[8px]">
            <Icon name="site" />
            Whole site
          </span>
        </div>
        <span className="flex h-[28px] items-center gap-[6px] px-[8px]">
          <Icon name="layers" />
          Add a design system
        </span>
        <span className="flex h-[28px] items-center gap-[6px] px-[8px]">
          <Icon name="options" />
          Options
        </span>
        <motion.span
          className="ml-auto flex h-[36px] items-center gap-[6px] rounded-[8px] px-[16px] text-[14px] leading-[14px] font-[550] text-[#fafafa] shadow-[0_1px_2px_rgba(9,9,11,0.16),inset_0_1px_0_rgba(255,255,255,0.1)]"
          initial={false}
          animate={{ backgroundColor: hover ? "#34343a" : "#18181b", scale: press ? 0.96 : 1 }}
          transition={{ backgroundColor: { duration: 0.12 }, scale: swift }}
        >
          Scan page
          <Icon name="arrow" size={15} />
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------ the scan card ------------------------------ */

// The scanner's stages: what each is called while it waits, and what it says while it runs.
const STAGES = [
  ["Start browser", "Starting browser", 0.02],
  ["Load the page", `Loading http://${TARGET}`, 0.08],
  [
    "Wait for content and lazy loading",
    "Waiting for the page to settle and lazy content to load",
    0.25,
  ],
  ["Read every element’s computed styles", "Reading computed styles", 0.4],
  [
    "Hover, focus and press every control",
    "Reading how controls look hovered, focused and pressed",
    0.5,
  ],
  ["Analyse consistency", "Analysing 140 elements", 0.6],
  ["Trace values back to CSS sources", "Locating the CSS rules behind each finding", 0.72],
  ["Capture the page", "Capturing full-page screenshot", 0.88],
];

// EvenUI's mark: a frame around a core. While it scans, the core pulses and the frame breathes.
function ScanningMark({ live }) {
  const loop = { duration: 1.6, repeat: Infinity, ease: [0.2, 0.8, 0.2, 1] };
  return (
    <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#09090b] text-white">
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
        <motion.path
          d="M3 8.5V6a3 3 0 0 1 3-3h2.5M15.5 3H18a3 3 0 0 1 3 3v2.5M21 15.5V18a3 3 0 0 1-3 3h-2.5M8.5 21H6a3 3 0 0 1-3-3v-2.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={live ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={live ? loop : { duration: 0.2 }}
        />
        <motion.rect
          x="8"
          y="8"
          width="8"
          height="8"
          rx="2"
          fill="currentColor"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={live ? { scale: [1, 0.72, 1] } : { scale: 1 }}
          transition={live ? loop : { duration: 0.2 }}
        />
      </svg>
    </span>
  );
}

function ScanCard({ show, stage: live }) {
  // Away from the scan it rests on its finished state, so it never rewinds on its way out.
  const stage = show ? live : STAGES.length;
  const done = stage >= STAGES.length;
  const pct = done ? 100 : Math.max(2, Math.round(STAGES[stage][2] * 100));

  return (
    <motion.div
      className={`absolute top-[164px] left-[40px] flex h-[520px] w-[720px] flex-col gap-[20px] rounded-[12px] border border-[rgba(9,9,11,0.08)] bg-white p-[24px] text-[14px] leading-[20px] ${module}`}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, scale: show ? 1 : 0.97 }}
      transition={{ ...soft, opacity: { duration: show ? 0.3 : 0.22 } }}
    >
      <div className="flex items-center gap-[16px]">
        <ScanningMark live={show} />
        <div>
          <p className="text-[17px] leading-[24px] font-[650] tracking-[-0.17px] text-[#09090b]">
            Scanning {TARGET}
          </p>
          <p className="text-[#52525b]">{TARGET}</p>
        </div>
      </div>

      <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(9,9,11,0.04)]">
        <motion.span
          className="block h-full rounded-full bg-[#18181b]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={show && stage > 0 ? soft : { duration: 0 }}
        />
      </div>

      <ol className="flex flex-col gap-[12px]">
        {STAGES.map(([label, message], i) => {
          const state = i < stage ? "done" : i === stage ? "active" : "waiting";
          return (
            <li key={label} className="flex h-[20px] items-center gap-[12px]">
              <span className="relative flex size-[16px] shrink-0 items-center justify-center">
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={false}
                  animate={{
                    boxShadow:
                      state === "active"
                        ? "inset 0 0 0 2px #18181b"
                        : state === "done"
                          ? "inset 0 0 0 8px #1fa463"
                          : "inset 0 0 0 1.5px rgba(9,9,11,0.14)",
                  }}
                  transition={{ duration: 0.2 }}
                />
                {state === "active" && (
                  <motion.span
                    className="relative size-[6px] rounded-full bg-[#18181b]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {state === "done" && (
                  <motion.span
                    className="relative text-white"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={swift}
                  >
                    <Icon name="check" size={11} />
                  </motion.span>
                )}
              </span>
              <span
                className={
                  state === "active"
                    ? "font-[550] text-[#09090b]"
                    : state === "done"
                      ? "text-[#52525b]"
                      : "text-[#71717a]"
                }
              >
                {state === "active" ? message : label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="border-t border-[rgba(9,9,11,0.08)] pt-[16px] text-[13px] leading-[16px] text-[#52525b]">
        {Math.min(3, Math.floor(stage * 0.45))}s elapsed · most pages take 5–30 seconds. You can
        leave this screen; the scan keeps running.
      </p>
    </motion.div>
  );
}

/* ------------------------------ the report ------------------------------ */

// A report piece: it leaves while the scan runs and comes back, in its own place, when it's done.
function Piece({ show, delay = 0, className = "", style, children }) {
  return (
    <motion.div
      className={`absolute bg-white ${module} ${className}`}
      style={style}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12, scale: show ? 1 : 0.985 }}
      transition={{
        ...soft,
        delay: show ? delay : 0,
        opacity: { duration: show ? 0.35 : 0.2, delay: show ? delay : 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

function Score({ show, value, issues }) {
  return (
    <Piece
      show={show}
      className="top-[164px] left-[40px] flex h-[85px] w-[320px] items-center gap-[12px] rounded-[12px] p-[16px]"
    >
      <span className="relative size-[52px] shrink-0">
        <svg viewBox="0 0 52 52" width="52" height="52" fill="none" className="block">
          <circle cx="26" cy="26" r="23.5" strokeWidth="5" stroke="rgba(9,9,11,0.04)" />
          <circle
            cx="26"
            cy="26"
            r="23.5"
            strokeWidth="5"
            stroke={MEDIUM}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
            pathLength="1"
            strokeDasharray={`${value / 100} 1`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[18px] leading-[20px] font-[650] tracking-[-0.36px] text-[#09090b] tabular-nums">
          {value}
        </span>
      </span>
      <span>
        <span className="block text-[15px] leading-[20px] font-[650] text-[#09090b]">
          Needs work
        </span>
        <span className="block text-[13px] leading-[16px] text-[#71717a] tabular-nums">
          {issues} issues on 140 elements
        </span>
      </span>
    </Piece>
  );
}

// The high severity issues the scan found, as the app lists them.
const ISSUES = [
  {
    icon: "spacing",
    title: "22px spacing is off the 4px grid",
    cat: "Spacing",
    fix: "24px",
    h: 52,
  },
  {
    icon: "colour",
    title: "#2463eb is a near-duplicate of #2563eb",
    cat: "Colour",
    fix: "#2563eb",
    swatch: "#2463eb",
    h: 70,
  },
  {
    icon: "colour",
    title: "#94a3b8 on #ffffff is hard to read (2.5:1)",
    cat: "Colour",
    fix: "#64748b",
    swatch: "#94a3b8",
    h: 70,
  },
  {
    icon: "colour",
    title: "#ffffff on #f97316 is hard to read (2.8:1)",
    cat: "Colour",
    fix: "#bd5711",
    swatch: "#ffffff",
    h: 70,
  },
  {
    icon: "radius",
    title: "Radius 7px is 1px off the common 8px",
    cat: "Radius",
    fix: "8px",
    h: 52,
  },
  {
    icon: "borders",
    title: "Border “1px solid #2463eb” nearly matches “1px solid #2563eb”",
    cat: "Borders",
    fix: "1px solid…",
    swatch: "#2463eb",
    h: 70,
  },
];
const PICK = 1;

function Dot() {
  return <i className="size-[3px] shrink-0 rounded-full bg-[#71717a] opacity-45" />;
}

function IssueList({ show, arriving, hover, picked }) {
  return (
    <Piece
      show={show}
      delay={0.08}
      className="top-[261px] left-[40px] h-[400px] w-[320px] overflow-hidden rounded-[12px] px-[8px]"
    >
      <div className="flex h-[32px] items-center gap-[8px] px-[8px] text-[12px] leading-[20px] font-[650] tracking-[0.48px] text-[#52525b] uppercase">
        <Bars />
        High
        <span className="text-[#71717a]">8</span>
      </div>

      {ISSUES.map((issue, i) => (
        <motion.div
          key={issue.title}
          className="relative flex items-start gap-[12px] rounded-[8px] p-[8px]"
          style={{ height: issue.h }}
          initial={false}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
          transition={{ ...soft, delay: arriving ? 0.35 + i * 0.09 : 0 }}
        >
          {/* Hover, then the selection: a tint with the accent bar down its left side. */}
          {i === PICK && (
            <motion.span
              className="absolute inset-0 rounded-[8px]"
              initial={false}
              animate={{
                backgroundColor: picked
                  ? "rgba(9,9,11,0.08)"
                  : hover
                    ? "rgba(9,9,11,0.04)"
                    : "rgba(9,9,11,0)",
              }}
              transition={{ duration: 0.14 }}
            >
              <motion.i
                className="absolute top-[8px] bottom-[8px] left-0 w-[3px] rounded-full bg-[#18181b]"
                initial={false}
                animate={{ scaleY: picked ? 1 : 0, opacity: picked ? 1 : 0 }}
                transition={swift}
              />
            </motion.span>
          )}
          <span className="relative flex size-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[rgba(229,72,77,0.1)] text-[#c4282d]">
            <Icon name={issue.icon} size={15} />
          </span>
          <span className="relative flex min-w-0 flex-1 flex-col gap-[2px]">
            <span className="text-[14px] leading-[18px] font-[550] text-[#09090b]">
              {issue.title}
            </span>
            <span className="flex items-center gap-[8px] text-[13px] leading-[16px] whitespace-nowrap text-[#71717a]">
              {issue.cat}
              <Dot />
              1 element
              <Dot />
              <span className="text-[12px] text-[#157a49]" style={{ fontFamily: MONO }}>
                → {issue.fix}
              </span>
            </span>
          </span>
          {issue.swatch && (
            <span
              className="relative mt-[8px] size-[12px] shrink-0 rounded-[3px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
              style={{ background: issue.swatch }}
            />
          )}
        </motion.div>
      ))}
    </Piece>
  );
}

// The page in its frame. The app shows it 588 wide; here it is 384, so everything the app drew
// on it scales by the same amount.
const FRAME_W = 384;
const K = FRAME_W / 588;

// The boxes the app draws on the page with "All issues" on: [severity, x, y, width, height] at
// the app's 588 wide, in the order they sit down the page.
const MARKS = [
  [MEDIUM, 234, 64, 120.8, 15.8],
  [MEDIUM, 137, 85, 314.3, 29.3],
  [MEDIUM, 170, 121, 249, 28.5],
  [HIGH, 234, 158, 53.8, 23.6],
  [HIGH, 289, 158, 64.4, 23.6],
  [HIGH, 76, 184, 435.2, 12.6],
  [MEDIUM, 105, 219, 378.8, 19.1],
  [MEDIUM, 111, 241, 72.2, 19.1],
  [HIGH, 370, 533, 141.2, 79.9],
  [MEDIUM, 87, 544, 20.3, 20.3],
  [MEDIUM, 234, 544, 20.3, 20.3],
  [MEDIUM, 380, 543, 20.3, 20.3],
  [MEDIUM, 380, 566, 122.4, 15],
  [MEDIUM, 87, 581, 120.8, 22.4],
  [MEDIUM, 234, 581, 120.8, 22.4],
  [MEDIUM, 380, 580, 122.4, 22.4],
];
// The element behind the picked issue: the "Start free" button.
const PICKED_MARK = 3;

const tint = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

function Page({ show, arriving, picked }) {
  return (
    <Piece
      show={show}
      delay={0.04}
      className="top-[164px] left-[376px] h-[500px] overflow-hidden rounded-[12px]"
      style={{ width: FRAME_W }}
    >
      <div className="flex h-[32px] items-center gap-[12px] border-b border-[rgba(18,18,28,0.08)] bg-[#f6f6f8] px-[12px] text-[12px] leading-[20px] text-[#6a6a75]">
        <span className="flex gap-[8px]">
          <i className="size-[10px] rounded-full bg-[#dcdce2]" />
          <i className="size-[10px] rounded-full bg-[#dcdce2]" />
          <i className="size-[10px] rounded-full bg-[#dcdce2]" />
        </span>
        <span className="flex flex-1 items-center justify-center gap-[4px]">
          <Icon name="globe" size={12} />
          {TARGET}
        </span>
        1440 × 900
      </div>

      <div className="relative">
        <Image
          src="/images/case-studies/evenui/reel-scan-page.webp"
          width={880}
          height={1161}
          alt=""
          sizes="(min-width: 768px) 25vw, 50vw"
          className="block max-w-none"
          style={{ width: FRAME_W, height: "auto" }}
        />

        {MARKS.map(([sev, x, y, w, h], i) => {
          const isPicked = picked && i === PICKED_MARK;
          return (
            <motion.span
              key={i}
              className="absolute rounded-[3px]"
              style={{
                left: x * K,
                top: y * K,
                width: w * K,
                height: h * K,
                zIndex: isPicked ? 3 : 1,
              }}
              initial={false}
              animate={{
                opacity: !show ? 0 : isPicked ? 1 : picked ? 0.3 : 0.8,
                scale: show ? 1 : 1.25,
                backgroundColor: tint(sev, isPicked ? 0.12 : 0.1),
                boxShadow: isPicked
                  ? `inset 0 0 0 2.5px ${sev}, 0 0 0 4px ${tint(sev, 0.28)}`
                  : `inset 0 0 0 1.5px ${sev}, 0 0 0 0px ${tint(sev, 0)}`,
              }}
              transition={{
                ...swift,
                delay: arriving ? 0.45 + i * 0.085 : 0,
                opacity: { duration: 0.2, delay: arriving ? 0.45 + i * 0.085 : 0 },
                boxShadow: { duration: 0.26 },
              }}
            />
          );
        })}

        {/* The picked element's badge and its selector, as the app labels it. */}
        <motion.div
          className="absolute z-[4]"
          style={{ left: MARKS[PICKED_MARK][1] * K, top: MARKS[PICKED_MARK][2] * K }}
          initial={false}
          animate={{ opacity: picked ? 1 : 0, scale: picked ? 1 : 0.6 }}
          transition={{ ...swift, delay: picked ? 0.1 : 0 }}
        >
          <span
            className="absolute top-[-10px] left-[-10px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-[4px] text-[12px] font-bold text-white shadow-[0_0_0_2px_#fff,0_2px_6px_rgba(0,0,0,0.25)]"
            style={{ background: HIGH }}
          >
            1
          </span>
          <span
            className="absolute left-[-2px] rounded-[6px] bg-[#18181f] px-[8px] py-[4px] text-[12px] leading-[16px] whitespace-nowrap text-[#f3f3f6] shadow-[0_6px_16px_-4px_rgba(0,0,0,0.4)]"
            style={{ top: MARKS[PICKED_MARK][4] * K + 8, fontFamily: MONO }}
          >
            a.btn.primary &quot;Start free&quot; · background-color: #2463eb
          </span>
        </motion.div>
      </div>
    </Piece>
  );
}

export default function EvenUIReel() {
  const { ref, step, reduced } = useReel(STEPS, S.picked);

  const scanning = step === S.scan;
  const report = !scanning;
  const arriving = step === S.found;
  const picked = step === S.picked;
  const stage = useTicker(scanning, STAGES.length + 1, 310);

  const typed = useTyped(TARGET, step === S.type ? "typing" : step > S.type ? "done" : "idle", {
    speed: 58,
  });
  const score = useCount(84, report, { duration: 900, instant: reduced });
  const issues = useCount(24, report, { duration: 900, instant: reduced });

  let pointer = { x: 232, y: 392 };
  if (step >= S.toField) pointer = { x: 214, y: 70 };
  if (step >= S.toScan) pointer = { x: 688, y: 116 };
  if (step >= S.toIssue) pointer = { x: 232, y: 392 };

  return (
    <ProductFrame reelRef={ref} font='"Satoshi", ui-sans-serif, system-ui, sans-serif'>
      <Composer
        text={typed}
        focused={step >= S.focus && step <= S.toScan}
        cleared={step === S.reset}
        hover={step === S.toScan || step === S.press}
        press={step === S.press}
      />

      <Score show={report} value={score} issues={issues} />
      {/* The scan card, the issues and the page run off the bottom of the card, and fade out as
          they go. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, #000 calc(100% - 72px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 72px), transparent 100%)",
        }}
      >
        <ScanCard show={scanning} stage={stage} />
        <IssueList
          show={report}
          arriving={arriving}
          hover={step === S.toIssue || step === S.pick}
          picked={picked}
        />
        <Page show={report} arriving={arriving} picked={picked} />
      </div>

      {/* The suggested fix for the picked issue. */}
      <motion.div
        className={`absolute top-[376px] left-[409px] z-10 h-[241px] w-[351px] overflow-hidden rounded-[12px] bg-white ${module}`}
        initial={false}
        animate={{ opacity: picked ? 1 : 0, y: picked ? 0 : 16, scale: picked ? 1 : 0.97 }}
        transition={{
          ...soft,
          delay: picked ? 0.45 : 0,
          opacity: { duration: picked ? 0.35 : 0.2, delay: picked ? 0.45 : 0 },
        }}
      >
        <Image
          src="/images/case-studies/evenui/reel-b-fix.webp"
          width={702}
          height={482}
          alt=""
          sizes="(min-width: 768px) 25vw, 50vw"
          className="block h-[241px] w-[351px] max-w-none"
        />
      </motion.div>

      <Pointer {...pointer} press={step === S.focus || step === S.press || step === S.pick} />
    </ProductFrame>
  );
}
