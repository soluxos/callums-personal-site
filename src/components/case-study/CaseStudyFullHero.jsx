import GlowTitle from "@/components/GlowTitle/GlowTitle";

// The top of a case study: title, a brief description and the Role / Team / Timeline / Outcome
// row. It has no background of its own, so it sits straight on the blue wall like the rest of
// the page.
export default function CaseStudyFullHero({
  title,
  description,
  logo,
  logoAlt = "",
  metaItems,
  link,
}) {
  return (
    <div className="flex min-h-[560px] flex-col gap-12 pt-10 pb-[50px] sm:min-h-[660px] sm:pt-[60px] sm:pb-[64px]">
      {/* Logo + title + description — vertically centred in the remaining space */}
      <div className="flex-1 flex flex-col items-start justify-center text-left gap-3">
        {logo && (
          <div className="h-10 flex items-end justify-center mb-2">
            <img src={logo} alt={logoAlt} className="max-w-[80px]" />
          </div>
        )}
        <GlowTitle
          text={title}
          className="font-ppmondwest text-[40px] sm:text-[64px] leading-[1.2] text-white"
        />
        {description && (
          <p className="text-[16px] max-w-[560px] font-medium leading-[1.5] text-white">
            {description}
          </p>
        )}
        {/* Optional link to the live work, e.g. a public prototype. */}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-medium leading-[1.5] text-white underline underline-offset-4 hover:text-white/80"
          >
            {link.label} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>

      {/* Meta grid, at the bottom */}
      {metaItems && metaItems.length > 0 && (
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {metaItems.map(item => (
            <div key={item.label} className="flex flex-col gap-1">
              <p className="font-ppmondwest text-[18px] leading-[1.25] text-white">{item.label}</p>
              <p className="text-[13px] font-medium leading-[1.5] text-white max-w-[240px]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
