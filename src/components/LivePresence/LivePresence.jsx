"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import supabase from "@/lib/supabase";

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
  "Ingenious",
  "Scrupulous",
];
const NOUNS = [
  "Panda",
  "Eagle",
  "Tiger",
  "Koala",
  "Fox",
  "Owl",
  "Lynx",
  "Wolf",
  "Bear",
  "Raven",
  "Weasel",
  "Rat",
];

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

const textStyle = {
  color: "#fff",
  fontSize: 14,
  fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
  fontWeight: 500,
  lineHeight: 1.25,
};

function FakeCursor({ user }) {
  return (
    <motion.div
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 9000 }}
      initial={{ x: user.x, y: user.y, opacity: 0 }}
      animate={{ x: user.x, y: user.y, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
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

// Real-user cursor: fast tween so it tracks closely without adding latency on top of network lag
function RealCursor({ user }) {
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

// Message bubble shown below-right of a cursor for both local and remote messages
function MessageBubble({ text, color, typing = false }) {
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

// Own-message bubble that follows the local cursor after sending
function OwnMessageBubble({ initX, initY, text, color }) {
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

// Composer: renders identically to MessageBubble(typing=true) with a hidden input for keystroke capture
function MyMessageComposer({ initX, initY, color, onType, onCommit, onCancel }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const cursorRef = useRef(null);
  const inactivityRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // If the user opens the composer but doesn't type within 2s, dismiss
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
    // Dismiss 1.5s after the user stops typing
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
  // presenceMap: id → { name, color }  (who's in the room)
  const [presenceMap, setPresenceMap] = useState({});
  // cursorMap: id → { x, y }  (updated via broadcast at ~20fps)
  const [cursorMap, setCursorMap] = useState({});
  // messageMap: id → { text, expiresAt }  (remote messages)
  const [messageMap, setMessageMap] = useState({});
  // composing: whether the local user has the / input open
  const [composing, setComposing] = useState(false);
  // myMessage: the sent message currently shown on my own cursor
  const [myMessage, setMyMessage] = useState(null);
  const myMessageTimerRef = useRef(null);
  const myMessagePosRef = useRef({ x: 0, y: 0 });
  const [fakeUsers, setFakeUsers] = useState([]);
  const [remoteFakes, setRemoteFakes] = useState([]); // fakes received from the leader
  const [enabled, setEnabled] = useState(true); // user-controlled live presence toggle
  const [mounted, setMounted] = useState(false);
  const [channelStatus, setChannelStatus] = useState("connecting"); // connecting | live | error
  const [inactiveIds, setInactiveIds] = useState(new Set());

  const meIdRef = useRef(null);
  const meColorRef = useRef(null);
  const meNameRef = useRef(null);
  const channelRef = useRef(null);
  const lastBroadcastRef = useRef(0);
  const lastClientRef = useRef({ x: 0, y: 0 }); // last known viewport mouse position
  const prevRealCountRef = useRef(0);
  const wanderTimersRef = useRef({});
  const churnTimerRef = useRef(null);
  const nextIdRef = useRef(0);
  const fakeUsersRef = useRef([]);
  const presenceMapRef = useRef({}); // synced after each render for use in timer closures
  const inactivityTimersRef = useRef({}); // per-real-user 20s hide timers
  const pathname = usePathname();

  // Resolve identity once on mount (client-only)
  useEffect(() => {
    setMounted(true);
    // Restore enabled preference before connecting
    try {
      if (localStorage.getItem("lp-enabled") === "false") setEnabled(false);
    } catch {}
    let color, id, name;
    try {
      // Always generate fresh identity — never persist across windows/sessions
      // (persisting causes collision when tabs are duplicated)
      color = randomItem(PALETTE);
      id = crypto.randomUUID();
      name = randomName();
    } catch {
      color = randomItem(PALETTE);
      id = crypto.randomUUID();
      name = randomName();
    }
    meIdRef.current = id;
    meColorRef.current = color;
    meNameRef.current = name;
    setMeColor(color);
  }, []);

  // Keep refs in sync so timer closures always see current state
  useEffect(() => {
    fakeUsersRef.current = fakeUsers;
    presenceMapRef.current = presenceMap;
  });

  // Supabase Realtime — presence for identity, broadcast for cursor positions
  useEffect(() => {
    if (!meColor) return;
    if (!enabled) {
      // Disconnect: clear all remote state (channel cleanup runs from previous effect teardown)
      setPresenceMap({});
      setCursorMap({});
      setMessageMap({});
      setComposing(false);
      setMyMessage(null);
      clearTimeout(myMessageTimerRef.current);
      return;
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    setPresenceMap({});
    setCursorMap({});
    setChannelStatus("connecting");

    const myId = meIdRef.current;
    // Per-user inactivity timers for remote composing state
    const remoteInactivityTimers = {};
    // Safe channel name from pathname
    const slug = pathname.replace(/^\//, "").replace(/\//g, "-") || "home";
    const channel = supabase.channel(`lp-${slug}`, {
      config: {
        presence: { key: myId },
        broadcast: { self: false, ack: false },
      },
    });
    channelRef.current = channel;

    function buildPresenceMap() {
      const state = channel.presenceState();
      const map = {};
      for (const [key, arr] of Object.entries(state)) {
        if (key !== myId && arr.length > 0) {
          map[key] = { name: arr[0].name ?? "Anonymous", color: arr[0].color ?? "#888" };
        }
      }
      setPresenceMap(map);
    }

    channel
      .on("presence", { event: "sync" }, buildPresenceMap)
      .on("presence", { event: "join" }, buildPresenceMap)
      .on("presence", { event: "leave" }, buildPresenceMap)
      // Receive other users' cursor positions via low-latency broadcast
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const { id, x, y } = payload ?? {};
        if (id && id !== myId) {
          setCursorMap(prev => ({ ...prev, [id]: { x, y } }));
          // Reset 20s inactivity hide timer
          clearTimeout(inactivityTimersRef.current[id]);
          setInactiveIds(prev => {
            const n = new Set(prev);
            n.delete(id);
            return n;
          });
          inactivityTimersRef.current[id] = setTimeout(() => {
            setInactiveIds(prev => new Set([...prev, id]));
          }, 20000);
        }
      })
      .on("broadcast", { event: "fake-state" }, ({ payload }) => {
        // Non-leader clients receive the leader's fake-user positions and render them
        setRemoteFakes(payload?.fakes ?? []);
      })
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const { id, text, composing } = payload ?? {};
        if (!id || id === myId) return;
        // Any message activity counts as presence — reset the cursor inactivity timer
        if (inactivityTimersRef.current[id] !== undefined) {
          clearTimeout(inactivityTimersRef.current[id]);
          setInactiveIds(prev => {
            const n = new Set(prev);
            n.delete(id);
            return n;
          });
          inactivityTimersRef.current[id] = setTimeout(() => {
            setInactiveIds(prev => new Set([...prev, id]));
          }, 20000);
        }
        // Empty + not composing = clear immediately (cancel/escape)
        if (!text && !composing) {
          clearTimeout(remoteInactivityTimers[id]);
          delete remoteInactivityTimers[id];
          setMessageMap(prev => {
            const n = { ...prev };
            delete n[id];
            return n;
          });
          return;
        }
        if (composing) {
          // Live typing — reset a 3 s inactivity watchdog
          setMessageMap(prev => ({ ...prev, [id]: { text, composing: true } }));
          clearTimeout(remoteInactivityTimers[id]);
          remoteInactivityTimers[id] = setTimeout(() => {
            delete remoteInactivityTimers[id];
            setMessageMap(prev => {
              const n = { ...prev };
              delete n[id];
              return n;
            });
          }, 3000);
        } else {
          // Committed — show for 4 s then remove
          clearTimeout(remoteInactivityTimers[id]);
          delete remoteInactivityTimers[id];
          const expiresAt = Date.now() + 4000;
          setMessageMap(prev => ({ ...prev, [id]: { text, composing: false, expiresAt } }));
          setTimeout(() => {
            setMessageMap(prev => {
              const next = { ...prev };
              if (next[id]?.expiresAt === expiresAt) delete next[id];
              return next;
            });
          }, 4000);
        }
      })
      .subscribe(async status => {
        if (status === "SUBSCRIBED") {
          setChannelStatus("live");
          // Track identity once — name + colour only, no position
          await channel.track({ name: meNameRef.current, color: meColorRef.current });
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setChannelStatus("error");
        }
      });

    // Shared broadcast helper — throttled to ~60fps
    const broadcastPos = (clientX, clientY) => {
      const now = Date.now();
      if (now - lastBroadcastRef.current < 16) return;
      lastBroadcastRef.current = now;
      channelRef.current?.send({
        type: "broadcast",
        event: "cursor",
        payload: { id: myId, x: clientX + window.scrollX, y: clientY + window.scrollY },
      });
    };

    const onMouseMove = e => {
      lastClientRef.current = { x: e.clientX, y: e.clientY };
      broadcastPos(e.clientX, e.clientY);
    };

    // Re-broadcast on scroll so other users see cursor move as you scroll
    const onScroll = () => {
      broadcastPos(lastClientRef.current.x, lastClientRef.current.y);
    };

    // Open composer on '/' — but not when focus is inside an input/textarea
    const onKeyDown = e => {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        // Clear any existing own-message so the composer starts fresh
        clearTimeout(myMessageTimerRef.current);
        setMyMessage(null);
        setComposing(true);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      Object.values(remoteInactivityTimers).forEach(t => clearTimeout(t));
      Object.values(inactivityTimersRef.current).forEach(t => clearTimeout(t));
      inactivityTimersRef.current = {};
      setInactiveIds(new Set());
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [meColor, pathname, enabled]);

  // Leader broadcasts the current fake-user state whenever it changes or the room membership changes.
  // This ensures every client sees the same bots immediately when someone joins.
  useEffect(() => {
    if (channelStatus !== "live" || !channelRef.current || !meIdRef.current) return;
    const allIds = [meIdRef.current, ...Object.keys(presenceMap)].sort();
    if (allIds[0] !== meIdRef.current) return; // not leader
    channelRef.current.send({
      type: "broadcast",
      event: "fake-state",
      payload: { fakes: fakeUsers.map(({ id, name, color, x, y }) => ({ id, name, color, x, y })) },
    });
  }, [fakeUsers, channelStatus, presenceMap]);

  // Fake user wander — always runs, but only leader's fakes are rendered
  useEffect(() => {
    if (!meColor) return;
    if (!enabled) {
      Object.values(wanderTimersRef.current).forEach(t => clearTimeout(t));
      wanderTimersRef.current = {};
      clearTimeout(churnTimerRef.current);
      setFakeUsers([]);
      return;
    }

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
    const count = 1 + Math.floor(Math.random() * 2);
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

    function scheduleChurn() {
      churnTimerRef.current = setTimeout(
        () => {
          const current = fakeUsersRef.current;
          const realCount = Object.keys(presenceMapRef.current).length;
          const maxFakes = realCount > 0 ? 1 : 3;
          const canLeave = current.length > 1;
          const canJoin = current.length < maxFakes;

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
  }, [meColor, pathname, enabled]);

  // When the last real user leaves, spawn a fresh fake to naturally replace them.
  // When the first real user joins, gradually remove fake users one by one.
  useEffect(() => {
    if (!meColor) return;
    const curr = Object.keys(presenceMap).length;
    const prev = prevRealCountRef.current;
    prevRealCountRef.current = curr;

    // First real user joined — trim any excess fakes down to 1 bot companion
    if (prev === 0 && curr === 1) {
      const excess = fakeUsersRef.current.slice(1);
      if (excess.length > 0) {
        excess.forEach(user => {
          clearTimeout(wanderTimersRef.current[user.id]);
          delete wanderTimersRef.current[user.id];
        });
        setFakeUsers(prev => prev.slice(0, 1));
      }
    }

    // Crossed below multiplayer threshold (≥2 → <2) — re-enable fakes alongside real user
    if (prev >= 2 && curr < 2) {
      const t = setTimeout(
        () => {
          const usedColors = new Set([meColor, ...fakeUsersRef.current.map(u => u.color)]);
          const avail = PALETTE.filter(c => !usedColors.has(c));
          const newColor = avail.length
            ? randomItem(avail)
            : randomItem(PALETTE.filter(c => c !== meColor));
          const newId = nextIdRef.current++;
          const newUser = {
            id: newId,
            name: randomName(),
            color: newColor,
            x: 80 + Math.random() * (window.innerWidth - 160),
            y: 80 + Math.random() * (window.innerHeight * 0.4),
          };
          setFakeUsers(prev => [...prev, newUser]);
          function wander() {
            setFakeUsers(p =>
              p.map(u =>
                u.id === newId
                  ? {
                      ...u,
                      x: 80 + Math.random() * (window.innerWidth - 160),
                      y: 100 + Math.random() * (document.body.scrollHeight - 200),
                    }
                  : u
              )
            );
            wanderTimersRef.current[newId] = setTimeout(wander, 5000 + Math.random() * 8000);
          }
          wanderTimersRef.current[newId] = setTimeout(wander, 2000 + Math.random() * 4000);
        },
        1000 + Math.random() * 1500
      );
      return () => clearTimeout(t);
    }

    // Crossed above multiplayer threshold (≤1 → ≥2) — stagger-remove all fakes
    if (prev < 2 && curr >= 2) {
      const timers = [];
      fakeUsersRef.current.forEach((user, i) => {
        const t = setTimeout(
          () => {
            clearTimeout(wanderTimersRef.current[user.id]);
            delete wanderTimersRef.current[user.id];
            setFakeUsers(p => p.filter(u => u.id !== user.id));
          },
          600 + i * (800 + Math.random() * 700)
        );
        timers.push(t);
      });
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [presenceMap, meColor]);

  const toggleEnabled = () => {
    setEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem("lp-enabled", String(next));
      } catch {}
      return next;
    });
    // Always cancel any active composer when toggling
    setComposing(false);
    clearTimeout(myMessageTimerRef.current);
    setMyMessage(null);
  };

  const broadcastMsg = (text, composing) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: { id: meIdRef.current, text, composing },
    });
  };

  // Called on every keystroke — live broadcast to others
  const handleType = text => broadcastMsg(text, true);

  // Enter pressed — commit and show own bubble for 4 s
  const commitMessage = text => {
    setComposing(false);
    myMessagePosRef.current = {
      x: lastClientRef.current.x + window.scrollX,
      y: lastClientRef.current.y + window.scrollY,
    };
    setMyMessage(text);
    clearTimeout(myMessageTimerRef.current);
    myMessageTimerRef.current = setTimeout(() => setMyMessage(null), 4000);
    broadcastMsg(text, false);
  };

  // Escape pressed — dismiss without leaving a bubble
  const cancelMessage = () => {
    setComposing(false);
    broadcastMsg("", false);
  };

  // Merge presence identity + broadcast cursor positions into renderable users
  const otherRealUsers = Object.entries(presenceMap).map(([id, user]) => ({
    id,
    name: user.name,
    color: user.color,
    x: cursorMap[id]?.x ?? 200,
    y: cursorMap[id]?.y ?? 200,
    message: messageMap[id] ?? null,
  }));

  // Leader election: client with the lexicographically smallest UUID controls fake users
  const allIds = meIdRef.current ? [meIdRef.current, ...Object.keys(presenceMap)].sort() : [];
  const isLeader = allIds.length === 0 || allIds[0] === meIdRef.current;
  // Non-leaders render fakes received from the leader broadcast; leaders use their own state
  const effectiveFakes = isLeader ? fakeUsers : remoteFakes;
  // Show fakes when alone or with only one other real user
  const showFake = otherRealUsers.length <= 1;
  const cursorsToRender = showFake ? effectiveFakes : otherRealUsers;
  const allUsers =
    enabled && meColor
      ? [
          { id: "me", name: "You", color: meColor },
          ...otherRealUsers,
          ...(showFake ? effectiveFakes : []),
        ]
      : [];

  return (
    <>
      {/* Avatar pill */}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          {enabled &&
            allUsers.slice(0, 4).map((user, i) => (
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
          {enabled && allUsers.length > 4 && (
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

        {/* Power button — enable/disable live presence */}
        <button
          onClick={toggleEnabled}
          title={enabled ? "Turn off live presence" : "Turn on live presence"}
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "2px solid white",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: enabled ? "#1f2937" : "#e5e7eb",
            color: enabled ? "#fff" : "#9ca3af",
            transition: "background 0.2s, color 0.2s",
            boxShadow: enabled ? "0 0 0 0px transparent" : "none",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>

      {/* Cursors — portalled to body, absolute-positioned in document */}
      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {effectiveFakes.map(
                user => showFake && <FakeCursor key={`fake-${user.id}`} user={user} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {otherRealUsers
                .filter(user => !inactiveIds.has(user.id))
                .map(user => (
                  <RealCursor key={`real-${user.id}`} user={user} />
                ))}
            </AnimatePresence>
            {/* Own sent message bubble — follows cursor after sending */}
            <AnimatePresence>
              {myMessage && meColor && (
                <OwnMessageBubble
                  key="own-bubble"
                  initX={myMessagePosRef.current.x}
                  initY={myMessagePosRef.current.y}
                  text={myMessage}
                  color={meColor}
                />
              )}
            </AnimatePresence>
          </>,
          document.body
        )}

      {/* Composer input — has its own portal, rendered outside the cursor portal */}
      {composing && mounted && (
        <MyMessageComposer
          initX={lastClientRef.current.x + window.scrollX}
          initY={lastClientRef.current.y + window.scrollY}
          color={meColor}
          onType={handleType}
          onCommit={commitMessage}
          onCancel={cancelMessage}
        />
      )}
    </>
  );
}
