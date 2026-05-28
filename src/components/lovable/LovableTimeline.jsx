"use client";

import { motion } from "motion/react";

export default function LovableTimeline({ total, selectedIndex, scrollTo }) {
  return (
    <div className="relative z-10 px-6 pb-8 pt-4 md:px-12">
      {/* Timeline segments */}
      <div className="relative flex w-full items-end">
        {/* Bottom baseline */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.08]" />

        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === selectedIndex;
          const isPast = index < selectedIndex;

          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="group relative flex flex-1 cursor-pointer items-end justify-center pb-0 pt-3"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className="w-[1px] origin-bottom"
                animate={{
                  height: isActive ? 24 : 12,
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.9)"
                    : isPast
                      ? "rgba(255, 255, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.12)",
                }}
                whileHover={{
                  height: 18,
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
