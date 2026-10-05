import FadeInUp from "@/components/FadeInUp/FadeInUp";
import CaseStudyPreviewCard from "@/components/case-study/CaseStudyPreviewCard";
import { CASE_STUDIES } from "@/data/caseStudies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Case studies · Callum Harrod",
  description:
    "Case studies from Callum Harrod, design lead and design engineer. Each one starts with what I owned, what I shared and what other people did.",
  path: "/case-studies",
});

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-[80px]">
        <FadeInUp>
          <section className="flex w-full flex-col gap-5">
            <h1 className="w-full max-w-[591px] font-ppmondwest text-[48px] leading-[1.25]">
              Case studies
            </h1>
            <p className="w-full max-w-[591px] text-[14px] font-medium leading-[1.5] text-[#6b6b6b]">
              A selection of projects I&apos;ve worked on. Each one starts with what I owned, what I
              shared and what other people did.
            </p>
          </section>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <section className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {CASE_STUDIES.map(cs => (
                <CaseStudyPreviewCard key={cs.slug} {...cs} />
              ))}
            </div>
          </section>
        </FadeInUp>
      </main>
    </>
  );
}
