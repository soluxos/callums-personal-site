"use client";

import { AnimatePresence, motion } from "motion/react";
import { Caret, useReel, useTyped } from "./shared";
import { Pointer, Prime, ProductFrame, Sym, module, soft, swift } from "./source";

// Acquia AI: someone builds a new website by talking to it. This is the product's own "Build a
// website for this project" conversation, from the prototype: it asks what to call the site and
// who it's for, offers a style to pick, then creates the site and shows a first look. "View full
// preview" opens the live preview beside the chat.
//
// Each piece is the product's component at its real size, with its own type, colours, spacing
// and icons, read from the prototype: the visibility banner, the bubbles, the "Completed in"
// line with what it used, the style picker and how it looks once answered, the preview card and
// its drawing, the live preview pane, and the Home page's message box. What's ours: there's no
// app window behind, the agent's plain text sits on a white card so it reads on the card's
// colour, the agent's two longer lines are trimmed, the site has a tidier name than the prototype
// makes up, and the live preview slides over the chat where the product narrows the chat to fit.
//
// The conversation is one tall strip, 720 wide, with every message at a fixed place on it. The
// strip glides up as the conversation grows, the way a chat scrolls, and fades out at the top of
// the card. The message box stays put at the bottom.
const STEPS = [1900, 320, 850, 1500, 750, 280, 1000, 1100, 1300, 650, 260, 2600, 500];
const S = {
  type: 0,
  send: 1,
  sent: 2,
  ask: 3,
  toOption: 4,
  pick: 5,
  picked: 6,
  build: 7,
  created: 8,
  toPreview: 9,
  open: 10,
  opened: 11,
  reset: 12,
};

const SITE = "Signal Summit";
const ANSWER = `${SITE}, for our customer conference`;

// Where each piece sits down the strip, and how tall it is.
const AT = {
  banner: 0,
  greeting: 57,
  request: 181,
  question: 243,
  answer: 344,
  style: 406,
  picker: 496,
  choice: 770,
  result: 832,
  preview: 922,
};
// The strip shows through a window from the top padding down to the message box.
const WINDOW = 478;
// How far the strip has moved up at each point: enough to bring the newest piece into view.
const CAMERA = {
  start: 0,
  ask: 746 + 16 - WINDOW,
  picked: 880 + 16 - WINDOW,
  created: 1188 + 16 - WINDOW,
};

const card = `rounded-[8px] border border-[#e0e6eb] bg-white ${module}`;

// Material Symbols Rounded "language", weight 300: the icon the product puts on a site.
const LANGUAGE =
  "M331.27-129.96q-69.35-29.96-120.85-81.27-51.5-51.31-80.96-120.96Q100-401.85 100-481.42q0-79.58 29.46-148.62t80.96-120.34q51.5-51.31 120.85-80.46Q400.62-860 480-860t148.73 29.16q69.35 29.15 120.85 80.46 51.5 51.3 80.96 120.34Q860-561 860-481.42q0 79.57-29.46 149.23-29.46 69.65-80.96 120.96-51.5 51.31-120.85 81.27Q559.38-100 480-100t-148.73-29.96ZM480-143.39q37.31-40.23 61.38-87.3 24.08-47.08 39.47-110.31H379.77q15.15 62.31 39.23 110.11 24.08 47.81 61 87.5Zm-63.46-8.15q-28.08-36.46-49.73-84.88-21.66-48.43-34.04-104.58H173.54q38.38 77.54 96.46 122.46 58.08 44.93 146.54 67Zm127.92-.61q78.54-17.62 142-66.7 63.46-49.07 100-122.15H627.85q-14.93 56.31-36.08 104.35-21.16 48.03-47.31 84.5ZM158.92-386.38h165.54q-3.77-27.39-4.84-50.43-1.08-23.04-1.08-44.81 0-24.23 1.38-45.84 1.39-21.62 5.16-46.77H158.92q-7.38 23.23-10.46 44.92-3.07 21.69-3.07 47.69 0 26.39 3.07 49 3.08 22.62 10.46 46.24Zm212.16 0h218.46q4.38-30.23 5.77-51.47 1.38-21.23 1.38-43.77 0-21.53-1.38-41.96-1.39-20.42-5.77-50.65H371.08q-4.39 30.23-5.77 50.65-1.39 20.43-1.39 41.96 0 22.54 1.39 43.77 1.38 21.24 5.77 51.47Zm263.84 0h166.16q7.38-23.62 10.46-46.24 3.07-22.61 3.07-49 0-26-3.07-47.69-3.08-21.69-10.46-44.92H635.92q3.39 33.08 4.77 53.88 1.39 20.81 1.39 38.73 0 22.39-1.7 44-1.69 21.62-5.46 51.24Zm-7.69-233.23h159.23q-35.310-76.7-97.81-125.2t-145.19-64.04q28.08 37.77 49.04 84.81t34.73 104.43Zm-247.46 0h202.08q-13.31-56.47-39.5-106.54-26.2-50.08-62.35-89.23-33.92 31.23-57.27 77.15t-42.96 118.62Zm-206.23 0h159.85q12.53-55.54 33-102.08 20.46-46.54 49.15-86.54-82.69 15.92-144.08 63.61-61.38 47.7-97.92 125.01Z";

// How a message arrives: the product's own message-in, a short fade up into its place.
function Arrive({ show, top, delay = 0, className = "", children }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ top }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
      transition={{
        ...soft,
        delay: show ? delay : 0,
        opacity: { duration: show ? 0.28 : 0.15, delay: show ? delay : 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

// What the person said: a bubble on the right.
function Said({ show, top, children }) {
  return (
    <Arrive show={show} top={top} className="right-0">
      <p
        className={`rounded-[8px] border border-[#f0f3f5] bg-white px-[16px] py-[8px] text-[#52697a] ${module}`}
      >
        {children}
      </p>
    </Arrive>
  );
}

// "Completed in 3s · Used" and what it used.
function Completed({ seconds, children }) {
  return (
    <p className="flex items-center gap-[8px] leading-[21px] text-[#68747e]">
      Completed in {seconds}s
      {children && (
        <>
          <span className="text-[#adb8c0]">·</span> Used {children}
        </>
      )}
    </p>
  );
}

function Chip({ icon, children }) {
  return (
    <span className="inline-flex h-[26px] items-center gap-[6px] rounded-full border border-[#e0e6eb] bg-white px-[10px] leading-[21px] text-[#3d4f5c]">
      {icon === "language" ? (
        <svg viewBox="0 -960 960 960" width="14" height="14" fill="#036bb5" className="shrink-0">
          <path d={LANGUAGE} />
        </svg>
      ) : (
        <Sym name={icon} size={14} className="text-[#036bb5]" />
      )}
      {children}
    </span>
  );
}

// An action the agent can take, named inline: blue, or red for the one that deletes.
function Action({ danger, children }) {
  return (
    <span
      className={`mx-[2px] inline-block rounded-[4px] px-[4px] align-middle text-[12px] leading-[20px] font-bold ${
        danger ? "bg-[#fee6e6] text-[#cc1f1f]" : "bg-[#d3ecf8] text-[#036bb5]"
      }`}
    >
      {children}
    </span>
  );
}

const PROCESSING = [
  "#8bc6e8",
  "#56a3d4",
  "#2481c1",
  "#56a3d4",
  "#2481c1",
  "#076eb7",
  "#2481c1",
  "#076eb7",
  "#056cb6",
];

function Processing({ show, top }) {
  return (
    <Arrive show={show} top={top} className="left-0">
      <p className={`flex h-[48px] items-center gap-[12px] px-[14px] font-semibold ${card}`}>
        <span className="grid size-[16px] grid-cols-3 gap-[0.5px]">
          {PROCESSING.map((colour, i) => (
            <motion.span
              key={i}
              className="size-[5px]"
              style={{ background: colour }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                delay: (i % 3) * 0.12 + Math.floor(i / 3) * 0.12,
              }}
            />
          ))}
        </span>
        Processing
      </p>
    </Arrive>
  );
}

/* ------------------------------ the style picker ------------------------------ */

const STYLES = ["Clean & corporate", "Bold & colorful", "Minimal"];

function Picker({ show, hover, picked }) {
  return (
    <Arrive show={show} top={AT.picker} delay={0.12} className="left-0">
      <div
        className={`w-[380px] rounded-[12px] border border-[#e0e6eb] bg-white p-[14px] ${module}`}
      >
        <p className="font-semibold text-[#3d4f5c]">Pick a style for “{SITE}”</p>
        <div className="mt-[10px] flex flex-col gap-[6px]">
          {STYLES.map((style, i) => {
            const chosen = picked && i === 0;
            return (
              <motion.div
                key={style}
                className="flex h-[43px] items-center gap-[10px] rounded-[6px] border px-[12px] leading-[21px]"
                initial={false}
                animate={{
                  backgroundColor: chosen ? "#036bb5" : hover && i === 0 ? "#f2f9fc" : "#ffffff",
                  borderColor: chosen ? "#036bb5" : hover && i === 0 ? "#036bb5" : "#e0e6eb",
                  color: chosen ? "#ffffff" : "#52697a",
                  opacity: !show ? 0 : picked && !chosen ? 0.5 : 1,
                  y: show ? 0 : 6,
                }}
                transition={{
                  duration: 0.18,
                  y: { ...soft, delay: show ? 0.2 + i * 0.07 : 0 },
                  opacity: { duration: 0.25, delay: show && !picked ? 0.2 + i * 0.07 : 0 },
                }}
              >
                <motion.span
                  className="flex size-[20px] shrink-0 items-center justify-center rounded-full text-[12px] leading-[18px] font-semibold"
                  initial={false}
                  animate={{
                    backgroundColor: chosen ? "rgba(255,255,255,0.2)" : "#f0f3f5",
                    color: chosen ? "#ffffff" : "#8a959d",
                  }}
                  transition={{ duration: 0.18 }}
                >
                  {i + 1}
                </motion.span>
                <span className="flex-1">{style}</span>
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0"
                  initial={false}
                  animate={{ opacity: chosen ? 1 : 0, scale: chosen ? 1 : 0.5 }}
                  transition={swift}
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.div>
            );
          })}
          <motion.div
            className="flex h-[43px] items-center gap-[10px] rounded-[6px] border border-dashed border-[#c2ced6] px-[12px] leading-[21px] text-[#8a959d]"
            initial={false}
            animate={{ opacity: !show ? 0 : picked ? 0.5 : 1, y: show ? 0 : 6 }}
            transition={{
              y: { ...soft, delay: show ? 0.41 : 0 },
              opacity: { duration: 0.25, delay: show && !picked ? 0.41 : 0 },
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 text-[#adb8c0]"
            >
              <path
                d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            Something else
          </motion.div>
        </div>
      </div>
    </Arrive>
  );
}

/* ------------------------------ the first look ------------------------------ */

// One part of the preview drawing, which builds itself a part at a time when the site arrives.
function Part({ show, n, children }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{
        ...soft,
        delay: show ? 0.45 + n * 0.11 : 0,
        opacity: { duration: 0.3, delay: show ? 0.45 + n * 0.11 : 0 },
      }}
    >
      {children}
    </motion.g>
  );
}

// The product's own drawing of the new site, in the picked style's colour.
function Drawing({ show, className }) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMin slice"
      className={`block w-full bg-[#f9fafb] ${className}`}
    >
      <rect x="0" y="0" width="400" height="22" fill="#fff" />
      <circle cx="14" cy="11" r="3" fill="#c2ced6" />
      <circle cx="26" cy="11" r="3" fill="#c2ced6" />
      <circle cx="38" cy="11" r="3" fill="#c2ced6" />
      <rect x="60" y="6" width="180" height="10" rx="5" fill="#f0f3f5" />
      <Part show={show} n={0}>
        <rect x="0" y="22" width="400" height="92" fill="#036BB51A" />
      </Part>
      <Part show={show} n={1}>
        <rect x="28" y="48" width="150" height="12" rx="3" fill="#3d4f5c" />
        <rect x="28" y="66" width="200" height="8" rx="3" fill="#adb8c0" />
      </Part>
      <Part show={show} n={2}>
        <rect x="28" y="86" width="70" height="16" rx="8" fill="#036BB5" />
      </Part>
      {[28, 150, 272].map((x, i) => (
        <Part key={x} show={show} n={3 + i}>
          <rect x={x} y="130" width="100" height="100" rx="6" fill="#fff" stroke="#e0e6eb" />
          <circle cx={x + 20} cy="152" r="10" fill="#036BB533" />
          <rect x={x + 12} y="172" width="76" height="8" rx="3" fill="#52697a" />
          <rect x={x + 12} y="186" width="60" height="6" rx="3" fill="#c2ced6" />
          <rect x={x + 12} y="198" width="76" height="6" rx="3" fill="#c2ced6" />
          <rect x={x + 12} y="210" width="40" height="6" rx="3" fill="#c2ced6" />
        </Part>
      ))}
    </svg>
  );
}

function Preview({ show, press }) {
  return (
    <Arrive show={show} top={AT.preview} delay={0.14} className="left-0">
      <div
        className={`w-[360px] overflow-hidden rounded-[12px] border border-[#e0e6eb] bg-white ${module}`}
      >
        <Drawing show={show} className="h-[160px]" />
        <div className="px-[14px] pt-[12px] pb-[14px]">
          <p className="font-semibold text-[#2c373f]">{SITE}</p>
          <p className="mt-[2px] text-[12px] leading-[16px] text-[#8a959d]">
            Freshly generated with Acquia Source
          </p>
          <motion.span
            className="mt-[10px] inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-[#c2ced6] bg-white px-[12px] text-[12px] leading-[16px] font-medium text-[#52697a]"
            initial={false}
            animate={{ scale: press ? 0.95 : 1 }}
            transition={swift}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View full preview
          </motion.span>
        </div>
      </div>
    </Arrive>
  );
}

// The live preview: the product opens it beside the chat. Here it slides in over the right of the
// conversation, and the site draws itself in.
function LivePreview({ show }) {
  return (
    <motion.div
      className="absolute top-[40px] left-[300px] h-[478px] w-[460px] overflow-hidden rounded-[12px] border border-[#d3dee3] bg-[#f9fafb] shadow-[-18px_0_40px_-18px_rgba(12,24,44,0.35),0_22px_48px_-22px_rgba(12,24,44,0.42)]"
      initial={false}
      animate={{ x: show ? 0 : 520, opacity: show ? 1 : 0 }}
      transition={{
        x: { type: "spring", stiffness: 150, damping: 24 },
        opacity: { duration: show ? 0.2 : 0.3 },
      }}
    >
      <div className="flex h-[48px] items-center justify-between border-b border-[#d3dee3] bg-white px-[20px]">
        <p className="flex items-center gap-[10px]">
          <span className="font-semibold text-[#2c373f]">{SITE}</span>
          <span className="text-[12px] leading-[16px] text-[#8a959d]">Live preview</span>
        </p>
        <span className="flex h-[30px] items-center gap-[6px] rounded-[6px] border border-[#c2ced6] bg-white px-[12px] text-[12px] leading-[16px] font-medium text-[#52697a]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Close
        </span>
      </div>
      <div className="p-[32px]">
        <Drawing show={show} className="h-[270px]" />
      </div>
    </motion.div>
  );
}

/* ------------------------------ the message box ------------------------------ */

// The message box as it is on the product's Home page: one row, with the project it works in.
function MessageBox({ text, typing, press }) {
  const ready = text.length > 0;
  return (
    <div className="absolute top-[534px] left-[40px] flex h-[66px] w-[720px] items-center gap-[12px] rounded-[12px] border border-[#036bb5] bg-white py-[12px] pr-[12px] pl-[20px] shadow-[0_0_0_4px_rgba(3,107,181,0.12),0_12px_32px_-8px_rgba(3,107,181,0.25)]">
      <Sym name="auto_awesome" size={20} className="text-[#036bb5]" />
      <p className="relative mr-auto flex h-[24px] flex-1 items-center">
        <motion.span
          className="absolute text-[16px] leading-[24px] text-[#8a959d]"
          initial={false}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ duration: ready ? 0.05 : 0.25 }}
        >
          Ask Acquia AI…
        </motion.span>
        <span className="relative whitespace-nowrap text-[#2c373f]">{text}</span>
        {typing && <Caret height={18} color="#2c373f" className="relative ml-px" />}
      </p>
      <div className="flex items-center gap-[8px] text-[#52697a]">
        <span className="flex size-[40px] items-center justify-center rounded-[8px] border border-[#e0e6eb] bg-white">
          <Sym name="add" size={20} />
        </span>
        <span className="flex size-[40px] items-center justify-center rounded-[8px] border border-[#e0e6eb] bg-white">
          <Sym name="work" size={20} />
        </span>
        <span className="flex h-[40px] items-center gap-[6px] rounded-[8px] border border-[#e0e6eb] bg-white px-[12px] leading-[14px]">
          <Sym name="folder_open" size={18} />
          Signal Relaunch
          <Sym name="expand_more" size={18} />
        </span>
        <motion.span
          className="flex size-[40px] items-center justify-center rounded-[8px]"
          initial={false}
          animate={{
            backgroundColor: ready ? "#036bb5" : "#f0f3f5",
            color: ready ? "#ffffff" : "#adb8c0",
            scale: press ? 0.9 : 1,
          }}
          transition={{ duration: 0.2, scale: swift }}
        >
          <Sym name="arrow_upward" size={22} />
        </motion.span>
      </div>
    </div>
  );
}

export default function AcquiaAIReel() {
  const { ref, step, cycle } = useReel(STEPS, S.opened);

  const typed = useTyped(ANSWER, step === S.type ? "typing" : step === S.send ? "done" : "idle", {
    speed: 34,
    delay: 450,
  });

  const answered = step >= S.sent;
  const asked = step >= S.ask;
  const picked = step >= S.picked;
  const created = step >= S.created;
  const opened = step >= S.opened;

  let camera = CAMERA.start;
  if (asked) camera = CAMERA.ask;
  if (picked) camera = CAMERA.picked;
  if (created) camera = CAMERA.created;

  let pointer = { x: 700, y: 606 };
  if (step >= S.send) pointer = { x: 730, y: 572 };
  if (step >= S.toOption) pointer = { x: 232, y: 322 };
  if (created) pointer = { x: 268, y: 440 };
  if (step >= S.toPreview) pointer = { x: 128, y: 476 };

  return (
    <ProductFrame reelRef={ref}>
      {/* Each time round is a fresh conversation, which fades in as the last one fades out, so
          the card is never empty. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={cycle}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* The conversation, through a window that fades out at the top of the card. */}
          <div
            className="absolute inset-x-0 top-0 h-[524px] overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0, #000 40px, #000 calc(100% - 14px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, #000 40px, #000 calc(100% - 14px), transparent 100%)",
            }}
          >
            <motion.div
              className="absolute top-[40px] left-[40px] w-[720px]"
              initial={false}
              animate={{ y: -camera }}
              transition={{ type: "spring", stiffness: 120, damping: 24, mass: 1 }}
            >
              {/* Who can see this conversation. */}
              <p
                className="absolute inset-x-0 flex h-[33px] items-center gap-[8px] rounded-[6px] border border-[#0f7bba] bg-white px-[10px] leading-[21px] text-[#0f7bba] shadow-[0_4px_8px_rgba(2,5,10,0.04)]"
                style={{ top: AT.banner }}
              >
                <Prime name="users" size={16} />
                This conversation is visible to all members of this project.
              </p>

              {/* The agent's opening line, with what it will always ask before doing. */}
              <div
                className={`absolute left-0 w-[568px] p-[14px] leading-[24px] text-[#52697a] ${card}`}
                style={{ top: AT.greeting }}
              >
                How can I help you today?
                <br />
                I&apos;d also like to point out that I can perform some actions, such as:
                <Action>Create site</Action>, <Action>Publish</Action>, <Action>Deploy</Action>,{" "}
                <Action danger>Delete site</Action>. But I&apos;ll need explicit permission before I
                do any of these for you.
              </div>

              <Said show top={AT.request}>
                Build a website for this project
              </Said>

              <div
                className={`absolute left-0 p-[14px] text-[#52697a] ${card}`}
                style={{ top: AT.question }}
              >
                <Completed seconds={2} />
                <p className="mt-[8px]">
                  I&apos;ll use your Signal Relaunch project for this. What should I call the site,
                  and who’s it for?
                </p>
              </div>

              <Said show={answered} top={AT.answer}>
                {ANSWER}
              </Said>

              <Processing show={step === S.sent} top={AT.style} />
              <Arrive show={asked} top={AT.style} className="left-0">
                <div className={`p-[14px] text-[#52697a] ${card}`}>
                  <Completed seconds={3}>
                    <Chip icon="description">Brand Guidelines.pdf</Chip>
                  </Completed>
                  <p className="mt-[8px]">What style are you after for “{SITE}”?</p>
                </div>
              </Arrive>
              <Picker show={asked} hover={step === S.toOption || step === S.pick} picked={picked} />

              <Said show={picked} top={AT.choice}>
                {STYLES[0]}
              </Said>

              <Processing show={step === S.picked || step === S.build} top={AT.result} />
              <Arrive show={created} top={AT.result} className="left-0">
                <div className={`p-[14px] text-[#52697a] ${card}`}>
                  <Completed seconds={11}>
                    <Chip icon="language">{SITE}</Chip>
                  </Completed>
                  <p className="mt-[8px]">
                    I’ve created “{SITE}” as a new Acquia Source site. Here’s a first look:
                  </p>
                </div>
              </Arrive>
              <Preview show={created} press={step === S.open} />
            </motion.div>
          </div>

          <LivePreview show={opened} />
        </motion.div>
      </AnimatePresence>

      <MessageBox text={typed} typing={step === S.type} press={step === S.send} />

      <Pointer {...pointer} press={step === S.send || step === S.pick || step === S.open} />
    </ProductFrame>
  );
}
