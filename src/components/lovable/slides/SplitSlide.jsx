"use client";

import { motion } from "motion/react";

export default function SplitSlide({ left, right }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid h-full w-full max-w-[1200px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Left panel */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {left}
        </motion.div>

        {/* Right panel */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {right}
        </motion.div>
      </div>
    </div>
  );
}
