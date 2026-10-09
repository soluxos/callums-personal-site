import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import CaseStudyCards from "@/components/case-study/CaseStudyCards";
import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import { pageMetadata } from "@/lib/metadata";
import ZoomableImage from "@/components/case-study/ZoomableImage";

const img = name => `/images/case-studies/acquia-source/${name}`;
const early = name => `/images/case-studies/acquia-unification/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";

export const metadata = pageMetadata({
  title: "Acquia Source · Callum Harrod",
  description:
    "Design lead on Acquia Source. I designed the navigation for every Acquia product and built the 104-route prototype the product team demos from.",
  path: "/case-studies/acquia-source",
});

export default function AcquiaSourceCaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The problem",
    "Where it started",
    "One navigation for every product",
    "A prototype everyone can build in",
    "Making it safe to contribute",
    "Rebuilding it on GEL",
    "Results",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="Acquia Source"
        description="One platform for every Acquia product. I lead its design: I designed the navigation they all sit in, and built the 104-route prototype the product team demos from."
        logo="/images/logos/acquia-logo.svg"
        logoAlt="Acquia logo"
        preset="tropical"
        link={{
          href: "https://acquia-source-prototype.netlify.app/",
          label: "Try the live prototype",
        }}
        metaItems={[
          { label: "Role", value: "Lead Product Designer" },
          {
            label: "Team",
            value: "Two designers under me, with engineers and product leads across Acquia",
          },
          { label: "Timeline", value: "Jan 2026 - Now" },
          {
            label: "Outcome",
            value:
              "Live, with fewer features than I designed. The 104-route prototype has the full design",
          },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="I lead design on Acquia Source. I designed the navigation every Acquia product sits in, then built the coded prototype the whole team designs, reviews and demos in, with guardrails that steer everyone's contributions, AI-written or not, onto the design system. I designed the platform, not every product in it: colleagues own the products inside it, like security and asset management, and build them in the same prototype."
            owned={[
              "The information architecture and navigation shell for desktop, tablet and mobile, with the interaction notes engineering builds from",
              "The prototype itself. I set it up in July 2026 and wrote most of its 900-plus commits, by prompting Replit's agent and later Claude Code",
              "Rebuilding its pages on GEL, Acquia's design system, so engineering can take code straight from them (35 so far)",
              "The guardrails that let other people contribute: design rules, lint rules, designer tools and CI checks",
              "Reviewing and merging colleagues' pull requests",
              "Leading the two designers who work under me",
            ]}
            shared={[
              "A library of 24 UI patterns. I turned the R&D design team's written guidance into working examples that new screens copy",
              "Unified user management, which I've worked on with two colleagues",
              "Feature areas where colleagues build their designs on my foundations and I review them",
            ]}
            others={[
              "Security and CDN rules, the asset management apps, and site deployment flows, each built by the person who owns that area",
              "Parts of the Acquia AI chat and agent access, built by colleagues on top of my designs",
              "GEL itself, which belongs to Acquia's design system team",
            ]}
            note="Every screen on this page is from the prototype, which has the full design. Acquia Source used to be called Command Center, which is the name on my CV."
          />

          <div className="flex flex-col gap-[120px]">
            <section className="w-full">
              <div className="flex flex-col gap-3 rounded-[16px] bg-[#e2e6e7] p-5 md:p-10">
                <ZoomableImage
                  alt="The Acquia Source dashboard, with an Ask Acquia AI box above performance cards for every site"
                  className="h-auto w-full rounded-[12px] border border-[#dfdfdf]"
                  src={img("dashboard.webp")}
                />
                <p className="text-[13px] font-medium text-[#636363]">
                  The Source dashboard in the prototype. Acquia AI sits at the top of the page,
                  above performance across every site.
                </p>
              </div>
            </section>

            <CaseStudySection title="The problem">
              <div className={body}>
                <p>
                  Acquia grew by building and buying products: Cloud Platform for hosting, Drupal
                  CMS and Canvas for building sites, a DAM for assets, Web Governance, and more.
                  Each one came with its own interface, its own navigation and its own way of
                  managing people. A customer running a few sites could bounce between several of
                  them in a day, relearning where things live every time.
                </p>
                <p>
                  Acquia wants to compete as a digital experience platform, and that's a hard sell
                  when the experience is split across half a dozen products. Source is one platform
                  with one navigation and one way of doing the common jobs, with Acquia AI working
                  across all of it.
                </p>
              </div>
            </CaseStudySection>

            <CaseStudySection title="Where it started">
              <div className={body}>
                <p>
                  The first version was called Command Center. From January 2026 I designed it as
                  the lead designer, testing whether one shell could hold sites, insights, assets
                  and AI. It had an AI panel docked on the left that could build a site from a
                  prompt, which is where a lot of the Acquia AI thinking began.
                </p>
                <p>
                  I also worked with engineering on the technical approach for bringing existing
                  products into the new shell, since rebuilding all of them at once was never an
                  option.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={early("hero.webp")}
                  imageAlt="Command Center's AI panel, docked on the left, building a Valentine's Day landing page from a prompt"
                >
                  Command Center&apos;s AI panel building a landing page from a prompt.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="One navigation for every product">
              <div className={body}>
                <p>
                  The navigation had one job: stop customers noticing that Source is several
                  products. I organised it by what people do (sites, AI, digital assets, codebases)
                  rather than by whichever product powers each area. Every state is in Figma with a
                  note for engineering explaining how it behaves, and the screens below are the real
                  thing, running in the prototype.
                </p>
                <p>
                  Hovering a section you're not in opens its sub-menu as a pop-out, so you can jump
                  straight to a page. The section you're in shows its sub-menu as a nested list
                  instead. Sections with no sub-menu show a tooltip, which matters most when the nav
                  is collapsed to icons.
                </p>
                <p>
                  On tablet the nav starts collapsed and opens over the page, so the content isn't
                  squashed. On mobile it moves into a menu button in the top bar, with sections as
                  accordions. Because a section becomes an accordion there, each sub-menu's first
                  link goes to that section's landing page, otherwise you couldn't get to it.
                </p>
                <p>
                  The organisation switcher lives at the bottom of the nav, for agencies and groups
                  that run several brands from one account.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("nav-popout.webp")}
                  imageAlt="The Source dashboard with the side nav's Dashboard section open as a nested list, and the Digital assets sub-menu popped out beside it on hover"
                >
                  The section you&apos;re in opens as a nested list. Hovering another, here Digital
                  assets, pops its sub-menu out so you can jump straight to a page.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("nav-org-switcher.webp")}
                  imageAlt="The organisation switcher open from the foot of the side nav, listing The Signal and four other organisations"
                >
                  Switching organisation from the foot of the nav, without leaving the page.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("nav-collapsed.webp")}
                  imageAlt="The side nav collapsed to icons, with a tooltip reading Insights and actions"
                >
                  Collapsed to icons, with a tooltip for sections that have no sub-menu.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="A prototype everyone can build in">
              <div className={body}>
                <p>
                  By the summer, Figma couldn&apos;t keep up. Source had to cover dozens of areas,
                  several designers were working on it at once, and product and engineering needed
                  to click through the real thing rather than a stack of frames. In July 2026 I
                  started a coded prototype from an export of our earlier Figma prototypes and made
                  it the reference for the whole platform.
                </p>
                <p>
                  It now has 104 routes: dashboards, sites, digital assets, codebases, insights,
                  security, integrations, administration and Acquia AI. Everything runs on one set
                  of sample data, a fictional media group called Signal, so a site you see on the
                  dashboard is the same site the AI talks about and the same one in the sites list.
                  It&apos;s what the product team demos.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="half"
                  image={img("sites.webp")}
                  imageAlt="Sites list in the prototype, showing site cards with thumbnails and status"
                >
                  Sites, with filters for analytics, SEO, accessibility and security.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("insights.webp")}
                  imageAlt="Insights and actions page listing critical issues and opportunities across sites"
                >
                  Insights and actions: problems and opportunities across every site, each with a
                  &quot;Fix with AI&quot; option.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Making it safe to contribute">
              <div className={body}>
                <p>
                  A prototype with one author is easy. Letting designers, engineers and product
                  people add to it, mostly through their own AI coding sessions, without it turning
                  into ten different products took more work.
                </p>
                <p>
                  I wrote the rules down where the tools read them. The repo&apos;s instructions
                  tell any AI session how the prototype works before it touches anything. A design
                  rules file covers backgrounds, borders, card anatomy, colour tokens and the type
                  scale. Four custom lint rules check the parts a machine can: buttons, page width,
                  colour tokens and design system components only. Each error names the rule it
                  breaks. The 24 patterns, from tables to destructive actions, give new screens
                  something to copy. Two skills walk an agent through adding a page and checking it
                  against the original.
                </p>
                <p>
                  Then I built designer tools into the prototype. A pill in the corner outlines
                  every component on the page, blue for design system components and orange for
                  anything custom. It opens the source for a component, forces the page into states
                  like empty or no permission, and exports a handoff pack for engineering. The
                  orange outlines make drift obvious to people who don&apos;t read code.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("designer-tools.webp")}
                  imageAlt="The AI Activity page with designer tools on: components outlined and labelled, and a panel of page states and handoff options"
                >
                  Designer tools on the AI Activity page: every component outlined and labelled,
                  page states to force, and a handoff export.
                </CaseStudyCard>
                <CaseStudyCard
                  width="full"
                  image={img("patterns.webp")}
                  imageAlt="The patterns library page, grouped into page layout, collections, forms, feedback and display"
                >
                  The patterns library, with a reference implementation for each pattern.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Rebuilding it on GEL">
              <div className={body}>
                <p>
                  The first prototype was built from exported code, which engineering couldn&apos;t
                  reuse. So I started rebuilding it on GEL, Acquia&apos;s design system, as a second
                  copy that mirrors every route. 35 pages have been rebuilt so far, and the rest
                  fall back to the original until they are. A check that runs in CI and in every
                  Claude Code session makes sure a change to one copy reaches the other.
                </p>
                <p>
                  Each page is logged in a coverage file: what was rebuilt, where it had to deviate,
                  and what GEL was missing. The gaps go back to the GEL team as requests. As an
                  example, the AI Activity page went from 2 design system components and 67 custom
                  ones to 60 and 7.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="half"
                  image={img("foundations.webp")}
                  imageAlt="GEL foundations page showing colour ramps read from the design tokens"
                >
                  Foundations, read straight from GEL&apos;s design tokens.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("gel-components.webp")}
                  imageAlt="GEL components catalogue page"
                >
                  The component catalogue, running on the same code the pages use.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Results">
              <div className={body}>
                <p>There are no usage numbers to share yet. What&apos;s true today:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Acquia Source is live, including the navigation, the organisation switcher and
                    the AI area. Many of the features I designed were cut for time before release,
                    and the prototype still has the full design.
                  </li>
                  <li>
                    One navigation model covers every product area, from dashboards to AI, on
                    desktop, tablet and mobile.
                  </li>
                  <li>
                    The prototype has 104 routes, and it&apos;s what the product team demos.{" "}
                    <a href="https://acquia-source-prototype.netlify.app/" className="underline">
                      You can try it yourself
                    </a>
                    .
                  </li>
                  <li>
                    Colleagues across design, engineering and product build their own areas in it,
                    and I review and merge their pull requests.
                  </li>
                  <li>
                    Engineering has GEL versions of 35 pages to build from, plus a list of what GEL
                    is missing.
                  </li>
                </ul>
              </div>
            </CaseStudySection>
          </div>
        </main>
      </CaseStudyLayout>
    </>
  );
}
