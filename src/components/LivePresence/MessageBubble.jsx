"use client";
import { motion } from "motion/react";
import { textStyle } from "./utils";

export default function MessageBubble({ text, color, typing = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.72, y: -6 }}
      transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.6 }}
      style={{
        position: "absolute",
        top: 22,
        left: 14,
        transformOrigin: "0% 0%",
        background: color,
        ...textStyle,
        padding: "6px 10px",
        borderRadius: 8,
        borderTopLeftRadius: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
        pointerEvents: "none",
        zIndex: 9010,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {text}
      {typing && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          style={{ marginLeft: -1, lineHeight: 1, letterSpacing: 0 }}
        >
          │
        </motion.span>
      )}
    </motion.div>
  );
}
