import Link from "next/link";
import ideas from "@/data/ideas";

const STICKY_COLORS = {
  yellow: {
    bg: "oklch(0.92 0.18 82.45 / 1)",
    border: "oklch(0.6 0.18 82.45 / 1)",
    shadow: "rgba(249,207,0,0.25)",
  },
  pink: {
    bg: "oklch(0.92 0.18 2.45 / 1)",
    border: "oklch(0.6 0.18 2.45 / 1)",
    shadow: "rgba(233,30,140,0.18)",
  },
  blue: {
    bg: "oklch(0.92 0.18 -100.55 / 1)",
    border: "oklch(0.6 0.18 -100.55 / 1)",
    shadow: "rgba(33,150,243,0.18)",
  },
  green: {
    bg: "oklch(0.92 0.18 151.45 / 1)",
    border: "oklch(0.6 0.18 151.45 / 1)",
    shadow: "rgba(76,175,80,0.18)",
  },
  orange: {
    bg: "oklch(0.92 0.18 51.45 / 1)",
    border: "oklch(0.6 0.18 51.45 / 1)",
    shadow: "rgba(255,152,0,0.22)",
  },
  purple: {
    bg: "oklch(0.92 0.18 290.45 / 1)",
    border: "oklch(0.6 0.18 290.45 / 1)",
    shadow: "rgba(156,39,176,0.18)",
  },
};

const FONT = "var(--font-satoshi), Satoshi, sans-serif";

function TapeStrip() {
  return (
    <div
      style={{
        position: "absolute",
        top: -9,
        left: "50%",
        transform: "translateX(-50%)",
        width: 48,
        height: 16,
        background: "rgba(255,255,255,0.55)",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    />
  );
}

function StickyNotePreview({ note }) {
  const colors = STICKY_COLORS[note.color] ?? STICKY_COLORS.yellow;
  const len = note.text.length;
  // Scale font down for longer text: 13px baseline, down to 10px for very long
  const fontSize = len > 200 ? 16 : len > 120 ? 14 : len > 60 ? 12 : 14;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        background: colors.bg,
        // border: `1.5px solid ${colors.border}`,
        borderRadius: 4,
        padding: "28px 14px 26px",
        boxShadow: `0 4px 18px ${colors.shadow}, 0 1px 3px rgba(0,0,0,0.10)`,
        transform: `rotate(${note.rotation}deg)`,
        transformOrigin: "center center",
        fontFamily: FONT,
        boxSizing: "border-box",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <TapeStrip />
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: "1.55",
          color: "#2a2a2a",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontWeight: 500,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 7,
          WebkitBoxOrient: "vertical",
        }}
      >
        {note.text}
      </p>
      {note.author && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 12,
            fontSize: 10,
            fontWeight: 500,
            color: "rgba(0,0,0,0.45)",
            fontFamily: FONT,
          }}
        >
          {note.author}
        </div>
      )}
    </div>
  );
}

export default function HomeStickyNotes() {
  const latest = [...ideas].slice(-4).reverse();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Ideas</h2>
        <Link
          href="/ideas"
          className="text-[13px] font-medium text-[#6b6b6b] hover:text-[#2a2a2a] transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {latest.map(note => (
          <Link key={note.id} href="/ideas" className="block">
            <StickyNotePreview note={note} />
          </Link>
        ))}
      </div>
    </section>
  );
}
