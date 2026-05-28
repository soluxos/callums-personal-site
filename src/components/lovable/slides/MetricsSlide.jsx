"use client";

import { motion } from "motion/react";

export default function MetricsSlide({ title, metrics }) {
  return (
    <div className="flex h-full w-full max-w-[1000px] flex-col items-center justify-center gap-12">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(20px,3vw,32px)] text-white/70"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-8"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className="font-ppmondwest text-[clamp(28px,5vw,48px)] leading-none text-white">
              {metric.value}
            </span>
            <span className="text-center text-[12px] leading-[1.4] text-white/40">
              {metric.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
