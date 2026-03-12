"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import supabase from "@/lib/supabase";

import { PALETTE, randomItem, randomName } from "./utils";
import AvatarPill from "./AvatarPill";
import FakeCursor from "./FakeCursor";
import RealCursor from "./RealCursor";
import OwnMessageBubble from "./OwnMessageBubble";
import MyMessageComposer from "./MyMessageComposer";

export default function LivePresence() {
  const [meColor, setMeColor] = useState(null);
  const [presenceMap, setPresenceMap] = useState({});
  const [cursorMap, setCursorMap] = useState({});
  const [messageMap, setMessageMap] = useState({});
  const [composing, setComposing] = useState(false);
  const [myMessage, setMyMessage] = useState(null);
  const myMessageTimerRef = useRef(null);
  const myMessagePosRef = useRef({ x: 0, y: 0 });
  const [fakeUsers, setFakeUsers] = useState([]);
  const [remoteFakes, setRemoteFakes] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [channelStatus, setChannelStatus] = useState("connecting");
  const [inactiveIds, setInactiveIds] = useState(new Set());

  const meIdRef = useRef(null);
  const meColorRef = useRef(null);
  const meNameRef = useRef(null);
  const channelRef = useRef(null);
  const lastBroadcastRef = useRef(0);
  const lastPresenceUpdateRef = useRef(0);
  const lastClientRef = useRef({ x: 0, y: 0 });
  const prevRealCountRef = useRef(0);
  const wanderTimersRef = useRef({});
  const churnTimerRef = useRef(null);
  const nextIdRef = useRef(0);
  const fakeUsersRef = useRef([]);
  const presenceMapRef = useRef({});
  const inactiveIdsRef = useRef(new Set());
  const inactivityTimersRef = useRef({});
  const selfInactivityTimerRef = useRef(null);
  const meInactiveRef = useRef(false);
  const pathname = usePathname();

  // Resolve identity once on mount (client-only)
  useEffect(() => {
    setMounted(true);
    const color = randomItem(PALETTE);
    const id = crypto.randomUUID();
    const name = randomName();
    meIdRef.current = id;
    meColorRef.current = color;
    meNameRef.current = name;
    setMeColor(color);
  }, []);

  // Keep refs in sync so timer closures always see current state
  useEffect(() => {
    fakeUsersRef.current = fakeUsers;
    presenceMapRef.current = presenceMap;
    inactiveIdsRef.current = inactiveIds;
  });

  // Supabase Realtime — presence for identity, broadcast for cursor positions
  useEffect(() => {
    if (!meColor) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    setPresenceMap({});
    setCursorMap({});
    setChannelStatus("connecting");

    const myId = meIdRef.current;
    const remoteInactivityTimers = {};
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
      const cursorSeed = {};
      const now = Date.now();
      for (const [key, arr] of Object.entries(state)) {
        if (key !== myId && arr.length > 0) {
          map[key] = { name: arr[0].name ?? "Anonymous", color: arr[0].color ?? "#888" };
          if (arr[0].x !== undefined && arr[0].y !== undefined) {
            cursorSeed[key] = {
              x: arr[0].x * document.documentElement.scrollWidth,
              y: arr[0].y * document.documentElement.scrollHeight,
            };
          }
          // inactive flag is the authoritative signal — set by the user's own client
          if (arr[0].inactive === true) {
            setInactiveIds(prev => new Set([...prev, key]));
            clearTimeout(inactivityTimersRef.current[key]);
            delete inactivityTimersRef.current[key];
          } else {
            setInactiveIds(prev => {
              const n = new Set(prev);
              n.delete(key);
              return n;
            });
            clearTimeout(inactivityTimersRef.current[key]);
            const lastActive = arr[0].lastActive;
            if (lastActive !== undefined) {
              const elapsed = now - lastActive;
              if (elapsed >= 20000) {
                setInactiveIds(prev => new Set([...prev, key]));
              } else {
                inactivityTimersRef.current[key] = setTimeout(() => {
                  setInactiveIds(prev => new Set([...prev, key]));
                }, 20000 - elapsed);
              }
            } else {
              inactivityTimersRef.current[key] = setTimeout(() => {
                setInactiveIds(prev => new Set([...prev, key]));
              }, 30000);
            }
          }
        }
      }
      setPresenceMap(map);
      setCursorMap(prev => ({ ...prev, ...cursorSeed }));
    }

    channel
      .on("presence", { event: "sync" }, buildPresenceMap)
      .on("presence", { event: "join" }, () => {
        buildPresenceMap();
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        buildPresenceMap();
        if (key) {
          clearTimeout(inactivityTimersRef.current[key]);
          delete inactivityTimersRef.current[key];
          setInactiveIds(prev => {
            const n = new Set(prev);
            n.delete(key);
            return n;
          });
        }
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const { id, x, y } = payload ?? {};
        if (id && id !== myId) {
          setCursorMap(prev => ({
            ...prev,
            [id]: {
              x: x * document.documentElement.scrollWidth,
              y: y * document.documentElement.scrollHeight,
            },
          }));
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
        setRemoteFakes(payload?.fakes ?? []);
      })
      .on("broadcast", { event: "req-positions" }, () => {
        const { x: cx, y: cy } = lastClientRef.current;
        const absX = cx + window.scrollX;
        const absY = cy + window.scrollY;
        channel.send({
          type: "broadcast",
          event: "cursor",
          payload: {
            id: myId,
            x: absX / document.documentElement.scrollWidth,
            y: absY / document.documentElement.scrollHeight,
          },
        });
      })
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const { id, text, composing } = payload ?? {};
        if (!id || id === myId) return;
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
          meInactiveRef.current = false;
          await channel.track({
            name: meNameRef.current,
            color: meColorRef.current,
            lastActive: Date.now(),
            inactive: false,
          });
          clearTimeout(selfInactivityTimerRef.current);
          selfInactivityTimerRef.current = setTimeout(() => {
            meInactiveRef.current = true;
            channelRef.current?.track({
              name: meNameRef.current,
              color: meColorRef.current,
              lastActive: Date.now(),
              inactive: true,
            });
          }, 20000);
          channel.send({ type: "broadcast", event: "req-positions", payload: {} });
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setChannelStatus("error");
        }
      });

    // Shared broadcast helper — throttled to ~60fps
    const broadcastPos = (clientX, clientY) => {
      const now = Date.now();
      if (now - lastBroadcastRef.current < 16) return;
      lastBroadcastRef.current = now;
      const absX = clientX + window.scrollX;
      const absY = clientY + window.scrollY;
      channelRef.current?.send({
        type: "broadcast",
        event: "cursor",
        payload: {
          id: myId,
          x: absX / document.documentElement.scrollWidth,
          y: absY / document.documentElement.scrollHeight,
        },
      });
      clearTimeout(selfInactivityTimerRef.current);
      if (meInactiveRef.current) {
        meInactiveRef.current = false;
        channelRef.current?.track({
          name: meNameRef.current,
          color: meColorRef.current,
          lastActive: now,
          inactive: false,
          x: absX / document.documentElement.scrollWidth,
          y: absY / document.documentElement.scrollHeight,
        });
        lastPresenceUpdateRef.current = now;
      }
      selfInactivityTimerRef.current = setTimeout(() => {
        meInactiveRef.current = true;
        channelRef.current?.track({
          name: meNameRef.current,
          color: meColorRef.current,
          lastActive: Date.now(),
          inactive: true,
        });
      }, 20000);
      if (now - lastPresenceUpdateRef.current > 10000) {
        lastPresenceUpdateRef.current = now;
        channelRef.current?.track({
          name: meNameRef.current,
          color: meColorRef.current,
          lastActive: now,
          inactive: false,
          x: absX / document.documentElement.scrollWidth,
          y: absY / document.documentElement.scrollHeight,
        });
      }
    };

    const onMouseMove = e => {
      lastClientRef.current = { x: e.clientX, y: e.clientY };
      broadcastPos(e.clientX, e.clientY);
    };

    const onScroll = () => {
      broadcastPos(lastClientRef.current.x, lastClientRef.current.y);
    };

    const onKeyDown = e => {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
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
      clearTimeout(selfInactivityTimerRef.current);
      Object.values(remoteInactivityTimers).forEach(t => clearTimeout(t));
      Object.values(inactivityTimersRef.current).forEach(t => clearTimeout(t));
      inactivityTimersRef.current = {};
      setInactiveIds(new Set());
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [meColor, pathname]);

  // Leader broadcasts fake-user state whenever it changes or room membership changes
  useEffect(() => {
    if (channelStatus !== "live" || !channelRef.current || !meIdRef.current) return;
    const allIds = [meIdRef.current, ...Object.keys(presenceMap)].sort();
    if (allIds[0] !== meIdRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "fake-state",
      payload: { fakes: fakeUsers.map(({ id, name, color, x, y }) => ({ id, name, color, x, y })) },
    });
  }, [fakeUsers, channelStatus, presenceMap]);

  // Fake user wander — always runs, but only leader's fakes are rendered
  useEffect(() => {
    if (!meColor) return;

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

    const users = Array.from({ length: count }, () => {
      const id = nextIdRef.current++;
      return {
        id,
        name: randomName(),
        color: available[id % available.length],
        x: 80 + Math.random() * (window.innerWidth - 160),
        y: 100 + Math.random() * (document.body.scrollHeight - 200),
      };
    });

    setFakeUsers(users);
    users.forEach(user => startWander(user));

    function scheduleChurn() {
      churnTimerRef.current = setTimeout(
        () => {
          const current = fakeUsersRef.current;
          const realCount = Object.keys(presenceMapRef.current).filter(
            id => !inactiveIdsRef.current.has(id)
          ).length;
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
            const newUser = {
              id: nextIdRef.current++,
              name: randomName(),
              color: newColor,
              x: 80 + Math.random() * (window.innerWidth - 160),
              y: 80 + Math.random() * (window.innerHeight * 0.4),
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

  // Manage fake user count relative to active real users
  useEffect(() => {
    if (!meColor) return;
    const curr = Object.keys(presenceMap).filter(id => !inactiveIds.has(id)).length;
    const prev = prevRealCountRef.current;
    prevRealCountRef.current = curr;

    // First real user joined — trim excess fakes down to 1
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

    // Crossed below multiplayer threshold (≥2 → <2) — re-enable fakes
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
  }, [presenceMap, inactiveIds, meColor]);

  const broadcastMsg = (text, isComposing) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: { id: meIdRef.current, text, composing: isComposing },
    });
  };

  const handleType = text => broadcastMsg(text, true);

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
  const effectiveFakes = isLeader ? fakeUsers : remoteFakes;
  const activeRealUsers = otherRealUsers.filter(user => !inactiveIds.has(user.id));
  const showFake = activeRealUsers.length <= 1;
  const allUsers = meColor
    ? [
        { id: "me", name: "You", color: meColor },
        ...activeRealUsers,
        ...(showFake ? effectiveFakes : []),
      ]
    : [];

  return (
    <>
      <AvatarPill allUsers={allUsers} channelStatus={channelStatus} />

      {mounted &&
        createPortal(
          <>
            {effectiveFakes.map(
              user => showFake && <FakeCursor key={`fake-${user.id}`} user={user} />
            )}
            <AnimatePresence>
              {activeRealUsers
                .filter(user => cursorMap[user.id] !== undefined)
                .map(user => (
                  <RealCursor key={`real-${user.id}`} user={user} />
                ))}
            </AnimatePresence>
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
