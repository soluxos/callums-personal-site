"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReel } from "./shared";
import { Pointer, ProductFrame, module, soft } from "./source";

// Site Studio: building a page from elements, and the page it makes.
//
// Three columns fill the card, from 40px in at the top and left to off its bottom edge: the
// Elements sidebar, the form's sections down to the layout canvas, and the website the layout
// produces (which also runs off the right). A Paragraph is dragged from the sidebar into the
// layout and the paragraph appears on the page. Then the image container is dragged below the
// text and the photo moves below the text on the page. Two presses of the canvas's undo button
// put both back, which is the loop.
//
// There's nothing to capture Site Studio from at high resolution, so the sidebar and the canvas
// are rebuilt in code from a screenshot of the app, measured pixel by pixel: its typeface
// (Roboto), its colours and its sizes (36px rows with 40 x 32 tiles on a 46px pitch in the
// sidebar; 40px boxes 8px apart, nested 10px in, on the canvas; the 2px blue outline on the
// selected one). The glyphs and icons are redrawn from the same screenshot. The sidebar shows
// the app's content and layout elements, not every group. The panels are as wide and tall as
// the card needs (the app's own are wider), and the layout in the canvas is this reel's own
// arrangement of the app's containers and elements.
//
// The website is Inspace, the demo site that ships with Site Studio. Its photo and its words are
// crops of a real screenshot of that site (the text re-wrapped for a narrower page), so the
// fonts stay in the pixels.
//
// What the screenshots don't show is how the app looks in the middle of a drag or a press, so
// the lifted row, the line that marks where it will land and the tint on the pressed undo button
// are this reel's own, in the app's selection blue and greys.

// How long each step holds, in ms.
const STEPS = [
  500, // 0  as it starts: an image and a heading
  800, // 1  the pointer reaches Paragraph in the sidebar
  300, // 2  picks it up
  1150, // 3  carries it over, under the heading
  900, // 4  drops it: a new row, and a paragraph on the page
  750, // 5  the pointer reaches the image container
  300, // 6  picks it up
  1150, // 7  carries it below the text
  500, // 8  drops it
  1000, // 9  the finished page
  700, // 10 the pointer reaches undo
  180, // 11 presses it
  750, // 12 the image is back on top
  180, // 13 presses it again
  800, // 14 the paragraph is gone
  600, // 15 the pointer leaves
];
const FINISHED = 9;

const FONT = '"Roboto Reel", Roboto, ui-sans-serif, system-ui, sans-serif';
const BLUE = "#0e68a7";
const YELLOW = "#fec231";
const LINE = "#b2b2b2";
const SELECTED = "#0c5ea1";

// The same glide as the pointer, so whatever it carries stays under it.
const glide = { type: "spring", stiffness: 70, damping: 17, mass: 1 };

const site = name => `/images/case-studies/site-studio-cohesion/reel-site-${name}.webp`;

// The glyphs in the tiles, redrawn from the app on its 40 x 32 tile.
const frame = <rect x="13.5" y="10.5" width="13" height="11" fill="none" stroke="#fff" />;
const GLYPHS = {
  wysiwyg: (
    <>
      {frame}
      <rect x="15" y="14" width="5" height="3" />
      <rect x="21" y="14" width="4" height="1" />
      <rect x="21" y="16" width="4" height="1" />
      <rect x="15" y="18" width="10" height="1" />
    </>
  ),
  heading: (
    <>
      <rect x="13" y="10" width="14" height="4" />
      <rect x="13" y="15" width="8" height="4" />
    </>
  ),
  paragraph: (
    <>
      <rect x="13" y="10" width="9" height="2" />
      <rect x="13" y="13" width="13" height="2" />
      <rect x="13" y="16" width="10" height="2" />
      <rect x="13" y="19" width="14" height="2" />
    </>
  ),
  link: (
    <g fill="none" stroke="#fff" strokeWidth="1.5">
      <circle cx="16.3" cy="12.3" r="2.6" />
      <circle cx="22.7" cy="18.7" r="2.6" />
      <path d="M18.2 14.2l2.6 2.6" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),
  quote: (
    <>
      <path d="M13 21v-6.5c0-3 1.6-4.5 4.5-4.5v2c-1.5 0-2.2.8-2.2 2.5h3.2V21z" />
      <path d="M20.5 21v-6.5c0-3 1.6-4.5 4.5-4.5v2c-1.5 0-2.2.8-2.2 2.5h3.2V21z" />
    </>
  ),
  list: (
    <>
      {frame}
      {[12, 15, 18].map(y => (
        <g key={y}>
          <rect x="15" y={y} width="2" height="2" opacity="0.8" />
          <rect x="18" y={y} width="7" height="2" />
        </g>
      ))}
    </>
  ),
  item: (
    <>
      {[11, 15, 19].map(y => (
        <g key={y}>
          <rect x="13" y={y} width="2" height="2" />
          <rect x="17" y={y} width="10" height="2" />
        </g>
      ))}
    </>
  ),
  inline: (
    <>
      {frame}
      <rect x="15" y="12" width="10" height="8" />
      <path d="M16.5 13.5l2 2-2 2" fill="none" stroke={BLUE} />
      <rect x="20" y="17" width="3" height="1" fill={BLUE} />
    </>
  ),
  container: frame,
  columns: (
    <>
      {frame}
      <rect x="19" y="10" width="2" height="12" />
    </>
  ),
};

function Tile({ glyph, colour = BLUE, h }) {
  return (
    <span
      className="flex w-[40px] shrink-0 items-center justify-center"
      style={{ height: h, background: colour }}
    >
      <svg viewBox="0 0 40 32" width="40" height="32" fill="#fff" aria-hidden="true">
        {GLYPHS[glyph]}
      </svg>
    </span>
  );
}

// An element in the sidebar: its tile, its name, and the button that adds it.
function Element({ glyph, colour, children }) {
  return (
    <p className="flex h-[36px] items-center bg-[#212121] p-[2px] text-[13px] leading-none whitespace-nowrap text-white">
      <Tile glyph={glyph} colour={colour} h={32} />
      <span className="ml-[10px]">{children}</span>
      <svg viewBox="0 0 14 14" width="14" height="14" className="mr-[7px] ml-auto shrink-0">
        <circle cx="7" cy="7" r="7" fill="#0d6cb0" />
        <path d="M3 7h8M7 3v8" stroke="#212121" strokeWidth="2" />
      </svg>
    </p>
  );
}

function Group({ children, first = false }) {
  return (
    <p
      className={`flex items-center justify-between pr-[8px] text-[16px] leading-[18px] whitespace-nowrap text-[#dedede] ${first ? "pt-[16px] pb-[10px]" : "pt-[33px] pb-[13px]"}`}
    >
      {children}
      <svg viewBox="0 0 9 5" width="9" height="5" fill="#c8c8c8">
        <path d="M0 0h9L4.5 5z" />
      </svg>
    </p>
  );
}

// The two arrows on a container's row: pointing in on an open one, out on a closed one.
function Arrows({ open }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="#0b5da1"
      stroke="#0b5da1"
      strokeWidth="1.6"
    >
      {open ? (
        <>
          <path d="M6.6 1.8v3.6h3.6z" stroke="none" />
          <path d="M8.3 3.7l3-3" />
          <path d="M1.8 6.6h3.6v3.6z" stroke="none" />
          <path d="M3.7 8.3l-3 3" />
        </>
      ) : (
        <>
          <path d="M7.4 0.8h3.8v3.8z" stroke="none" />
          <path d="M9.5 2.5L6.7 5.3" />
          <path d="M0.8 7.4v3.8h3.8z" stroke="none" />
          <path d="M2.5 9.5l2.8-2.8" />
        </>
      )}
    </svg>
  );
}

// A row on the layout canvas: its tile, its name, and its controls on the right.
function Row({ glyph, colour, children, open }) {
  return (
    <p className="flex h-[36px] items-center text-[13px] leading-none whitespace-nowrap text-[#111]">
      <Tile glyph={glyph} colour={colour} h={36} />
      <span className="ml-[10px]">{children}</span>
      <span className="mr-[8px] ml-auto flex items-center gap-[15px]">
        {open !== undefined && <Arrows open={open} />}
        <span className="flex gap-px">
          {[0, 1, 2].map(dot => (
            <span key={dot} className="size-[4px] rounded-full bg-[#0661a3]" />
          ))}
        </span>
      </span>
    </p>
  );
}

// The app's outline on whichever box is selected: 2px of blue where the grey line was.
const box = selected => ({
  borderColor: selected ? SELECTED : LINE,
  boxShadow: `inset 0 0 0 1px rgba(12,94,161,${selected ? 1 : 0})`,
  backgroundColor: selected ? "#f9fbfd" : "#ffffff",
});

function Undo({ flip = false }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      fill="none"
      stroke="#666"
      strokeWidth="1.4"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M7 2.9a4.6 4.6 0 1 1-4.6 4.6" />
      <path d="M7.8 0.6L4.9 2.9l2.9 2.3z" fill="#666" stroke="none" />
    </svg>
  );
}

// The heading of a section of the form: its arrow, its name and its help button.
function Section({ title, open = false }) {
  return (
    <>
      <p className="absolute top-[16px] left-[18px] flex items-center gap-[9px] text-[16px] leading-[18px] font-bold whitespace-nowrap text-[#222330]">
        <svg viewBox="0 0 14 8" width="14" height="8" fill="none" stroke="#3c3d4a" strokeWidth="2">
          <path d={open ? "M1.5 7L7 1.5 12.5 7" : "M1.5 1.5L7 7l5.5-5.5"} />
        </svg>
        {title}
      </p>
      <span className="absolute top-[15px] right-[16px] flex size-[20px] items-center justify-center rounded-full bg-[#0e68a7] text-[13px] leading-none font-bold text-white">
        ?
      </span>
    </>
  );
}

function Plus() {
  return (
    <span className="flex h-[32px] w-[53px] items-center justify-center rounded-[3px] bg-[#0e68a7]">
      <svg viewBox="0 0 15 16" width="15" height="16" stroke="#fff" strokeWidth="3">
        <path d="M0 8h15M7.5 0v16" />
      </svg>
    </span>
  );
}

// A piece of the website, at a size of its own choosing (the crops are larger than they're shown).
function Crop({ name, w, h, source }) {
  return (
    <Image
      src={site(name)}
      width={source[0]}
      height={source[1]}
      alt=""
      sizes="(min-width: 768px) 25vw, 45vw"
      className="block max-w-none"
      style={{ width: w, height: h }}
    />
  );
}

export default function SiteStudioReel() {
  const { ref, step, reduced } = useReel(STEPS, FINISHED);

  const added = step >= 4 && step <= 13; // the paragraph is in the layout
  const moved = step >= 7 && step <= 11; // the image sits below the text
  const carrying = step === 3; // the sidebar row is in the air
  const lifting = step === 6 || step === 7; // the image container is in the air
  const picked = added && step <= 5 ? "paragraph" : step >= 6 && step <= 11 ? "image" : null;

  // Where the pointer is. It waits out of sight, and looks over the page once it's built.
  let pointer = { x: 452, y: 606 };
  if (step === 1 || step === 2) pointer = { x: 150, y: 290 };
  if (step === 3 || step === 4) pointer = { x: 400, y: 512 };
  if (step === 5 || step === 6) pointer = { x: 404, y: 368 };
  if (step === 7 || step === 8) pointer = { x: 404, y: 532 };
  if (step === 9) pointer = { x: 704, y: 468 };
  if (step >= 10 && step <= 14) pointer = { x: 361, y: 278 };
  const pressing = step === 2 || step === 3 || lifting || step === 11 || step === 13;

  // Whatever is under the pointer travels with it; what it displaces follows a moment later.
  const carried = step === 7 ? glide : soft;
  const displaced = { ...soft, delay: step === 7 ? 0.3 : 0 };

  return (
    <ProductFrame reelRef={ref} font={FONT}>
      {/* With reduced motion the pieces are put down afresh on the finished page, so nothing
          travels there from the opening state. */}
      <Fragment key={reduced ? "still" : "moving"}>
        {/* The Elements sidebar. */}
        <div
          className={`absolute top-[40px] left-[40px] h-[640px] w-[212px] overflow-hidden rounded-t-[12px] bg-[#333] ${module}`}
        >
          <div className="flex h-[41px] items-center bg-black pl-[11px] text-[18px] leading-none font-bold text-white">
            Elements
            <svg viewBox="0 0 10 6" width="10" height="6" fill="#fff" className="mr-[14px] ml-auto">
              <path d="M0 0h10L5 6z" />
            </svg>
            <span className="flex h-full w-[42px] items-center justify-center bg-[#0e68a7]">
              <svg viewBox="0 0 12 12" width="12" height="12" stroke="#fff" strokeWidth="2.8">
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
              </svg>
            </span>
          </div>
          <div className="flex h-[53px] items-start gap-[10px] border-b border-[#5a5a5a] bg-[#303030] p-[10px]">
            <span className="flex h-[32px] min-w-0 flex-1 items-center gap-[7px] overflow-hidden bg-[#fafafa] pl-[8px] text-[13px] leading-none whitespace-nowrap text-[#8e8f93]">
              <svg
                viewBox="0 0 13 13"
                width="13"
                height="13"
                fill="none"
                stroke="#b4b4b4"
                strokeWidth="1.6"
                className="shrink-0"
              >
                <circle cx="5.3" cy="5.3" r="4" />
                <path d="M8.4 8.4l3.6 3.6" />
              </svg>
              Search for Elements
            </span>
            <span className="flex size-[32px] shrink-0 items-center justify-center bg-[#181818]">
              <svg viewBox="0 0 14 10" width="14" height="10">
                <path
                  d="M0.5 5C2.2 2 4.4.6 7 .6S11.800 2 13.500 5C11.800 8 9.600 9.400 7 9.400S2.200 8 .5 5z"
                  fill="#fff"
                />
                <circle cx="7" cy="5" r="2.2" fill="#181818" />
                <circle cx="6.200" cy="4.200" r=".8" fill="#fff" />
              </svg>
            </span>
          </div>
          <div className="flex flex-col gap-[10px] px-[10px]">
            <div className="-mb-[10px]">
              <Group first>Content elements</Group>
            </div>
            <Element glyph="wysiwyg">WYSIWYG</Element>
            <Element glyph="heading">Heading</Element>
            <Element glyph="paragraph">Paragraph</Element>
            <Element glyph="link">Link</Element>
            <Element glyph="quote">Block quote</Element>
            <Element glyph="list">List container</Element>
            <Element glyph="item">List item</Element>
            <Element glyph="inline">Inline element</Element>
            <div className="-my-[10px]">
              <Group>Layout elements</Group>
            </div>
            <Element glyph="container" colour={YELLOW}>
              Container
            </Element>
            <Element glyph="columns" colour={YELLOW}>
              Row for columns
            </Element>
          </div>
        </div>

        {/* The two closed sections that sit above the layout canvas in the app. */}
        {["Details", "Availability"].map((title, i) => (
          <div
            key={title}
            className={`absolute left-[264px] h-[50px] w-[264px] rounded-[12px] bg-white ${module}`}
            style={{ top: 40 + i * 66 }}
          >
            <Section title={title} />
          </div>
        ))}

        {/* The layout canvas. */}
        <div
          className={`absolute top-[172px] left-[264px] h-[640px] w-[264px] rounded-t-[12px] bg-white ${module}`}
        >
          <Section title="Layout canvas" open />

          <div className="absolute top-[88px] left-[16px] flex gap-[5px]">
            <Plus />
            <motion.span
              className="flex h-[32px] w-[50px] items-center justify-center rounded-[3px] border border-[#d9d9d9]"
              initial={false}
              animate={{ backgroundColor: step === 11 || step === 13 ? "#e6e6e6" : "#ffffff" }}
              transition={{ duration: 0.12 }}
            >
              <Undo />
            </motion.span>
            <span className="flex h-[32px] w-[50px] items-center justify-center rounded-[3px] border border-[#d9d9d9]">
              <Undo flip />
            </span>
          </div>

          {/* The layout: a full-width container holding an image container and a text container. */}
          <motion.div
            className="absolute top-[129px] left-[16px] w-[232px] border bg-white"
            style={{ borderColor: LINE }}
            initial={false}
            animate={{ height: added ? 271 : 223 }}
            transition={soft}
          >
            <div className="absolute inset-x-px top-px">
              <Row glyph="container" colour={YELLOW} open>
                Container - Full width
              </Row>
            </div>

            {/* Where the image container will land, while it's being carried. */}
            <motion.span
              className="absolute top-[205px] left-[9px] h-[2px] w-[212px] rounded-full"
              style={{ background: SELECTED }}
              initial={false}
              animate={{ opacity: step === 7 ? 1 : 0, scaleX: step === 7 ? 1 : 0.7 }}
              transition={{ duration: 0.25, delay: step === 7 ? 0.25 : 0 }}
            />

            {/* The text container. It moves up when the image container is dragged below it. */}
            <motion.div
              className="absolute top-[94px] left-[9px] w-[212px] border"
              initial={false}
              animate={{ height: added ? 156 : 108, y: moved ? -48 : 0, ...box(false) }}
              transition={{ height: soft, y: displaced }}
            >
              <div className="absolute inset-x-px top-px">
                <Row glyph="container" colour={YELLOW} open>
                  Container - Text
                </Row>
              </div>
              <div
                className="absolute top-[47px] left-[9px] w-[192px] border p-px"
                style={box(false)}
              >
                <Row glyph="heading">Heading</Row>
              </div>
              {/* The paragraph, once it's dropped in. */}
              <motion.div
                className="absolute top-[95px] left-[9px] w-[192px] border p-px"
                initial={false}
                animate={{
                  opacity: added ? 1 : 0,
                  scale: added ? 1 : 0.97,
                  ...box(picked === "paragraph"),
                }}
                transition={{ ...soft, opacity: { duration: 0.25 } }}
              >
                <Row glyph="paragraph">Paragraph</Row>
              </motion.div>
              {/* Where it will land, while it's being carried. */}
              <motion.span
                className="absolute top-[90px] left-[9px] h-[2px] w-[192px] rounded-full"
                style={{ background: SELECTED }}
                initial={false}
                animate={{ opacity: carrying ? 1 : 0, scaleX: carrying ? 1 : 0.7 }}
                transition={{ duration: 0.25, delay: carrying ? 0.45 : 0 }}
              />
            </motion.div>

            {/* The image container: picked up, carried below the text, and put down. */}
            <motion.div
              className="absolute top-[46px] left-[9px] z-10 w-[212px] border p-px"
              initial={false}
              animate={{
                y: moved ? 164 : 0,
                scale: lifting ? 1.025 : 1,
                ...box(picked === "image"),
                boxShadow: lifting
                  ? "inset 0 0 0 1px rgba(12,94,161,1), 0 16px 30px -12px rgba(10,30,60,0.5)"
                  : `${box(picked === "image").boxShadow}, 0 0px 0px 0px rgba(10,30,60,0)`,
              }}
              transition={{ ...soft, y: carried }}
            >
              <Row glyph="container" colour={YELLOW} open={false}>
                Container - Image
              </Row>
            </motion.div>
          </motion.div>

          {/* The buttons under the layout, which sit below however tall it is. */}
          <motion.div
            className="absolute top-[361px] right-[16px] left-[16px] flex justify-between"
            initial={false}
            animate={{ y: added ? 48 : 0 }}
            transition={soft}
          >
            <Plus />
            <span className="flex h-[32px] w-[100px] items-center justify-center gap-[6px] rounded-[3px] border border-[#b2b2b2] text-[14px] leading-none font-medium text-black">
              Options
              <svg viewBox="0 0 8 4" width="8" height="4" fill="#000">
                <path d="M0 0h8L4 4z" />
              </svg>
            </span>
          </motion.div>
        </div>

        {/* The page the layout makes: Inspace, Site Studio's demo site. */}
        <div
          className={`absolute top-[40px] left-[540px] h-[640px] w-[320px] overflow-hidden rounded-tl-[12px] bg-white ${module}`}
        >
          {/* Its navigation, as far as the logo: the links are further right than the card goes. */}
          <div className="absolute top-[17px] left-[20px] w-[96px] overflow-hidden">
            <Crop name="nav" w={460} h={22} source={[767, 37]} />
          </div>

          <motion.div
            className="absolute top-[320px] left-[22px]"
            initial={false}
            animate={{ y: moved ? -246 : 0 }}
            transition={displaced}
          >
            <Crop name="heading" w={216} h={94} source={[321, 140]} />
          </motion.div>

          <motion.div
            className="absolute top-[434px] left-[22px]"
            initial={false}
            animate={{ y: moved ? -246 : 0 }}
            transition={displaced}
          >
            {/* The paragraph arrives a line at a time, from the top. */}
            <motion.div
              initial={false}
              animate={{
                opacity: added ? 1 : 0,
                y: added ? 0 : 8,
                clipPath: added ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
              }}
              transition={{
                ...soft,
                opacity: { duration: 0.3 },
                clipPath: { duration: 0.55, ease: [0.3, 0, 0.2, 1] },
              }}
            >
              <Crop name="para" w={216} h={98} source={[324, 147]} />
            </motion.div>
          </motion.div>

          {/* The photo travels with the image container. */}
          <motion.div
            className="absolute top-[56px] left-0 z-10"
            initial={false}
            animate={{
              y: moved ? 254 : 0,
              scale: lifting ? 1.02 : 1,
              boxShadow: lifting
                ? "0 22px 40px -14px rgba(10,20,40,0.55)"
                : "0 0px 0px 0px rgba(10,20,40,0)",
            }}
            transition={{ ...soft, y: carried }}
          >
            <Crop name="hero" w={320} h={240} source={[433, 325]} />
          </motion.div>
        </div>

        {/* The sidebar row being carried, under the pointer. */}
        <motion.div
          className="pointer-events-none absolute z-20 w-[188px] shadow-[0_16px_30px_-10px_rgba(0,0,0,0.6)]"
          initial={false}
          animate={{
            left: step === 3 || step === 4 ? 300 : 50,
            top: step === 3 || step === 4 ? 492 : 270,
            opacity: step === 2 || step === 3 ? 1 : 0,
            scale: step === 2 || step === 3 ? 1.03 : 1,
            rotate: step === 3 ? 1.5 : 0,
          }}
          transition={{
            left: step === 3 ? glide : { duration: 0 },
            top: step === 3 ? glide : { duration: 0 },
            opacity: { duration: step === 4 ? 0.22 : 0.12 },
            scale: soft,
            rotate: soft,
          }}
        >
          <Element glyph="paragraph">Paragraph</Element>
        </motion.div>

        {!reduced && <Pointer {...pointer} press={pressing} hidden={step === 0 || step === 15} />}
      </Fragment>
    </ProductFrame>
  );
}
