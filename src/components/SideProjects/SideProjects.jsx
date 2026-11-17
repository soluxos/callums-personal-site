"use client";

import { useEffect, useRef } from "react";

// Each film is the live site being scrolled, recorded at 1280x800 (16:10), so a card shows
// the whole width of the page with nothing cropped off.
const PROJECTS = [
  { name: "Your Next Tale", href: "https://yournexttale.com", film: "ynt" },
  { name: "Crisp Framer Template", href: "https://crisp.framer.website", film: "crisp" },
  { name: "Nifty Framer Template", href: "https://nifty.framer.website", film: "nifty" },
  { name: "Maybe Framer Template", href: "https://maybe.framer.website", film: "maybe" },
];

function Film({ film }) {
  const ref = useRef(null);

  // Play only while the card is on screen, and not at all for reduced motion: the poster
  // (the film's first frame) stands in.
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="block h-full w-full object-cover"
      poster={`/videos/${film}.jpg`}
      preload="none"
      loop
      muted
      playsInline
      aria-hidden="true"
    >
      <source src={`/videos/${film}.mp4`} type="video/mp4" />
    </video>
  );
}

export default function SideProjects() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Some side projects</h2>
      <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
        {PROJECTS.map(({ name, href, film }) => (
          <a key={film} href={href} className="group flex flex-col gap-3">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[8px] shadow-[0_1px_3px_rgba(0,9,58,0.28)]">
              <Film film={film} />
            </div>
            <p className="text-[14px] font-medium leading-[1.5] text-[#6b6b6b] transition-colors group-hover:text-white">
              {name} <span aria-hidden="true">↗</span>
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
