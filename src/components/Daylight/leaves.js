import * as THREE from "three";
import { makeRandom } from "./random";

// Five limbs reaching in from the top and right.
const OAK = [
  [1.03, 0.04, 2.55, 0.85],
  [1.03, 0.36, 2.95, 0.72],
  [0.62, -0.03, 2.05, 0.62],
  [1.03, 0.66, 3.25, 0.6],
  [0.28, -0.03, 1.75, 0.45],
];

// The tree outside the window, drawn once as a silhouette: an English oak, its limbs reaching
// in from the top and right and drooping as they go, crooked twigs, and lobed leaves bunched at
// the twig ends with sky between the bunches. Only the alpha matters; it's what the sun has to get past.
// Each limb is [x, y, angle, length], as fractions of the texture's size. `keep` is the share of
// the bunches of leaves still on it, for an oak in winter holding on to a few dry ones; the limbs
// and the bunches left are the same whatever it is.
export function leafTexture(size = 1024, seed = 23, limbs = OAK, keep = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d");
  const rand = makeRandom(seed);
  const kept = makeRandom(seed + 1);
  g.fillStyle = g.strokeStyle = "#fff";
  g.lineCap = g.lineJoin = "round";

  // An oak leaf: widest past the middle, with four or five rounded lobes a side and a short stalk.
  const leaf = (x, y, angle, length, drawn) => {
    const lobes = rand.int(4, 5);
    if (!drawn) return;
    const steps = 30;
    const width = (t) => length * 0.3 * Math.sin(Math.PI * t ** 1.35) * (0.6 + 0.4 * Math.abs(Math.sin(t * lobes * Math.PI)));
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    g.beginPath();
    g.moveTo(0, 0);
    for (let i = 0; i <= steps; i++) g.lineTo((i / steps) * length, -width(i / steps));
    for (let i = steps; i >= 0; i--) g.lineTo((i / steps) * length, width(i / steps));
    g.fill();
    g.lineWidth = length * 0.04;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(-length * 0.12, 0);
    g.stroke();
    g.restore();
  };

  const bunch = (x, y, angle, count) => {
    const drawn = kept.next() < keep;
    for (let k = 0; k < count; k++) {
      leaf(x, y, angle + rand.range(-1.7, 1.7), size * rand.range(0.022, 0.036), drawn);
    }
  };

  // Oak limbs grow in short straight runs with sudden kinks, and sag under their own weight.
  const branch = (x, y, angle, length, width, depth) => {
    const steps = Math.max(3, Math.round(length / 18));
    const step = length / steps;
    for (let i = 0; i < steps; i++) {
      angle += rand.range(-0.08, 0.08) + (rand.chance(0.22) ? rand.range(-0.45, 0.45) : 0);
      angle += (Math.PI / 2 - angle) * 0.012 * (4 - depth);
      const nx = x + Math.cos(angle) * step;
      const ny = y + Math.sin(angle) * step;
      g.lineWidth = Math.max(1.5, width * (1 - (0.55 * i) / steps));
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(nx, ny);
      g.stroke();
      x = nx;
      y = ny;
      if (depth > 0 && rand.chance(0.24)) {
        const side = rand.chance(0.5) ? -1 : 1;
        branch(x, y, angle + side * rand.range(0.5, 1.1), length * rand.range(0.4, 0.62), width * 0.62, depth - 1);
      }
      if (depth === 0 && rand.chance(0.25)) bunch(x, y, angle, rand.int(1, 2));
    }
    if (depth === 0) bunch(x, y, angle, rand.int(4, 7));
  };

  for (const [x, y, angle, length] of limbs) branch(x * size, y * size, angle, length * size, size * 0.02, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  return texture;
}
