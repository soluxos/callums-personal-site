export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// `lead` is the problem statement: the question the project answered. A section with one sets
// the question in large type, left aligned like the rest of the page, with room above and below
// so it stands on its own. The title sits over it as a small label, and whatever the page puts
// under it (a paragraph or two of context, two or three lines each) follows on the same edge.
export default function CaseStudySection({ title, lead, children }) {
  const id = slugify(title);

  if (lead) {
    return (
      <section
        id={id}
        className="flex scroll-mt-8 flex-col items-start gap-8 py-10 md:gap-10 md:py-20"
      >
        <div className="flex flex-col items-start gap-5">
          <h2 className="font-ppmondwest text-[20px] leading-[1.25] text-[#6b6b6b]">{title}</h2>
          <p className="max-w-[920px] text-balance font-ppmondwest text-[30px] leading-[1.25] text-[#2b2b2b] md:text-[44px] md:leading-[1.2]">
            {lead}
          </p>
        </div>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className="flex flex-col gap-10 scroll-mt-8">
      <h2 className="font-ppmondwest text-[24px] leading-[1.25] text-[#484848]">{title}</h2>
      {children}
    </section>
  );
}
