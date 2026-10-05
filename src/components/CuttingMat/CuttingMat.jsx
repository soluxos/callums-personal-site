// A self-healing cutting mat drawn behind every page except the ideas board: a fine grid with heavier
// lines every fifth square, rulers along the top and left edges, and the angle
// guides mats print in one corner. Purely decorative, so it ignores the pointer and
// is hidden from screen readers. Kept faint so it never competes with the content.

// Shared with MatCuts, which redraws the grid where a cut pushes it apart.
export const MINOR = 20; // px between fine lines
export const MAJOR = MINOR * 5; // px between numbered lines

const LINE = "72, 72, 72"; // the site's text colour, as rgb for the alpha below
export const MINOR_LINE = `rgba(${LINE}, 0.03)`;
export const MAJOR_LINE = `rgba(${LINE}, 0.06)`;
export const MAT_SURFACE = "#f5f5f5"; // SiteShell's background, which the mat sits on
const TICK = `rgba(${LINE}, 0.2)`;

// Enough numbers for very wide screens and long pages; the layer clips the rest.
const COLUMNS = 40;
const ROWS = 140;

const gridStyle = {
  backgroundImage: [
    `linear-gradient(to right, ${MAJOR_LINE} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${MAJOR_LINE} 1px, transparent 1px)`,
    `linear-gradient(to right, ${MINOR_LINE} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${MINOR_LINE} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: `${MAJOR}px ${MAJOR}px, ${MAJOR}px ${MAJOR}px, ${MINOR}px ${MINOR}px, ${MINOR}px ${MINOR}px`,
};

// Short ticks at every fine line, long ones at every numbered line.
const topTicks = {
  backgroundImage: [
    `linear-gradient(to right, ${TICK} 1px, transparent 1px)`,
    `linear-gradient(to right, ${TICK} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: `${MAJOR}px 10px, ${MINOR}px 5px`,
  backgroundRepeat: "repeat-x",
};
const leftTicks = {
  backgroundImage: [
    `linear-gradient(to bottom, ${TICK} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${TICK} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: `10px ${MAJOR}px, 5px ${MINOR}px`,
  backgroundRepeat: "repeat-y",
};

const NUMBER = "absolute text-[9px] font-medium leading-none tabular-nums text-[#bdbdbd]";

// Angle guides: lines at 30°, 45° and 60° rising from the left edge, with two arcs.
const GUIDE_SIZE = 480;
const ANGLES = [30, 45, 60];

function AngleGuides() {
  const r = GUIDE_SIZE - 40;
  return (
    <svg
      width={GUIDE_SIZE}
      height={GUIDE_SIZE}
      viewBox={`0 0 ${GUIDE_SIZE} ${GUIDE_SIZE}`}
      className="absolute left-0 top-[calc(100svh-520px)] hidden md:block"
      fill="none"
    >
      <g stroke={`rgba(${LINE}, 0.1)`} strokeWidth="1" strokeDasharray="4 4">
        {ANGLES.map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1="0"
              y1={GUIDE_SIZE}
              x2={Math.cos(rad) * r}
              y2={GUIDE_SIZE - Math.sin(rad) * r}
            />
          );
        })}
        <path d={`M 200 ${GUIDE_SIZE} A 200 200 0 0 0 0 ${GUIDE_SIZE - 200}`} />
        <path d={`M ${r} ${GUIDE_SIZE} A ${r} ${r} 0 0 0 0 ${GUIDE_SIZE - r}`} />
      </g>
      <g fill="#bdbdbd" fontSize="9" fontWeight="500">
        {ANGLES.map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <text
              key={angle}
              x={Math.cos(rad) * (r + 12)}
              y={GUIDE_SIZE - Math.sin(rad) * (r + 12)}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {angle}°
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export default function CuttingMat({ showAngleGuides = true }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={gridStyle}
    >
      {/* Top ruler */}
      <div className="absolute inset-x-0 top-0 h-[10px]" style={topTicks} />
      {Array.from({ length: COLUMNS }, (_, i) => i + 1).map(n => (
        <span key={`x${n}`} className={NUMBER} style={{ top: 13, left: n * MAJOR + 3 }}>
          {n}
        </span>
      ))}

      {/* Left ruler */}
      <div className="absolute inset-y-0 left-0 w-[10px]" style={leftTicks} />
      {Array.from({ length: ROWS }, (_, i) => i + 1).map(n => (
        <span key={`y${n}`} className={NUMBER} style={{ top: n * MAJOR + 3, left: 13 }}>
          {n}
        </span>
      ))}

      {showAngleGuides && <AngleGuides />}

      {/* Self-healing cuts are drawn in here by MatCuts. */}
      <div id="mat-cuts" className="absolute inset-0" />
    </div>
  );
}
