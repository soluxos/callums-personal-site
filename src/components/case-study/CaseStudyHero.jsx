export default function CaseStudyHero({ title, description }) {
  return (
    <section className="flex w-full max-w-[591px] flex-col gap-5">
      <h1 className="font-ppmondwest text-[48px] leading-[1.25] text-[#484848]">{title}</h1>
      <p className="text-[14px] font-medium leading-[1.5] text-[#656565]">{description}</p>
    </section>
  );
}
