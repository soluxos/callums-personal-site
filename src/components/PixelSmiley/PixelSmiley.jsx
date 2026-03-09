"use client";

// 32×32 grid, each pixel = 3px → renders at 96×96
// centre of circle = (15.5, 15.5), outer-r = 13.5, inner-r = 11.5
const P = 3;

const FACE_BORDER = [
  [2, 12],
  [2, 13],
  [2, 14],
  [2, 15],
  [2, 16],
  [2, 17],
  [2, 18],
  [2, 19],
  [3, 10],
  [3, 11],
  [3, 20],
  [3, 21],
  [4, 8],
  [4, 9],
  [4, 22],
  [4, 23],
  [5, 7],
  [5, 24],
  [6, 6],
  [6, 25],
  [7, 5],
  [7, 26],
  [8, 4],
  [8, 27],
  [9, 3],
  [9, 28],
  [10, 3],
  [10, 28],
  [11, 2],
  [11, 29],
  [12, 2],
  [12, 29],
  [13, 2],
  [13, 29],
  [14, 2],
  [14, 29],
  [15, 2],
  [15, 29],
  [16, 2],
  [16, 29],
  [17, 2],
  [17, 29],
  [18, 2],
  [18, 29],
  [19, 2],
  [19, 29],
  [20, 2],
  [20, 29],
  [21, 3],
  [21, 28],
  [22, 3],
  [22, 28],
  [23, 4],
  [23, 27],
  [24, 5],
  [24, 26],
  [25, 6],
  [25, 25],
  [26, 7],
  [26, 24],
  [27, 8],
  [27, 9],
  [27, 22],
  [27, 23],
  [28, 10],
  [28, 11],
  [28, 20],
  [28, 21],
  [29, 12],
  [29, 13],
  [29, 14],
  [29, 15],
  [29, 16],
  [29, 17],
  [29, 18],
  [29, 19],
];

// left eyebrow
const LEFT_BROW = [
  [9, 9],
  [9, 10],
  [9, 11],
  [9, 12],
];
// right eyebrow (static – animates up when winking)
const RIGHT_BROW = [
  [9, 19],
  [9, 20],
  [9, 21],
  [9, 22],
];

// left eye – always visible (3 wide × 4 tall)
const LEFT_EYE = [
  [10, 9],
  [10, 10],
  [10, 11],
  [11, 9],
  [11, 10],
  [11, 11],
  [12, 9],
  [12, 10],
  [12, 11],
  [13, 9],
  [13, 10],
  [13, 11],
];

// smile – U-shape
const SMILE = [
  [21, 10],
  [21, 21],
  [22, 10],
  [22, 21],
  [23, 11],
  [23, 12],
  [23, 13],
  [23, 14],
  [23, 15],
  [23, 16],
  [23, 17],
  [23, 18],
  [23, 19],
  [23, 20],
];

// right eye open
const RIGHT_EYE_OPEN = [
  [10, 20],
  [10, 21],
  [10, 22],
  [11, 20],
  [11, 21],
  [11, 22],
  [12, 20],
  [12, 21],
  [12, 22],
  [13, 20],
  [13, 21],
  [13, 22],
];

// right eye wink (thin squint line)
const RIGHT_EYE_WINK = [
  [12, 18],
  [12, 19],
  [12, 20],
  [12, 21],
  [12, 22],
  [12, 23],
];

const STATIC = [...FACE_BORDER, ...LEFT_BROW, ...LEFT_EYE, ...SMILE];

export default function PixelSmiley({ size = 96, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      <style>{`
        .ps-rbrow      { animation: ps-brow  5s ease-in-out infinite; }
        .ps-eye-open   { animation: ps-wink  5s ease-in-out infinite; }
        .ps-eye-wink   { animation: ps-wink-show 5s ease-in-out infinite; opacity: 0; }
        @keyframes ps-brow {
          0%,78%,100% { transform: translateY(0); }
          85%,95%     { transform: translateY(-${P}px); }
        }
        @keyframes ps-wink {
          0%,78%,100% { opacity: 1; }
          85%,95%     { opacity: 0; }
        }
        @keyframes ps-wink-show {
          0%,78%,100% { opacity: 0; }
          85%,95%     { opacity: 1; }
        }
      `}</style>

      {/* Static: face + left eye + smile + left brow */}
      {STATIC.map(([r, c]) => (
        <rect key={`s-${r}-${c}`} x={c * P} y={r * P} width={P} height={P} rx="0.5" fill={color} />
      ))}

      {/* Right eyebrow – rises when winking */}
      <g className="ps-rbrow" style={{ transformOrigin: `${21 * P}px ${9 * P}px` }}>
        {RIGHT_BROW.map(([r, c]) => (
          <rect
            key={`rb-${r}-${c}`}
            x={c * P}
            y={r * P}
            width={P}
            height={P}
            rx="0.5"
            fill={color}
          />
        ))}
      </g>

      {/* Right eye open */}
      <g className="ps-eye-open">
        {RIGHT_EYE_OPEN.map(([r, c]) => (
          <rect
            key={`ro-${r}-${c}`}
            x={c * P}
            y={r * P}
            width={P}
            height={P}
            rx="0.5"
            fill={color}
          />
        ))}
      </g>

      {/* Right eye wink */}
      <g className="ps-eye-wink">
        {RIGHT_EYE_WINK.map(([r, c]) => (
          <rect
            key={`rw-${r}-${c}`}
            x={c * P}
            y={r * P}
            width={P}
            height={P}
            rx="0.5"
            fill={color}
          />
        ))}
      </g>
    </svg>
  );
}
