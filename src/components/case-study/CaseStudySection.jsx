export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CaseStudySection({ title, children }) {
  const id = slugify(title);
  return (
    <section id={id} className="flex flex-col gap-10 scroll-mt-8">
      <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">{title}</h2>
      {children}
    </section>
  );
}
