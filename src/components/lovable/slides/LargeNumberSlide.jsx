"use client";

import { motion } from "motion/react";

export default function LargeNumberSlide({ number, label, description }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
      <motion.span
        className="font-ppmondwest text-[clamp(80px,20vw,200px)] leading-none text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {number}
      </motion.span>

      {label && (
        <motion.span
          className="text-[16px] font-medium text-white/60 md:text-[18px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {label}
        </motion.span>
      )}

      {description && (
        <motion.p
          className="mt-2 max-w-[400px] text-[13px] leading-[1.5] text-white/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
