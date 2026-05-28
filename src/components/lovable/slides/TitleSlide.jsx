"use client";

import { motion } from "motion/react";

export default function TitleSlide({ title, subtitle, meta }) {
  return (
    <div className="flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-8 text-center">
      <motion.h1
        className="font-ppmondwest text-[clamp(36px,8vw,80px)] leading-[1.1] text-[#1a1a1a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          className="max-w-[600px] text-[16px] leading-[1.6] text-[#6b6b6b] md:text-[18px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          {subtitle}
        </motion.p>
      )}

      {meta && (
        <motion.div
          className="mt-4 flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {meta.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-medium uppercase tracking-widest text-[#b0b0b0]">
                {item.label}
              </span>
              <span className="text-[13px] text-[#484848]">{item.value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
