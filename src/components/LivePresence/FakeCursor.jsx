"use client";
import { motion } from "motion/react";
import CursorIcon from "./CursorIcon";

export default function FakeCursor({ user }) {
  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 9000 }}
      initial={{ x: user.x, y: user.y }}
      animate={{ x: user.x, y: user.y }}
      transition={{ type: "spring", stiffness: 55, damping: 18, mass: 0.7 }}
    >
      <CursorIcon color={user.color} />
      <div
        style={{
          marginTop: 4,
          marginLeft: 16,
          background: user.color,
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.01em",
          padding: "2px 8px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
        }}
      >
        {user.name}
      </div>
    </motion.div>
  );
}
