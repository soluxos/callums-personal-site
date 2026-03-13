"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initials } from "./utils";
import { useEditMode } from "@/contexts/EditModeContext";

function AvatarWithTooltip({ user, index, total, onScrollTo, onHoverChange }) {
  const [hovered, setHovered] = useState(false);
  const isMe = user.id === "me";

  const handleEnter = () => {
    setHovered(true);
    onHoverChange?.(true);
  };
  const handleLeave = () => {
    setHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div
      style={{ position: "relative", zIndex: hovered ? 1000 : total - index, flexShrink: 0 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Avatar circle */}
      <div
        onClick={!isMe ? onScrollTo : undefined}
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: user.color,
          border: "2px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "white",
          marginLeft: index > 0 ? -6 : 0,
          fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
          cursor: !isMe ? "pointer" : "default",
        }}
      >
        {initials(user.name)}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          onClick={!isMe ? onScrollTo : undefined}
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: user.color,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.01em",
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            cursor: !isMe ? "pointer" : "default",
            pointerEvents: !isMe ? "auto" : "none",
            fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
            zIndex: 9999,
          }}
        >
          {/* Triangle pointing up toward the avatar */}
          <div
            style={{
              position: "absolute",
              top: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: `5px solid ${user.color}`,
            }}
          />
          {user.name}
        </div>
      )}
    </div>
  );
}

export default function AvatarPill({ allUsers, channelStatus }) {
  const [pillHovered, setPillHovered] = useState(false);
  const [anyAvatarHovered, setAnyAvatarHovered] = useState(false);
  const { editMode, setEditMode } = useEditMode();

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9001,
      }}
      className="hidden md:block"
      onMouseEnter={() => setPillHovered(true)}
      onMouseLeave={() => setPillHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 999,
          padding: "5px 10px 5px 8px",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {allUsers.slice(0, 4).map((user, i) => (
            <AvatarWithTooltip
              key={user.id}
              user={user}
              index={i}
              total={Math.min(allUsers.length, 4)}
              onScrollTo={
                user.id !== "me"
                  ? () =>
                      window.scrollTo({
                        top: user.y - window.innerHeight / 2,
                        behavior: "smooth",
                      })
                  : undefined
              }
              onHoverChange={setAnyAvatarHovered}
            />
          ))}
          {allUsers.length > 4 && (
            <div
              title={`${allUsers.length - 4} more`}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#e5e7eb",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: "#6b7280",
                marginLeft: -6,
                fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
                flexShrink: 0,
              }}
            >
              +{allUsers.length - 4}
            </div>
          )}
        </div>

        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#888",
            fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {/* Connection status dot */}
          <span
            title={
              channelStatus === "live"
                ? "Connected"
                : channelStatus === "error"
                  ? "Connection error"
                  : "Connecting…"
            }
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background:
                channelStatus === "live"
                  ? "#22c55e"
                  : channelStatus === "error"
                    ? "#ef4444"
                    : "#f59e0b",
            }}
          />
          {allUsers.length} online
        </span>

        {/* Edit mode toggle */}
        <div
          style={{
            width: 1,
            height: 14,
            background: "rgba(0,0,0,0.12)",
            borderRadius: 1,
            marginLeft: 2,
            marginRight: 2,
            flexShrink: 0,
          }}
        />
        <button
          data-no-drag
          onClick={() => setEditMode(m => !m)}
          title={editMode ? "Exit edit mode" : "Enter edit mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: editMode ? "#1a6cf1" : "transparent",
            border: editMode ? "none" : "1px solid rgba(0,0,0,0.12)",
            borderRadius: 999,
            padding: "2px 8px 2px 6px",
            cursor: "pointer",
            color: editMode ? "#fff" : "#888",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
            flexShrink: 0,
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {/* Pencil icon */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 1.5a1.414 1.414 0 0 1 2 2L4 10H2V8L8.5 1.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          {editMode ? "Editing" : "Edit"}
        </button>
      </div>

      {/* Chat hint tooltip */}
      <AnimatePresence>
        {pillHovered && !anyAvatarHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -4, x: "-50%" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: "50%",
              background: "#888",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.01em",
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {/* Triangle pointing up */}
            <div
              style={{
                position: "absolute",
                top: -5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "5px solid #888",
              }}
            />
            Use / to chat
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
