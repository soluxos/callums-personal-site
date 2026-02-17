export default function CaseStudySection({ title, children }) {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="font-ppmondwest text-[32px] leading-[1.25] text-[#484848]">{title}</h2>
      {children}
    </section>
  );
}
