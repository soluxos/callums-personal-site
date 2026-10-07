import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import CaseStudyCards from "@/components/case-study/CaseStudyCards";
import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import { pageMetadata } from "@/lib/metadata";

const img = name => `/images/case-studies/site-studio-cohesion/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";

export const metadata = pageMetadata({
  title: "Site Studio · Callum Harrod",
  description:
    "Site Studio, Acquia's low-code page builder. I rebuilt the whole app in React with one other engineer, and before that taught, demoed and sold it.",
  path: "/case-studies/site-studio-cohesion",
});

export default function SiteStudioCaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The problem",
    "Becoming an expert",
    "Teaching and pitching",
    "What else the job involved",
    "Landing our largest customer",
    "Being acquired",
    "Rebuilding it in React",
    "Results",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="Site Studio"
        description="A low-code site builder for Drupal. I helped land a £1m ARR deal for it, and after Acquia acquired us, I rebuilt the whole app in React with one other engineer."
        logo="/images/logos/acquia-logo.svg"
        logoAlt="Acquia logo"
        preset="forest"
        metaItems={[
          { label: "Role", value: "Senior Frontend Designer, then Senior Software Engineer" },
          { label: "Team", value: "A 12-person startup, then Acquia" },
          { label: "Timeline", value: "Sep 2018 - Jan 2025" },
          {
            label: "Outcome",
            value: "A £1m ARR customer, an acquisition, and the whole app rebuilt in React",
          },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="I had two jobs at Site Studio. Until the acquisition I made people good at the product and helped sell it: I learned it inside out by building sites with it, taught it through videos, webinars and training, and demoed it to prospects, including the weekend prototype that won our biggest deal. After Acquia bought us I moved into engineering, and spent nearly five years as one of the two front-end engineers responsible for the whole app."
            owned={[
              "A self-serve tutorial video series, taking a new user from nothing to a shipped site",
              "Demo sites designed and built in Site Studio, including whole sites built for prospects in a single day",
              "Webinars for hundreds of prospective users, and training for customer teams",
              "The React component library the whole app used, built in Styled Components",
              "A Cypress end-to-end test suite covering the whole application",
            ]}
            shared={[
              "In-person demos at prospects' offices, with our Head of Marketing",
              "The weekend prototype that won the pharmaceutical deal, with our Product Design Director",
              "Helping that client migrate over 1,000 websites onto Site Studio",
              "Rebuilding the whole app in React, with one other front-end engineer: over 100,000 lines of AngularJS migrated and the architecture redesigned",
              "The visual page builder, built from scratch by the two of us",
            ]}
            others={[
              "The lead came from a Senior Director of Solutions Architecture at Acquia",
              "The commercial deal and the acquisition were handled by our directors",
            ]}
          />

          <FadeInUp>
            <section className="w-full">
              <CaseStudySlider
                images={[
                  {
                    src: img("hero-4.webp"),
                    alt: "A demo site for a co-working brand, with Site Studio's editing panel open on its hero component",
                  },
                  {
                    src: img("hero-1.png"),
                    alt: "Site Studio's component builder, editing the layout canvas of a hero component",
                  },
                  {
                    src: img("hero-2.png"),
                    alt: "Settings for a container inside the hero component, with layout styles applied",
                  },
                  {
                    src: img("hero-3.png"),
                    alt: "Site Studio's style editor, setting the h1 font size for each screen size",
                  },
                ]}
              />
            </section>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="The problem">
              <div className={body}>
                <p>
                  Good Drupal developers are hard to find, and building websites on Drupal is hard
                  too. Site Studio offered a low-code way to build Drupal sites, but it was still a
                  technical product. To get good results, people had to know how to build a sensible
                  component library and understand front-end development.
                </p>
                <p>
                  I was hired as a Senior Frontend Designer to bridge that gap: teach individuals
                  and whole companies how to build websites with Site Studio.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Becoming an expert">
              <div className={body}>
                <p>
                  My first big job was a self-serve tutorial video series that would teach users how
                  to build an entire website with the product. To do that properly I had to be an
                  expert myself, so I designed and built a whole site in Site Studio from scratch
                  first.
                </p>
                <p>
                  With that behind me, I made a full set of videos covering everything a new user
                  needed to go from nothing to shipping a site with confidence.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Teaching and pitching">
              <div className={body}>
                <p>
                  Knowing the product that well opened up work beyond training. Our only customer at
                  the time was our partner agency, and we needed others. I visited companies with
                  our Head of Marketing to demo the product in person, ran webinars for hundreds of
                  prospective users, and built entire websites for prospects in a single day to show
                  how fast Site Studio could be. We recorded those sessions and sent them to the
                  prospects afterwards.
                </p>
                <p>
                  Teaching plus live building turned out to be one of our best ways of showing the
                  product to people who had never seen anything like it.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="What else the job involved">
              <div className={body}>
                <p>
                  My title was Senior Frontend Designer, but most of the job was teaching: showing
                  companies how to build a sensible design system and front end in Site Studio. I
                  also trained teams in other countries, designed and built sites on stage at live
                  events, and pitched to some of the biggest companies in the world. It&apos;s still
                  one of the most rewarding stretches of my career.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Landing our largest customer">
              <div className={body}>
                <p>
                  We&apos;d been talking to two of the largest pharmaceutical companies in the
                  world, and nothing had converted. Then on a Friday evening, a Senior Director of
                  Solutions Architecture at Acquia told us one of them was close to buying Site
                  Studio licences. We just needed to show them the value. On Monday morning.
                </p>
                <p>
                  Our Product Design Director and I got to work straight away. Over the weekend we
                  designed and built a prototype in Site Studio using the company&apos;s brand. For
                  a 12-person startup, a £1m deal was enormous, and we both knew it.
                </p>
                <p>
                  We presented it on Monday morning, and we landed the deal. The client had over
                  1,000 websites to move onto Site Studio over the following year, and we helped
                  them do that too.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Being acquired">
              <div className={body}>
                <p>
                  Soon after that deal, our directors started talking to Acquia, and Acquia acquired
                  us. A customer of that size made our revenue easy to see, and nothing else in the
                  Drupal world did what Site Studio did.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Rebuilding it in React">
              <div className={body}>
                <p>
                  After the acquisition I moved from design into engineering, as a Senior Software
                  Engineer. Site Studio&apos;s front end was written in AngularJS, and there were
                  two of us responsible for all of it.
                </p>
                <p>
                  Together we rebuilt the whole app in React. That meant migrating more than 100,000
                  lines of AngularJS, and we redesigned the architecture as we went rather than
                  porting it line by line. At the centre of it was the visual page builder, which we
                  built from scratch: complex, stateful, interaction-heavy UI for content editors
                  and site builders.
                </p>
                <p>
                  Alongside that I built the React component library the whole app used, in Styled
                  Components, and a Cypress end-to-end test suite that covered the whole
                  application. I didn&apos;t stop designing either. New features usually started
                  with me in Figma, and I prototyped the interactions before building them.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Results">
              <div className={body}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    A £1m ARR deal with one of the world&apos;s largest pharmaceutical companies, at
                    a company whose only customer had been our partner agency.
                  </li>
                  <li>The client moved over 1,000 websites onto Site Studio.</li>
                  <li>Acquia acquired the business.</li>
                  <li>
                    The whole app rebuilt in React by two of us, and Site Studio grew to more than
                    1,000 customers and $45m in attached revenue.
                  </li>
                </ul>
              </div>
            </CaseStudySection>
          </FadeInUp>
        </main>
      </CaseStudyLayout>
    </>
  );
}
