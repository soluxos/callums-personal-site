export const PALETTE = [
  "#FF4006",
  "#0090ff",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
];

export const ADJECTIVES = [
  "Happy",
  "Swift",
  "Bright",
  "Calm",
  "Bold",
  "Keen",
  "Warm",
  "Cool",
  "Wise",
  "Crisp",
  "Ingenious",
  "Scrupulous",
];

export const NOUNS = [
  "Panda",
  "Eagle",
  "Tiger",
  "Koala",
  "Fox",
  "Owl",
  "Lynx",
  "Wolf",
  "Bear",
  "Raven",
  "Weasel",
  "Rat",
];

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomName() {
  return `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)}`;
}

export function initials(name) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

export const textStyle = {
  color: "#fff",
  fontSize: 14,
  fontFamily: "var(--font-satoshi), Satoshi, sans-serif",
  fontWeight: 500,
  lineHeight: 1.25,
};
