"use client";

// My photos left on the cutting mat as prints, with a sticky note. With a
// mouse you can pick them up and move them about. On touch screens dragging would
// fight with scrolling, so a tap just brings a print to the top.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

// Positions are percentages of the desk, so the layout scales with it. `desk` is for
// tablets and up, and `phone` for narrow screens,
// which only have room for some of the prints (`phone: null` hides one there).
const ITEMS = [
  {
    id: "books",
    src: "/images/about/image-3.jpg",
    alt: "Shelves of colourful books in a bookshop",
    rotate: -7,
    tape: -4,
    desk: { left: "0%", top: "3%", width: "21%" },
    phone: { left: "0%", top: "0%", width: "46%" },
  },
  {
    id: "drink",
    src: "/images/about/image-11.jpg",
    alt: "A glass with mint and a straw, on a table by a lake",
    rotate: 4,
    desk: { left: "20%", top: "0%", width: "21%" },
    phone: { left: "4%", top: "19%", width: "46%" },
  },
  {
    id: "portrait",
    src: "/images/random/38.jpg",
    alt: "A woman with long brown hair looking back over her shoulder",
    rotate: -3,
    desk: { left: "39%", top: "4%", width: "21%" },
    phone: { left: "50%", top: "56%", width: "46%" },
  },
  {
    id: "cocktails",
    src: "/images/about/image-6.jpg",
    alt: "Two cocktails on a table by the sea, with a swimmer in the water behind",
    rotate: 5,
    desk: { left: "59%", top: "1%", width: "21%" },
    phone: { left: "50%", top: "18%", width: "46%" },
  },
  {
    id: "cows",
    src: "/images/random/40.jpg",
    alt: "Three curious cows looking at the camera in a field",
    rotate: 5,
    desk: { left: "3%", top: "26%", width: "21%" },
    phone: { left: "0%", top: "38%", width: "46%" },
  },
  {
    id: "boat",
    src: "/images/about/image-12.jpg",
    alt: "A white boat moored on a cobbled quay on a misty morning",
    rotate: -5,
    tape: 3,
    desk: { left: "23%", top: "23%", width: "21%" },
    phone: { left: "52%", top: "37%", width: "46%" },
  },
  {
    id: "cat",
    src: "/images/about/image-5.jpg",
    alt: "A tabby cat stretched out asleep on a sofa",
    rotate: 3,
    desk: { left: "43%", top: "28%", width: "21%" },
    phone: { left: "4%", top: "57%", width: "46%" },
  },
  {
    id: "dusk",
    src: "/images/about/image-8.jpg",
    alt: "The sea at dusk, with lights along the coastline",
    rotate: -4,
    desk: { left: "62%", top: "24%", width: "21%" },
    phone: null,
  },
  {
    id: "azalea",
    src: "/images/random/7.jpg",
    alt: "Yellow azalea flowers against a dark background",
    rotate: 6,
    tape: -2,
    desk: { left: "79%", top: "28%", width: "21%" },
    phone: { left: "52%", top: "75%", width: "46%" },
  },
  {
    id: "marina",
    src: "/images/about/image-10.jpg",
    alt: "Yachts moored in a marina under a clear blue sky",
    rotate: -4,
    desk: { left: "0%", top: "49%", width: "21%" },
    phone: { left: "0%", top: "76%", width: "46%" },
  },
  {
    id: "orange",
    src: "/images/random/32.jpg",
    alt: "Bright orange azalea flowers",
    rotate: 6,
    desk: { left: "19%", top: "46%", width: "21%" },
    phone: null,
  },
  {
    id: "smile",
    src: "/images/random/11.jpg",
    alt: "A smiling woman with short grey hair, resting her chin on her hand by a bookshelf",
    rotate: -5,
    tape: 4,
    desk: { left: "39%", top: "50%", width: "21%" },
    phone: null,
  },
  {
    id: "street",
    src: "/images/random/20.jpg",
    alt: "Red brick Victorian buildings on a busy city street",
    rotate: 3,
    desk: { left: "58%", top: "47%", width: "21%" },
    phone: null,
  },
  {
    id: "rooftops",
    src: "/images/random/13.jpg",
    alt: "Rooftops and telephone wires at sunset",
    rotate: -3,
    desk: { left: "79%", top: "51%", width: "21%" },
    phone: null,
  },
  {
    id: "branches",
    src: "/images/random/6.jpg",
    alt: "Sunlight on water, framed by overhanging branches",
    rotate: 5,
    desk: { left: "4%", top: "72%", width: "21%" },
    phone: null,
  },
  {
    id: "river",
    src: "/images/random/25.jpg",
    alt: "A river winding through green fields on a sunny day",
    rotate: -4,
    tape: 4,
    desk: { left: "23%", top: "69%", width: "21%" },
    phone: null,
  },
  {
    id: "rhododendron",
    src: "/images/about/image-4.jpg",
    alt: "Bright red rhododendron flowers",
    rotate: 4,
    desk: { left: "42%", top: "74%", width: "21%" },
    phone: null,
  },
  {
    id: "alley",
    src: "/images/random/15.jpg",
    alt: "A narrow alley strung with greenery between brick buildings",
    rotate: -6,
    tape: -3,
    desk: { left: "61%", top: "70%", width: "21%" },
    phone: null,
  },
  {
    id: "tower",
    src: "/images/random/1.jpg",
    alt: "Looking up at a dark glass office tower against a pale sky",
    rotate: 3,
    desk: { left: "79%", top: "74%", width: "21%" },
    phone: null,
  },
  {
    id: "note",
    note: true,
    rotate: 7,
    desk: { left: "79%", top: "0%", width: "18%" },
    phone: { left: "60%", top: "0%", width: "34%" },
  },
];

const RESTING_SHADOW = "0 1px 2px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.08)";
const LIFTED_SHADOW = "0 6px 12px rgba(0,0,0,0.08), 0 28px 56px rgba(0,0,0,0.2)";

function Tape({ rotate }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-[7px] left-1/2 h-[14px] w-[36%] -translate-x-1/2 rounded-[2px] border border-black/[0.06] bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-[1px]"
      style={{ rotate: `${rotate}deg` }}
    />
  );
}

function Print({ item }) {
  return (
    <div className="relative rounded-[3px] bg-white p-[4%] pb-[13%]">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[1px] bg-[#e9e9e9]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          draggable={false}
          className="pointer-events-none object-cover"
          sizes="(max-width: 768px) 45vw, 20vw"
        />
      </div>
      {item.tape != null && <Tape rotate={item.tape} />}
    </div>
  );
}

function Note() {
  return (
    <div
      className="@container relative flex aspect-square items-center rounded-[4px] p-[12%]"
      style={{ background: "oklch(0.92 0.18 82.45)" }}
    >
      <Tape rotate={-2} />
      <p className="text-[13cqw] font-medium leading-[1.2] text-[#2a2a2a]">
        Here&apos;s some piccies
      </p>
    </div>
  );
}

export default function PhotoDesk() {
  const deskRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [canDrag, setCanDrag] = useState(false);
  const [order, setOrder] = useState(() => ITEMS.map(item => item.id));

  // Decided after mount, so the server and first client render match.
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setCanDrag(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const toFront = id => setOrder(current => [...current.filter(other => other !== id), id]);

  return (
    <div ref={deskRef} className="relative aspect-[3/5] w-full md:aspect-[17/10]">
      {ITEMS.map((item, i) => {
        const place = { desk: item.desk, phone: item.phone ?? item.desk };
        return (
          <motion.div
            key={item.id}
            className={`absolute left-[var(--pl)] top-[var(--pt)] w-[var(--pw)] touch-pan-y select-none md:left-[var(--dl)] md:top-[var(--dt)] md:w-[var(--dw)] ${
              item.phone ? "" : "hidden md:block"
            } ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
            style={{
              "--dl": place.desk.left,
              "--dt": place.desk.top,
              "--dw": place.desk.width,
              "--pl": place.phone.left,
              "--pt": place.phone.top,
              "--pw": place.phone.width,
              zIndex: order.indexOf(item.id) + 1,
              boxShadow: RESTING_SHADOW,
              borderRadius: item.note ? 4 : 3,
            }}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: -36, scale: 1.12, rotate: item.rotate + (i % 2 ? 12 : -12) }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: item.rotate }}
            transition={{ type: "spring", stiffness: 210, damping: 22, delay: 0.2 + i * 0.05 }}
            drag={canDrag}
            dragConstraints={deskRef}
            dragElastic={0.12}
            dragTransition={{
              power: 0.18,
              timeConstant: 220,
              bounceStiffness: 320,
              bounceDamping: 26,
            }}
            whileHover={canDrag ? { scale: 1.02 } : undefined}
            whileDrag={{ scale: 1.06, rotate: item.rotate * 0.4, boxShadow: LIFTED_SHADOW }}
            onPointerDown={() => toFront(item.id)}
          >
            {item.note ? <Note /> : <Print item={item} />}
          </motion.div>
        );
      })}
    </div>
  );
}
