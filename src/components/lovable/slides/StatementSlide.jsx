"use client";

import { motion } from "motion/react";

export default function StatementSlide({ statement, accent = "white" }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <motion.p
        className="max-w-[800px] text-center font-ppmondwest text-[clamp(28px,5vw,56px)] leading-[1.3] text-[#1a1a1a]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {statement}
      </motion.p>
    </div>
  );
}
