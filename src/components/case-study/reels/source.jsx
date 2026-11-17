"use client";

import { motion } from "motion/react";
import { INLINE, MATERIAL, PRIME } from "./sourceIcons";

// Pieces shared by the card reels. Each reel is drawn at its product's real pixel sizes, with
// its own typeface, colours, spacing and icons, on an 800 x 640 canvas that is scaled as a
// whole to fit the card. Nothing in them is restyled: every value is read from the product.

const FRAME = { width: 800, height: 640 };
// The card is 5:4 like the frame, so at this share of the card's width (in cqw, 1% of it) the
// frame covers the card exactly.
const SHARE = 100;

// The frame: an 800 x 640 canvas the size of the card, with no background of its own. The
// product's pieces sit on it as separate modules, at their real pixel sizes.
// tan(atan2(a, b)) is a / b as a plain number, which lets CSS scale by the ratio of two lengths:
// the card's width over the frame's own.
// `font` is the product's typeface. It defaults to Proxima Nova, the Acquia products'.
export function ProductFrame({
  reelRef,
  children,
  className = "",
  font = '"Proxima Nova", ui-sans-serif, system-ui, sans-serif',
}) {
  return (
    <div
      ref={reelRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ width: `${SHARE}cqw`, height: `${(SHARE * FRAME.height) / FRAME.width}cqw` }}
    >
      <div
        className={`relative origin-top-left text-[14px] leading-[20px] font-normal text-[#3d4f5c] ${className}`}
        style={{
          width: FRAME.width,
          height: FRAME.height,
          scale: `tan(atan2(${SHARE}cqw, ${FRAME.width}px))`,
          fontFamily: font,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// The lift every module gets off the card: a soft shadow under the product's own border.
export const module =
  "shadow-[0_22px_48px_-22px_rgba(12,24,44,0.42),0_2px_6px_-2px_rgba(12,24,44,0.08)]";

// One easing for everything that moves in these reels, so they feel like one piece.
export const soft = { type: "spring", stiffness: 170, damping: 26, mass: 1 };
export const swift = { type: "spring", stiffness: 300, damping: 32 };

// A Material Symbols Rounded icon, at the weight the product uses for it.
export function Sym({ name, size = 16, className = "" }) {
  const icon = MATERIAL[name];
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={icon.d} />
    </svg>
  );
}

// One of the product's own inline SVGs: its logo, navigation icons and chevrons.
export function Inline({ name, width, height = width, className = "", style }) {
  const icon = INLINE[name];
  return (
    <svg
      viewBox={icon.viewBox}
      width={width}
      height={height}
      fill={icon.fill}
      className={`shrink-0 ${className}`}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

// A PrimeIcons icon, as the product's PrimeVue components use.
export function Prime({ name, size = 16, className = "" }) {
  const icon = PRIME[name];
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

const glide = { type: "spring", stiffness: 70, damping: 17, mass: 1 };

// The pointer, positioned in the frame's own pixels.
export function Pointer({ x, y, press = false, hidden = false }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      initial={false}
      animate={{ left: x, top: y, scale: press ? 0.8 : 1, opacity: hidden ? 0 : 1 }}
      transition={{
        left: glide,
        top: glide,
        scale: { duration: 0.14 },
        opacity: { duration: 0.35 },
      }}
      style={{ transformOrigin: "top left" }}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        className="block drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
      >
        <path
          d="M3 2 L3 18.6 L7.6 14.6 L10.5 21.4 L13.4 20.1 L10.6 13.5 L16.6 13.2 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
