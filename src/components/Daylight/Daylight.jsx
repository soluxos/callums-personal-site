"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { grainTile } from "./grain";
import { Life } from "./life";
import styles from "./Daylight.module.css";
import posters from "./posters.module.css";

// The lit wall from callum-personal-site-2026 (its v4: window, blinds and the oak outside, the day
// passing as you scroll), drawn behind every page in place of the cutting mat. Its light and
// shade stay on the wall: the veil and the grain sit under the page with the wall, never over it,
// so nothing is drawn across a word, a card or a screen.
//
// The day runs down each page from first light at the top. With reduced motion nothing moves on
// its own and the sun follows the scroll directly. Until the room has started, and without WebGL,
// a still picture of the first frame is on the wall instead (posters.module.css), so the light is
// there from the first paint.
const FIRST = 1; // 06:12, first light
const LAST = 4; // 17:35, the sun low and warm, still light: where an untinted wall stops
const NIGHT = 6; // 23:10, moonlight and the lamp

// The room (three.js and its shaders) starts loading as soon as this file runs, alongside the
// page's own scripts, instead of waiting for the page to hydrate first. It still isn't part of
// the page's bundle, so it doesn't hold anything up.
const loadRoom = typeof window === "undefined" ? null : import("./room");

// `tint` lays a colour over the wall and its shade (multiplied, so the light and the blinds
// still show through it) and deepens the shade to suit. SiteShell passes the site's blue. The
// text on it is white, so the day carries on through dusk to night at the bottom of the page.
export default function Daylight({ tint }) {
  // Read by the running loop, so it follows the page without restarting the room.
  const lastRef = useRef(LAST);
  lastRef.current = tint ? NIGHT : LAST;
  const wallRef = useRef(null);
  const veilRef = useRef(null);
  const grainRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const grain = grainRef.current;
    // Drawn at the screen's own pixel size so the grain stays crisp.
    grain.style.backgroundImage = `url(${grainTile()})`;
    grain.style.backgroundSize = `${256 / window.devicePixelRatio}px`;
  }, []);

  // A new page is a new length; measure it again once it's in.
  useEffect(() => {
    window.dispatchEvent(new Event("daylight:measure"));
  }, [pathname]);

  useEffect(() => {
    let room;
    let frame;
    let cleanup = () => {};
    let cancelled = false;

    loadRoom.then(({ DaylightRoom, dayAt }) => {
      if (cancelled) return;
      try {
        room = new DaylightRoom(wallRef.current, veilRef.current);
      } catch {
        return;
      }
      const life = new Life();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

      // How far down the page is, 0 to 1.
      let scrollable = 1;
      const measure = () => {
        scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      };
      const target = () => Math.min(1, Math.max(0, window.scrollY / scrollable));
      const layout = new ResizeObserver(measure);
      layout.observe(document.body);
      window.addEventListener("resize", measure);
      window.addEventListener("daylight:measure", measure);
      measure();

      let moved = 0;
      const onPointer = event => (moved += Math.hypot(event.movementX, event.movementY));
      window.addEventListener("pointermove", onPointer, { passive: true });

      let progress = target();
      let lastY = window.scrollY;
      let last = performance.now();
      const tick = now => {
        frame = requestAnimationFrame(tick);
        // Never step backwards, and never leap after the tab has been away.
        const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
        last = now;
        const still = reduced.matches;

        // Scrolling quickly or sweeping the pointer about stirs up a breeze in the oak.
        const y = window.scrollY;
        const push = dt > 0 ? Math.min(1, Math.abs(y - lastY) / dt / 4000 + moved / dt / 6000) : 0;
        lastY = y;
        moved = 0;

        progress = still ? target() : progress + (target() - progress) * (1 - Math.exp(-dt * 5));
        const position = FIRST + (lastRef.current - FIRST) * progress;
        life.update(dt, { progress: position, push, still, windowWidth: room.windowWidth });
        room.render(dayAt(position), life);
      };
      frame = requestAnimationFrame(tick);

      cleanup = () => {
        layout.disconnect();
        window.removeEventListener("resize", measure);
        window.removeEventListener("daylight:measure", measure);
        window.removeEventListener("pointermove", onPointer);
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup();
      room?.dispose();
    };
  }, []);

  // Fixed behind everything: the wall, the veil that lays its shade on it, and a film of grain.
  return (
    <>
      <div ref={wallRef} className={`${styles.layer} ${styles.wall} ${posters.wall}`} aria-hidden="true" />
      <div
        ref={veilRef}
        className={`${styles.layer} ${styles.veil} ${posters.veil} ${tint ? styles.veilTinted : ""}`}
        aria-hidden="true"
      />
      {tint && (
        <div
          className={`${styles.layer} ${styles.tint}`}
          style={{ background: tint }}
          aria-hidden="true"
        />
      )}
      <div ref={grainRef} className={`${styles.layer} ${styles.grain}`} aria-hidden="true" />
    </>
  );
}
