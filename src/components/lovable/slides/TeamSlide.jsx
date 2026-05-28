"use client";

import { motion } from "motion/react";

export default function TeamSlide({ title, members }) {
  return (
    <div className="flex h-full w-full max-w-[900px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(20px,3vw,32px)] text-[#6b6b6b]"
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e8e8e8] bg-[#f5f5f5] text-[20px]">
              {member.avatar || member.name?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[13px] font-medium text-[#484848]">{member.name}</span>
              {member.role && <span className="text-[11px] text-[#a0a0a0]">{member.role}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
