"use client";

import { motion } from "motion/react";

export default function FullBleedSlide({ src, alt, overlay, title, subtitle }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <motion.img
        src={src}
        alt={alt || ""}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            overlay ||
            "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%)",
        }}
      />

      {/* Content */}
      {(title || subtitle) && (
        <div className="relative z-10 flex max-w-[700px] flex-col items-center gap-4 text-center px-6">
          {title && (
            <motion.h2
              className="font-ppmondwest text-[clamp(28px,6vw,56px)] leading-[1.1] text-[#1a1a1a]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-[15px] leading-[1.6] text-[#484848] md:text-[17px]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
