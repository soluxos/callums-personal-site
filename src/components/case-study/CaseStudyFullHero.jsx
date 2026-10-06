"use client";

import AnimatedGradientBackground from "@/components/AnimatedGradientBackground/AnimatedGradientBackground";
import GlowTitle from "@/components/GlowTitle/GlowTitle";

export default function CaseStudyFullHero({
  title,
  description,
  logo,
  logoAlt = "",
  preset = "peach",
  metaItems,
  link,
}) {
  return (
    // margin-top: -60px pulls the hero up behind the nav (pt-8 ≈ 32px + nav ≈ 28px)
    <div className="relative min-h-[600px] sm:min-h-[680px]" style={{ marginTop: "-60px" }}>
      {/* Absolutely-positioned background breaks out of the container's horizontal margins
          to cover the full viewport width without causing a horizontal scrollbar */}
      <div
        className="absolute inset-y-0 overflow-hidden"
        style={{ left: "calc(50% - 50vw)", width: "100vw" }}
      >
        <AnimatedGradientBackground
          preset={preset}
          animationDuration={50}
          blurAmount={50}
          opacity={1}
          grain={true}
          grainOpacity={0.015}
          dither={false}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div className="bg-[rgba(0,0,0,0.2)] absolute inset-0" />
      </div>

      {/* Content sits on top of the background */}
      <div className="relative z-10 min-h-[600px] sm:min-h-[680px] flex flex-col gap-12 pt-[100px] sm:pt-[120px] pb-[50px] sm:pb-[64px]">
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
            <p className="text-[16px] max-w-[560px] font-medium leading-[1.5] text-white/80">
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

        {/* Meta grid — white text, pinned to the bottom */}
        {metaItems && metaItems.length > 0 && (
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {metaItems.map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <p className="font-ppmondwest text-[18px] leading-[1.25] text-white">
                  {item.label}
                </p>
                <p className="text-[13px] font-medium leading-[1.5] text-white/80 max-w-[240px]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
