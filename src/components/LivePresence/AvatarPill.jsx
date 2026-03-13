"use client";
import { useState } from "react";
import { initials } from "./utils";

function AvatarWithTooltip({ user, index, total, onScrollTo }) {
  const [hovered, setHovered] = useState(false);
  const isMe = user.id === "me";

  return (
    <div
      style={{ position: "relative", zIndex: hovered ? 1000 : total - index, flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
  return (
    <div
      className="hidden md:flex"
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9001,
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
    </div>
  );
}
