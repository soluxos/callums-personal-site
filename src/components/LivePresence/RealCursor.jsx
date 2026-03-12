"use client";
import { motion, AnimatePresence } from "motion/react";
import CursorIcon from "./CursorIcon";
import MessageBubble from "./MessageBubble";

// Real-user cursor: fast tween so it tracks closely without adding latency on top of network lag
export default function RealCursor({ user }) {
  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 9000 }}
      initial={{ x: user.x, y: user.y, opacity: 0 }}
      animate={{ x: user.x, y: user.y, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
      transition={{ type: "tween", duration: 0.08, ease: "linear" }}
    >
      <AnimatePresence>
        {user.message && (
          <MessageBubble key="bubble" text={user.message.text} color={user.color} typing={false} />
        )}
      </AnimatePresence>
      <CursorIcon color={user.color} />
      {!user.message && (
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
      )}
    </motion.div>
  );
}
