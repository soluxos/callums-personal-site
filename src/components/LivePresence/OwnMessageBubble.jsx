"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

// Own-message bubble that follows the local cursor after sending
export default function OwnMessageBubble({ initX, initY, text, color }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onMove = e => {
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${e.clientX + window.scrollX + 14}px, ${e.clientY + window.scrollY + 22}px)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${initX + 14}px, ${initY + 22}px)`,
        pointerEvents: "none",
        zIndex: 9050,
      }}
    >
      <MessageBubble text={text} color={color} />
    </div>
  );
}
