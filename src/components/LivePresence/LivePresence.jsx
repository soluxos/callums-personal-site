"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const PALETTE = [
  "#FF4006",
  "#0090ff",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
];

const ADJECTIVES = [
  "Happy",
  "Swift",
  "Bright",
  "Calm",
  "Bold",
  "Keen",
  "Warm",
  "Cool",
  "Wise",
  "Crisp",
];
const NOUNS = ["Panda", "Eagle", "Tiger", "Koala", "Fox", "Owl", "Lynx", "Wolf", "Bear", "Raven"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName() {
  return `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)}`;
}

function initials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

function CursorIcon({ color }) {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 2L16 9L9.5 11.5L7 19L2 2Z"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FakeCursor({ user }) {
  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 9000 }}
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

export default function LivePresence() {
  const [meColor, setMeColor] = useState(null);
  const [fakeUsers, setFakeUsers] = useState([]);
  const [mounted, setMounted] = useState(false);
  const wanderTimersRef = useRef({}); // keyed by user.id
  const churnTimerRef = useRef(null);
  const nextIdRef = useRef(0);
  const fakeUsersRef = useRef([]);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Resolve own colour client-side only to avoid SSR/client mismatch
    let color;
    try {
      const stored = sessionStorage.getItem("lp-color");
      color = stored && PALETTE.includes(stored) ? stored : randomItem(PALETTE);
      sessionStorage.setItem("lp-color", color);
    } catch {
      color = randomItem(PALETTE);
    }
    setMeColor(color);
  }, []);

  // Keep fakeUsersRef in sync so churn closures always see current state
  useEffect(() => {
    fakeUsersRef.current = fakeUsers;
  });

  useEffect(() => {
    if (!meColor) return;

    // Clear all existing timers on each navigation
    Object.values(wanderTimersRef.current).forEach(t => clearTimeout(t));
    wanderTimersRef.current = {};
    clearTimeout(churnTimerRef.current);

    function startWander(user) {
      function wander() {
        setFakeUsers(prev =>
          prev.map(u =>
            u.id === user.id
              ? {
                  ...u,
                  x: 80 + Math.random() * (window.innerWidth - 160),
                  y: 100 + Math.random() * (document.body.scrollHeight - 200),
                }
              : u
          )
        );
        wanderTimersRef.current[user.id] = setTimeout(wander, 5000 + Math.random() * 8000);
      }
      wanderTimersRef.current[user.id] = setTimeout(wander, 2000 + Math.random() * 4000);
    }

    function stopWander(userId) {
      clearTimeout(wanderTimersRef.current[userId]);
      delete wanderTimersRef.current[userId];
    }

    const usedColors = new Set([meColor]);
    const available = PALETTE.filter(c => !usedColors.has(c));
    const count = 2 + Math.floor(Math.random() * 2); // 2–3 fake users, fresh each nav
    const pageWidth = window.innerWidth;
    const pageHeight = document.body.scrollHeight;

    const users = Array.from({ length: count }, () => {
      const id = nextIdRef.current++;
      return {
        id,
        name: randomName(),
        color: available[id % available.length],
        x: 80 + Math.random() * (pageWidth - 160),
        y: 100 + Math.random() * (pageHeight - 200),
      };
    });

    setFakeUsers(users);
    users.forEach(user => startWander(user));

    // Churn: a user leaves or joins every 15–35 seconds, keeping count at 1–3
    function scheduleChurn() {
      churnTimerRef.current = setTimeout(
        () => {
          const current = fakeUsersRef.current;
          const canLeave = current.length > 2;
          const canJoin = current.length < 3;

          let action = null;
          if (canLeave && canJoin) action = Math.random() < 0.45 ? "leave" : "join";
          else if (canLeave) action = "leave";
          else if (canJoin) action = "join";

          if (action === "leave") {
            const leaving = current[Math.floor(Math.random() * current.length)];
            stopWander(leaving.id);
            setFakeUsers(prev => prev.filter(u => u.id !== leaving.id));
          } else if (action === "join") {
            const usedInCurrent = new Set([meColor, ...current.map(u => u.color)]);
            const avail = PALETTE.filter(c => !usedInCurrent.has(c));
            const newColor = avail.length
              ? randomItem(avail)
              : randomItem(PALETTE.filter(c => c !== meColor));
            // New joiner enters near the top, then wanders down naturally
            const entryY = 80 + Math.random() * (window.innerHeight * 0.4);
            const newUser = {
              id: nextIdRef.current++,
              name: randomName(),
              color: newColor,
              x: 80 + Math.random() * (window.innerWidth - 160),
              y: entryY,
            };
            setFakeUsers(prev => [...prev, newUser]);
            startWander(newUser);
          }

          scheduleChurn();
        },
        15000 + Math.random() * 20000
      );
    }

    scheduleChurn();

    return () => {
      Object.values(wanderTimersRef.current).forEach(t => clearTimeout(t));
      wanderTimersRef.current = {};
      clearTimeout(churnTimerRef.current);
    };
  }, [meColor, pathname]);

  const allUsers = meColor ? [{ id: "me", name: "You", color: meColor }, ...fakeUsers] : [];

  return (
    <>
      {/* Avatar pill — top center */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9001,
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
        {/* Stacked avatars */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {allUsers.map((user, i) => (
            <AvatarWithTooltip
              key={user.id}
              user={user}
              index={i}
              total={allUsers.length}
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
        </div>

        {/* Online count */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#888",
            fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {allUsers.length} online
        </span>
      </div>

      {/* Fake user cursors — portalled to body so they sit in document flow, not fixed to viewport */}
      {mounted &&
        createPortal(
          fakeUsers.map(user => <FakeCursor key={user.id} user={user} />),
          document.body
        )}
    </>
  );
}
