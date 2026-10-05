import HeroBubbles from "@/components/HeroBubbles/HeroBubbles";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import IdeasCanvasPreview from "@/components/IdeasCanvasPreview/IdeasCanvasPreview";
import CaseStudyPreviewCard from "@/components/case-study/CaseStudyPreviewCard";
import GitHubContributions from "@/components/GitHubContributions/GitHubContributions";
import { CASE_STUDIES } from "@/data/caseStudies";

export default function Home() {
  return (
    <main className="flex flex-col gap-[120px]">
      <div className="flex flex-col gap-[120px] md:gap-[240px]">
        <FadeInUp>
          <section className="flex w-full flex-col gap-2 items-center justify-center text-center pb-[120px]">
            <div className="hero-text-container w-full flex flex-col gap-2 items-center justify-start">
              <HeroBubbles
                messages={[
                  "I led design on Drupal Canvas. It's on over 13,000 sites now",
                  "These days I'm design lead on Acquia Source and Acquia AI",
                  "I rebuilt Site Studio in React with one other engineer",
                  "That was over 100,000 lines of AngularJS",
                  "I built the Drupal Canvas design system from scratch",
                  "Oh, I'm also building a neat bookshelf web app on the side",
                  "I designed and built a 104-route prototype our product team demos from",
                  "We won a £1m ARR deal with a prototype built over one weekend",
                  "Then Acquia acquired the startup I worked at",
                  "I design in Figma and build in React",
                  "I wonder if you've stayed around for this?",
                ]}
              />
              <h1 className="font-ppmondwest text-[64px] leading-[1.25]">Hey, I&apos;m Callum.</h1>
              <p className="max-w-[480px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b]">
                I&apos;m a designer and developer with over ten years of experience in solving
                difficult problems in tech. Versed in design systems, AI tooling, and more.
              </p>
            </div>
          </section>
        </FadeInUp>
      </div>

      {/* Case studies section */}
      <FadeInUp delay={0.1}>
        <section className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {CASE_STUDIES.map(cs => (
              <CaseStudyPreviewCard key={cs.slug} {...cs} dither={false} />
            ))}
          </div>
        </section>
      </FadeInUp>

      {/* Side projects section */}
      <FadeInUp>
        <section className="flex flex-col gap-6">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">Some side projects</h2>
          <div className="grid gap-5 md:grid-cols-4">
            <a
              href="https://yournexttale.com"
              className="relative h-auto w-full flex flex-col gap-2"
            >
              <div className="h-[240px] w-full rounded-[8px] overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/videos/ynt.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="font-satoshi text-[14px] text-[#6b6b6b] leading-[1.5] font-medium">
                Your Next Tale
              </p>
            </a>
            <a
              href="https://crisp.framer.website"
              className="relative h-auto w-full flex flex-col gap-2"
            >
              <div className="h-[240px] w-full rounded-[8px] overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/videos/crisp.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="font-satoshi text-[14px] text-[#6b6b6b] leading-[1.5] font-medium">
                Crisp Framer Template
              </p>
            </a>
            <a
              href="https://nifty.framer.website"
              className="relative h-auto w-full flex flex-col gap-2"
            >
              <div className="h-[240px] w-full rounded-[8px] overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/videos/nifty.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="font-satoshi text-[14px] text-[#6b6b6b] leading-[1.5] font-medium">
                Nifty Framer Template
              </p>
            </a>
            <a
              href="https://maybe.framer.website"
              className="relative h-auto w-full flex flex-col gap-2"
            >
              <div className="h-[240px] w-full rounded-[8px] overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/videos/maybe.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="font-satoshi text-[14px] text-[#6b6b6b] leading-[1.5] font-medium">
                Maybe Framer Template
              </p>
            </a>
          </div>
        </section>
      </FadeInUp>

      {/* GitHub contributions section */}
      <GitHubContributions />

      {/* Notes section */}
      <FadeInUp>
        <IdeasCanvasPreview />
      </FadeInUp>
    </main>
  );
}
