"use client";

import { motion } from "motion/react";

export default function ProcessSlide({ title, steps }) {
  return (
    <div className="flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(22px,3.5vw,36px)] text-[#1a1a1a]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="relative flex w-full flex-col gap-0">
        {/* Vertical connecting line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-[#e8e8e8] md:left-[23px]" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="relative flex items-start gap-5 py-4 md:gap-6"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {/* Step indicator */}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8e8e8] bg-white md:h-12 md:w-12">
              <span className="font-mono text-[12px] text-[#a0a0a0]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Step content */}
            <div className="flex flex-col gap-1 pt-2">
              <h3 className="text-[15px] font-medium text-[#1a1a1a]">{step.title}</h3>
              {step.description && (
                <p className="text-[13px] leading-[1.5] text-[#929292]">{step.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
