"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

// Steps through a reel: `durations` is how long each step holds, in ms, and it loops. It only
// runs while the card is on screen. With reduced motion it holds on the `rest` step instead.
// `cycle` counts the loops, for anything that should start afresh each time round.
export function useReel(durations, rest = 0) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  // Only trusted after mount, so the server and the first client render agree.
  const reduced = mounted && prefersReduced;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!inView || reduced) return undefined;
    const timer = setTimeout(() => {
      const next = (step + 1) % durations.length;
      if (next === 0) setCycle(c => c + 1);
      setStep(next);
    }, durations[step]);
    return () => clearTimeout(timer);
  }, [step, inView, reduced, durations]);

  return { ref, step: reduced ? rest : step, cycle, reduced };
}

// A little unevenness between keystrokes, the same every time (no Math.random, so renders agree).
const jitter = i => 0.55 + 0.9 * Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);

// Text that types itself. `state` is "idle" (nothing yet), "typing" (a character at a time, from
// the start, every time it becomes "typing") or "done" (all of it). `speed` is ms per character.
export function useTyped(text, state, { speed = 48, delay = 0 } = {}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (state !== "typing") return undefined;
    let i = 0;
    let timer;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length)
        timer = setTimeout(tick, speed * jitter(i) * (text[i] === " " ? 1.5 : 1));
    };
    timer = setTimeout(tick, delay);
    return () => {
      clearTimeout(timer);
      setCount(0);
    };
  }, [state, text, speed, delay]);

  if (state === "done") return text;
  if (state === "idle") return "";
  return text.slice(0, count);
}

// A number that counts up to `to` while `active`, easing out. Shows `to` straight away when
// `instant` (reduced motion), and 0 while not active.
export function useCount(to, active, { duration = 900, instant = false } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || instant) return undefined;
    let frame;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setValue(0);
    };
  }, [to, active, duration, instant]);

  if (instant) return active ? to : 0;
  return active ? value : 0;
}

// The text cursor, blinking the way a focused field's does.
export function Caret({ height = 18, color = "currentColor", className = "" }) {
  return (
    <span
      className={`inline-block w-px animate-[reel-caret_1.06s_steps(1)_infinite] align-middle ${className}`}
      style={{ height, background: color }}
    />
  );
}

// Counts 0, 1, 2 ... up to `count - 1`, one every `interval` ms, while `active`. Back to 0 when
// it isn't. For a run of small beats inside one step: a checklist ticking off, lines arriving.
export function useTicker(active, count, interval) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setN(v => Math.min(count - 1, v + 1)), interval);
    return () => {
      clearInterval(timer);
      setN(0);
    };
  }, [active, count, interval]);

  return active ? n : 0;
}
