import HeroBubbles from "@/components/HeroBubbles/HeroBubbles";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import IdeasCanvasPreview from "@/components/IdeasCanvasPreview/IdeasCanvasPreview";
import CaseStudyPreviewCard from "@/components/case-study/CaseStudyPreviewCard";
import SideProjects from "@/components/SideProjects/SideProjects";
import GitHubGrid from "@/components/GitHubContributions/GitHubGrid";
import RecentlyRead from "@/components/RecentlyRead/RecentlyRead";
import { CASE_STUDIES } from "@/data/caseStudies";

export default function Home() {
  return (
    <main className="flex flex-col gap-[120px]">
      <div className="flex flex-col gap-[120px] md:gap-[240px]">
        <FadeInUp>
          <section className="flex w-full flex-col gap-2 items-center justify-center text-center pt-6 pb-[120px] sm:pt-20">
            <div className="hero-text-container w-full flex flex-col gap-2 items-center justify-start">
              <HeroBubbles
                messages={[
                  "I led design on Drupal Canvas. It's on over 13,500 sites now",
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
              <h1 className="font-ppmondwest text-[64px] leading-[1.15]">Hey, I&apos;m Callum.</h1>
              <p className="max-w-[480px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b]">
                I&apos;m a product designer and design engineer, leading design on Acquia AI and
                Acquia Source. I&apos;ve spent over ten years designing and building B2B products,
                mostly tools for building websites.
              </p>
            </div>
          </section>
        </FadeInUp>
      </div>

      {/* Case studies section */}
      <FadeInUp delay={0.1}>
        <section className="flex flex-col gap-4">
          <div className="grid gap-x-4 gap-y-10 md:grid-cols-2">
            {CASE_STUDIES.map(cs => (
              <CaseStudyPreviewCard key={cs.slug} {...cs} />
            ))}
          </div>
        </section>
      </FadeInUp>

      {/* Side projects section */}
      <FadeInUp>
        <SideProjects />
      </FadeInUp>

      {/* The last books finished on Your Next Tale */}
      <RecentlyRead />

      {/* GitHub contributions section */}
      <GitHubGrid />

      {/* Notes section */}
      <FadeInUp>
        <IdeasCanvasPreview />
      </FadeInUp>
    </main>
  );
}
