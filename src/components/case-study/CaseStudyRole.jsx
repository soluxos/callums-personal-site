/**
 * CaseStudyRole
 *
 * The "My role" section. Always the first thing in a case study's <main>, and
 * always outside any PasswordGate, so a reader can tell what Callum owned
 * before anything else.
 *
 * Props:
 *  - summary: string — one or two sentences: did I design it, build it, or join for one part?
 *  - owned:   string[] — things I did, start to finish
 *  - shared:  string[] — things I did with other people (say who)
 *  - others:  string[] — other people's work that appears in the story
 *  - note:    optional string — small print under the columns
 */
const COLUMNS = [
  { key: "owned", label: "What I owned", dot: "bg-[#0090ff]" },
  { key: "shared", label: "What I shared", dot: "bg-[#929292]" },
  { key: "others", label: "What others did", dot: "bg-[#d0d0d0]" },
];

export default function CaseStudyRole({ summary, owned = [], shared = [], others = [], note }) {
  const lists = { owned, shared, others };

  return (
    <section id="my-role" className="flex flex-col gap-10 scroll-mt-8">
      <div className="flex flex-col gap-4">
        <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">My role</h2>
        <p className="max-w-[720px] text-[18px] font-medium leading-[1.5] text-[#484848]">
          {summary}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.filter(({ key }) => lists[key].length > 0).map(({ key, label, dot }) => (
          <div key={key} className="flex flex-col gap-4 rounded-[8px] bg-[#ededed] p-5">
            <p className="font-ppmondwest text-[20px] leading-[1.25] text-[#484848]">{label}</p>
            <ul className="flex flex-col gap-3">
              {lists[key].map(item => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[14px] font-medium leading-[1.5] text-[#656565]"
                >
                  <span className={`mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full ${dot}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {note && (
        <p className="max-w-[720px] text-[13px] font-medium leading-[1.5] text-[#6b6b6b]">{note}</p>
      )}
    </section>
  );
}
