"use client";

import { useEffect, useMemo, useRef } from "react";
import DitherOverlay from "../DitherOverlay/DitherOverlay";

/**
 * AnimatedGradientBackground
 *
 * A vibrant, dynamic mesh gradient background with bold animations
 * inspired by rachelchen.tech's gradient style.
 */

const PRESETS = {
  // Rachel Chen / OpenAI style - vibrant orange, purple, blue, pink
  rachelChen: {
    colors: [
      { color: "#F97316", x: 20, y: 30, size: 120 }, // Bright orange
      { color: "#A855F7", x: 80, y: 20, size: 100 }, // Purple
      { color: "#3B82F6", x: 85, y: 70, size: 110 }, // Blue
      { color: "#EC4899", x: 15, y: 80, size: 100 }, // Pink
      { color: "#FBBF24", x: 50, y: 60, size: 90 }, // Amber
      { color: "#8B5CF6", x: 60, y: 10, size: 80 }, // Violet
      { color: "#F472B6", x: 40, y: 85, size: 95 }, // Rose
    ],
    backgroundColor: "#D97706",
  },
  // Sunset - warm oranges, pinks and corals
  sunset: {
    colors: [
      { color: "#EF4444", x: 10, y: 20, size: 110 }, // Red
      { color: "#F97316", x: 70, y: 15, size: 120 }, // Orange
      { color: "#FBBF24", x: 90, y: 60, size: 100 }, // Amber
      { color: "#FB7185", x: 20, y: 75, size: 110 }, // Rose
      { color: "#F59E0B", x: 50, y: 50, size: 90 }, // Yellow-orange
      { color: "#EC4899", x: 80, y: 85, size: 85 }, // Pink
    ],
    backgroundColor: "#EA580C",
  },
  // Aurora - cool blues, greens and purples
  aurora: {
    colors: [
      { color: "#10B981", x: 15, y: 25, size: 110 }, // Emerald
      { color: "#8B5CF6", x: 75, y: 15, size: 105 }, // Purple
      { color: "#06B6D4", x: 85, y: 65, size: 115 }, // Cyan
      { color: "#22C55E", x: 25, y: 80, size: 100 }, // Green
      { color: "#A855F7", x: 55, y: 45, size: 95 }, // Violet
      { color: "#14B8A6", x: 45, y: 90, size: 90 }, // Teal
    ],
    backgroundColor: "#059669",
  },
  // Midnight - deep blues, purples, cyans
  midnight: {
    colors: [
      { color: "#6366F1", x: 10, y: 20, size: 120 }, // Indigo
      { color: "#A855F7", x: 80, y: 15, size: 110 }, // Purple
      { color: "#0EA5E9", x: 90, y: 70, size: 105 }, // Sky blue
      { color: "#8B5CF6", x: 20, y: 80, size: 115 }, // Violet
      { color: "#3B82F6", x: 50, y: 50, size: 100 }, // Blue
      { color: "#06B6D4", x: 70, y: 90, size: 90 }, // Cyan
    ],
    backgroundColor: "#4338CA",
  },
  // Coral Reef - tropical vibrant colors
  coralReef: {
    colors: [
      { color: "#06B6D4", x: 15, y: 25, size: 115 }, // Cyan
      { color: "#F472B6", x: 80, y: 20, size: 110 }, // Pink
      { color: "#FBBF24", x: 85, y: 75, size: 100 }, // Amber
      { color: "#14B8A6", x: 20, y: 80, size: 105 }, // Teal
      { color: "#EC4899", x: 50, y: 50, size: 95 }, // Pink
      { color: "#22D3EE", x: 65, y: 90, size: 90 }, // Light cyan
    ],
    backgroundColor: "#0891B2",
  },
  // Neon - electric bright colors
  neon: {
    colors: [
      { color: "#F43F5E", x: 15, y: 30, size: 120 }, // Rose
      { color: "#8B5CF6", x: 75, y: 20, size: 115 }, // Purple
      { color: "#06B6D4", x: 85, y: 70, size: 110 }, // Cyan
      { color: "#F97316", x: 25, y: 75, size: 105 }, // Orange
      { color: "#D946EF", x: 50, y: 50, size: 100 }, // Fuchsia
      { color: "#3B82F6", x: 60, y: 85, size: 95 }, // Blue
    ],
    backgroundColor: "#BE185D",
  },
  // Ocean - deep blues, teals, aquas
  ocean: {
    colors: [
      { color: "#0369A1", x: 15, y: 20, size: 120 }, // Dark blue
      { color: "#06B6D4", x: 75, y: 25, size: 115 }, // Cyan
      { color: "#0EA5E9", x: 85, y: 65, size: 110 }, // Sky blue
      { color: "#14B8A6", x: 20, y: 75, size: 105 }, // Teal
      { color: "#22D3EE", x: 50, y: 50, size: 100 }, // Light cyan
      { color: "#0284C7", x: 60, y: 90, size: 95 }, // Blue
      { color: "#2DD4BF", x: 35, y: 35, size: 90 }, // Aqua
    ],
    backgroundColor: "#0C4A6E",
  },
  // Forest - deep greens, earth tones
  forest: {
    colors: [
      { color: "#15803D", x: 20, y: 25, size: 120 }, // Green
      { color: "#22C55E", x: 80, y: 20, size: 110 }, // Emerald
      { color: "#84CC16", x: 85, y: 70, size: 105 }, // Lime
      { color: "#166534", x: 15, y: 80, size: 115 }, // Dark green
      { color: "#4ADE80", x: 50, y: 50, size: 100 }, // Light green
      { color: "#65A30D", x: 70, y: 85, size: 90 }, // Olive
      { color: "#A3E635", x: 30, y: 60, size: 85 }, // Yellow-green
    ],
    backgroundColor: "#14532D",
  },
  // Candy - bright pinks, magentas, purples
  candy: {
    colors: [
      { color: "#EC4899", x: 15, y: 30, size: 120 }, // Pink
      { color: "#D946EF", x: 75, y: 20, size: 115 }, // Fuchsia
      { color: "#F472B6", x: 85, y: 65, size: 110 }, // Light pink
      { color: "#A855F7", x: 20, y: 75, size: 105 }, // Purple
      { color: "#F9A8D4", x: 50, y: 50, size: 100 }, // Pale pink
      { color: "#E879F9", x: 60, y: 85, size: 95 }, // Orchid
      { color: "#FB7185", x: 40, y: 15, size: 90 }, // Rose
    ],
    backgroundColor: "#BE185D",
  },
  // Fire - reds, oranges, yellows
  fire: {
    colors: [
      { color: "#DC2626", x: 20, y: 25, size: 120 }, // Red
      { color: "#F97316", x: 80, y: 20, size: 115 }, // Orange
      { color: "#FBBF24", x: 85, y: 70, size: 110 }, // Amber
      { color: "#EF4444", x: 15, y: 75, size: 105 }, // Light red
      { color: "#F59E0B", x: 50, y: 50, size: 100 }, // Yellow-orange
      { color: "#FCD34D", x: 65, y: 85, size: 95 }, // Yellow
      { color: "#EA580C", x: 35, y: 40, size: 90 }, // Dark orange
    ],
    backgroundColor: "#B91C1C",
  },
  // Lavender - soft purples, pinks, lilacs
  lavender: {
    colors: [
      { color: "#A78BFA", x: 20, y: 30, size: 115 }, // Violet
      { color: "#C4B5FD", x: 75, y: 20, size: 110 }, // Light violet
      { color: "#DDD6FE", x: 85, y: 65, size: 105 }, // Pale violet
      { color: "#8B5CF6", x: 15, y: 75, size: 115 }, // Purple
      { color: "#E9D5FF", x: 50, y: 50, size: 100 }, // Lavender
      { color: "#F5D0FE", x: 60, y: 85, size: 95 }, // Pink lavender
      { color: "#D8B4FE", x: 40, y: 15, size: 90 }, // Mauve
    ],
    backgroundColor: "#7C3AED",
  },
  // Tropical - bright greens, yellows, teals
  tropical: {
    colors: [
      { color: "#10B981", x: 15, y: 25, size: 120 }, // Emerald
      { color: "#FBBF24", x: 80, y: 20, size: 115 }, // Amber
      { color: "#06B6D4", x: 85, y: 70, size: 110 }, // Cyan
      { color: "#84CC16", x: 20, y: 80, size: 105 }, // Lime
      { color: "#F97316", x: 50, y: 50, size: 100 }, // Orange
      { color: "#22D3EE", x: 65, y: 85, size: 95 }, // Light cyan
      { color: "#4ADE80", x: 35, y: 40, size: 90 }, // Light green
    ],
    backgroundColor: "#059669",
  },
  // Ice - light blues, whites, pale cyans
  ice: {
    colors: [
      { color: "#7DD3FC", x: 20, y: 25, size: 120 }, // Light sky blue
      { color: "#BAE6FD", x: 80, y: 20, size: 115 }, // Pale blue
      { color: "#E0F2FE", x: 85, y: 70, size: 110 }, // Ice blue
      { color: "#38BDF8", x: 15, y: 75, size: 105 }, // Sky blue
      { color: "#A5F3FC", x: 50, y: 50, size: 100 }, // Cyan light
      { color: "#67E8F9", x: 60, y: 85, size: 95 }, // Aqua
      { color: "#CFFAFE", x: 40, y: 15, size: 90 }, // Pale cyan
    ],
    backgroundColor: "#0284C7",
  },
  // Peach - soft oranges, pinks, corals
  peach: {
    colors: [
      { color: "#FDBA74", x: 20, y: 30, size: 115 }, // Light orange
      { color: "#FED7AA", x: 75, y: 20, size: 110 }, // Pale orange
      { color: "#FECACA", x: 85, y: 65, size: 105 }, // Pale red
      { color: "#FB923C", x: 15, y: 75, size: 115 }, // Orange
      { color: "#FCA5A5", x: 50, y: 50, size: 100 }, // Light coral
      { color: "#FBBF24", x: 60, y: 85, size: 95 }, // Amber
      { color: "#FDA4AF", x: 40, y: 15, size: 90 }, // Rose
    ],
    backgroundColor: "#EA580C",
  },
  // Electric - vibrant neon contrasts
  electric: {
    colors: [
      { color: "#00FF88", x: 15, y: 25, size: 120 }, // Neon green
      { color: "#FF00FF", x: 80, y: 20, size: 115 }, // Magenta
      { color: "#00FFFF", x: 85, y: 70, size: 110 }, // Cyan
      { color: "#FFFF00", x: 20, y: 80, size: 105 }, // Yellow
      { color: "#FF0080", x: 50, y: 50, size: 100 }, // Hot pink
      { color: "#8000FF", x: 65, y: 85, size: 95 }, // Purple
      { color: "#00FF00", x: 35, y: 40, size: 90 }, // Green
    ],
    backgroundColor: "#1a0033",
  },
  // Dusk - deep purples, blues, warm oranges
  dusk: {
    colors: [
      { color: "#7C3AED", x: 20, y: 25, size: 120 }, // Violet
      { color: "#4338CA", x: 80, y: 20, size: 115 }, // Indigo
      { color: "#F97316", x: 85, y: 70, size: 110 }, // Orange
      { color: "#6366F1", x: 15, y: 75, size: 105 }, // Blue
      { color: "#FB7185", x: 50, y: 50, size: 100 }, // Rose
      { color: "#8B5CF6", x: 60, y: 85, size: 95 }, // Purple
      { color: "#FBBF24", x: 35, y: 40, size: 90 }, // Amber
    ],
    backgroundColor: "#4C1D95",
  },
};

const DEFAULT_CONFIG = {
  animationDuration: 5000, // faster animation
  blurAmount: 60, // less blur for more defined colors
  opacity: 1,
  grain: false,
  grainOpacity: 0.02,
  dither: true,
};

// The blobs are drawn into one small canvas and stretched to fill the box. A gradient this
// soft looks the same at a fraction of the resolution, and one small canvas costs the GPU
// almost nothing. The old version gave every blob its own huge, blurred layer: six cards
// came to roughly 70 layers and 700 MB of textures at 2x, so browsers dropped tiles, and
// the cards flickered and showed hard-edged bands where the dark wash on top went missing.
const SCALE_DOWN = 6; // canvas pixels per CSS pixel, inverted

// Each blob drifts through the same five moves the CSS keyframes used, eased per step.
const STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const ease = t => t * t * (3 - 2 * t); // close to CSS ease-in-out

function blobPath(index) {
  const x = [
    0,
    35 + ((index * 17) % 40),
    -30 - ((index * 13) % 35),
    25 + ((index * 11) % 30),
    -40 + ((index * 19) % 45),
    0,
  ];
  const y = [
    0,
    -25 - ((index * 11) % 30),
    40 + ((index * 15) % 35),
    -35 + ((index * 9) % 25),
    30 + ((index * 21) % 40),
    0,
  ];
  const scale = [
    1,
    1.1 + (index % 3) * 0.15,
    0.85 + (index % 4) * 0.1,
    1.2 + (index % 2) * 0.1,
    0.9 + (index % 5) * 0.08,
    1,
  ];
  const rotate = [0, 5 + index * 2, -8 - index * 3, 10 + index, -5 - index * 2, 0];
  return { x, y, scale, rotate };
}

// Where a blob is at `progress` (0 to 1) through its loop.
function sample(path, progress) {
  let k = 0;
  while (k < STEPS.length - 2 && progress > STEPS[k + 1]) k++;
  const t = ease((progress - STEPS[k]) / (STEPS[k + 1] - STEPS[k]));
  const mix = values => values[k] + (values[k + 1] - values[k]) * t;
  return { x: mix(path.x), y: mix(path.y), scale: mix(path.scale), rotate: mix(path.rotate) };
}

// "#rrggbb" plus a two-digit hex alpha, as an rgba() string the canvas understands.
function withAlpha(hex, alphaHex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${parseInt(alphaHex, 16) / 255})`;
}

export default function AnimatedGradientBackground({
  preset = "rachelChen",
  colors: customColors,
  backgroundColor: customBgColor,
  animationDuration = DEFAULT_CONFIG.animationDuration,
  blurAmount = DEFAULT_CONFIG.blurAmount,
  opacity = DEFAULT_CONFIG.opacity,
  grain = DEFAULT_CONFIG.grain,
  grainOpacity = DEFAULT_CONFIG.grainOpacity,
  dither = DEFAULT_CONFIG.dither,
  className = "",
  style = {},
  children,
}) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const { colors, backgroundColor } = useMemo(() => {
    const presetConfig = PRESETS[preset] || PRESETS.rachelChen;
    return {
      colors: customColors || presetConfig.colors,
      backgroundColor: customBgColor || presetConfig.backgroundColor,
    };
  }, [preset, customColors, customBgColor]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext("2d");
    const paths = colors.map((_, i) => blobPath(i));
    // The blobs lay out over an area larger than the box, as the CSS version did, so they
    // can drift in from beyond the edges.
    const pad = blurAmount * 2;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();

    function resize() {
      width = box.offsetWidth + pad * 2;
      height = box.offsetHeight + pad * 2;
      canvas.width = Math.max(1, Math.ceil(width / SCALE_DOWN));
      canvas.height = Math.max(1, Math.ceil(height / SCALE_DOWN));
    }

    function draw(now) {
      const seconds = reduceMotion ? 0 : (now - started) / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(1 / SCALE_DOWN, 1 / SCALE_DOWN);
      colors.forEach((blob, i) => {
        const duration = animationDuration + i * 1.5;
        const offset = i * (animationDuration / colors.length) * 0.8;
        const progress = ((((seconds + offset) % duration) + duration) % duration) / duration;
        const at = sample(paths[i], progress);
        const size = (blob.size || 100) / 100;
        const w = width * size;
        const h = height * size;
        const cx = (blob.x / 100) * width + (at.x / 100) * w;
        const cy = (blob.y / 100) * height + (at.y / 100) * h;
        // A soft ellipse that fades out a little past its edge, standing in for the old blur.
        const spread = 1 + blurAmount / 250;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((at.rotate * Math.PI) / 180);
        ctx.scale(at.scale, (at.scale * h) / w || at.scale);
        const r = (w / 2) * spread;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, withAlpha(blob.color, "ff"));
        g.addColorStop(0.25, withAlpha(blob.color, "ee"));
        g.addColorStop(0.5, withAlpha(blob.color, "99"));
        g.addColorStop(0.7, withAlpha(blob.color, "44"));
        g.addColorStop(1, withAlpha(blob.color, "00"));
        ctx.fillStyle = g;
        ctx.fillRect(-r, -r, r * 2, r * 2);
        ctx.restore();
      });
    }

    function loop(now) {
      draw(now);
      frame = visible && !reduceMotion ? requestAnimationFrame(loop) : 0;
    }

    resize();
    draw(performance.now());

    // Only animate while the box is on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduceMotion) frame = requestAnimationFrame(loop);
    });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(box);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [colors, animationDuration, blurAmount]);

  return (
    <div
      ref={boxRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor,
        ...style,
      }}
    >
      {/* The blobs, drawn small and stretched to fill (see SCALE_DOWN). */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `-${blurAmount * 2}px`,
          width: `calc(100% + ${blurAmount * 4}px)`,
          height: `calc(100% + ${blurAmount * 4}px)`,
          // The base styles cap a canvas at its container's width; this one overhangs on purpose.
          maxWidth: "none",
          opacity,
        }}
      />

      {/* Subtle color overlay for richness */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, transparent 0%, ${backgroundColor}22 50%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Optional grain overlay */}
      {grain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: grainOpacity,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Dither overlay */}
      {dither && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <DitherOverlay
            color={colors[0]?.color || "#cccccc"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* Content layer */}
      {children && <div style={{ position: "relative", zIndex: 1 }}>{children}</div>}
    </div>
  );
}

AnimatedGradientBackground.presets = Object.keys(PRESETS);
AnimatedGradientBackground.PRESETS = PRESETS;
