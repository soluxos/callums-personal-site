export default function CaseStudyHero({ title, description, preTitle }) {
  return (
    <section className="flex w-full max-w-[800px] flex-col gap-5">
      {preTitle && <p className="font-ppmondwest text-[20px]">{preTitle}</p>}
      <h1 className="font-ppmondwest text-[48px] leading-[1.25] text-[#484848]">{title}</h1>
      <p className="text-[14px] max-w-[588px] font-medium leading-[1.5] text-[#929292]">
        {description}
      </p>
    </section>
  );
}
