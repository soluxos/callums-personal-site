import * as THREE from "three";
import { leafTexture } from "./leaves";
import { DAY } from "./day";

export { DAY };

// Version four of the lit wall: v3, with blinds that behave as real ones do. v3 tilted the slats
// to a different angle for each time of day. Here they stay at one tilt, nearly level, and how
// much light gets between them comes from the slats themselves: each is a little wider than the
// gap to the next, so the higher the light comes in, the more of it they catch. The stripes of
// light are widest with the sun low and thinnest at noon, and nobody touches the blinds.
// From v3, which built on v2's room (window, blinds, oak, plaster, dust, clouds, rainbow, and the
// veil that lays the light over the words):
// - The oak is two layers, a bough close to the window and the tree further off. Light through
//   the gaps between leaves lands as little images of the sun, round or drawn out into ellipses
//   by the angle, the way dappled light really falls. Light through the leaves themselves comes
//   out green-gold.
// - Gusts roll through the tree and its leaves flutter, so the dapples shiver.
// - A robin flies past the window now and then, its shadow cast along the light like the rest.
// - The blinds open from the top down as the page arrives, turning from shut to their tilt.
// - At dusk a lamp comes on, its light rising up the wall out of the top of its shade.
// What happens when is worked out in `life.js`; this draws it. Each of the two canvases (the
// wall behind the page and the veil over it) draws in five steps: light and shadow at a reduced
// size, the sun's disc over the leaves, a Gaussian blur across and down, then the finish.

const DEG = Math.PI / 180;


// The window and blinds, as in v2, but with the blinds raised partway, so that below them the
// sun comes through the panes in the open and the oak can dapple it. Across, it's measured by
// where its light lands on the wall (see `render`): the shade left either side, as a share of the
// wall's width, about how wide each pane is, and how thick the bars. The margin is negative: the
// window runs a little past both sides of the wall, so the blinds reach edge to edge with no band
// of shade down either side.
const WINDOW = { margin: -0.1, pane: 3.4, bar: 0.24, transomY: 1.6, transom: 0.14, reach: 3.5 };
// The slats: how far apart they are, how wide (front to back, a little more than the gap so they
// close), and their tilt, the outside edge dipped a few degrees below level; and how far they
// turn to be shut, before the page opens them. The cords, like the bars, are spaced on the wall.
const BLINDS = { pitch: 0.75, width: 0.86, tilt: -5 * DEG, shut: -62 * DEG, to: -0.4, cords: 2.7, sag: 0.04 };
const YAW = -62 * DEG;
const VIEW_H = 10;
// The two layers of the oak: how far out each is, where its middle lands on the wall at noon,
// and how big it is. The bough hangs in from the top right.
const OAK = { reach: 9.5, x: 4.5, y: -1, size: 20 };
const BOUGH = { reach: 5, x: 5.5, y: 3.2, size: 13 };
const BOUGH_LIMBS = [
  [0.98, -0.03, 2.2, 0.75],
  [1.03, 0.24, 2.75, 0.5],
];
// The sun's angular radius, in radians, several times the real one, so the dapples are big
// enough to see.
const SUN_SIZE = 0.02;
// How far out past the window the robins fly, across it, and the real sun's radius, as an angle,
// which softens their shadows (the leaves use a bigger one, to make more of their dapples).
const BIRD_OUT = 6;
const BIRD_SUN = 0.005;
// The lamp's bulb: across the wall as a fraction of its width, below the bottom of the view,
// and out in the room from the wall.
const LAMP = { x: 0.3, y: -5.8, z: 2.4 };
// The bevelled pane: across the window, as a share of the way to its edge, and down it; and how
// much it bends the light.
const PRISM = { u: -0.42, v: -3.4, bend: [0.75, 0.45] };
// Blur widths: the window's as multiples of `soft` at a typical distance (`NEAR`), the leaves'
// in mask pixels (the sun's disc does most of their softening), and the glow's in wall units.
const BLUR = { window: 2.4, leaves: 1.2, glow: 0.75 };
const NEAR = 4.2;
const MASK_SCALE = 0.4;

const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);
const linear = (hex) => rgb(hex).map((v) => v ** 2.2);
// Light through a leaf, the floor's warm bounce and the lamp, in linear light.
const TINT = [0.08, 0.12, 0.025];
const FLOOR = [0.16, 0.1, 0.06];
const LAMP_COLOUR = linear("#ffb066");

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// The room, shared by the steps that need it: the window and its blinds, and how much light
// gets through them from any direction.
const room = /* glsl */ `
  uniform vec2 uView;
  uniform vec3 uSunDir;
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uWinO;
  uniform vec3 uWinN;
  uniform vec3 uWinU;
  uniform vec4 uWin;      // halfW, halfH, pane width, bar thickness
  uniform vec2 uTransom;  // height, thickness
  uniform vec4 uBlind;    // slat pitch, how steeply the light comes through the window, lower edge, cord spacing
  uniform vec3 uSlat;     // slat width over pitch, tilt, tilt when shut
  uniform float uSag;

  const float PI = 3.14159265;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  // How much of [x - w/2, x + w/2] lies in [a, b]: a band, box-filtered to width w.
  float band(float x, float a, float b, float w) {
    float h = 0.5 * w;
    return max(0.0, min(x + h, b) - max(x - h, a)) / w;
  }
  float slatsUpTo(float x, float s, float k) {
    return floor(x / s) * k * s + min(mod(x, s), k * s);
  }
  float slats(float x, float s, float k, float w) {
    float h = 0.5 * w;
    return (slatsUpTo(x + h, s, k) - slatsUpTo(x - h, s, k)) / w;
  }
  // Where the ray from wall point p along dir crosses the plane through o facing n: across it
  // (along u), up it, and how far along the ray.
  vec3 cross_(vec3 p, vec3 dir, vec3 o, vec3 n, vec3 u) {
    float t = dot(o - p, n) / dot(dir, n);
    vec3 q = p + dir * t - o;
    return vec3(dot(q, u), q.y, t);
  }

  // How much of its row a slat's shadow covers. Seen side-on, a slat is a short line across the
  // window's depth, tilted; the light comes through at a slope, and the slat's shadow on the
  // window is that line run along the slope. Each slat is tilted a little differently, and they
  // turn open from the top down as the page arrives.
  float slatCover(float row) {
    float jitter = (hash(vec2(row, 3.7)) - 0.5) * 0.06;
    float from = clamp((uWin.y - row * uBlind.x) / (uWin.y - uBlind.z), 0.0, 1.0);
    float open = 1.0 - pow(1.0 - clamp(uReveal * 1.15 - from * 0.15, 0.0, 1.0), 3.0);
    float tilt = mix(uSlat.z, uSlat.y + jitter, open);
    return min(uSlat.x * abs(sin(tilt) - cos(tilt) * uBlind.y), 1.0);
  }
  // The slats over height y, box-filtered to width w. Each slat covers the bottom of its row.
  float blinds(float y, float w) {
    float row = floor(y / uBlind.x);
    float sum = 0.0;
    for (int i = -1; i <= 1; i++) {
      float r = row + float(i);
      sum += band(y - r * uBlind.x, 0.0, slatCover(r) * uBlind.x, w);
    }
    return min(sum, 1.0);
  }
  // How much light coming along dir gets through the window to wall point p, with shadow edges
  // softening by soft per unit of distance. w comes back with where it crossed the window.
  float windowLight(vec3 p, vec3 dir, float soft, out vec3 w) {
    w = cross_(p, dir, uWinO, uWinN, uWinU);
    float edge = max(1.5 * max(fwidth(w.x), fwidth(w.y)), soft * w.z);
    float light = band(w.x, -uWin.x, uWin.x, edge) * band(w.y, -uWin.y, uWin.y, edge);
    light *= 1.0 - slats(w.x + 0.5 * uWin.w, uWin.z, uWin.w / uWin.z, edge);
    light *= 1.0 - band(w.y, uTransom.x - 0.5 * uTransom.y, uTransom.x + 0.5 * uTransom.y, edge);
    float drawn = band(w.y, uBlind.z, uWin.y + 1.0, edge);
    float between = sin(PI * w.x / uBlind.w);
    light *= 1.0 - drawn * blinds(w.y + uSag * between * between, edge);
    light *= 1.0 - band(w.y, uBlind.z - 0.14, uBlind.z, edge);
    return light * step(0.0, dot(dir, uWinN)) * step(0.0, dir.z);
  }
`;

// Step one. Red is the light the window lets in, past the blinds; green
// is how much the near bough blocks, alpha how much the far tree does, and blue the light that
// gets past all of them, for the glow.
const maskShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  ${room}

  uniform float uSoft;
  uniform float uPixel;
  uniform float uWind;
  uniform vec3 uBoughO;
  uniform float uBoughSize;
  uniform sampler2D uBoughLeaves;
  uniform vec3 uOakO;
  uniform float uOakSize;
  uniform sampler2D uOakLeaves;

  // How the leaves move: gusts that roll across the tree from one side, the branches swaying
  // under them, and the leaves themselves fluttering.
  vec2 sway(vec2 uv, float t, float seed) {
    float gust = 0.5 + 0.5 * sin(t * 0.35 - uv.x * 2.5 + seed);
    vec2 bend = vec2(
      sin(t * 0.55 + uv.y * 6.0 + seed) + 0.5 * sin(t * 1.21 + uv.x * 9.0),
      cos(t * 0.47 + uv.x * 5.0 + seed) + 0.4 * sin(t * 1.07 + uv.y * 8.0)
    );
    vec2 flutter = vec2(sin(t * 7.3 + uv.y * 140.0 + uv.x * 60.0), cos(t * 6.1 + uv.x * 130.0 - uv.y * 50.0));
    return 0.006 * bend * (0.6 + 0.8 * gust) + 0.0012 * flutter * (0.4 + gust);
  }

  // How much of a layer of leaves the ray from p towards the sun passes through. soften reads a
  // coarser level of the texture, smoothing over gaps smaller than the sun's disc will spread.
  float leaves(vec3 p, vec3 o, float size, sampler2D map, float t, float seed, float soften) {
    vec3 c = cross_(p, uSunDir, o, vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0));
    vec2 uv = c.xy / size + 0.5;
    uv += uWind * sway(uv, t, seed);
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    float bias = log2(max(1.0, uPixel / size * 1024.0)) + soften;
    return texture2D(map, uv, bias).a * inside;
  }

  void main() {
    vec3 p = vec3((vUv - 0.5) * uView, 0.0);
    vec3 w;
    float light = windowLight(p, uSunDir, 0.2 * uSoft, w);
    float bough = leaves(p, uBoughO, uBoughSize, uBoughLeaves, uTime, 0.0, 0.0);
    float oak = leaves(p, uOakO, uOakSize, uOakLeaves, uTime * 0.8, 2.1, 0.5);
    gl_FragColor = vec4(light, bough, light * (1.0 - bough) * (1.0 - oak), oak);
  }
`;

// Step two: each gap in the leaves lets through a little image of the sun, so the leaves are
// spread over the sun's disc, an ellipse stretched along the way the light is travelling. The
// further the leaves, the bigger it is. Samples spiral out over the disc, turned a little
// differently at each pixel; the blur after this smooths out the grain that leaves.
const discShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform vec2 uView;
  uniform vec2 uSunAxis;    // the way the light travels across the wall
  uniform vec2 uDiscBough;  // the disc's radii, along and across, in wall units
  uniform vec2 uDiscOak;

  void main() {
    vec4 mask = texture2D(tMap, vUv);
    float spin = 6.2832 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    vec2 side = vec2(-uSunAxis.y, uSunAxis.x);
    float bough = 0.0;
    float oak = 0.0;
    for (int i = 0; i < 32; i++) {
      float r = sqrt((float(i) + 0.5) / 32.0);
      float a = float(i) * 2.39996 + spin;
      vec2 s = r * vec2(cos(a), sin(a));
      bough += texture2D(tMap, vUv + (uSunAxis * s.x * uDiscBough.x + side * s.y * uDiscBough.y) / uView).g;
      oak += texture2D(tMap, vUv + (uSunAxis * s.x * uDiscOak.x + side * s.y * uDiscOak.y) / uView).a;
    }
    gl_FragColor = vec4(mask.r, bough / 32.0, mask.b, oak / 32.0);
  }
`;

// Steps three and four, across then down: Gaussian blurs. The window's shadow blurs more the
// further this point is from the window; the leaves just lose the disc's grain; the glow is wide.
const blurShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform vec2 uStep;
  uniform vec3 uSigma;  // window at the typical distance, leaves, glow; in mask pixels
  uniform vec2 uView;
  uniform vec3 uSunDir;
  uniform vec3 uWinO;
  uniform vec3 uWinN;
  uniform float uNear;

  void main() {
    vec3 p = vec3((vUv - 0.5) * uView, 0.0);
    float t = dot(uWinO - p, uWinN) / dot(uSunDir, uWinN);
    float sigma = uSigma.x * clamp(t / uNear, 0.35, 2.5);

    float spacing = max(0.5, sigma / 4.0);
    float window = 0.0;
    float weight = 0.0;
    for (int i = -12; i <= 12; i++) {
      float x = float(i) * spacing;
      float k = exp(-x * x / (2.0 * sigma * sigma + 1e-4));
      window += texture2D(tMap, vUv + uStep * x).r * k;
      weight += k;
    }
    window /= weight;

    spacing = max(0.5, uSigma.y / 2.5);
    vec2 leaves = vec2(0.0);
    weight = 0.0;
    for (int i = -6; i <= 6; i++) {
      float x = float(i) * spacing;
      float k = exp(-x * x / (2.0 * uSigma.y * uSigma.y + 1e-4));
      leaves += texture2D(tMap, vUv + uStep * x).ga * k;
      weight += k;
    }
    leaves /= weight;

    spacing = max(0.5, uSigma.z / 4.0);
    float glow = 0.0;
    weight = 0.0;
    for (int i = -12; i <= 12; i++) {
      float x = float(i) * spacing;
      float k = exp(-x * x / (2.0 * uSigma.z * uSigma.z + 1e-4));
      glow += texture2D(tMap, vUv + uStep * x).b * k;
      weight += k;
    }
    gl_FragColor = vec4(window, leaves.x, glow / weight, leaves.y);
  }
`;

// Step five. The wall and the veil share how a point is coloured.
const finish = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  ${room}

  uniform sampler2D tMask;
  uniform vec3 uSun;
  uniform float uStrength;
  uniform vec3 uSky;
  uniform vec3 uWall;
  uniform vec3 uTint;
  uniform vec3 uFloor;
  uniform float uExposure;
  uniform float uVeil;
  uniform vec4 uLamp;        // the bulb, and how bright it is
  uniform vec3 uLampColour;
  uniform vec4 uBirds[4];     // where each bird is on its plane, its size (negative flying left), its wingbeat
  uniform float uBirdFold[4]; // how far each has its wings folded
  uniform vec3 uBirdO;
  uniform float uBirdSoft;    // the sun's radius, as an angle

  float segment(vec2 p, vec2 a, vec2 b, out float h) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }
  // Distance to a triangle, negative inside.
  float triangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 ab = b - a, bc = c - b, ca = a - c;
    vec2 pa = p - a, pb = p - b, pc = p - c;
    vec2 qa = pa - ab * clamp(dot(pa, ab) / dot(ab, ab), 0.0, 1.0);
    vec2 qb = pb - bc * clamp(dot(pb, bc) / dot(bc, bc), 0.0, 1.0);
    vec2 qc = pc - ca * clamp(dot(pc, ca) / dot(ca, ca), 0.0, 1.0);
    float turn = sign(ab.x * ca.y - ab.y * ca.x);
    vec2 d = min(min(vec2(dot(qa, qa), turn * (pa.x * ab.y - pa.y * ab.x)),
                     vec2(dot(qb, qb), turn * (pb.x * bc.y - pb.y * bc.x))),
                     vec2(dot(qc, qc), turn * (pc.x * ca.y - pc.y * ca.x)));
    return -sqrt(d.x) * sign(d.y);
  }
  // A robin as the sun sees it, which is the shape of its shadow. It's built in three dimensions,
  // along its flight, up and out to one side, in units of about its length: a round body with
  // the big head run into the breast, a short thin beak, a short square tail, and short rounded
  // wings beating up and down from the shoulders. Between bursts of wingbeats it folds them
  // (fold, 0 to 1) back against its body. birdF, birdU and birdS carry those three directions
  // across the light, and at() a point along them. The parts are blended where they meet, as
  // feathers would.
  vec2 birdF;
  vec2 birdU;
  vec2 birdS;
  vec2 at(vec3 k) {
    return k.x * birdF + k.y * birdU + k.z * birdS;
  }
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  float capsule(vec2 p, vec3 a, vec3 b, float ra, float rb) {
    float h;
    return segment(p, at(a), at(b), h) - mix(ra, rb, h);
  }
  float plate(vec2 p, vec3 a, vec3 b, vec3 c) {
    return triangle(p, at(a), at(b), at(c)) - 0.012;
  }
  float bird(vec2 q, float beat, float fold, float aa) {
    float d = capsule(q, vec3(-0.1, 0.0, 0.0), vec3(0.06, 0.02, 0.0), 0.12, 0.15);
    d = smin(d, length(q - at(vec3(0.21, 0.08, 0.0))) - 0.1, 0.08);
    d = min(d, capsule(q, vec3(0.29, 0.075, 0.0), vec3(0.37, 0.065, 0.0), 0.02, 0.005));
    float tail = capsule(q, vec3(-0.12, 0.02, 0.0), vec3(-0.4, 0.0, 0.0), 0.05, 0.03);
    tail = min(tail, plate(q, vec3(-0.14, 0.02, 0.03), vec3(-0.42, 0.0, 0.07), vec3(-0.42, 0.0, -0.07)));
    tail = min(tail, plate(q, vec3(-0.14, 0.02, 0.03), vec3(-0.14, 0.02, -0.03), vec3(-0.42, 0.0, -0.07)));
    d = smin(d, tail, 0.04);
    float lift = 0.2 + sin(beat);
    float hand = 1.2 * lift;
    float reach = 1.0 - 0.7 * fold;
    for (int i = 0; i < 2; i++) {
      float side = i == 0 ? 1.0 : -1.0;
      vec3 shoulder = vec3(0.05, 0.07, 0.07 * side);
      vec3 back = vec3(-0.12, 0.06, 0.07 * side);
      vec3 wrist = shoulder + vec3(0.03, 0.24 * sin(lift), 0.24 * cos(lift) * side) * reach;
      vec3 tip = wrist + vec3(-0.16 - 0.06 * cos(beat) - 0.14 * fold, 0.3 * sin(hand) * reach, 0.3 * cos(hand) * reach * side);
      float wing = capsule(q, shoulder, wrist, 0.075, 0.07);
      wing = smin(wing, capsule(q, wrist, tip, 0.07, 0.05), 0.03);
      wing = smin(wing, plate(q, shoulder, wrist, back), 0.03);
      wing = smin(wing, plate(q, back, wrist, tip), 0.03);
      d = smin(d, wing, 0.04);
    }
    return 1.0 - smoothstep(-aa, aa, d);
  }
  // The robins fly across the window, out past it. Each wall point is shaded by whatever the
  // ray from it towards the sun passes through: the birds seen down that ray, across it and up.
  // The edge of each shadow is as soft as the sun's disc makes it at that bird's distance, and
  // never softer than a pixel, since they're drawn at the screen's own size.
  float birds(vec2 xy) {
    vec3 p = vec3(xy, 0.0);
    float pixel = fwidth(xy.x);
    vec3 up = normalize(vec3(0.0, 1.0, 0.0) - uSunDir * uSunDir.y);
    vec3 across = cross(up, uSunDir);
    birdU = vec2(across.y, up.y);
    float shadow = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 b = uBirds[i];
      if (b.z == 0.0) continue;
      float size = abs(b.z);
      vec3 r = p - uBirdO - uWinU * b.x - vec3(0.0, b.y, 0.0);
      vec2 q = vec2(dot(r, across), dot(r, up)) / size;
      if (dot(q, q) > 1.5) continue;
      vec3 f = uWinU * sign(b.z);
      vec3 side = cross(f, vec3(0.0, 1.0, 0.0));
      birdF = vec2(dot(f, across), dot(f, up));
      birdS = vec2(dot(side, across), dot(side, up));
      float penumbra = -dot(r, uSunDir) * uBirdSoft;
      shadow = max(shadow, bird(q, b.w, uBirdFold[i], max(penumbra, pixel) / size));
    }
    return shadow;
  }

  // Linear light to the screen, with the highlights rolling off gently rather than clipping.
  vec3 screen(vec3 colour) {
    return pow(1.0 - exp(-colour * uExposure), vec3(1.0 / 2.2));
  }

  // Sunlight reaching the wall: through the gaps as it is, and through the leaves green-gold.
  vec3 sunlight(vec4 mask) {
    float open = mask.r * (1.0 - mask.g) * (1.0 - mask.a);
    return vec3(open) + (mask.r - open) * uTint;
  }

  // A lamp on a table out in the room, just below the wall in view. Light leaves the top of its
  // shade in a wide cone and meets the wall in a broad arc, soft-edged because the shade's rim is
  // close to the bulb. The shade glows a little too, warming the wall under the arc, and light
  // off the ceiling warms the whole room a touch.
  vec3 lamp(vec2 p) {
    if (uLamp.w <= 0.0) return vec3(0.0);
    vec3 v = vec3(p, 0.0) - uLamp.xyz;
    float d = length(v);
    float cone = smoothstep(0.48, 0.72, v.y / d);
    return uLampColour * uLamp.w * ((cone + 0.1) * 18.0 * uLamp.z / (d * d * d) + 0.02);
  }

  // The wall's colour in linear light, given the sunlight reaching it, the glow around that,
  // how the plaster catches it, and the lamp. Shade takes the sky's colour, the
  // ceiling is a little darker and the floor bounces warm light up the bottom of the wall.
  vec3 lit(vec3 light, float glow, float rake, vec3 extra) {
    float lambert = sqrt(max(uSunDir.z, 0.0));
    float bounce = (0.8 + 0.24 * smoothstep(0.95, 0.05, vUv.x) + 0.04 * vUv.y) * (1.0 - 0.1 * smoothstep(0.7, 1.0, vUv.y));
    vec3 direct = uSun * uStrength * lambert;
    vec3 ambient = uSky * bounce + direct * uFloor * smoothstep(0.45, 0.0, vUv.y);
    float l = dot(light, vec3(1.0 / 3.0));
    vec3 sun = direct * (0.9 * light * rake + 0.2 * glow);
    sun *= 1.0 + l * (1.0 - l) * 4.0 * vec3(0.1, 0.02, -0.07);
    return uWall * (ambient + sun + extra);
  }

  // How much the veil darkens a point, in the screen's colour space, which is where the browser
  // multiplies: nothing in full sun, and part of the way to the wall's own shade elsewhere.
  vec3 veil(vec4 mask, vec3 light, vec3 extra) {
    vec3 here = screen(lit(light, mask.b, 1.0, extra));
    vec3 full = screen(lit(vec3(1.0), 1.0, 1.0, extra));
    return mix(vec3(1.0), min(here / full, vec3(1.0)), uVeil);
  }
`;

const veilShader = /* glsl */ `
  ${finish}
  void main() {
    vec2 p = (vUv - 0.5) * uView;
    vec4 mask = texture2D(tMask, vUv);
    gl_FragColor = vec4(veil(mask, sunlight(mask) * (1.0 - birds(p)), lamp(p)), 1.0);
  }
`;

// The wall, behind the page, drawn lighter by however much the veil will darken it.
const wallShader = /* glsl */ `
  ${finish}
  uniform float uPixelRatio;
  uniform vec2 uResolution;
  uniform float uDust;
  uniform vec4 uPrism;        // where the rainbow lands, and the way the light is travelling
  uniform float uPrismStrength;

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float plaster(vec2 p) {
    return 0.55 * noise(p) + 0.3 * noise(p * 2.7 + 11.0) + 0.15 * noise(p * 7.3 + 23.0);
  }

  float lightAt(vec2 uv) {
    vec4 mask = texture2D(tMask, uv);
    return mask.r * (1.0 - mask.g) * (1.0 - mask.a);
  }

  // Specks of dust drifting in the air between the window and the wall. Most cells of a loose
  // grid hold none; the rest hold one that wanders slowly around its cell. A speck shows only
  // while it's in a beam, so it's lit by the light that would land on the wall behind it,
  // further along the beam, and it twinkles as it turns.
  float dust(vec2 px, vec2 uvPerPx, float t) {
    float sum = 0.0;
    for (int layer = 0; layer < 2; layer++) {
      float cell = layer == 0 ? 60.0 : 97.0;
      vec2 g = px / cell + float(layer) * 17.0;
      vec2 id = floor(g);
      vec2 f = fract(g);
      float a = hash(id + 0.13);
      float b = hash(id + 7.7);
      if (hash(id + 3.1) > 0.5) continue;
      vec2 centre = 0.5 + 0.32 * vec2(sin(t * (0.05 + 0.05 * a) + b * 6.28), sin(t * (0.04 + 0.05 * b) + a * 6.28));
      float radius = mix(0.6, 1.5, a * a);
      float speck = smoothstep(radius + 0.9, radius - 0.4, length(f - centre) * cell);
      if (speck <= 0.0) continue;
      float depth = mix(0.4, 2.6, b);
      vec2 behind = (id + centre - float(layer) * 17.0) * cell * uvPerPx - depth * uSunDir.xy / max(uSunDir.z, 0.2) / uView;
      float glint = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(t * (0.6 + b) + a * 6.28), 4.0);
      sum += speck * glint * lightAt(behind);
    }
    return sum;
  }

  void main() {
    vec4 mask = texture2D(tMask, vUv);
    vec2 p = (vUv - 0.5) * uView;

    // Plaster: where the sun falls, it picks out the bumps, more so the lower it is.
    vec2 q = p * 7.0;
    float e = 0.3;
    vec2 slope = vec2(plaster(q + vec2(e, 0.0)) - plaster(q - vec2(e, 0.0)), plaster(q + vec2(0.0, e)) - plaster(q - vec2(0.0, e))) / (2.0 * e);
    float rake = clamp(1.0 - 0.2 * dot(slope, uSunDir.xy) / max(uSunDir.z, 0.35), 0.7, 1.3);

    vec3 extra = lamp(p);
    vec3 light = sunlight(mask) * (1.0 - birds(p));
    vec3 colour = lit(light, mask.b, rake, extra);
    colour += uSun * uStrength * dust(gl_FragCoord.xy / uPixelRatio, uPixelRatio / uResolution, uTime) * uDust;

    // The rainbow, from a bevelled pane low on the window: a short bar, its colours running across it.
    vec2 r = p - uPrism.xy;
    vec2 k = vec2(dot(r, uPrism.zw), dot(r, vec2(-uPrism.w, uPrism.z)));
    float bar = exp(-k.x * k.x / 0.3) * smoothstep(0.24, 0.1, abs(k.y));
    float hue = clamp(k.y / 0.24 * 0.5 + 0.5, 0.0, 1.0) * 0.75;
    vec3 spectrum = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    colour += uWall * spectrum * bar * uPrismStrength * (1.0 - 0.9 * mask.g) * (1.0 - 0.9 * mask.a);

    vec3 behind = screen(colour) / veil(mask, light, extra);
    behind += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(behind, 1.0);
  }
`;

const KEYS = DAY.map((key) => ({ ...key, sunRGB: linear(key.sun), skyRGB: linear(key.sky), wallRGB: linear(key.wall), inkRGB: rgb(key.ink) }));
const smooth = (x) => x * x * (3 - 2 * x);
const mix = (a, b, f) => a + (b - a) * f;
const mixArray = (a, b, f) => a.map((v, i) => mix(v, b[i], f));
const clamp = (x) => Math.min(1, Math.max(0, x));
const luma = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// The day at a point along the page, in sections, eased between keys.
export function dayAt(position) {
  const p = Math.min(KEYS.at(-1).at, Math.max(0, position));
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].at) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = clamp((p - a.at) / (b.at - a.at));
  const f = smooth(t);
  // Where the words turn from dark to light, they turn quickly, about when the wall goes dark.
  // Eased the whole way like the rest, they'd spend a while as grey as the wall, and a page with
  // a section between those keys would sit there.
  const inkF = Math.abs(luma(a.inkRGB) - luma(b.inkRGB)) > 0.5 ? smooth(clamp((t - 0.74) / 0.05)) : f;
  const day = { ink: mixArray(a.inkRGB, b.inkRGB, inkF), sun: mixArray(a.sunRGB, b.sunRGB, f), sky: mixArray(a.skyRGB, b.skyRGB, f), wall: mixArray(a.wallRGB, b.wallRGB, f) };
  for (const key of ["azimuth", "elevation", "strength", "exposure", "veil", "soft", "cloud", "prism", "clock"]) day[key] = mix(a[key], b[key], f);
  return day;
}

export const sunDirection = (azimuth, elevation, target = new THREE.Vector3()) =>
  target.set(Math.sin(azimuth * DEG) * Math.cos(elevation * DEG), Math.sin(elevation * DEG), Math.cos(azimuth * DEG) * Math.cos(elevation * DEG));

// How much cloud is over the sun at a moment: clear most of the time, with a cloud drifting
// across every minute or so.
function cloudOver(time) {
  const n = 0.5 + 0.3 * Math.sin(time * 0.071) + 0.2 * Math.sin(time * 0.193 + 1.3);
  return smooth(Math.min(1, Math.max(0, (n - 0.62) / 0.3)));
}

const pass = (fragmentShader, uniforms) => new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false });

// One canvas: its own WebGL context, drawing the light and shadow at the reduced size, spreading
// the leaves over the sun's disc, blurring, then finishing with `fragmentShader`. The uniforms
// are shared between the two canvases, apart from which texture each pass reads.
class Layer {
  constructor(container, fragmentShader, uniforms, pixelRatio) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(pixelRatio);
    container.appendChild(this.renderer.domElement);

    const ext = this.renderer.extensions;
    const type = ext.has("EXT_color_buffer_float") || ext.has("EXT_color_buffer_half_float") ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const target = () => new THREE.WebGLRenderTarget(1, 1, { type, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    this.a = target();
    this.b = target();

    const { scene } = uniforms;
    this.mask = pass(maskShader, { ...scene, ...uniforms.mask });
    this.disc = pass(discShader, { ...uniforms.disc, uView: scene.uView, tMap: { value: this.a.texture } });
    const blur = { ...uniforms.blur, uView: scene.uView, uSunDir: scene.uSunDir, uWinO: scene.uWinO, uWinN: scene.uWinN };
    this.across = pass(blurShader, { ...blur, tMap: { value: this.b.texture }, uStep: uniforms.across });
    this.down = pass(blurShader, { ...blur, tMap: { value: this.a.texture }, uStep: uniforms.down });
    this.finish = pass(fragmentShader, { ...scene, ...uniforms.finish, tMask: { value: this.b.texture } });

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mask);
    this.scene.add(this.quad);
  }

  setSize(width, height, maskWidth, maskHeight) {
    this.renderer.setSize(width, height, false);
    this.a.setSize(maskWidth, maskHeight);
    this.b.setSize(maskWidth, maskHeight);
  }

  draw(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.draw(this.mask, this.a);
    this.draw(this.disc, this.b);
    this.draw(this.across, this.a);
    this.draw(this.down, this.b);
    this.draw(this.finish, null);
  }

  dispose() {
    this.quad.geometry.dispose();
    for (const material of [this.mask, this.disc, this.across, this.down, this.finish]) material.dispose();
    this.a.dispose();
    this.b.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

// The lit wall, in `wall` behind the page, and the veil, in `veil` over it.
export class DaylightRoom {
  constructor(wall, veil) {
    this.container = wall;
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    this.avoid = [0, 0];

    const noon = DAY.find((key) => key.at === 3);
    const noonSun = sunDirection(noon.azimuth, noon.elevation);
    const landing = (x, y, reach) => new THREE.Vector3(x, y, 0).addScaledVector(noonSun, reach);
    this.windowBase = landing(-1, -1.2, WINDOW.reach);
    this.windowOrigin = this.windowBase.clone();
    this.windowAlong = new THREE.Vector3(Math.cos(YAW), 0, Math.sin(YAW));
    this.windowNormal = new THREE.Vector3(-Math.sin(YAW), 0, Math.cos(YAW));
    this.windowSpan = { half: 1, pane: 1 };
    this.birdOrigin = this.windowOrigin.clone().addScaledVector(this.windowNormal, BIRD_OUT);
    this.boughOrigin = landing(BOUGH.x, BOUGH.y, BOUGH.reach);
    this.oakOrigin = landing(OAK.x, OAK.y, OAK.reach);
    this.sunDir = new THREE.Vector3();
    this.prismPoint = new THREE.Vector3();
    this.bent = new THREE.Vector3();
    this.boughLeaves = leafTexture(1024, 7, BOUGH_LIMBS);
    this.oakLeaves = leafTexture();

    const v2 = () => ({ value: new THREE.Vector2() });
    const v3 = () => ({ value: new THREE.Vector3() });
    this.uniforms = {
      scene: {
        uView: { value: new THREE.Vector2(1, 1) },
        uSunDir: { value: this.sunDir },
        uTime: { value: 0 },
        uReveal: { value: 1 },
        uWinO: { value: this.windowOrigin },
        uWinN: { value: this.windowNormal },
        uWinU: { value: this.windowAlong },
        uWin: { value: new THREE.Vector4(1, 1, 1, WINDOW.bar) },
        uTransom: { value: new THREE.Vector2(WINDOW.transomY, WINDOW.transom) },
        uBlind: { value: new THREE.Vector4(BLINDS.pitch, 0.4, BLINDS.to, BLINDS.cords) },
        uSlat: { value: new THREE.Vector3(BLINDS.width / BLINDS.pitch, BLINDS.tilt, BLINDS.shut) },
        uSag: { value: BLINDS.sag },
      },
      mask: {
        uSoft: { value: 0.04 },
        uPixel: { value: 0.05 },
        uWind: { value: 1 },
        uBoughO: { value: this.boughOrigin },
        uBoughSize: { value: BOUGH.size },
        uBoughLeaves: { value: this.boughLeaves },
        uOakO: { value: this.oakOrigin },
        uOakSize: { value: OAK.size },
        uOakLeaves: { value: this.oakLeaves },
      },
      disc: { uSunAxis: v2(), uDiscBough: v2(), uDiscOak: v2() },
      blur: { uSigma: v3(), uNear: { value: NEAR } },
      across: { value: new THREE.Vector2() },
      down: { value: new THREE.Vector2() },
      finish: {
        uSun: v3(),
        uStrength: { value: 1 },
        uSky: v3(),
        uWall: v3(),
        uTint: { value: new THREE.Vector3().fromArray(TINT) },
        uFloor: { value: new THREE.Vector3().fromArray(FLOOR) },
        uExposure: { value: 2 },
        uVeil: { value: 0.6 },
        uLamp: { value: new THREE.Vector4() },
        uLampColour: { value: new THREE.Vector3().fromArray(LAMP_COLOUR) },
        uBirds: { value: [0, 1, 2, 3].map(() => new THREE.Vector4()) },
        uBirdFold: { value: [0, 0, 0, 0] },
        uBirdO: { value: this.birdOrigin },
        uBirdSoft: { value: BIRD_SUN },
      },
    };
    this.wall = new Layer(
      wall,
      wallShader,
      {
        ...this.uniforms,
        finish: {
          ...this.uniforms.finish,
          uPixelRatio: { value: this.pixelRatio },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uDust: { value: 0.55 },
          uPrism: { value: new THREE.Vector4() },
          uPrismStrength: { value: 0 },
        },
      },
      this.pixelRatio,
    );
    this.veil = new Layer(veil, veilShader, this.uniforms, 1);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(wall);
    this.resize();
  }

  // How wide the wall in view is, in the room's units.
  get width() {
    return this.uniforms.scene.uView.value.x;
  }

  // How wide the window is, which the birds cross.
  get windowWidth() {
    return 2 * this.uniforms.scene.uWin.value.x;
  }

  // Keeps the edges of the window's light from landing between `from` and `to` pixels in from
  // the sides of the wall, so they don't cut through something there; they move to whichever
  // end is nearer.
  keepOff(from, to) {
    if (from === this.avoid[0] && to === this.avoid[1]) return;
    this.avoid = [from, to];
    this.resize();
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    const mw = Math.max(1, Math.round(w * MASK_SCALE));
    const mh = Math.max(1, Math.round(h * MASK_SCALE));
    this.wall.setSize(w, h, mw, mh);
    this.veil.setSize(mw, mh, mw, mh);
    this.wall.finish.uniforms.uResolution.value.set(w * this.pixelRatio, h * this.pixelRatio);
    const viewW = (VIEW_H * w) / h;
    this.uniforms.scene.uView.value.set(viewW, VIEW_H);
    // The window's light fills the wall and runs past it either side, whatever the screen's shape
    // (`margin` of its width, negative so there's no shade down the sides), and is split
    // into an even number of panes so that a bar runs down the middle; a wider screen shows more
    // of them. The window is tall enough that, slanting across the wall as its light does, it
    // still runs off the top and bottom.
    const [from, to] = this.avoid;
    let margin = WINDOW.margin * w;
    if (margin > from && margin < to) margin = margin - from < to - margin ? from : to;
    const half = (viewW / 2) * (1 - (2 * margin) / w);
    const panes = 2 * Math.max(1, Math.round(half / WINDOW.pane));
    this.windowSpan = { half, pane: (2 * half) / panes };
    this.uniforms.scene.uWin.value.y = VIEW_H / 2 + 0.6 * half + 1;
    this.uniforms.mask.uPixel.value = VIEW_H / mh;
    this.uniforms.across.value.set(1 / mw, 0);
    this.uniforms.down.value.set(0, 1 / mh);
  }

  // Draws the wall at a point in the day, with whatever `life` (see life.js) has going on.
  render(day, life) {
    const L = sunDirection(day.azimuth, day.elevation, this.sunDir);
    const cloud = life.still ? 0 : day.cloud * cloudOver(life.time);
    const soft = day.soft * (1 + 1.4 * cloud);

    const s = this.uniforms.scene;
    s.uTime.value = life.time;
    s.uReveal.value = life.reveal;
    // How steeply the light comes through the window, seen side-on: what the slats catch.
    const U = this.windowAlong;
    const N = this.windowNormal;
    const through = Math.max(L.dot(N), 0.05);
    s.uBlind.value.y = L.y / through;
    // Left alone, the window's light would swing across the wall through the day, widening and
    // narrowing as it went. Instead the window is slid along its wall to keep its light in the
    // middle, and stretched across to keep it the same width, so the sun moves only the slant of
    // the slats, what they let through, and the leaves. `scale` is how far across the window a
    // step across the wall goes.
    const slant = L.dot(U) / through;
    const scale = U.x - N.x * slant;
    this.windowOrigin.copy(this.windowBase).addScaledVector(U, this.windowBase.dot(N) * slant - this.windowBase.dot(U));
    this.birdOrigin.copy(this.windowOrigin).addScaledVector(N, BIRD_OUT);
    s.uWin.value.x = this.windowSpan.half * scale;
    s.uWin.value.z = this.windowSpan.pane * scale;
    s.uWin.value.w = WINDOW.bar * scale;
    s.uBlind.value.w = BLINDS.cords * scale;

    const m = this.uniforms.mask;
    m.uSoft.value = soft;
    m.uWind.value = life.wind;
    const pixel = m.uPixel.value;
    this.uniforms.blur.uSigma.value.set((soft * BLUR.window) / pixel, BLUR.leaves, BLUR.glow / pixel);

    // The sun's disc over each layer of leaves: wider the further the leaves are along the
    // light, and stretched by the angle it meets the wall at.
    const d = this.uniforms.disc;
    const along = Math.hypot(L.x, L.y) || 1;
    d.uSunAxis.value.set(L.x / along, L.y / along);
    const size = SUN_SIZE * (1 + 2 * cloud);
    const bough = (this.boughOrigin.z / L.z) * size;
    const oak = (this.oakOrigin.z / L.z) * size;
    d.uDiscBough.value.set(bough / L.z, bough);
    d.uDiscOak.value.set(oak / L.z, oak);

    // The birds are given where they cross the window as seen along the light; carry each out
    // along it to the plane they fly in.
    const out = BIRD_OUT / L.dot(this.windowNormal);
    this.uniforms.finish.uBirdSoft.value = BIRD_SUN * (1 + 2 * cloud);
    this.uniforms.finish.uBirds.value.forEach((v, i) => {
      const bird = life.birds[i];
      if (bird) v.set(bird.x + out * L.dot(this.windowAlong), bird.y + out * L.y, bird.size, bird.beat);
      else v.set(0, 0, 0, 0);
      this.uniforms.finish.uBirdFold.value[i] = bird ? bird.fold : 0;
    });

    const f = this.uniforms.finish;
    f.uSun.value.fromArray(day.sun);
    f.uSky.value.fromArray(day.sky);
    f.uWall.value.fromArray(day.wall);
    f.uStrength.value = day.strength * (1 - 0.75 * cloud);
    f.uExposure.value = day.exposure;
    f.uVeil.value = day.veil;
    f.uLamp.value.set(LAMP.x * this.width, LAMP.y, LAMP.z, life.lamp);

    // Where the bevelled pane's rainbow lands: its spot on the window, carried along the bent light to the wall.
    const B = this.bent.set(L.x * PRISM.bend[0], L.y * PRISM.bend[1], L.z);
    const q = this.prismPoint.copy(this.windowOrigin).addScaledVector(U, PRISM.u * s.uWin.value.x);
    q.y += PRISM.v;
    const spread = Math.hypot(B.x, B.y) || 1;
    const w = this.wall.finish.uniforms;
    w.uPrism.value.set(q.x - (B.x * q.z) / B.z, q.y - (B.y * q.z) / B.z, -B.x / spread, -B.y / spread);
    w.uPrismStrength.value = 0.4 * day.prism * (1 - cloud);
    w.uDust.value = life.still ? 0 : 0.55;

    this.wall.render();
    this.veil.render();
  }

  dispose() {
    this.resizeObserver.disconnect();
    this.wall.dispose();
    this.veil.dispose();
    this.boughLeaves.dispose();
    this.oakLeaves.dispose();
  }
}
