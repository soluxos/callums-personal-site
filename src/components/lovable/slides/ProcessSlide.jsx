"use client";

import { motion } from "motion/react";

export default function ProcessSlide({ title, steps }) {
  return (
    <div className="flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(22px,3.5vw,36px)] text-white"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="relative flex w-full flex-col gap-0">
        {/* Vertical connecting line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-white/10 md:left-[23px]" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="relative flex items-start gap-5 py-4 md:gap-6"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {/* Step indicator */}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a] md:h-12 md:w-12">
              <span className="font-mono text-[12px] text-white/50">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Step content */}
            <div className="flex flex-col gap-1 pt-2">
              <h3 className="text-[15px] font-medium text-white/90">{step.title}</h3>
              {step.description && (
                <p className="text-[13px] leading-[1.5] text-white/40">{step.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
