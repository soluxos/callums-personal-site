"use client";

import { motion } from "motion/react";

export default function TimelineSlide({ title, events }) {
  return (
    <div className="flex h-full w-full max-w-[800px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(20px,3vw,32px)] text-white"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="relative flex w-full flex-col gap-0">
        {/* Horizontal timeline line */}
        <div className="absolute left-0 right-0 top-[20px] h-[1px] bg-white/10" />

        <div className="flex w-full justify-between">
          {events.map((event, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-3 px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Dot on line */}
              <div className="relative z-10 h-[10px] w-[10px] rounded-full border border-white/30 bg-[#0a0a0a]">
                <div className="absolute inset-[2px] rounded-full bg-white/50" />
              </div>

              {/* Content below */}
              <div className="flex flex-col items-center gap-1 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  {event.date}
                </span>
                <span className="max-w-[120px] text-center text-[12px] leading-[1.4] text-white/60">
                  {event.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
