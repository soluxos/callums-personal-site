import { ArrowUpRight, Download } from "lucide-react";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import PhotoDesk from "@/components/about/PhotoDesk";
import SkillBadges from "@/components/SkillBadges/SkillBadges";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About · Callum Harrod",
  description:
    "Design lead at Acquia and a design engineer. Ten years of designing and building for the web, from WordPress sites to Drupal's new page builder. Both CVs are here to download.",
  path: "/about",
});

const sectionTitle = "font-ppmondwest text-[24px] leading-[1.25]";
const copy = "space-y-4 text-[14px] font-medium leading-[1.5] text-[#6b6b6b]";
const inlineLink = "text-[#484848] underline underline-offset-2 hover:text-white/[0.66]";

// Two versions of the same CV: one leads with product design, the other with engineering.
const CVS = [
  { href: "/cv/Callum-Harrod-CV-Product-Designer.pdf", label: "Product designer CV" },
  { href: "/cv/Callum-Harrod-CV-Design-Engineer.pdf", label: "Design engineer CV" },
];

const ELSEWHERE = [
  { href: "https://www.linkedin.com/in/callumharrod/", label: "LinkedIn" },
  { href: "https://github.com/soluxos", label: "GitHub" },
  { href: "mailto:callumharrod1994@hotmail.co.uk", label: "Email me" },
];

const EXPERIENCE = [
  {
    role: "Senior Product Designer, then Lead Product Designer",
    company: "Acquia",
    dates: "Jan 2025 to now",
    body: (
      <>
        <p>
          I lead design on{" "}
          <a href="/case-studies/acquia-source" className={inlineLink}>
            Acquia Source
          </a>
          , which brings every Acquia product under one navigation, and on{" "}
          <a href="/case-studies/acquia-ai" className={inlineLink}>
            Acquia AI
          </a>
          , where AI agents do work across those products with a person in charge. Two designers
          work under me across both. I joined as a Senior Product Designer in January 2025, leading
          the design of{" "}
          <a href="/case-studies/drupal-canvas" className={inlineLink}>
            Drupal Canvas
          </a>
          , Drupal&apos;s new page builder, which was on over 13,500 sites within ten months of its
          1.0 release. I&apos;ve been acting as design lead since August 2025, starting on Acquia
          AI.
        </p>
        <p>
          I joined Canvas as a front-end engineer, saw it had no design system, and built one. From
          there I redesigned the whole product. Over the year three junior designers joined under
          me, and I led and mentored them, working with one product manager and around 20 engineers.
        </p>
        <p>
          I also built the{" "}
          <a href="/case-studies/acquia-source" className={inlineLink}>
            Acquia Source prototype
          </a>
          , which the design team now designs in. I&apos;m rebuilding its pages on GEL,
          Acquia&apos;s design system, so engineering can take code straight from them.
        </p>
      </>
    ),
  },
  {
    role: "Senior Software Engineer",
    company: "Acquia",
    dates: "May 2020 to Jan 2025",
    body: (
      <>
        <p>
          I was one of two front-end engineers responsible for the whole of{" "}
          <a href="/case-studies/site-studio-cohesion" className={inlineLink}>
            Site Studio
          </a>
          , Acquia&apos;s low-code site builder. Together we rebuilt it in React, migrating more
          than 100,000 lines of AngularJS and redesigning the architecture as we went. At the centre
          of it was the visual page builder, which we built from scratch: complex, stateful,
          interaction-heavy UI for content editors and site builders.
        </p>
        <p>
          I built the React component library the whole app used, in Styled Components, and a
          Cypress end-to-end test suite that covered the whole application. New features usually
          started with me in Figma before I built them. Over those years Site Studio grew to more
          than 1,000 customers and $45m in attached revenue, from hosting deals that included it.
        </p>
      </>
    ),
  },
  {
    role: "Senior Frontend Designer",
    company: "Cohesion, then Acquia",
    dates: "Sep 2018 to May 2020",
    body: (
      <>
        <p>
          Before moving into engineering, I was Site Studio&apos;s Senior Frontend Designer at
          Cohesion, a 12-person startup. It was an unusual role that spanned design, development and
          customer success.
        </p>
        <p>
          Over one weekend, our Product Design Director and I designed and built a branded prototype
          that helped land a £1m ARR deal with Bayer, and that deal led to Acquia acquiring us. I
          also built a full website live on stage at Acquia Engage, and recorded a soup-to-nuts site
          build in a single day to close a major customer.
        </p>
      </>
    ),
  },
  {
    role: "Frontend Designer",
    company: "WeMakeWebsites",
    dates: "May 2018 to Sep 2018",
    body: (
      <>
        <p>
          I designed and built Shopify sites for a variety of very cool clients (at least I thought
          they were cool), including Skinnydip and Pepsi. I helped design new features, and I built
          them too.
        </p>
        <p>
          I designed{" "}
          <a href="/case-studies/union-roasted" className={inlineLink}>
            one of my favourite sites I&apos;ve ever worked on
          </a>
          , and before leaving I was named employee of the month (I still have the trophy to prove
          it). They desperately wanted to keep me, but at the time I couldn&apos;t keep commuting
          five hours a day.
        </p>
      </>
    ),
  },
  {
    role: "Designer & Developer",
    company: "Pragmatic",
    dates: "Jun 2016 to May 2018",
    body: (
      <p>
        I joined Pragmatic as a developer. I was experienced with WordPress, and I helped create
        some brilliant websites using PHP, Advanced Custom Fields and good ol&apos; front-end
        development. After about a year I moved to the design team, as I&apos;d been doing design
        outside my day job. From there I worked with the likes of Sage and Bacardi, including some
        fundamental UX work that&apos;s still used on all of Bacardi&apos;s websites.
      </p>
    ),
  },
  {
    role: "Web Developer",
    company: "UnitedUs",
    dates: "Apr 2015 to Jun 2016",
    body: (
      <p>
        My first job out of university! I worked on some incredible sites for small and large
        businesses alike, doing full-stack WordPress development (not Divi Builder, don&apos;t
        worry). It&apos;s where I learned how much good design matters to a brilliant website, and
        it was a perfect place to start my career.
      </p>
    ),
  },
];

export default function About() {
  return (
    <main className="flex flex-col gap-[120px]">
      <FadeInUp>
        <section className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Who I am and the things a hiring manager reaches for first. */}
          <div className="flex flex-col gap-10 lg:col-span-5">
            {/* Same type as the homepage hero. */}
            <div className="flex flex-col gap-2">
              <h1 className="font-ppmondwest text-[64px] leading-[1.15]">About me</h1>
              <p className="max-w-[480px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b]">
                I&apos;m a product designer and design engineer in Brighton, leading design on
                Acquia AI and Acquia Source. For over ten years I&apos;ve worked as a designer, an
                engineer and usually both, mostly on B2B SaaS, and I still build a lot of what I
                design.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <ul className="flex flex-wrap gap-3">
                {CVS.map(cv => (
                  <li key={cv.href}>
                    <a
                      href={cv.href}
                      download
                      className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 text-[13px] font-semibold leading-[1.4] text-[#0046d5] transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Download size={14} strokeWidth={2.25} aria-hidden="true" />
                      {cv.label} <span className="font-medium text-[#0046d5]/[0.66]">PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium leading-[1.5]">
                {ELSEWHERE.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-1 text-[#484848] underline underline-offset-2 hover:text-white/[0.66]"
                    >
                      {link.label}
                      {!link.href.startsWith("mailto:") && (
                        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhotoDesk />
          </div>
        </section>
      </FadeInUp>

      <FadeInUp>
        <section className="flex flex-col gap-6">
          <h2 className={sectionTitle}>Experience</h2>
          <ol className="border-b border-white/20">
            {EXPERIENCE.map(job => (
              <li
                key={`${job.company}-${job.dates}`}
                className="grid gap-4 border-t border-white/20 py-8 md:grid-cols-12 md:gap-10 md:py-10"
              >
                <div className="flex flex-col gap-1.5 md:col-span-5 lg:col-span-4">
                  <h3 className="font-ppmondwest text-[20px] leading-[1.25]">{job.role}</h3>
                  <p className="font-ppmondwest text-[16px] leading-[1.25] text-[#6b6b6b]">
                    {job.company} · {job.dates}
                  </p>
                </div>
                <div className={`${copy} max-w-[588px] md:col-span-7 lg:col-span-8`}>
                  {job.body}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </FadeInUp>

      <FadeInUp>
        <SkillBadges />
      </FadeInUp>
    </main>
  );
}
