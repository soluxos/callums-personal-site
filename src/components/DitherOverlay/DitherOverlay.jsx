"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ╔════════════════════════════════════════════════════════════════════╗
// ║  DITHER OVERLAY CONTROLS                                         ║
// ║  Tweak these to customise the look and feel of the overlay.      ║
// ╚════════════════════════════════════════════════════════════════════╝

// Helper: parse a hex colour string to { r, g, b } in 0–1 range
const hexToGL = hex => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
};

// Helper: convert HSL (h 0–1, s 0–1, l 0–1) to RGB 0–1
const hslToRGB = (h, s, l) => {
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: f(0), g: f(8), b: f(4) };
};

const CONFIG = {
  // ── Colour ──────────────────────────────────────────────────────────
  // Hex colour string, e.g. "#000000" = black, "#FF765B" = orange
  // (ignored when rainbowMode is true)
  dotColor: "#cccccc",

  // When true, each wave spawns with a different colour from the rainbow
  rainbowMode: false,

  // How opaque each dithered dot is (0 = invisible, 1 = fully solid)
  dotOpacity: 1,

  // Overall overlay opacity on top of everything (0–1)
  overlayOpacity: 1,

  // ── Dot / Pixel Size ────────────────────────────────────────────────
  // Size of a single dither "pixel" in screen pixels (try 2–8)
  pixelSize: 2,

  // How many pixels make up one dither cell (multiplied by pixelSize)
  // Higher = coarser / more chunky pattern.  8 = classic Bayer 8×8
  cellMultiplier: 16,

  // ── Wave Shape ──────────────────────────────────────────────────────
  // How fast the ring expands outward (higher = faster)
  waveSpeed: 0.2,

  // How thick / wide each ring is (higher = fatter rings)
  ringThickness: 0.1,

  // How quickly a wave fades over TIME (higher = dies sooner)
  timeDamping: 0.05,

  // How quickly a wave fades over DISTANCE from its centre
  distanceDamping: 2,

  // How long (seconds) a new wave takes to fade in (prevents pop-in)
  fadeInDuration: 0.8,

  // ── Wave Spawning ───────────────────────────────────────────────────
  // Max number of simultaneous wave sources (shader limit, keep ≤ 16)
  maxWaves: 16,

  // Seconds between automatic wave spawns (random within this range)
  spawnIntervalMin: 0.8,
  spawnIntervalMax: 2.5,

  // Random speed multiplier range for each wave (1 = normal)
  waveSpeedVarianceMin: 0.6,
  waveSpeedVarianceMax: 1.4,

  // Random strength multiplier range for each wave (1 = normal)
  waveStrengthMin: 0.7,
  waveStrengthMax: 1.2,

  // How many waves are pre-spawned on load for instant visibility
  initialWaveCount: 4,

  // ── Layer Positioning ───────────────────────────────────────────────
  // CSS z-index — lower = further behind content
  zIndex: 0,
};

// ════════════════════════════════════════════════════════
// Shader source  (reads values from uniforms set by CONFIG)
// ════════════════════════════════════════════════════════

const vertexShader = `void main() {
  gl_Position = vec4(position, 1.0);
}`;

const buildFragmentShader = cfg => `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;

const int MAX_WAVES = ${cfg.maxWaves};
uniform vec2  uWavePos[MAX_WAVES];
uniform float uWaveTimes[MAX_WAVES];
uniform float uWaveSpeeds[MAX_WAVES];
uniform float uWaveStrengths[MAX_WAVES];
uniform vec3  uWaveColors[MAX_WAVES];

const float PIXEL_SIZE     = ${cfg.pixelSize.toFixed(1)};
const float CELL_PIXEL_SIZE = ${cfg.cellMultiplier.toFixed(1)} * PIXEL_SIZE;

out vec4 fragColor;

// ── Bayer 8×8 ordered dithering ──
float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
#define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))

void main() {
    vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
    float aspectRatio = uResolution.x / uResolution.y;

    float cellPixelSize = CELL_PIXEL_SIZE;
    vec2 cellId = floor(fragCoord / cellPixelSize);
    vec2 cellCoord = cellId * cellPixelSize;

    vec2 uv = (cellCoord / uResolution) * vec2(aspectRatio, 1.0);

    // Accumulate wave energy from all active wave sources
    float feed = 0.0;
    int dominantWave = 0;

    const float speed     = ${cfg.waveSpeed.toFixed(4)};
    const float thickness = ${cfg.ringThickness.toFixed(4)};
    const float dampT     = ${cfg.timeDamping.toFixed(4)};
    const float dampR     = ${cfg.distanceDamping.toFixed(4)};
    const float fadeInDur = ${cfg.fadeInDuration.toFixed(4)};

    for (int i = 0; i < MAX_WAVES; ++i) {
        vec2 pos = uWavePos[i];
        if (pos.x < -0.5 && pos.y < -0.5) continue;

        vec2 cuv = ((pos - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution) * vec2(aspectRatio, 1.0);

        float t = max(uTime - uWaveTimes[i], 0.0);
        float waveSpeed = speed * uWaveSpeeds[i];
        float r = distance(uv, cuv);

        float waveR = waveSpeed * t;
        float ring  = exp(-pow((r - waveR) / thickness, 2.0));
        float atten = exp(-dampT * t) * exp(-dampR * r);

        // Smooth fade-in so waves don't pop
        float fadeIn = smoothstep(0.0, fadeInDur, t);

        float energy = ring * atten * fadeIn * uWaveStrengths[i];
        if (energy > feed) {
            feed = energy;
            dominantWave = i;
        }
    }

    float bayerValue = Bayer8(fragCoord / PIXEL_SIZE) - 0.5;
    float bw = step(0.5, feed + bayerValue);

    // Pick colour: per-wave colour in rainbow mode, fixed colour otherwise
    vec3 baseColor = ${cfg.rainbowMode ? "uWaveColors[dominantWave]" : `vec3(${hexToGL(cfg.dotColor).r.toFixed(4)}, ${hexToGL(cfg.dotColor).g.toFixed(4)}, ${hexToGL(cfg.dotColor).b.toFixed(4)})`};

    // Premultiplied alpha output
    float alpha = bw * ${cfg.dotOpacity.toFixed(4)};
    fragColor = vec4(baseColor * alpha, alpha);
}
`;

export default function DitherOverlay() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const animRef = useRef(null);
  const waveIndexRef = useRef(0);
  const nextSpawnRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── WebGL2 renderer ──
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { alpha: true });
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(canvas);
    rendererRef.current = renderer;

    // ── Scene ──
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ── Uniforms ──
    const uniforms = {
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uWavePos: {
        value: Array.from({ length: CONFIG.maxWaves }, () => new THREE.Vector2(-1, -1)),
      },
      uWaveTimes: { value: new Float32Array(CONFIG.maxWaves) },
      uWaveSpeeds: { value: new Float32Array(CONFIG.maxWaves).fill(1.0) },
      uWaveStrengths: { value: new Float32Array(CONFIG.maxWaves).fill(1.0) },
      uWaveColors: {
        value: Array.from({ length: CONFIG.maxWaves }, () => new THREE.Vector3(0, 0, 0)),
      },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: buildFragmentShader(CONFIG),
      uniforms,
      glslVersion: THREE.GLSL3,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // ── Resize ──
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(window.devicePixelRatio);
      uniforms.uResolution.value.set(w * window.devicePixelRatio, h * window.devicePixelRatio);
    };

    // ── Spawn a wave at a random position ──
    const spawnWave = time => {
      const idx = waveIndexRef.current;
      const w = uniforms.uResolution.value.x;
      const h = uniforms.uResolution.value.y;

      // Random position across the full canvas
      const x = Math.random() * w;
      const y = Math.random() * h;

      uniforms.uWavePos.value[idx].set(x, y);
      uniforms.uWaveTimes.value[idx] = time;
      uniforms.uWaveSpeeds.value[idx] =
        CONFIG.waveSpeedVarianceMin +
        Math.random() * (CONFIG.waveSpeedVarianceMax - CONFIG.waveSpeedVarianceMin);
      uniforms.uWaveStrengths.value[idx] =
        CONFIG.waveStrengthMin + Math.random() * (CONFIG.waveStrengthMax - CONFIG.waveStrengthMin);

      // Assign colour: cycle through rainbow or use fixed dotColor
      if (CONFIG.rainbowMode) {
        const hue = (idx / CONFIG.maxWaves + Math.random() * 0.08) % 1.0;
        const rgb = hslToRGB(hue, 0.75, 0.55);
        uniforms.uWaveColors.value[idx].set(rgb.r, rgb.g, rgb.b);
      } else {
        const c = hexToGL(CONFIG.dotColor);
        uniforms.uWaveColors.value[idx].set(c.r, c.g, c.b);
      }

      waveIndexRef.current = (idx + 1) % CONFIG.maxWaves;
    };

    // ── Render loop ──
    const clock = new THREE.Clock();

    const loop = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // Auto-spawn waves at random intervals
      if (elapsed >= nextSpawnRef.current) {
        spawnWave(elapsed);
        nextSpawnRef.current =
          elapsed +
          CONFIG.spawnIntervalMin +
          Math.random() * (CONFIG.spawnIntervalMax - CONFIG.spawnIntervalMin);
      }

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(loop);
    };

    resize();
    // Seed initial waves so the effect is immediately visible
    for (let i = 0; i < CONFIG.initialWaveCount; i++) {
      spawnWave(-(i * 1.5 + Math.random()));
    }
    nextSpawnRef.current = 0.5 + Math.random();

    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
      material.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: CONFIG.zIndex,
        opacity: CONFIG.overlayOpacity,
      }}
    />
  );
}
