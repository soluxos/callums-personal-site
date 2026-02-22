"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

const DEFAULTS = {
  dotColor: "#cccccc",
  rainbowMode: false,
  dotOpacity: 1,
  overlayOpacity: 1,
  pixelSize: 1,
  cellMultiplier: 16,
  waveSpeed: 0.2,
  ringThickness: 0.1,
  timeDamping: 0.05,
  distanceDamping: 2,
  fadeInDuration: 0.8,
  maxWaves: 16,
  spawnIntervalMin: 0.8,
  spawnIntervalMax: 2.5,
  waveSpeedVarianceMin: 0.6,
  waveSpeedVarianceMax: 1.4,
  waveStrengthMin: 0.7,
  waveStrengthMax: 1.2,
  initialWaveCount: 4,
  zIndex: 0,
  waveShape: "circle", // "circle", "diamond", "square"
  waveProfile: "gaussian", // "gaussian", "sharp", "sine", "sawtooth"
};

// ════════════════════════════════════════════════════════
// Shader source
// ════════════════════════════════════════════════════════

const vertexShader = `void main() {
  gl_Position = vec4(position, 1.0);
}`;

const buildFragmentShader = cfg => `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;

const int MAX_WAVES = ${cfg.maxWaves};
uniform vec2  uWavePos[MAX_WAVES];
uniform float uWaveTimes[MAX_WAVES];
uniform float uWaveSpeeds[MAX_WAVES];
uniform float uWaveStrengths[MAX_WAVES];
uniform vec3  uWaveColors[MAX_WAVES];

out vec4 fragColor;

// ── Bayer 8×8 ordered dithering ──
float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
#define Bayer4(a) (Bayer2(0.5 * (a)) * 0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + Bayer2(a))

void main() {
    float PIXEL_SIZE      = uPixelSize;
    float CELL_PIXEL_SIZE = ${cfg.cellMultiplier.toFixed(1)} * PIXEL_SIZE;

    vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
    float aspectRatio = uResolution.x / uResolution.y;

    float cellPixelSize = CELL_PIXEL_SIZE;
    vec2 cellId = floor(fragCoord / cellPixelSize);
    vec2 cellCoord = cellId * cellPixelSize;

    vec2 uv = (cellCoord / uResolution) * vec2(aspectRatio, 1.0);

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
        vec2 delta = uv - cuv;
        ${(() => {
          switch (cfg.waveShape) {
            case "diamond":
              return "float r = abs(delta.x) + abs(delta.y);";
            case "square":
              return "float r = max(abs(delta.x), abs(delta.y));";
            default:
              return "float r = length(delta);";
          }
        })()}

        float waveR = waveSpeed * t;
        ${(() => {
          switch (cfg.waveProfile) {
            case "sharp":
              return "float ring = 1.0 - smoothstep(0.0, thickness, abs(r - waveR));";
            case "sine":
              return "float ring = 0.5 + 0.5 * cos(((r - waveR) / thickness) * 6.28318);";
            case "sawtooth":
              return "float ring = 1.0 - clamp(abs(r - waveR) / thickness, 0.0, 1.0);";
            default:
              return "float ring = exp(-pow((r - waveR) / thickness, 2.0));";
          }
        })()}
        float atten = exp(-dampT * t) * exp(-dampR * r);

        float fadeIn = smoothstep(0.0, fadeInDur, t);

        float energy = ring * atten * fadeIn * uWaveStrengths[i];
        if (energy > feed) {
            feed = energy;
            dominantWave = i;
        }
    }

    float bayerValue = Bayer8(fragCoord / PIXEL_SIZE) - 0.5;
    float bw = step(0.5, feed + bayerValue);

    vec3 baseColor = ${cfg.rainbowMode ? "uWaveColors[dominantWave]" : `vec3(${hexToGL(cfg.dotColor).r.toFixed(4)}, ${hexToGL(cfg.dotColor).g.toFixed(4)}, ${hexToGL(cfg.dotColor).b.toFixed(4)})`};

    float alpha = bw * ${cfg.dotOpacity.toFixed(4)};
    fragColor = vec4(baseColor * alpha, alpha);
}
`;

export default function DitherBackground({
  dotColor,
  rainbowMode,
  dotOpacity,
  overlayOpacity,
  pixelSize,
  cellMultiplier,
  waveSpeed,
  ringThickness,
  timeDamping,
  distanceDamping,
  fadeInDuration,
  maxWaves,
  spawnIntervalMin,
  spawnIntervalMax,
  waveSpeedVarianceMin,
  waveSpeedVarianceMax,
  waveStrengthMin,
  waveStrengthMax,
  initialWaveCount,
  zIndex,
  waveShape,
  waveProfile,
  className,
  style,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const animRef = useRef(null);
  const waveIndexRef = useRef(0);
  const nextSpawnRef = useRef(0);

  // Merge props with defaults
  const config = {
    dotColor: dotColor ?? DEFAULTS.dotColor,
    rainbowMode: rainbowMode ?? DEFAULTS.rainbowMode,
    dotOpacity: dotOpacity ?? DEFAULTS.dotOpacity,
    overlayOpacity: overlayOpacity ?? DEFAULTS.overlayOpacity,
    pixelSize: pixelSize ?? DEFAULTS.pixelSize,
    cellMultiplier: cellMultiplier ?? DEFAULTS.cellMultiplier,
    waveSpeed: waveSpeed ?? DEFAULTS.waveSpeed,
    ringThickness: ringThickness ?? DEFAULTS.ringThickness,
    timeDamping: timeDamping ?? DEFAULTS.timeDamping,
    distanceDamping: distanceDamping ?? DEFAULTS.distanceDamping,
    fadeInDuration: fadeInDuration ?? DEFAULTS.fadeInDuration,
    maxWaves: maxWaves ?? DEFAULTS.maxWaves,
    spawnIntervalMin: spawnIntervalMin ?? DEFAULTS.spawnIntervalMin,
    spawnIntervalMax: spawnIntervalMax ?? DEFAULTS.spawnIntervalMax,
    waveSpeedVarianceMin: waveSpeedVarianceMin ?? DEFAULTS.waveSpeedVarianceMin,
    waveSpeedVarianceMax: waveSpeedVarianceMax ?? DEFAULTS.waveSpeedVarianceMax,
    waveStrengthMin: waveStrengthMin ?? DEFAULTS.waveStrengthMin,
    waveStrengthMax: waveStrengthMax ?? DEFAULTS.waveStrengthMax,
    initialWaveCount: initialWaveCount ?? DEFAULTS.initialWaveCount,
    zIndex: zIndex ?? DEFAULTS.zIndex,
    waveShape: waveShape ?? DEFAULTS.waveShape,
    waveProfile: waveProfile ?? DEFAULTS.waveProfile,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uPixelSize: { value: config.pixelSize * (window.devicePixelRatio || 1) },
      uWavePos: {
        value: Array.from({ length: config.maxWaves }, () => new THREE.Vector2(-1, -1)),
      },
      uWaveTimes: { value: new Float32Array(config.maxWaves) },
      uWaveSpeeds: { value: new Float32Array(config.maxWaves).fill(1.0) },
      uWaveStrengths: { value: new Float32Array(config.maxWaves).fill(1.0) },
      uWaveColors: {
        value: Array.from({ length: config.maxWaves }, () => new THREE.Vector3(0, 0, 0)),
      },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: buildFragmentShader(config),
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

    // ── Resize (fills parent container) ──
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      renderer.setSize(w, h, false);
      const dpr = window.devicePixelRatio || 1;
      renderer.setPixelRatio(dpr);
      uniforms.uPixelSize.value = config.pixelSize * dpr;
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };

    const spawnWave = time => {
      const idx = waveIndexRef.current;
      const w = uniforms.uResolution.value.x;
      const h = uniforms.uResolution.value.y;

      const x = Math.random() * w;
      const y = Math.random() * h;

      uniforms.uWavePos.value[idx].set(x, y);
      uniforms.uWaveTimes.value[idx] = time;
      uniforms.uWaveSpeeds.value[idx] =
        config.waveSpeedVarianceMin +
        Math.random() * (config.waveSpeedVarianceMax - config.waveSpeedVarianceMin);
      uniforms.uWaveStrengths.value[idx] =
        config.waveStrengthMin + Math.random() * (config.waveStrengthMax - config.waveStrengthMin);

      if (config.rainbowMode) {
        const hue = (idx / config.maxWaves + Math.random() * 0.08) % 1.0;
        const rgb = hslToRGB(hue, 0.75, 0.55);
        uniforms.uWaveColors.value[idx].set(rgb.r, rgb.g, rgb.b);
      } else {
        const c = hexToGL(config.dotColor);
        uniforms.uWaveColors.value[idx].set(c.r, c.g, c.b);
      }

      waveIndexRef.current = (idx + 1) % config.maxWaves;
    };

    const clock = new THREE.Clock();

    const loop = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      if (elapsed >= nextSpawnRef.current) {
        spawnWave(elapsed);
        nextSpawnRef.current =
          elapsed +
          config.spawnIntervalMin +
          Math.random() * (config.spawnIntervalMax - config.spawnIntervalMin);
      }

      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(loop);
    };

    resize();
    for (let i = 0; i < config.initialWaveCount; i++) {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: config.zIndex,
        opacity: config.overlayOpacity,
        ...style,
      }}
    />
  );
}
