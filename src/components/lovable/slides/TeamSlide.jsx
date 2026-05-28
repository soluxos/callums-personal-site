"use client";

import { motion } from "motion/react";

export default function TeamSlide({ title, members }) {
  return (
    <div className="flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(20px,3vw,32px)] text-white/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="flex flex-wrap items-center justify-center gap-6">
        {members.map((member, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[20px]">
              {member.avatar || member.name?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[13px] font-medium text-white/80">{member.name}</span>
              {member.role && <span className="text-[11px] text-white/35">{member.role}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
