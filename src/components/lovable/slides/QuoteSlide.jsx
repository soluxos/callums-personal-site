"use client";

import { motion } from "motion/react";

export default function QuoteSlide({ quote, author, role }) {
  return (
    <div className="flex h-full w-full max-w-[800px] flex-col items-center justify-center gap-8 text-center">
      <motion.blockquote
        className="font-ppmondwest text-[clamp(20px,4vw,36px)] leading-[1.4] text-[#1a1a1a]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        &ldquo;{quote}&rdquo;
      </motion.blockquote>

      {(author || role) && (
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {author && <span className="text-[14px] font-medium text-[#6b6b6b]">{author}</span>}
          {role && <span className="text-[12px] text-[#a0a0a0]">{role}</span>}
        </motion.div>
      )}
    </div>
  );
}
