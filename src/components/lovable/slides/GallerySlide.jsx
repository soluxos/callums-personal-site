"use client";

import { motion } from "motion/react";

export default function GallerySlide({ images, caption }) {
  const count = images.length;

  return (
    <div className="flex h-full w-full max-w-[1200px] flex-col items-center justify-center gap-6">
      <div
        className={`grid w-full gap-3 ${
          count <= 2
            ? "grid-cols-1 md:grid-cols-2"
            : count === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <img src={img.src} alt={img.alt || ""} className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>

      {caption && (
        <motion.p
          className="text-center text-[13px] text-[#a0a0a0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  );
}
