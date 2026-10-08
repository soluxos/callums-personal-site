import CanvasUsageChart from "@/components/case-study/CanvasUsageChart";
import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import CaseStudyCards from "@/components/case-study/CaseStudyCards";
import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import FadeInUp from "@/components/FadeInUp/FadeInUp";
import { pageMetadata } from "@/lib/metadata";

const img = name => `/images/case-studies/drupal-canvas/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";

export const metadata = pageMetadata({
  title: "Drupal Canvas · Callum Harrod",
  description:
    "I led design on Drupal Canvas, Drupal's new page builder: the whole design system and a ground-up redesign of the product. It's now on over 13,000 sites.",
  path: "/case-studies/drupal-canvas",
});

export default function DrupalCanvasCaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The problem",
    "How I got involved",
    "Building the design system",
    "Structuring the shell",
    "Designing new features",
    "Results",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="Drupal Canvas"
        description="Drupal's new page builder, now on over 13,000 sites. I joined as a front-end engineer and ended up leading its design, from the design system to a redesign of the whole product."
        logo="/images/logos/acquia-logo.svg"
        logoAlt="Acquia logo"
        preset="ocean"
        metaItems={[
          {
            label: "Role",
            value: "Design lead (Senior Product Designer), joined as a front-end engineer",
          },
          {
            label: "Team",
            value:
              "Around 20 engineers, a product manager, and three junior designers who joined under me",
          },
          { label: "Timeline", value: "Jan 2025 - Dec 2025" },
          {
            label: "Outcome",
            value: "13,604 sites in the week of 20 Sept 2026, under ten months after 1.0",
          },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="I led the design of Drupal Canvas, but I didn't start it. When I joined, engineering had already chosen the tech, including Radix for components, and earlier designers had produced a first UI. I designed the whole design system, then redesigned the entire UI so it held together as one product, rethinking its foundations along the way: the shell, the panels and how every feature flows. I also designed the new features and reviewed the UI engineering shipped."
            owned={[
              "The whole Figma design system, built on Radix to match the codebase, with usage rules for components, icons, colour and type",
              "A ground-up redesign of the entire UI, so every part of Canvas works the same way, with new components where the old ones didn't fit",
              "The product shell: the panels and top bar, and how they expand with what you're doing",
              "User flows and designs for every feature, both the redesigned ones and the new ones",
              "Design review of the UI engineering built",
              "Leading the three junior designers who joined under me, and reviewing their features so Canvas stayed cohesive",
            ]}
            shared={[
              "Interaction details, worked out with the engineers building them",
              "Requirements, which I often worked out with product before there was anything to design",
            ]}
            others={[
              "Engineering built and shipped Canvas, and chose the tech stack",
              "Earlier designers created the first UI, which I pulled into the design system before redesigning it",
              "The junior designers on my team designed individual features, such as asymmetric translations",
            ]}
          />

          <FadeInUp>
            <section className="w-full">
              <CaseStudySlider
                images={[
                  {
                    src: img("drupal-canvas-hero.webp"),
                    alt: "Drupal Canvas editing a travel site's home page, with the templates panel on the left, the page preview in the middle and page settings on the right",
                  },
                  {
                    src: img("cms-content.png"),
                    alt: "The Canvas content list, with an article open for editing in a side panel",
                  },
                  {
                    src: img("code-editor.png"),
                    alt: "The Canvas code editor, writing a code component with a live preview and its props alongside",
                  },
                ]}
                caption="Canvas as it is now: the page editor, the content list and the code editor. I designed all three, and the Canvas engineers built them."
              />
            </section>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="The problem">
              <div className={body}>
                <p>
                  Drupal is one of the most powerful content management systems around, and it has a
                  long reputation for being hard to use. Editing content was clunky and building
                  sites was worse. That hurt the people using it, and it hurt Drupal as a platform.
                </p>
                <p>
                  Canvas had to make building and editing pages approachable without losing the
                  power and flexibility that Drupal&apos;s users rely on.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="How I got involved">
              <div className={body}>
                <p>
                  I was brought in as a front-end engineer. The project was moving quickly, and
                  nobody had pulled the design work into a system yet, which made the UI hard to
                  build consistently. So I started doing it: auditing the existing designs,
                  consolidating them into components and organising everything into an atomic design
                  system.
                </p>
                <p>
                  That work is how I was offered the Senior Product Designer role at Acquia. From
                  there I led the design of Canvas: a redesign of the entire UI, a rethink of the
                  product shell and how every feature flows, new features, and a lot of time with
                  engineers on how things should behave.
                </p>
              </div>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Building the design system">
              <div className={body}>
                <p>
                  The codebase used Radix as its component library, so the design system had to
                  reflect Radix exactly. I started from Radix&apos;s own design file for the basic
                  elements, then removed every option we weren&apos;t going to use. With those gone,
                  a designer on the team couldn&apos;t make an incorrect UI any more.
                </p>
                <p>
                  Over time I redesigned many of the components to suit Canvas users better, and
                  wrote rules for how to use each one. There are usage guides for icons, colour and
                  type too, so every part of Canvas feels like the same product.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="half"
                  image={img("case-study-components.png")}
                  imageAlt="The Canvas file upload field in two states: empty, and with two images added"
                >
                  One of the redesigned fields: file upload, empty and with files added.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("content-edit-panel.webp")}
                  imageAlt="The Canvas article editor: title, media, a rich text body with its formatting toolbar, and a category field"
                >
                  The same fields in use, editing an article.
                </CaseStudyCard>
                <CaseStudyCard
                  width="full"
                  image={img("case-study-documented.png")}
                  imageAlt="Figma documentation pages for Canvas form fields, including plain text, formatted text and number, each showing every state"
                >
                  Form fields, each documented with its states and a line on when to use it.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Structuring the shell">
              <div className={body}>
                <p>
                  The shell is the frame around everything in Canvas: panels, top bar, and how they
                  respond to what you&apos;re doing. It had to work as the site building and editing
                  interface today, and leave room for features we hadn&apos;t designed yet.
                </p>
                <p>
                  I kept it as small as possible, expanding only when a task needs more. Adding
                  something to a page or editing what&apos;s already there brings up options for
                  that part of the UI. A lot of the work was solving problems we didn&apos;t have
                  yet, so new features would slot in without a redesign.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("highlighted-component.png")}
                  imageAlt="Canvas with the hero component selected on the page and its settings open in the right-hand panel"
                >
                  Select something on the page and its settings open beside it. Nothing else changes
                  until you need it.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("case-study-consistent-experience.png")}
                  imageAlt="The Canvas templates panel, open beside the icon bar that switches between panels"
                >
                  Every panel behaves the same way. It never takes you away from the page at the top
                  level. It only navigates once you&apos;ve picked something.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("case-study-top-bar.png")}
                  imageAlt="The Canvas top bar: the Drupal logo to exit, a content type and entry switcher, and preview and publish actions"
                >
                  The top bar lets you exit Canvas, switch the content you&apos;re previewing, and
                  run page or global actions in one click.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Designing new features">
              <div className={body}>
                <p>
                  I redesigned every existing feature and designed the new ones from scratch, from
                  the templates panel to the content list and the code editor. Each one started as a
                  detailed user flow. Canvas workflows can get complicated, and the flows let
                  engineers see how I&apos;d turned them into something simple before anyone built
                  anything.
                </p>
                <p>
                  Over the year, three junior designers joined the team under me. Each took on
                  individual features, such as asymmetric translations, and I reviewed what they
                  designed to make sure it fitted the rest of Canvas and made sense to the people
                  using it.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("case-study-step-by-step.png")}
                  imageAlt="Three Canvas screens in sequence: choosing Add then Content template in the templates panel, then the Add new template dialog asking for a content type and template"
                >
                  Adding a content template, screen by screen.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>
          </FadeInUp>

          <FadeInUp>
            <CaseStudySection title="Results">
              <div className={body}>
                <p>
                  Canvas 1.0 was released on 4 December 2025. Three and a half months later it was
                  on over 4,500 sites. In{" "}
                  <a href="https://www.drupal.org/project/usage/canvas" className="underline">
                    drupal.org&apos;s usage count
                  </a>{" "}
                  for the week of 20 September 2026 it was on 13,604, and it hasn&apos;t dropped
                  below 7,000 in any week since mid-June.
                </p>
              </div>
              <CanvasUsageChart />
            </CaseStudySection>
          </FadeInUp>
        </main>
      </CaseStudyLayout>
    </>
  );
}
