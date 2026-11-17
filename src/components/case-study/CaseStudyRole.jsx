/**
 * CaseStudyRole
 *
 * The "My role" section. Always the first thing in a case study's <main>, and
 * always outside any PasswordGate, so a reader can tell what Callum owned
 * before anything else.
 *
 * Every item is a post-it, styled like the notes on the ideas canvas: the same
 * colours, tape, coloured shadow and slight tilt. Each group has its own colour
 * (yellow for what I owned, orange for what I shared, blue for what others did)
 * as well as its heading.
 *
 * Every note is the same size and sits on one shared grid: six columns on wide
 * screens, four on tablets, two on phones. A group is as wide as its notes, so
 * short groups share a row and every note lines up with the ones above it.
 *
 * Props:
 *  - summary: string — one or two sentences: did I design it, build it, or join for one part?
 *  - owned:   string[] — things I did, start to finish
 *  - shared:  string[] — things I did with other people (say who)
 *  - others:  string[] — other people's work that appears in the story
 *  - note:    optional string — small print under the notes
 */

// The ideas canvas's post-it colours, with the shadow tinted to match each one.
const YELLOW = { bg: "oklch(0.92 0.18 82.45)", shadow: "rgba(249,207,0,0.25)" };
const ORANGE = { bg: "oklch(0.92 0.18 51.45)", shadow: "rgba(255,152,0,0.22)" };
const BLUE = { bg: "oklch(0.92 0.18 -100.55)", shadow: "rgba(33,150,243,0.18)" };

// Small, uneven tilts, like notes stuck up by hand.
const TILTS = [-1.2, 0.8, -0.5, 1.3, -0.9, 0.5, -1.4, 1];

const GROUPS = [
  { key: "owned", title: "What I owned", colour: YELLOW },
  { key: "shared", title: "What I shared", colour: ORANGE },
  { key: "others", title: "What others did", colour: BLUE },
];

// The gap between columns. The groups and the notes inside them use the same one, which is
// what keeps every note on the same columns.
const GAP = "gap-x-4 md:gap-x-5 xl:gap-x-6";

function Tape() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-[7px] left-1/2 h-[14px] w-10 -translate-x-1/2 rounded-[2px] border border-black/[0.07] bg-white/55 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
    />
  );
}

export default function CaseStudyRole({ summary, owned = [], shared = [], others = [], note }) {
  const lists = { owned, shared, others };
  // Count across groups, so the tilts keep varying instead of each group repeating
  // the same pattern.
  let n = 0;

  return (
    <section id="my-role" className="flex flex-col gap-12 scroll-mt-8">
      <div className="flex flex-col gap-4">
        <h2 className="font-ppmondwest text-[24px] leading-[1.25] text-[#484848]">My role</h2>
        <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
          {summary}
        </p>
      </div>

      <div className={`grid grid-cols-2 gap-y-12 md:grid-cols-4 xl:grid-cols-6 ${GAP}`}>
        {GROUPS.filter(({ key }) => lists[key].length > 0).map(({ key, title, colour }) => (
          <div
            key={key}
            className="col-span-full flex flex-col gap-5 md:[grid-column:span_var(--four)] xl:[grid-column:span_var(--six)]"
            // How many columns the group takes: one per note, up to a full row.
            style={{
              "--four": Math.min(lists[key].length, 4),
              "--six": Math.min(lists[key].length, 6),
            }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-ppmondwest text-[20px] leading-[1.25] text-[#484848]">{title}</h3>
              <span className="rounded-full bg-card px-2 text-[12px] font-semibold leading-[20px] text-[#656565]">
                {lists[key].length}
              </span>
            </div>

            <ul
              className={`grid grid-cols-2 gap-y-6 md:auto-rows-fr md:[grid-template-columns:repeat(var(--four),minmax(0,1fr))] xl:[grid-template-columns:repeat(var(--six),minmax(0,1fr))] ${GAP}`}
            >
              {lists[key].map(item => {
                const i = n++;
                const { bg, shadow } = colour;
                return (
                  <li
                    key={item}
                    // Square from tablet width up (the empty ::before holds the note open to its own
                    // width), and free to grow if the text needs it; the row then grows with it, so
                    // every note in a group stays the same size. On phones a note is only as tall as
                    // its text, so the work isn't pushed far down.
                    className="relative min-h-[96px] rotate-[var(--tilt)] rounded-[4px] px-4 pt-6 pb-4 transition-[rotate,translate] duration-300 ease-out hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none md:grid md:min-h-0 md:before:[grid-area:1/1] md:before:pb-[calc(100%-8px)] md:before:content-['']"
                    style={{
                      background: bg,
                      // Dark ink on the note, whatever colour the text around it is.
                      color: "#2a2a2a",
                      boxShadow: `0 4px 18px ${shadow}, 0 1px 3px rgba(0,0,0,0.10)`,
                      "--tilt": `${TILTS[i % TILTS.length]}deg`,
                    }}
                  >
                    <Tape />
                    <p className="text-[12px] font-medium leading-[1.5] md:[grid-area:1/1] xl:text-[13px]">
                      {item}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {note && (
        <p className="max-w-[588px] text-[13px] font-medium leading-[1.5] text-[#6b6b6b]">{note}</p>
      )}
    </section>
  );
}
