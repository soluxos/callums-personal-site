"use client";
import { motion } from "motion/react";

// PAGE_TRANSITION_DURATION must match PageTransition's exit+enter durations (currently 0.25s each)
const PAGE_TRANSITION_DURATION = 0.25;

export default function FadeInUp({ children, className, delay = 0, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.7,
        delay: PAGE_TRANSITION_DURATION + delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
