"use client";
import { motion, useInView } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

function FadeInUpInner({ children, className, delay, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.7, delay: inView ? 0.25 + delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function FadeInUp({ children, className, delay = 0, style }) {
  const pathname = usePathname();
  return (
    <FadeInUpInner key={pathname} className={className} delay={delay} style={style}>
      {children}
    </FadeInUpInner>
  );
}
