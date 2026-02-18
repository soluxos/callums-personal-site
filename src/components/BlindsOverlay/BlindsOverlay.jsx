"use client";

import { useEffect, useRef, useCallback } from "react";

// ════════════════════════════════════════════════════════
// Configuration
// ════════════════════════════════════════════════════════
const SLAT_PITCH = 48; // px center-to-center
const MAX_SLAT_H = 40; // px when fully closed
const MIN_SLAT_H = 5; // px when fully open
const ANGLE_DEG = 12;
const BLUR = 14;

// Vertical cord strings
const CORD_COUNT = 5;
const CORD_WIDTH = 1.5;
const CORD_OPACITY = 0.07;

// Leaf shadows
const LEAF_COUNT = 22;

// Scroll cycle
const CYCLE_VH = 3.5;

// Opacity range
const OP_CLOSED = 0.22;
const OP_OPEN = 0.08;

// ════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function closedness(scrollVh) {
  if (scrollVh < 0.05) return 1;
  const phase = ((scrollVh - 0.05) / CYCLE_VH) * Math.PI * 2;
  return easeInOut((Math.cos(phase) + 1) / 2);
}

// Calculate how many slats we need to fully cover the rotated viewport
function getSlatCount(w, h) {
  // The diagonal of the viewport after rotation
  const rad = (ANGLE_DEG * Math.PI) / 180;
  const diagonal = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  // Add generous overflow (50% extra on each side)
  const totalNeeded = diagonal * 2;
  return Math.ceil(totalNeeded / SLAT_PITCH);
}

// ════════════════════════════════════════════════════════
// Leaf generation — bigger, more visible
// ════════════════════════════════════════════════════════
function generateLeaves(w, h) {
  const rand = seeded(7);
  const leaves = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    const cx = w * 0.15 + rand() * w * 0.9;
    const cy = -h * 0.2 + rand() * h * 1.4;
    const size = 60 + rand() * 160; // bigger leaves
    const rotation = rand() * Math.PI * 2;
    const opacity = 0.06 + rand() * 0.1; // more visible: 0.06–0.16
    const phase = rand() * Math.PI * 2;
    const speed = 0.2 + rand() * 0.5;
    const type = Math.floor(rand() * 3);
    leaves.push({ cx, cy, size, rotation, opacity, phase, speed, type });
  }
  return leaves;
}

// Draw a botanical leaf silhouette
function drawLeaf(ctx, leaf, time) {
  const { cx, cy, size, rotation, opacity, phase, speed, type } = leaf;

  const swayX = Math.sin(time * 0.00015 * speed + phase) * 15;
  const swayY = Math.sin(time * 0.0001 * speed + phase * 1.3) * 10;
  const swayRot = Math.sin(time * 0.00012 * speed + phase * 0.7) * 0.08;

  ctx.save();
  ctx.translate(cx + swayX, cy + swayY);
  ctx.rotate(rotation + swayRot);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "rgba(0, 0, 0, 1)";

  ctx.beginPath();

  if (type === 0) {
    // Broad oval leaf
    ctx.ellipse(0, 0, size * 0.35, size * 0.75, 0, 0, Math.PI * 2);
  } else if (type === 1) {
    // Pointed leaf
    const lw = size * 0.4;
    const lh = size * 0.85;
    ctx.moveTo(0, -lh);
    ctx.bezierCurveTo(lw * 1.3, -lh * 0.4, lw * 1.5, lh * 0.35, 0, lh);
    ctx.bezierCurveTo(-lw * 1.5, lh * 0.35, -lw * 1.3, -lh * 0.4, 0, -lh);
  } else {
    // Compound leaf — leaflets on alternating sides of a stem
    const leaflets = 4 + Math.floor((phase / Math.PI) * 2);
    for (let j = 0; j < leaflets; j++) {
      const ly = -size * 0.5 + (j / (leaflets - 1)) * size;
      const lSize = size * (0.25 + 0.15 * Math.sin(j * 1.2));
      const side = j % 2 === 0 ? 1 : -1;
      const lx = side * lSize * 0.3;

      ctx.moveTo(lx, ly);
      ctx.bezierCurveTo(
        lx + side * lSize,
        ly - lSize * 0.4,
        lx + side * lSize,
        ly + lSize * 0.4,
        lx,
        ly + lSize * 0.15
      );
    }
    // Stem
    ctx.rect(-1.5, -size * 0.55, 3, size * 1.1);
  }

  ctx.fill();
  ctx.restore();
}

// ════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════
export default function BlindsOverlay() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollRef = useRef(0);
  const smoothRef = useRef(0);
  const leavesRef = useRef([]);
  const slatCountRef = useRef(60);

  const draw = useCallback((ctx, w, h, time) => {
    smoothRef.current += (scrollRef.current - smoothRef.current) * 0.07;
    const scrollVh = smoothRef.current / h;
    const SLAT_COUNT = slatCountRef.current;

    ctx.clearRect(0, 0, w, h);

    // ── Rotated drawing context ──
    const cx = w / 2;
    const cy = h / 2;
    const rad = (ANGLE_DEG * Math.PI) / 180;

    // ── 1. Leaves (drawn in rotated space, behind blinds) ──
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.translate(-cx, -cy);
    for (let i = 0; i < leavesRef.current.length; i++) {
      drawLeaf(ctx, leavesRef.current[i], time);
    }
    ctx.restore();

    // ── 2. Blind slats ──
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.translate(-cx, -cy);

    // Field is centered and oversized to cover entire rotated viewport
    const fieldH = SLAT_COUNT * SLAT_PITCH;
    const startY = cy - fieldH / 2;
    const slatW = w * 2.2;
    const offX = -(slatW - w) / 2;

    // Idle drift
    const driftY = Math.sin(time * 0.00012) * 6 + Math.sin(time * 0.00007) * 4;

    for (let i = 0; i < SLAT_COUNT; i++) {
      const slatPhase = i * 0.18;
      const perSlatClosed = closedness(scrollVh - i * 0.006);
      const thisSlatH = MIN_SLAT_H + (MAX_SLAT_H - MIN_SLAT_H) * perSlatClosed;
      const thisOpacity = OP_OPEN + (OP_CLOSED - OP_OPEN) * perSlatClosed;

      // Center of this slat — stays fixed, slat grows/shrinks around it
      const slatCenterY = startY + i * SLAT_PITCH + SLAT_PITCH / 2 + driftY;

      // Per-slat micro-animation
      const microY = Math.sin(time * 0.00025 + slatPhase) * 2;
      const microX = Math.sin(time * 0.00015 + slatPhase * 1.4) * 3;

      const y = slatCenterY - thisSlatH / 2 + microY;

      // Cull (generous bounds for blur)
      if (y + thisSlatH < -80 || y > h + 80) continue;

      const breathe = 0.9 + Math.sin(time * 0.0003 + slatPhase * 2) * 0.1;
      ctx.globalAlpha = thisOpacity * breathe;
      ctx.fillStyle = "rgba(0, 0, 0, 1)";

      const r = Math.min(thisSlatH * 0.3, 3);
      ctx.beginPath();
      ctx.roundRect(offX + microX, y, slatW, thisSlatH, r);
      ctx.fill();
    }

    // ── 3. Vertical cords ──
    ctx.globalAlpha = CORD_OPACITY;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    const cordSpacing = slatW / (CORD_COUNT + 1);

    for (let c = 1; c <= CORD_COUNT; c++) {
      const cordX = offX + c * cordSpacing;
      const cordSway = Math.sin(time * 0.0001 + c * 1.2) * 2;
      ctx.beginPath();
      ctx.rect(cordX + cordSway, startY + driftY - 60, CORD_WIDTH, fieldH + 120);
      ctx.fill();
    }

    ctx.restore();

    // ── 4. Left gradient mask ──
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const fadeW = w * 0.28;
    const grad = ctx.createLinearGradient(0, 0, fadeW, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.8)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.3)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, fadeW, h);
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      slatCountRef.current = getSlatCount(w, h);
      leavesRef.current = generateLeaves(w, h);
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const loop = ts => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      draw(ctx, w, h, ts);
      animRef.current = requestAnimationFrame(loop);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 40,
        filter: `blur(${BLUR}px)`,
      }}
    />
  );
}
