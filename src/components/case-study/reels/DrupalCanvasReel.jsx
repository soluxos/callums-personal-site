"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { Caret, useReel, useTyped } from "./shared";
import { Pointer, ProductFrame, module, soft, swift } from "./source";

// Drupal Canvas: select the hero on the page, retype its heading, swap its image, publish.
//
// Three pieces, as in the editor: the top bar across the card, the page under it on the left
// and the selected component's settings on the right. The page and the panel run off the bottom
// of the card, and the page is wider than its piece, the way it is when you zoom in.
//
// What is real and what is drawn:
// - The page is the travel site from the Canvas screenshots, cut into its nav, the hero's two
//   photos and the rows under it. Its headings are the screenshot's own letters with the white
//   knocked out, so the page's typeface is never substituted. The new heading is revealed a
//   letter at a time (STOPS are the letter boundaries, measured from the image).
// - The top bar, the panel and the selection are drawn here in Inter with sizes, spacing and
//   colours measured from the same screenshots (Radix controls: 24px in the top bar, 32px
//   fields, 12px labels, 14px values), because they have to change.
//
// Every piece keeps its place. The panel scrolls the way it does in the editor to reach the
// Heading field, which is the last one.
//
// Steps: 0 waiting, 1 the pointer reaches the hero, 2 press, 3 selected and the panel fills in,
// 4 the pointer reaches Heading as the panel scrolls, 5 the old text is selected, 6 typing,
// 7 typed, 8 the pointer reaches the image as the panel scrolls back, 9 press, 10 the image is
// swapped, 11 the pointer reaches Publish, 12 press, 13 published, 14 back to the start.
const STEPS = [700, 850, 220, 900, 900, 450, 2100, 450, 900, 220, 1200, 850, 220, 1300, 900];

const OLD_HEADING = "Book your vacation";
const NEW_HEADING = "Ensure your vacation goes smoothly";
// How much of the new heading's image is showing after each typed character.
const STOPS = [
  0, 0.0418, 0.0773, 0.105, 0.1426, 0.1652, 0.2021, 0.2021, 0.2404, 0.2738, 0.3113, 0.3418, 0.3418,
  0.3794, 0.4121, 0.444, 0.478, 0.4986, 0.5128, 0.5475, 0.5908, 0.5908, 0.6312, 0.6688, 0.7014,
  0.7355, 0.7355, 0.7688, 0.8241, 0.8603, 0.8957, 0.9142, 0.9496, 0.966, 1,
];

const img = name => `/images/case-studies/drupal-canvas/reel-${name}.webp`;

// How far the panel scrolls to bring the Heading field clear of the card's bottom edge.
const SCROLL = 34;

// The page is 1400 image pixels wide and shown 490 wide: the editor zoomed to just over half.
const ZOOM = 0.35;

// A piece of the page screenshot, at the page's zoom.
function PagePiece({ name, w, h, className = "", style }) {
  return (
    <Image
      src={img(name)}
      width={w}
      height={h}
      alt=""
      sizes="(min-width: 768px) 45vw, 90vw"
      className={`block max-w-none ${className}`}
      style={{ width: w * ZOOM, height: h * ZOOM, ...style }}
    />
  );
}

// Radix icons, which Canvas uses throughout. All are drawn on a 15 x 15 grid.
const ICONS = {
  file: "M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z",
  chevron:
    "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
  eye: "M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z",
  component:
    "M4.67129 3.14634C4.47603 3.34161 4.47603 3.65819 4.67129 3.85345L7.14616 6.32833C7.34142 6.52359 7.65801 6.52359 7.85327 6.32833L10.3281 3.85345C10.5234 3.65819 10.5234 3.34161 10.3281 3.14634L7.85327 0.671471C7.65801 0.476209 7.34142 0.476209 7.14616 0.671471L4.67129 3.14634ZM7.49971 5.26766L5.73195 3.4999L7.49971 1.73213L9.26748 3.4999L7.49971 5.26766ZM8.67129 7.14634C8.47603 7.34161 8.47603 7.65819 8.67129 7.85345L11.1462 10.3283C11.3414 10.5236 11.658 10.5236 11.8533 10.3283L14.3281 7.85345C14.5234 7.65819 14.5234 7.34161 14.3281 7.14634L11.8533 4.67147C11.658 4.47621 11.3414 4.47621 11.1462 4.67147L8.67129 7.14634ZM11.4997 9.26766L9.73195 7.4999L11.4997 5.73213L13.2675 7.4999L11.4997 9.26766ZM4.67129 11.8535C4.47603 11.6582 4.47603 11.3416 4.67129 11.1463L7.14616 8.67147C7.34142 8.47621 7.65801 8.47621 7.85327 8.67147L10.3281 11.1463C10.5234 11.3416 10.5234 11.6582 10.3281 11.8535L7.85327 14.3283C7.65801 14.5236 7.34142 14.5236 7.14616 14.3283L4.67129 11.8535ZM5.73195 11.4999L7.49971 13.2677L9.26748 11.4999L7.49971 9.73213L5.73195 11.4999ZM0.671288 7.14649C0.476026 7.34175 0.476026 7.65834 0.671288 7.8536L3.14616 10.3285C3.34142 10.5237 3.65801 10.5237 3.85327 10.3285L6.32814 7.8536C6.5234 7.65834 6.5234 7.34175 6.32814 7.14649L3.85327 4.67162C3.65801 4.47636 3.34142 4.47636 3.14616 4.67162L0.671288 7.14649ZM3.49972 9.26781L1.73195 7.50005L3.49972 5.73228L5.26748 7.50005L3.49972 9.26781Z",
  dots: "M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z",
  cross:
    "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
};

function Icon({ name, size = 15, className = "" }) {
  return (
    <svg
      viewBox="0 0 15 15"
      width={size}
      height={size}
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={ICONS[name]} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

// One field in the panel: its label, then its control `top` pixels down the panel. Fields come
// in one after another when their tab opens, and leave together.
function Row({ show, order, top, label, labelGap = 24, required = false, children }) {
  return (
    <motion.div
      className="absolute inset-x-[24px]"
      style={{ top: top - labelGap }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={
        show
          ? {
              ...soft,
              delay: 0.1 + order * 0.05,
              opacity: { duration: 0.3, delay: 0.1 + order * 0.05 },
            }
          : { duration: 0.18 }
      }
    >
      <p className="h-[16px] text-[12px] leading-[16px] text-[#60646c]">
        {label}
        {required && <span className="text-[#fc5e56]">*</span>}
      </p>
      <div className="absolute inset-x-0" style={{ top: labelGap }}>
        {children}
      </div>
    </motion.div>
  );
}

const control =
  "relative flex items-center rounded-[4px] border border-[#d9d9e0] bg-white text-[14px] leading-[20px] text-[#1c2024]";

function TextInput({ children, focused = false }) {
  return (
    <div className={`${control} h-[32px] px-[8px] whitespace-nowrap`}>
      {children}
      <motion.span
        className="pointer-events-none absolute -inset-px rounded-[4px] border-2 border-[#5eb1ef]"
        initial={false}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}

function Select({ children }) {
  return (
    <div className={`${control} h-[32px] justify-between pr-[8px] pl-[8px]`}>
      {children}
      <Icon name="chevron" />
    </div>
  );
}

function TextArea({ lines, children }) {
  return (
    <div className={`${control} items-start px-[8px] py-[2px]`} style={{ height: lines * 20 + 6 }}>
      {children}
    </div>
  );
}

export default function DrupalCanvasReel() {
  const { ref, step } = useReel(STEPS, 10);

  const hovered = step === 1 || step === 2;
  const selected = step >= 3 && step <= 13;
  const scrolled = step >= 4 && step <= 7;
  const focused = step >= 5 && step <= 7;
  const typing = step === 6;
  const typed = useTyped(
    NEW_HEADING,
    step < 6 || step === 14 ? "idle" : typing ? "typing" : "done",
    {
      speed: 46,
    }
  );
  // The old heading goes on the first keystroke, as selected text does.
  const retyped = (typing && typed.length > 0) || (step > 6 && step < 14);
  const marked = step === 5 || (typing && typed.length === 0);
  const swapped = step >= 10 && step <= 13;
  const changed = retyped && step <= 12;

  let pointer = { x: 352, y: 588 };
  if (step >= 1) pointer = { x: 236, y: 300 };
  if (step >= 4) pointer = { x: 700, y: 596 };
  if (step >= 6) pointer = { x: 738, y: 616 };
  if (step >= 8) pointer = { x: 622, y: 246 };
  if (step >= 11) pointer = { x: 722, y: 62 };
  if (step === 14) pointer = { x: 352, y: 588 };

  const overPublish = step === 11 || step === 12;
  const overImage = step === 8 || step === 9;

  return (
    <ProductFrame reelRef={ref} font='"Inter Reel", ui-sans-serif, system-ui, sans-serif'>
      {/* With reduced motion, nothing slides or scales on its way to the still frame. */}
      <MotionConfig reducedMotion="user">
        {/* The top bar: the page being edited, whether it has changes, preview and Publish. */}
        <div
          className={`absolute top-[40px] left-[40px] h-[40px] w-[720px] rounded-[12px] bg-[#fdfdfd] text-[12px] leading-[16px] font-medium ${module}`}
        >
          <Image
            src={img("bar-left")}
            width={276}
            height={76}
            alt=""
            className="absolute top-px left-[5px] block h-[38px] w-[138px] max-w-none"
          />
          <div className="absolute top-[8px] left-[301px] flex h-[24px] w-[118px] items-center rounded-[3px] bg-[#eeeef1] pr-[9px] pl-[8px] text-[#60646c]">
            <Icon name="file" />
            <span className="ml-[6px]">Homepage</span>
            <Icon name="chevron" className="ml-auto" />
          </div>
          <motion.div
            className="absolute top-[8px] left-[427px] flex h-[24px] items-center rounded-[3px] bg-[#fdf6c0] px-[8px] text-[#a9612a]"
            initial={false}
            animate={{ opacity: changed ? 1 : 0, scale: changed ? 1 : 0.88 }}
            transition={{ ...swift, opacity: { duration: 0.25 } }}
          >
            Changed
          </motion.div>
          <div className="absolute top-[8px] left-[613px] flex h-[24px] w-[32px] items-center justify-center rounded-[3px] border border-[#8acaf0] bg-[#f4faff] text-[#08799b]">
            <Icon name="eye" />
          </div>
          <motion.div
            className="absolute top-[8px] left-[653px] flex h-[24px] w-[59px] items-center justify-center rounded-[3px] text-white"
            initial={false}
            animate={{
              backgroundColor: overPublish ? "#0588f0" : "#0190ff",
              scale: step === 12 ? 0.94 : 1,
            }}
            transition={{ scale: swift, backgroundColor: { duration: 0.2 } }}
          >
            Publish
          </motion.div>
        </div>

        {/* The page. It is wider than this piece and longer than the card. */}
        <div
          className={`absolute top-[96px] left-[40px] h-[584px] w-[408px] overflow-hidden rounded-[12px] bg-white ${module}`}
        >
          <div className="absolute top-0 left-0 w-[490px]">
            <PagePiece name="nav" w={1400} h={142} />

            {/* The hero: its image, then its heading. */}
            <div className="relative h-[245px]">
              <PagePiece name="hero-palm" w={1400} h={700} className="absolute inset-0" />
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: swapped ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                <PagePiece name="hero-kid" w={1400} h={700} />
              </motion.div>
            </div>
            <div className="relative h-[55.3px]">
              <motion.div
                className="absolute inset-x-0 top-[24.5px] flex justify-center"
                initial={false}
                animate={{ opacity: retyped ? 0 : 1 }}
                transition={retyped ? { duration: 0 } : { duration: 0.35, delay: 0.25 }}
              >
                <PagePiece name="heading-old" w={380} h={48} />
              </motion.div>
              <motion.div
                className="absolute inset-x-0 top-[24.5px] flex justify-center"
                initial={false}
                animate={{ opacity: retyped ? 1 : 0 }}
                transition={{ duration: retyped ? 0 : 0.22 }}
              >
                <div
                  className="overflow-hidden"
                  style={{ width: 705 * ZOOM * (typing ? STOPS[typed.length] : 1) }}
                >
                  <PagePiece name="heading-new" w={705} h={48} />
                </div>
              </motion.div>
            </div>

            <PagePiece name="below" w={1400} h={700} />
          </div>

          {/* The selection: the editor's outline round the component, and its name. */}
          <motion.div
            className="pointer-events-none absolute left-0 h-[304.3px] w-[490px] border-2 border-[#9747ff]"
            style={{ top: 47.7 }}
            initial={false}
            animate={{ opacity: selected ? 1 : hovered ? 0.55 : 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.p
            className="absolute left-0 flex h-[20px] items-center gap-[4px] rounded-[4px] bg-[#8e4ec6] pr-[8px] pl-[5px] text-[12px] leading-none text-white"
            style={{ top: 25.7 }}
            initial={false}
            animate={{ opacity: selected || hovered ? 1 : 0, y: selected || hovered ? 0 : 5 }}
            transition={{ ...swift, opacity: { duration: 0.2 } }}
          >
            <Icon name="component" size={13} />
            Hero component
          </motion.p>
        </div>

        {/* The right-hand panel: the page's own fields, or the selected component's. */}
        <div
          className={`absolute top-[96px] left-[460px] h-[584px] w-[300px] overflow-hidden rounded-[12px] bg-white ${module}`}
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ y: scrolled ? -SCROLL : 0 }}
            transition={soft}
          >
            {/* Page data, while nothing is selected. */}
            <Row show={!selected} order={0} top={82} label="Title" required>
              <TextInput>10 Summer Travel Tips for Families</TextInput>
            </Row>
            <Row show={!selected} order={1} top={156} label="URL path">
              <TextInput>/</TextInput>
            </Row>
            <Row show={!selected} order={2} top={230} label="Menu link title">
              <TextInput>Home</TextInput>
            </Row>
            <Row show={!selected} order={3} top={304} label="Title tag">
              <TextArea lines={2}>WanderTogether | 10 Summer Travel Tips for Families</TextArea>
            </Row>
            <Row show={!selected} order={4} top={392} label="Meta description">
              <TextArea lines={5}>
                Start your next family adventure with WanderTogether. Explore 10 must-know travel
                tips for planning a fun, simple, and unforgettable summer vacation.
              </TextArea>
            </Row>

            {/* The hero's settings. */}
            <Row show={selected} order={0} top={84} label="Background Image" labelGap={26.5}>
              <motion.div
                className="relative h-[93px] rounded-[4px] border border-[#d9d9e0]"
                initial={false}
                animate={{ backgroundColor: overImage ? "#f9f9fb" : "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute top-[8px] left-[7px] size-[75px] overflow-hidden rounded-[4px]"
                  initial={false}
                  animate={{ scale: step === 9 ? 0.95 : 1 }}
                  transition={swift}
                >
                  <Image
                    src={img("thumb-palm")}
                    width={225}
                    height={225}
                    alt=""
                    className="absolute inset-0 size-full"
                  />
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: swapped ? 1 : 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <Image
                      src={img("thumb-kid")}
                      width={225}
                      height={225}
                      alt=""
                      className="size-full"
                    />
                  </motion.div>
                </motion.div>
                {["palm-beach.jpg", "summer-splash.jpg"].map((file, i) => (
                  <motion.p
                    key={file}
                    className="absolute top-[36px] left-[95px] text-[14px] leading-[20px] text-[#60646c]"
                    initial={false}
                    animate={{
                      opacity: swapped === (i === 1) ? 1 : 0,
                      y: swapped === (i === 1) ? 0 : i ? 5 : -5,
                    }}
                    transition={{ ...soft, opacity: { duration: 0.3 } }}
                  >
                    {file}
                  </motion.p>
                ))}
              </motion.div>
            </Row>
            <Row show={selected} order={1} top={220} label="Layout">
              <Select>Left aligned</Select>
            </Row>
            <Row show={selected} order={2} top={294} label="Pre heading">
              <TextInput />
            </Row>
            <Row show={selected} order={3} top={368} label="Heading Element">
              <Select>h2</Select>
            </Row>
            <Row show={selected} order={4} top={442} label="Heading size">
              <Select>Extra Large</Select>
            </Row>
            <Row show={selected} order={5} top={516} label="Heading">
              <TextInput focused={focused}>
                <span className={marked ? "bg-[#0093ff3d]" : ""}>
                  {retyped ? typed : OLD_HEADING}
                </span>
                {focused && !marked && <Caret height={17} color="#1c2024" />}
              </TextInput>
            </Row>
          </motion.div>

          {/* The tabs stay put while the fields scroll under them. */}
          <div className="absolute inset-x-0 top-0 h-[40px] bg-white text-[12px] leading-[16px]">
            {[
              { label: "Page data", left: 33, on: !selected },
              { label: "Content", left: 105.5, on: false },
              { label: "Settings", left: 167.5, on: selected },
            ].map(tab => (
              <p
                key={tab.label}
                className="absolute top-[15.5px] transition-colors duration-200"
                style={{
                  left: tab.left,
                  color: tab.on ? "#1c2024" : "#60646c",
                  fontWeight: tab.on ? 500 : 400,
                }}
              >
                {tab.label}
              </p>
            ))}
            <Icon name="dots" className="absolute top-[12.5px] left-[240.5px] text-[#1c2024]" />
            <Icon name="cross" className="absolute top-[12.5px] left-[260.5px] text-[#1c2024]" />
            <div className="absolute inset-x-[24px] bottom-0 h-px bg-[#d9d9e0]" />
            <motion.div
              className="absolute bottom-0 h-[2px] bg-[#0090ff]"
              initial={false}
              animate={{ left: selected ? 159 : 24.5, width: selected ? 65 : 72 }}
              transition={swift}
            />
          </div>
        </div>

        <Pointer {...pointer} press={step === 2 || step === 5 || step === 9 || step === 12} />
      </MotionConfig>
    </ProductFrame>
  );
}
