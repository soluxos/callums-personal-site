// The day the v4 room passes through: a key for each section of a seven-section page, as in v2.
// A page with more or fewer sections spreads the same day across them (see `LitRoom`). Kept apart
// from the room so a page can print its times without loading three.js.
export const DAY = [
  { at: 0, azimuth: 56, elevation: 16, sun: "#ffd9b0", strength: 1.45, sky: "#9ea5b3", wall: "#f4f1ec", exposure: 1.7, veil: 0.6, soft: 0.05, cloud: 0.2, prism: 0.5, ink: "#2b2926", clock: 6.2 },
  { at: 1, azimuth: 56, elevation: 16, sun: "#ffd9b0", strength: 1.45, sky: "#9ea5b3", wall: "#f4f1ec", exposure: 1.7, veil: 0.6, soft: 0.05, cloud: 0.2, prism: 0.5, ink: "#2b2926", clock: 6.2 },
  { at: 2, azimuth: 52, elevation: 24, sun: "#fff0dc", strength: 1.5, sky: "#a4aab6", wall: "#f6f3ef", exposure: 1.8, veil: 0.6, soft: 0.045, cloud: 0.35, prism: 0.7, ink: "#2b2926", clock: 9.5 },
  { at: 3, azimuth: 47, elevation: 31, sun: "#fff8ee", strength: 1.5, sky: "#a9adb5", wall: "#f7f4f0", exposure: 1.9, veil: 0.6, soft: 0.04, cloud: 0.5, prism: 0.5, ink: "#2a2826", clock: 12.5 },
  { at: 4, azimuth: 43, elevation: 19, sun: "#ffb27a", strength: 1.65, sky: "#9c8d93", wall: "#f6ece4", exposure: 1.7, veil: 0.6, soft: 0.05, cloud: 0.2, prism: 1, ink: "#3a2519", clock: 17 + 35 / 60 },
  { at: 5, azimuth: 41, elevation: 12, sun: "#ff8a5a", strength: 0.8, sky: "#5f5568", wall: "#efe6e2", exposure: 1.25, veil: 0.4, soft: 0.06, cloud: 0.1, prism: 0.3, ink: "#f4ebe6", clock: 20 + 5 / 60 },
  { at: 6, azimuth: 44, elevation: 17, sun: "#a9bde0", strength: 0.34, sky: "#323a48", wall: "#e6e9ee", exposure: 1.2, veil: 0.5, soft: 0.065, cloud: 0, prism: 0, ink: "#e3e8f0", clock: 23 + 10 / 60 },
];

const pad = (n) => String(n).padStart(2, "0");
export const clockText = (hours) => `${pad(Math.floor(hours) % 24)}:${pad(Math.floor((hours % 1) * 60))}`;

// The hour on the clock at a point along the day, in keys, eased between them as the room eases.
export function clockAt(position) {
  const p = Math.min(DAY.length - 1, Math.max(0, position));
  const i = Math.min(DAY.length - 2, Math.floor(p));
  const f = p - i;
  return DAY[i].clock + (DAY[i + 1].clock - DAY[i].clock) * f * f * (3 - 2 * f);
}

// Where a section of a page with `count` of them sits in the day, in keys.
export const dayPosition = (section, count) => (count > 1 ? (section * (DAY.length - 1)) / (count - 1) : 0);

// The time on the clock as each of a page's `count` sections sits centred, for printing.
export const sectionTimes = (count) => Array.from({ length: count }, (_, i) => clockText(clockAt(dayPosition(i, count))));

// Where in the day a time on the clock falls, in keys: `clockAt` the other way round. The small
// hours are night, and from half past four it's first light.
export function positionAt(hours) {
  const h = ((hours % 24) + 24) % 24;
  const last = DAY.length - 1;
  if (h >= DAY[last].clock || h < 4.5) return last;
  if (h <= DAY[1].clock) return 1;
  let i = 1;
  while (i < last - 1 && h > DAY[i + 1].clock) i++;
  const share = (h - DAY[i].clock) / (DAY[i + 1].clock - DAY[i].clock);
  // Undo the easing clockAt puts on it.
  let low = 0;
  let high = 1;
  for (let step = 0; step < 20; step++) {
    const f = (low + high) / 2;
    if (f * f * (3 - 2 * f) < share) low = f;
    else high = f;
  }
  return i + (low + high) / 2;
}
