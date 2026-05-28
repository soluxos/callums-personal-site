"use client";

import { motion } from "motion/react";

export default function ComparisonSlide({ title, before, after }) {
  return (
    <div className="flex h-full w-full max-w-[1100px] flex-col items-center justify-center gap-8">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(20px,3vw,32px)] text-white/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {/* Before */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-[11px] font-medium uppercase tracking-widest text-white/30">
            Before
          </span>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            {typeof before === "string" ? (
              <img src={before} alt="Before" className="h-auto w-full object-cover" />
            ) : (
              before
            )}
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-[11px] font-medium uppercase tracking-widest text-white/30">
            After
          </span>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            {typeof after === "string" ? (
              <img src={after} alt="After" className="h-auto w-full object-cover" />
            ) : (
              after
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
