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
    <div className="flex flex-col gap-14 py-24 sm:gap-20 sm:py-[160px]">
      <div className="flex flex-col items-start text-left">
        {logo && <img src={logo} alt={logoAlt} className="mb-6 max-h-10 max-w-[80px]" />}
        <GlowTitle
          text={title}
          className="font-ppmondwest text-[40px] sm:text-[64px] leading-[1.15] text-white"
        />
        {description && (
          <p className="mt-4 max-w-[480px] text-[14px] font-medium leading-[1.5] text-white/[0.66]">
            {description}
          </p>
        )}
        {/* Optional link to the live work, e.g. a public prototype. A plain white button. */}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 bg-white px-3.5 py-2 text-[13px] font-semibold leading-[1.4] text-[#0046d5] transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {link.label} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>

      {/* Role, Team, Timeline and Outcome, on even columns. */}
      {metaItems && metaItems.length > 0 && (
        <dl className="grid max-w-[1040px] grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-10">
          {metaItems.map(item => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <dt className="font-ppmondwest text-[18px] leading-[1.25] text-white">
                {item.label}
              </dt>
              <dd className="max-w-[240px] text-[13px] font-medium leading-[1.5] text-white/[0.66]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
