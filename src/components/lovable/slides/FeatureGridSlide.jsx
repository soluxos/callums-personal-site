"use client";

import { motion } from "motion/react";

export default function FeatureGridSlide({ title, features }) {
  return (
    <div className="flex h-full w-full max-w-[1000px] flex-col items-center justify-center gap-10">
      {title && (
        <motion.h2
          className="font-ppmondwest text-[clamp(22px,3.5vw,36px)] text-[#1a1a1a]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-[#f8f8f8] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            {feature.icon && <span className="text-[24px]">{feature.icon}</span>}
            <h3 className="text-[15px] font-medium text-[#1a1a1a]">{feature.title}</h3>
            <p className="text-[13px] leading-[1.5] text-[#929292]">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
