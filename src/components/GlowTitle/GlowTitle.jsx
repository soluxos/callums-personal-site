"use client";

import { motion } from "motion/react";

// Pre-compute a 40-step sine-curve bell for silky-smooth glow interpolation.
const STEPS = 40;
const _sine = Array.from({ length: STEPS + 1 }, (_, i) => Math.sin((i / STEPS) * Math.PI));
const _times = _sine.map((_, i) => i / STEPS);

const _shadowFrames = _sine.map(
  s =>
    `0 0 ${(4 * s).toFixed(2)}px oklch(100% 0 0 / ${(s * 100).toFixed(1)}%),` +
    `0 0 ${(8 * s).toFixed(2)}px oklch(100% 0 0 / ${(s * 80).toFixed(1)}%),` +
    `0 0 ${(20 * s).toFixed(2)}px oklch(100% 0 0 / ${(s * 60).toFixed(1)}%),` +
    `0 0 ${(40 * s).toFixed(2)}px oklch(100% 0 0 / ${(s * 40).toFixed(1)}%),` +
    `0 0 ${(80 * s).toFixed(2)}px oklch(100% 0 0 / ${(s * 20).toFixed(1)}%)`
);

const _opacityFrames = _sine.map((_, i) => Math.min(1, (i / (STEPS * 0.15)) * 1));
const _yFrames = _sine.map((_, i) => Math.max(0, 6 * (1 - i / (STEPS * 0.15))));

/**
 * GlowTitle
 *
 * Renders text with a character-by-character sine-wave glow animation.
 *
 * Props:
 *   text       string   — the text to display
 *   as         string   — HTML tag to use, e.g. "h1", "h2", "p" (default: "h1")
 *   className  string   — additional Tailwind / CSS classes on the wrapper element
 *   replayKey  any      — change this value to replay the animation (e.g. a hover counter)
 */
export default function GlowTitle({ text, as: Tag = "h1", className = "", replayKey = 0 }) {
  const chars = text.split("");
  const isReplay = replayKey > 0;
  return (
    <Tag className={className}>
      {/* One letter per span would be read out letter by letter, so screen readers get
          the whole word here and the animated letters are hidden from them. */}
      <span className="sr-only">{text}</span>
      {chars.map((char, i) => (
        <motion.span
          key={`${replayKey}-${i}`}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          initial={
            isReplay
              ? { textShadow: _shadowFrames[0] }
              : { textShadow: _shadowFrames[0], opacity: 0, y: 6 }
          }
          animate={
            isReplay
              ? { textShadow: _shadowFrames }
              : { textShadow: _shadowFrames, opacity: _opacityFrames, y: _yFrames }
          }
          transition={{
            duration: 1,
            delay: i * 0.05,
            ease: "linear",
            times: _times,
          }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  );
}
