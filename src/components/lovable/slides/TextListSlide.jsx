"use client";

import { motion } from "motion/react";

export default function TextListSlide({ title, items }) {
  return (
    <div className="flex h-full w-full max-w-[700px] flex-col items-start justify-center gap-8">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(22px,3.5vw,36px)] text-[#1a1a1a]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h2>
      )}

      <ul className="flex w-full flex-col gap-0">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-baseline gap-4 border-b border-[#e8e8e8] py-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <span className="shrink-0 font-mono text-[11px] text-[#c0c0c0]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[15px] leading-[1.6] text-[#484848]">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
