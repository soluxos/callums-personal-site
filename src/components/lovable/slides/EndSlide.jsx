"use client";

import { motion } from "motion/react";

export default function EndSlide({ title, links, message }) {
  return (
    <div className="flex h-full w-full max-w-[600px] flex-col items-center justify-center gap-8 text-center">
      <motion.h2
        className="font-ppmondwest text-[clamp(28px,5vw,48px)] leading-[1.2] text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title || "Thank you"}
      </motion.h2>

      {message && (
        <motion.p
          className="text-[15px] leading-[1.6] text-white/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {message}
        </motion.p>
      )}

      {links && links.length > 0 && (
        <motion.div
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="rounded-full border border-white/15 px-5 py-2 text-[13px] text-white/60 transition-colors hover:border-white/30 hover:text-white/90"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
