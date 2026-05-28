"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function LovableNav({ title, currentIndex, total }) {
  return (
    <motion.div
      className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Back / close */}
      <Link
        href="/lovable"
        className="group flex items-center gap-2 text-[13px] text-[#a0a0a0] transition-colors hover:text-[#484848]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform group-hover:-translate-x-0.5"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Exit</span>
      </Link>

      {/* Title */}
      <span className="font-ppmondwest text-[13px] text-[#a0a0a0]">{title}</span>

      {/* Counter */}
      <span className="font-mono text-[12px] tabular-nums text-[#c0c0c0]">
        {String(currentIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
