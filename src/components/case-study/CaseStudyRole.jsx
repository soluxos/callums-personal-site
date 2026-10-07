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
 * as well as its heading. On wide screens the groups sit side by side, each
 * taking room in proportion to how many notes it has; on narrower ones they stack.
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
const TILTS = [-1.8, 1.2, -0.6, 2, -1.3, 0.7, -2.2, 1.5];

const GROUPS = [
  { key: "owned", title: "What I owned", colour: YELLOW },
  { key: "shared", title: "What I shared", colour: ORANGE },
  { key: "others", title: "What others did", colour: BLUE },
];

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
    <section id="my-role" className="flex flex-col gap-10 scroll-mt-8">
      <div className="flex flex-col gap-4">
        <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">My role</h2>
        <p className="max-w-[588px] text-[14px] font-medium leading-[1.5] text-[#656565]">
          {summary}
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-10">
        {GROUPS.filter(({ key }) => lists[key].length > 0).map(({ key, title, colour }) => (
          <div
            key={key}
            className="flex flex-col gap-6 lg:min-w-[164px] lg:basis-0"
            // Side by side, a group with more notes gets more of the row.
            style={{ flexGrow: lists[key].length }}
          >
            <div className="flex items-center gap-3">
              <h3 className="font-ppmondwest text-[20px] leading-[1.25] text-[#484848]">{title}</h3>
              <span className="rounded-full bg-black/[0.06] px-2 text-[12px] font-semibold leading-[20px] text-[#656565]">
                {lists[key].length}
              </span>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-7">
              {lists[key].map(item => {
                const i = n++;
                const { bg, shadow } = colour;
                return (
                  <li
                    key={item}
                    // Square, but free to grow taller if the text needs it.
                    className="relative aspect-square w-[148px] rotate-[var(--tilt)] rounded-[4px] px-3.5 pt-6 pb-4 sm:w-[164px] transition-[rotate,translate] duration-300 ease-out hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none"
                    style={{
                      background: bg,
                      boxShadow: `0 4px 18px ${shadow}, 0 1px 3px rgba(0,0,0,0.10)`,
                      "--tilt": `${TILTS[i % TILTS.length]}deg`,
                    }}
                  >
                    <Tape />
                    <p className="text-[12px] font-medium leading-[1.45] text-[#2a2a2a]">{item}</p>
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
