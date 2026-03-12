"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import CursorIcon from "./CursorIcon";
import { textStyle } from "./utils";

// Composer: renders identically to MessageBubble(typing=true) with a hidden input for keystroke capture
export default function MyMessageComposer({ initX, initY, color, onType, onCommit, onCancel }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const cursorRef = useRef(null);
  const inactivityRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // If the user opens the composer but doesn't type within 4s, dismiss
    inactivityRef.current = setTimeout(onCancel, 4000);
    // Hide system cursor so only our custom icon shows
    document.body.style.cursor = "none";
    // Dismiss immediately if the mouse leaves the window
    const onMouseLeave = e => {
      if (e.relatedTarget === null) onCancel();
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      clearTimeout(inactivityRef.current);
      document.body.style.cursor = "";
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onCancel]);

  // Update both the bubble and cursor icon positions imperatively
  useEffect(() => {
    const onMove = e => {
      const x = e.clientX + window.scrollX;
      const y = e.clientY + window.scrollY;
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${x + 14}px, ${y + 22}px)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleChange = e => {
    const val = e.target.value;
    setText(val);
    onType(val);
    clearTimeout(inactivityRef.current);
    // Dismiss 2.5s after the user stops typing
    inactivityRef.current = setTimeout(onCancel, 2500);
  };

  const handleKey = e => {
    if (e.key === "Enter") {
      if (text.trim()) onCommit(text.trim());
      else onCancel();
    } else if (e.key === "Escape") {
      onCancel();
    }
    e.stopPropagation();
  };

  return createPortal(
    <>
      {/* Cursor icon — visible to the local user while composing */}
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${initX}px, ${initY}px)`,
          pointerEvents: "none",
          zIndex: 9102,
        }}
      >
        <CursorIcon color="#000" />
      </div>

      {/* Bubble + hidden input */}
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${initX + 14}px, ${initY + 22}px)`,
          zIndex: 9100,
          pointerEvents: "auto",
          cursor: "none",
        }}
      >
        {/* Visual — identical to MessageBubble with typing=true */}
        <div
          style={{
            background: color,
            ...textStyle,
            padding: "6px 10px",
            borderRadius: 8,
            borderTopLeftRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          {text}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            style={{ marginLeft: -1, lineHeight: 1, letterSpacing: 0 }}
          >
            │
          </motion.span>
        </div>
        {/* Hidden input to capture keystrokes */}
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKey}
          maxLength={50}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            border: "none",
            cursor: "none",
            background: "transparent",
          }}
        />
      </div>
    </>,
    document.body
  );
}
