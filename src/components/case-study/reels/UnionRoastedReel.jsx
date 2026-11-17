"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useReel } from "./shared";

// Union Roasted: the shop itself, filling the whole card. It scrolls down a coffee's page the way
// you'd read it: the coffee and its buy panel, the story of the microlot, the farm it comes from,
// then the other coffees in the range, and back to the top.
//
// It is one capture of the live site from 2025 (the product page, with its empty side margins
// trimmed so the page is a little larger on the card). Nothing is redrawn and nothing is added:
// the only thing that moves is the scroll position.
//
// The scroll is a timed ease (not the reels' shared springs): a spring covers any distance in
// the same half second, which over a page this tall would read as a jump.

// The capture, and how tall the page in it is in the site's own pixels.
const PAGE = {
  src: "/images/case-studies/union-roasted/reel-site.webp",
  width: 1600,
  height: 5127,
};
const PAGE_HEIGHT = 3400;

// Where the scroll rests, in the site's own pixels from the top of the page. Each step waits,
// travels to its stop, then holds there.
const STOPS = [
  { at: 845, wait: 1.0, travel: 2.0, hold: 0.7 }, // the tasting strip and "More about this microlot"
  { at: 1540, wait: 0, travel: 1.9, hold: 0.8 }, // the farm
  { at: 2500, wait: 0, travel: 2.2, hold: 1.4 }, // the other coffees
  { at: 0, wait: 0, travel: 1.8, hold: 0.5 }, // back to the coffee and its buy panel
];
const STEPS = STOPS.map(stop => (stop.wait + stop.travel + stop.hold) * 1000);
const TOP = STOPS.length - 1;

const offset = at => `${(-at / PAGE_HEIGHT) * 100}%`;

export default function UnionRoastedReel() {
  const { ref, step, reduced } = useReel(STEPS, TOP);

  // The page waits at the top until the card is first on screen, so the scroll is seen from its
  // start. (The steps themselves only run while the card is on screen.)
  const inView = useInView(ref, { amount: 0.35 });
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  const stop = started ? STOPS[step] : STOPS[TOP];

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#f8f6f1] select-none">
      <motion.div
        className="absolute inset-x-0 top-0 will-change-transform"
        initial={{ y: offset(0) }}
        animate={{ y: offset(stop.at) }}
        transition={
          reduced || !started
            ? { duration: 0 }
            : { duration: stop.travel, delay: stop.wait, ease: [0.45, 0, 0.15, 1] }
        }
      >
        <Image
          src={PAGE.src}
          width={PAGE.width}
          height={PAGE.height}
          alt=""
          sizes="(min-width: 768px) 46vw, 94vw"
          className="block h-auto w-full max-w-none"
        />
      </motion.div>
    </div>
  );
}
