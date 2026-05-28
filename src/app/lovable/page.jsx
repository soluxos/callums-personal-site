import Link from "next/link";

// Fine diagonal lines at 45°
function DiagonalPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diag" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6 L6 0" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)" />
    </svg>
  );
}

// Tiny plus signs in a grid
function PlusPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="plus" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 6 L8 10 M6 8 L10 8" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#plus)" />
    </svg>
  );
}

// Small quarter-circle arcs tiling
function ArcPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="arc" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 12 A12 12 0 0 1 12 0" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arc)" />
    </svg>
  );
}

// Fine horizontal lines
function LinePattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hline" x="0" y="0" width="8" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 2.5 L8 2.5" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hline)" />
    </svg>
  );
}

const patterns = [DiagonalPattern, PlusPattern, ArcPattern, LinePattern];

export default function LovablePage() {
  const studies = [
    {
      slug: "drupal-canvas",
      title: "Drupal Canvas",
      description: "A node-based design system editor for Drupal CMS",
      meta: "Sr. Product Designer & Engineer · 2025",
      slides: 10,
    },
    {
      slug: "command-center",
      title: "Command Center",
      description: "A centralized operations dashboard for complex environments",
      meta: "Product Designer · 2024",
      slides: 9,
    },
    {
      slug: "union-roasted",
      title: "Union Roasted",
      description: "Premium e-commerce for a specialty coffee brand",
      meta: "Designer & Developer · 2018",
      slides: 10,
    },
    {
      slug: "templates",
      title: "Templates",
      description: "Browse all 17 available slide types with placeholder data",
      meta: "Reference",
      slides: 17,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 bg-white px-6 py-24">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-ppmondwest text-[48px] leading-[1.2] text-[#1a1a1a]">Lovable</h1>
        <p className="max-w-[420px] text-center text-[15px] leading-[1.6] text-[#929292]">
          Case studies presented as interactive slide decks.
        </p>
      </div>

      <div className="flex items-end justify-center gap-5">
        {studies.map((study, i) => {
          const Pattern = patterns[i];
          return (
            <Link
              key={study.slug}
              href={`/lovable/${study.slug}`}
              className="group relative flex h-[420px] w-[280px] shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-[#e4e4e4] bg-[#f6f6f6] transition-all duration-200 hover:-translate-y-2 hover:border-[#d0d0d0] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
            >
              {/* Repeating pattern */}
              <div className="absolute inset-0 text-[#e8e8e8] transition-colors duration-200 group-hover:text-[#dcdcdc]">
                <Pattern />
              </div>

              {/* Slide count badge - top left */}
              <span className="absolute top-4 left-4 z-10 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#929292] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                {study.slides} slides
              </span>

              {/* Card info */}
              <div className="relative z-10 flex flex-col gap-2 px-6 pb-6">
                <h2 className="font-ppmondwest text-[18px] leading-[1.3] text-[#1a1a1a]">
                  {study.title}
                </h2>
                <p className="text-[13px] leading-[1.5] text-[#6b6b6b]">
                  {study.description}
                </p>
                <span className="mt-1 text-[11px] text-[#a0a0a0]">{study.meta}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
