"use client";

import { motion } from "motion/react";

export default function ImageSlide({ src, alt, caption, variant = "default" }) {
  const variants = {
    default: "max-h-[70vh] w-auto rounded-xl",
    full: "h-full w-full object-cover rounded-xl",
    contained: "max-h-[65vh] max-w-full object-contain rounded-xl",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <motion.div
        className="flex items-center justify-center overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img src={src} alt={alt || ""} className={variants[variant]} />
      </motion.div>

      {caption && (
        <motion.p
          className="max-w-[500px] text-center text-[13px] leading-[1.5] text-[#a0a0a0]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  );
}
