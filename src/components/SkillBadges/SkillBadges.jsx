"use client";

import { useEffect, useRef } from "react";

const PAD_X = 14;
const PAD_Y = 7;
const WALL = 60;
const INNER_PAD = 20;

// Ball config. BALL_COUNT is the most there can be; the pit takes as many as fill about
// half of it, so a narrow one (a phone) isn't packed so tight that things get crushed.
const BALL_COUNT = 200;
const BALL_RADIUS = 18;
const BALL_RADIUS_SMALL = 13;
const FILL = 0.5;

// The physics runs in fixed steps, whatever the screen's frame rate, so it behaves the
// same everywhere and doesn't jitter when a frame is late.
const STEP = 1000 / 60;
// How many still steps before a body is put to rest (about three seconds). Long enough that
// things squashed together by a blast have pushed themselves apart first.
const REST = 180;

const DYNAMITE_W = 20;
const DYNAMITE_H = 80;

const BALL_COLOURS = [
  "oklch(0.65 0.20 24)",
  "oklch(0.75 0.17 53)",
  "oklch(0.89 0.18 94)",
  "oklch(0.75 0.15 144)",
  "oklch(0.65 0.18 257)",
  "oklch(0.68 0.22 305)",
  "oklch(0.68 0.21 359)",
  "oklch(0.74 0.17 214)",
  "oklch(0.72 0.17 60)",
  "oklch(0.65 0.12 172)",
];

const DESIGN_SKILLS = [
  "UI design",
  "UX design",
  "Design systems",
  "Figma",
  "Atomic design",
  "Prototyping",
  "Wireframing",
  "User flows",
  "User testing",
  "User research",
  "Competitor analysis",
  "AI product design",
  "Conversational UI",
  "Prompt UI design",
  "Human AI interaction",
];

const ENGINEERING_SKILLS = [
  "React",
  "JavaScript",
  "HTML",
  "CSS",
  "Sass/SCSS",
  "GraphQL",
  "Styled components",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Webpack",
  "Three.js",
  "PHP",
  "WordPress",
  "Drupal",
  "Git",
];

const ALL_SKILLS = [
  ...DESIGN_SKILLS.map(text => ({ text, type: "design" })),
  ...ENGINEERING_SKILLS.map(text => ({ text, type: "engineering" })),
];

const BADGE_STYLE = {
  design: {
    background: "oklch(0.22 0 0)",
    color: "oklch(0.97 0 0)",
    borderRadius: "999px",
    chamfer: 13,
  },
  engineering: {
    background: "oklch(0.60 0.20 252)",
    color: "oklch(1 0 0)",

    borderRadius: "6px",
    chamfer: 5,
  },
};

export default function SkillBadges() {
  const containerRef = useRef(null);
  const badgeRefsRef = useRef([]);
  const ballRefsRef = useRef([]);
  const dynamiteElRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let rafId = null;
    let ro = null;
    const cleanupFns = [];

    (async () => {
      await new Promise(r => requestAnimationFrame(r));
      // The badges are measured below, so their fonts have to be in first. Measured too
      // early, a badge's body is a different size from the badge you can see.
      if (document.fonts?.ready) await document.fonts.ready;
      if (cancelled) return;

      const Matter = await import("matter-js");
      if (cancelled) return;

      const { Engine, Bodies, Body, World, Mouse, MouseConstraint, Query, Sleeping } = Matter;

      const container = containerRef.current;
      if (!container) return;

      let W = container.offsetWidth;
      let H = container.offsetHeight;
      if (W === 0 || H === 0) return;

      // Read actual rendered dimensions from DOM
      const dims = badgeRefsRef.current.map(el =>
        el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 80, h: 30 }
      );

      const engine = Engine.create({
        // Once things come to rest they stay at rest, instead of trembling for ever.
        enableSleeping: true,
        gravity: { y: 1.4 },
        positionIterations: 10,
        velocityIterations: 6,
        constraintIterations: 4,
      });

      // Badge bodies
      const badgeBodies = ALL_SKILLS.map((skill, i) => {
        const { w, h } = dims[i];
        const st = BADGE_STYLE[skill.type];
        const chamferRadius = Math.min(st.chamfer, h / 2 - 1);
        const x = INNER_PAD + w / 2 + Math.random() * Math.max(1, W - w - INNER_PAD * 2);
        const y = -(i * (h + 10) + h);
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.1,
          friction: 0.6,
          frictionAir: 0.08,
          sleepThreshold: REST,
          chamfer: { radius: chamferRadius },
        });
        body._w = w;
        body._h = h;
        body._isBadge = true;
        return body;
      });

      // Ball bodies — fixed radius, staggered above the visible area
      const radius = W < 600 ? BALL_RADIUS_SMALL : BALL_RADIUS;
      const badgeArea = dims.reduce((sum, { w, h }) => sum + w * h, 0);
      const room = (W - INNER_PAD * 2) * (H - INNER_PAD * 2) * FILL - badgeArea;
      const ballCount = Math.max(0, Math.min(BALL_COUNT, Math.floor(room / (radius * 2) ** 2)));
      const ballData = Array.from({ length: ballCount }, (_, i) => ({
        r: radius,
        colour: BALL_COLOURS[i % BALL_COLOURS.length],
      }));

      const innerW = W - INNER_PAD * 2;
      const ballDiam = radius * 2 + 2;
      const ballCols = Math.max(1, Math.floor(innerW / ballDiam));

      const ballBodies = ballData.map(({ r }, i) => {
        const col = i % ballCols;
        const row = Math.floor(i / ballCols);
        const hexOffset = row % 2 === 0 ? 0 : r + 1;
        const x = INNER_PAD + r + col * ballDiam + hexOffset;
        const y = -(H + r + row * ballDiam);
        const body = Bodies.circle(x, y, r, {
          restitution: 0.2,
          friction: 0.3,
          frictionAir: 0.04,
          density: 0.002,
          sleepThreshold: REST,
        });
        body._r = r;
        body._isBall = true;
        return body;
      });

      // Interleave design badges, engineering badges, and balls so all three types
      // fall together rather than arriving in separate groups.
      // Pattern: designBadge → engBadge → ~18 balls → repeat
      const designBodies = badgeBodies.slice(0, DESIGN_SKILLS.length);
      const engBodies = badgeBodies.slice(DESIGN_SKILLS.length);
      const ballsPerSlot = Math.ceil(
        ballBodies.length / Math.max(designBodies.length, engBodies.length)
      );
      const spawnOrder = [];
      let bIdx = 0;
      const slots = Math.max(designBodies.length, engBodies.length);
      for (let s = 0; s < slots; s++) {
        if (s < designBodies.length) spawnOrder.push(designBodies[s]);
        if (s < engBodies.length) spawnOrder.push(engBodies[s]);
        const take = s === slots - 1 ? ballBodies.length - bIdx : ballsPerSlot;
        for (let b = 0; b < take && bIdx < ballBodies.length; b++) {
          spawnOrder.push(ballBodies[bIdx++]);
        }
      }
      // Re-assign y positions in interleaved order, keeping each body's x intact
      const SPAWN_STEP = 4;
      const SPAWN_BASE = 30;
      spawnOrder.forEach((body, i) => {
        Body.setPosition(body, { x: body.position.x, y: -(SPAWN_BASE + i * SPAWN_STEP) });
      });

      // Static boundaries
      const floor = Bodies.rectangle(W / 2, H - INNER_PAD + WALL / 2, 100000, WALL, {
        isStatic: true,
        friction: 0.9,
        restitution: 0.15,
      });
      const wallL = Bodies.rectangle(INNER_PAD - WALL / 2, H / 2, WALL, 99999, { isStatic: true });
      const wallR = Bodies.rectangle(W - INNER_PAD + WALL / 2, H / 2, WALL, 99999, {
        isStatic: true,
      });

      World.add(engine.world, [...badgeBodies, ...ballBodies, floor, wallL, wallR]);

      const allBodies = [...badgeBodies, ...ballBodies];

      const mouse = Mouse.create(container);
      // Remove Matter.js wheel listeners — they call preventDefault and block page scroll.
      // Cover all event names used across different browser/Matter versions.
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      // Matter's touch handlers call preventDefault too, which traps a phone's scroll
      // inside the pit. Without them a swipe scrolls the page; the mouse can still drag
      // badges, and a tap on the dynamite still sets it off (that's a click).
      mouse.element.removeEventListener("touchmove", mouse.mousemove);
      mouse.element.removeEventListener("touchstart", mouse.mousedown);
      mouse.element.removeEventListener("touchend", mouse.mouseup);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          damping: 0.3,
          angularStiffness: 0.1,
          render: { visible: false },
        },
      });
      World.add(engine.world, mc);

      // --- Dynamite ---
      let dynamiteBody = null;
      let dynamiteState = "hidden"; // "hidden" | "live" | "exploding"
      let blastBody = null; // expanding shockwave body
      const BLAST_SCALE_PER_FRAME = 2.2; // multiply radius each frame
      const BLAST_MAX_RADIUS = 260;
      const BLAST_FRAMES = Math.ceil(
        Math.log(BLAST_MAX_RADIUS / 2) / Math.log(BLAST_SCALE_PER_FRAME)
      );

      function triggerExplosion(bx, by) {
        dynamiteState = "exploding";
        World.remove(engine.world, dynamiteBody);
        dynamiteBody = null;
        if (dynamiteElRef.current) dynamiteElRef.current.style.visibility = "hidden";

        // Expanding ring
        const ring = document.createElement("div");
        ring.style.cssText = `position:absolute;left:${bx}px;top:${by}px;width:24px;height:24px;border-radius:50%;background:oklch(0.82 0.18 70);pointer-events:none;z-index:10;`;
        container.appendChild(ring);
        ring.animate(
          [
            { transform: "translate(-50%,-50%) scale(0)", opacity: 1 },
            { transform: "translate(-50%,-50%) scale(10)", opacity: 0 },
          ],
          { duration: 500, easing: "ease-out", fill: "forwards" }
        ).onfinish = () => ring.remove();

        // Particles
        for (let p = 0; p < 14; p++) {
          const angle = (p / 14) * Math.PI * 2 + Math.random() * 0.3;
          const dist = 40 + Math.random() * 90;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          const sz = 6 + Math.random() * 7;
          const hue = 40 + Math.random() * 45;
          const pel = document.createElement("div");
          pel.style.cssText = `position:absolute;left:${bx}px;top:${by}px;width:${sz}px;height:${sz}px;border-radius:50%;background:oklch(${(0.62 + Math.random() * 0.22).toFixed(2)} 0.21 ${hue.toFixed(0)});pointer-events:none;z-index:9;`;
          container.appendChild(pel);
          pel.animate(
            [
              { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(0.1)`,
                opacity: 0,
              },
            ],
            { duration: 400 + Math.random() * 300, easing: "ease-out", fill: "forwards" }
          ).onfinish = () => pel.remove();
        }

        // Expanding shockwave body — grows outward each frame, physically pushing bodies
        blastBody = Bodies.circle(bx, by, 2, {
          isStatic: true,
          isSensor: false,
          restitution: 2.0,
          friction: 0,
          frictionStatic: 0,
          frictionAir: 0,
          label: "blast",
        });
        blastBody._framesLeft = BLAST_FRAMES;
        World.add(engine.world, blastBody);

        // Immediately kick all bodies outward — radial velocity proportional to 1/distance
        const KICK_STRENGTH = 55;
        const KICK_RADIUS = 500;
        [...badgeBodies, ...ballBodies].forEach(b => {
          const dx = b.position.x - bx;
          const dy = b.position.y - by;
          const d = Math.max(Math.sqrt(dx * dx + dy * dy), 8);
          if (d > KICK_RADIUS) return;
          const strength = KICK_STRENGTH * (1 - d / KICK_RADIUS) * (1 / (d * 0.04 + 1));
          const nx = dx / d;
          const ny = dy / d;
          Sleeping.set(b, false);
          Body.setVelocity(b, {
            x: b.velocity.x + nx * strength,
            y: b.velocity.y + ny * strength - 4, // extra upward bias
          });
          Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.8);
        });

        setTimeout(() => {
          if (cancelled) return;
          dynamiteState = "hidden";
          spawnDynamite();
        }, 3500);
      }

      function spawnDynamite() {
        const x =
          INNER_PAD + DYNAMITE_W / 2 + Math.random() * Math.max(1, W - DYNAMITE_W - INNER_PAD * 2);
        const body = Bodies.rectangle(x, -80, DYNAMITE_W, DYNAMITE_H, {
          restitution: 0.12,
          friction: 0.6,
          frictionAir: 0.07,
          chamfer: { radius: 5 },
          label: "dynamite",
        });
        body._w = DYNAMITE_W;
        body._h = DYNAMITE_H;
        World.add(engine.world, body);
        dynamiteBody = body;
        dynamiteState = "live";
        if (dynamiteElRef.current) dynamiteElRef.current.style.visibility = "visible";
      }

      spawnDynamite();

      const handleClick = e => {
        if (dynamiteState !== "live" || !dynamiteBody) return;
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (Math.hypot(mx - dynamiteBody.position.x, my - dynamiteBody.position.y) < 32)
          triggerExplosion(dynamiteBody.position.x, dynamiteBody.position.y);
      };
      container.addEventListener("click", handleClick);
      cleanupFns.push(() => container.removeEventListener("click", handleClick));

      // Size + style ball DOM elements
      ballBodies.forEach((body, i) => {
        const el = ballRefsRef.current[i];
        if (!el) return;
        const r = body._r;
        const d = r * 2;
        el.style.width = `${d}px`;
        el.style.height = `${d}px`;
        el.style.borderRadius = "50%";
        el.style.background = ballData[i].colour;
        el.style.boxShadow = "none";
      });

      // Put every element where its body is. Positions aren't rounded: whole pixels make
      // slow movement step and shimmer.
      const draw = () => {
        badgeBodies.forEach((body, i) => {
          const el = badgeRefsRef.current[i];
          if (!el) return;
          const { x, y } = body.position;
          el.style.transform = `translate(${x}px,${y}px) rotate(${body.angle}rad) translate(${-body._w / 2}px,${-body._h / 2}px)`;
        });

        ballBodies.forEach((body, i) => {
          const el = ballRefsRef.current[i];
          if (!el) return;
          const r = body._r;
          el.style.transform = `translate(${body.position.x - r}px,${body.position.y - r}px)`;
        });

        if (dynamiteBody && dynamiteState === "live" && dynamiteElRef.current) {
          const { x, y } = dynamiteBody.position;
          dynamiteElRef.current.style.transform = `translate(${x}px,${y}px) rotate(${dynamiteBody.angle}rad) translate(${-DYNAMITE_W / 2}px,${-DYNAMITE_H / 2}px)`;
        }
      };

      const step = () => {
        Engine.update(engine, STEP);

        // Grow blast shockwave body
        if (blastBody) {
          if (blastBody._framesLeft > 0) {
            Body.scale(blastBody, BLAST_SCALE_PER_FRAME, BLAST_SCALE_PER_FRAME);
            blastBody._framesLeft--;
          } else {
            World.remove(engine.world, blastBody);
            blastBody = null;
          }
        }

        // Anything thrown or blown out of the pit drops back in from the top.
        for (const body of dynamiteBody ? [...allBodies, dynamiteBody] : allBodies) {
          const { x, y } = body.position;
          if (y < H + 200 && x > -200 && x < W + 200 && y > -3000) continue;
          Sleeping.set(body, false);
          Body.setPosition(body, {
            x: INNER_PAD + 40 + Math.random() * Math.max(1, W - INNER_PAD * 2 - 80),
            y: -60,
          });
          Body.setVelocity(body, { x: 0, y: 0 });
        }
      };

      let last = performance.now();
      let owed = 0;
      let running = false;

      const loop = now => {
        if (cancelled || !running) {
          rafId = null;
          return;
        }
        owed += Math.min(now - last, 100);
        last = now;
        let steps = 0;
        while (owed >= STEP && steps < 3) {
          step();
          owed -= STEP;
          steps++;
        }
        if (steps === 3) owed = 0;
        draw();

        const isDynHovered =
          dynamiteBody &&
          dynamiteState === "live" &&
          Math.hypot(
            mouse.position.x - dynamiteBody.position.x,
            mouse.position.y - dynamiteBody.position.y
          ) < 28;
        const under = Query.point(allBodies, mouse.position);
        container.style.cursor = mc.body
          ? "grabbing"
          : isDynHovered
            ? "pointer"
            : under.length
              ? "grab"
              : "default";

        rafId = requestAnimationFrame(loop);
      };

      // Nothing falls until the pit is on screen, so the drop is seen, and the physics
      // stops again whenever it's scrolled away.
      let started = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (cancelled) return;
          running = entry.isIntersecting;
          if (!running) return;
          if (!started) {
            started = true;
            // For reduced motion the pit is already full and at rest: the fall happens
            // before anything is shown.
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              for (let i = 0; i < 900; i++) step();
            }
            draw();
            badgeRefsRef.current.forEach(el => {
              if (el) el.style.visibility = "visible";
            });
          }
          last = performance.now();
          if (rafId === null) rafId = requestAnimationFrame(loop);
        },
        { threshold: 0.2 }
      );
      io.observe(container);
      cleanupFns.push(() => io.disconnect());

      // Reposition static walls when container resizes
      let resizeRaf = null;
      ro = new ResizeObserver(entries => {
        if (cancelled) return;
        const entry = entries[0];
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW === 0 || newH === 0) return;
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          Body.setPosition(floor, { x: newW / 2, y: newH - INNER_PAD + WALL / 2 });
          Body.setPosition(wallL, { x: INNER_PAD - WALL / 2, y: newH / 2 });
          Body.setPosition(wallR, { x: newW - INNER_PAD + WALL / 2, y: newH / 2 });
          // Keep everything inside the new walls, and let it settle again.
          const narrower = newW < W;
          W = newW;
          H = newH;
          allBodies.forEach(body => {
            Sleeping.set(body, false);
            if (!narrower) return;
            const half = (body._w ?? body._r * 2) / 2;
            const max = newW - INNER_PAD - half;
            if (body.position.x > max) {
              Body.setPosition(body, { x: Math.max(INNER_PAD + half, max), y: body.position.y });
            }
          });
        });
      });
      ro.observe(container);
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      cleanupFns.forEach(fn => fn());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="flex flex-col gap-6">
      <style>{`
        @keyframes dynamite-spark {
          from { transform: translateX(-50%) scale(1); opacity: 1; box-shadow: 0 0 4px 2px oklch(0.85 0.22 75); }
          to   { transform: translateX(-50%) scale(1.8); opacity: 0.4; box-shadow: 0 0 8px 4px oklch(0.75 0.22 60); }
        }
      `}</style>
      <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Skills</h2>

      <div
        ref={containerRef}
        className="relative h-[540px] overflow-hidden rounded-[16px]"
        style={{
          maxWidth: 1400,
          userSelect: "none",
          touchAction: "pan-y",
          backgroundColor: "var(--color-card)",
        }}
      >
        {/* Balls rendered behind badges */}
        {Array.from({ length: BALL_COUNT }, (_, i) => (
          <div
            key={`ball-${i}`}
            ref={el => {
              ballRefsRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              // Size will be overridden once physics runs; start hidden
              width: 0,
              height: 0,
              pointerEvents: "none",
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          />
        ))}

        {/* Dynamite */}
        <div
          ref={dynamiteElRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: DYNAMITE_W,
            height: DYNAMITE_H,
            overflow: "visible",
            transformOrigin: "0 0",
            willChange: "transform",
            pointerEvents: "none",
            visibility: "hidden",
          }}
        >
          {/* Fuse */}
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-1px)",
              width: 3,
              height: 10,
              background: "linear-gradient(to top, #777, oklch(0.78 0.20 75))",
              borderRadius: "2px 2px 0 0",
            }}
          />
          {/* Spark */}
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 9px)",
              left: "50%",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "oklch(0.90 0.22 80)",
              animation: "dynamite-spark 0.35s ease-in-out infinite alternate",
            }}
          />
          {/* Body */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "oklch(0.48 0.22 25)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: 8,
                fontWeight: 900,
                color: "white",
                letterSpacing: 1.5,
                fontFamily: "monospace",
                opacity: 0.9,
              }}
            >
              TNT
            </span>
          </div>
        </div>

        {/* Badges on top */}
        {ALL_SKILLS.map((skill, i) => {
          const st = BADGE_STYLE[skill.type];
          return (
            <div
              key={skill.text}
              ref={el => {
                badgeRefsRef.current[i] = el;
              }}
              className={skill.type === "design" ? "font-ppmondwest" : "font-satoshi"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                visibility: "hidden",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: "nowrap",
                padding: `${PAD_Y}px ${PAD_X}px`,
                background: st.background,
                color: st.color,
                borderRadius: st.borderRadius,
                pointerEvents: "none",
                transformOrigin: "0 0",
                willChange: "transform",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
              }}
            >
              {skill.text}
            </div>
          );
        })}
      </div>
    </section>
  );
}
