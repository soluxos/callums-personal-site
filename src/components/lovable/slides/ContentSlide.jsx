"use client";

import { motion } from "motion/react";

export default function ContentSlide({ title, content, aside, accent = "#ffffff" }) {
  return (
    <div className="flex h-full w-full max-w-[1100px] flex-col items-start justify-center gap-10 md:flex-row md:items-center md:gap-16">
      {/* Text content */}
      <div className="flex flex-1 flex-col gap-5">
        {title && (
          <motion.h2
            className="font-ppmondwest text-[clamp(24px,4vw,44px)] leading-[1.2] text-[#1a1a1a]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
        )}

        {content && (
          <motion.div
            className="flex flex-col gap-4 text-[15px] leading-[1.7] text-[#6b6b6b] md:text-[16px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {typeof content === "string" ? <p>{content}</p> : content}
          </motion.div>
        )}
      </div>

      {/* Aside / visual element */}
      {aside && (
        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {aside}
        </motion.div>
      )}
    </div>
  );
}
