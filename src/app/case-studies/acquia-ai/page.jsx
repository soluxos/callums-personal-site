import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import CaseStudyCards from "@/components/case-study/CaseStudyCards";
import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import { pageMetadata } from "@/lib/metadata";
import ZoomableImage from "@/components/case-study/ZoomableImage";

const img = name => `/images/case-studies/acquia-ai/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";

export const metadata = pageMetadata({
  title: "Acquia AI · Callum Harrod",
  description:
    "Lead designer on Acquia AI: agents that can publish and delete across a company's sites, with a person always in charge. Its first version shipped as an MVP four months after I joined.",
  path: "/case-studies/acquia-ai",
});

export default function AcquiaAICaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The problem",
    "Part one: the standalone app",
    "Part two: inside Acquia Source",
    "Projects hold the context",
    "Agents only do what they're allowed to",
    "Destructive actions always ask",
    "Admins can see everything",
    "Results",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="Acquia AI"
        description="AI agents that can publish and delete across a company's sites. I've designed it twice, and inside Acquia Source I designed how a person stays in charge of them, and built it in the prototype."
        logo="/images/logos/acquia-logo.svg"
        logoAlt="Acquia logo"
        preset="fire"
        link={{
          href: "https://acquia-source-prototype.netlify.app/ai",
          label: "Try Acquia AI in the live prototype",
        }}
        metaItems={[
          { label: "Role", value: "Lead Product Designer" },
          {
            label: "Team",
            value: "Two designers under me, with product and engineering at Acquia",
          },
          { label: "Timeline", value: "Aug 2025 - Now" },
          {
            label: "Outcome",
            value:
              "Both versions are live: the standalone app since December 2025, and inside Acquia Source",
          },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="I was the lead designer on both versions of Acquia AI. On the first, a standalone app, I took a developer-built prototype, redesigned it end to end and saw the MVP through to shipping. On the second, inside Acquia Source, I designed the experience for the project model the Acquia AI team chose, where each project acts as the agent and holds its permissions, and worked through the alternatives. I also mapped the agent role onto Cloud Platform's real permissions and built the AI area of the Source prototype myself. A few colleagues have since added features on top."
            owned={[
              "First version: the design system, and a full redesign of the developer-built prototype",
              "First version: design QA on the MVP until it shipped",
              "Inside Source: the experience design for projects and their permissions, context, approvals and admin oversight",
              "Inside Source: working through the alternatives to the project model (inheriting the user's permissions, locking to them, or acting as the user) and what each would mean",
              "Inside Source: building the AI area of the Source prototype, including chats, projects, context, activity, users, agent access and onboarding",
              "Leading the two designers who work under me",
            ]}
            shared={[
              "First version: user testing, run by UX researchers. What they found changed parts of our approach",
              "Product requirements, worked through with product management on both versions",
              "The rules for what agents can access, settled in a review with product and engineering leads",
            ]}
            others={[
              "The first version's engineers built the original prototype and shipped the product",
              "The Acquia AI team chose the project model, where each project is the agent and holds its permissions",
              "Inside Source, colleagues built parts of the chat and the agent access changes from the September review, on top of my designs",
            ]}
          />

          <div className="flex flex-col gap-[120px]">
            <section className="w-full">
              <div className="flex flex-col gap-3 rounded-[16px] bg-[#e2e6e7] p-5 md:p-10">
                <ZoomableImage
                  alt="An Acquia AI conversation summarising a campaign brief, listing the brand guidelines and brief it used"
                  className="h-auto w-full rounded-[12px] border border-[#dfdfdf]"
                  src={img("chat-context.webp")}
                />
                <p className="text-[13px] font-medium text-[#636363]">
                  Acquia AI in the Source prototype, answering from the project&apos;s brand
                  guidelines and campaign brief, and showing which sources it used.
                </p>
              </div>
            </section>

            <CaseStudySection title="The problem">
              <div className={body}>
                <p>
                  Businesses want to hand work to AI, and Acquia&apos;s products hold the things
                  that work touches: sites, content, assets and code. An assistant that can publish
                  or delete across a company&apos;s sites is useful. It&apos;s also a liability if
                  nobody can tell what it&apos;s allowed to do, or who asked it to do something.
                </p>
                <p>
                  Both versions of this product came back to the same two questions. What can the AI
                  do? And how does a person stay in charge of it?
                </p>
              </div>
            </CaseStudySection>

            <CaseStudySection title="Part one: the standalone app">
              <div className={body}>
                <p>
                  The first version of Acquia AI was a standalone app that framed AI as digital
                  teammates. You&apos;d ask for something like &quot;check my Cloud applications for
                  outdated modules and email me a ranked report every week&quot;, and it would hand
                  the job to the AI teammate with the right tools. One, called Phil, was set up as a
                  full-stack engineer with access to GitHub and Cloud. Another, Annie, was set up as
                  a marketing specialist.
                </p>
                <p>
                  I joined as lead designer in August 2025. There was a prototype the developers had
                  built and no design system. I built the design system, redesigned the product from
                  the ground up, and UX researchers ran user testing with us to find out what worked
                  and what didn&apos;t, which changed parts of our approach. Where the interface
                  exposed a gap in the requirements, I pushed on them with product. I did design QA
                  on everything engineering built until the MVP shipped in December 2025.
                </p>
                <p>
                  One idea carried straight into the version inside Source. When a teammate
                  didn&apos;t have access to something, it said so and suggested who might, instead
                  of trying anyway.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("first-version-decline.webp")}
                  imageAlt="A chat in the first version of Acquia AI: Annie, the marketing teammate, declines a request to audit Acquia Cloud because she has no access, and suggests another teammate might"
                >
                  Asked for something she can&apos;t do, the marketing teammate says so and points
                  elsewhere, instead of trying anyway.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Part two: inside Acquia Source">
              <div className={body}>
                <p>
                  In 2026 the AI moved inside Acquia Source, so it could work across every product
                  in the platform. From July I designed and built the AI area of the Source
                  prototype: the composer on the dashboard, chats, projects, context, activity,
                  users and agent access, and a first-run tour.
                </p>
                <p>
                  The Acquia AI team decided access would work through projects. There&apos;s no
                  separate agent to choose: the project is the agent and holds the permissions, and
                  anyone added to it can ask it to do anything those permissions allow. My job was
                  to design the experience for that model. To do it well, I also worked through the
                  alternatives, an agent that inherits the user&apos;s permissions, one locked to
                  them, and one that acts as the user, to see what each would mean when a person and
                  an agent can do different things. The rest of this page shows the project model.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("source-dashboard.webp")}
                  imageAlt="Source dashboard with the Ask Acquia AI composer, a project picker and suggested prompts"
                >
                  The composer on the Source dashboard. It knows which project you&apos;re working
                  in and suggests things to ask.
                </CaseStudyCard>
                <CaseStudyCard
                  width="full"
                  image={img("onboarding.webp")}
                  imageAlt="First step of the Acquia AI tour, explaining projects, chats, context and access"
                >
                  The first-run tour: projects, context and access, then approvals and activity. I
                  built it with seven steps, and we cut it to three after a review.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Projects hold the context">
              <div className={body}>
                <p>
                  A project is a shared workspace for a piece of work, like a relaunch or day-to-day
                  publishing. It has members, chats and resources, and it acts as the agent: it
                  holds the permissions, and any member can ask it to do anything those permissions
                  allow. Every chat in a project is visible to its members. The top of each
                  conversation says so, so nobody finds out later.
                </p>
                <p>
                  Context comes in four layers: the whole organisation, groups of shared material
                  such as brand guidelines, the project, and whatever you attach to the message.
                  Each answer lists the sources it used.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="half"
                  image={img("projects.webp")}
                  imageAlt="Projects page with four Signal projects showing chats, resources, context groups and members"
                >
                  Projects, each with its chats, resources, context and members.
                </CaseStudyCard>
                <CaseStudyCard
                  width="half"
                  image={img("context.webp")}
                  imageAlt="Context page listing context groups such as org baseline, brand guidelines and compliance"
                >
                  Context groups, applied to the projects that need them.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Agents only do what they're allowed to">
              <div className={body}>
                <p>
                  A project&apos;s permissions are separate from the person asking. If a request
                  needs something the project can&apos;t do, it declines, explains why, and points
                  to where that permission could be granted or which project already has it. It
                  never quietly escalates.
                </p>
                <p>
                  To make the permissions believable, I mapped the agent role onto Cloud
                  Platform&apos;s real ones. Cloud has 79 permissions, and the agent role starts
                  with 19. That mapping, and the rules for areas like digital assets, were settled
                  in a review with product and engineering leads in September 2026.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("chat-declined.webp")}
                  imageAlt="Acquia AI declining to publish Signal UK because the project lacks publish permission, and naming the project that has it"
                >
                  Asked to publish from the wrong project, the agent declines and tells you which
                  project can do it.
                </CaseStudyCard>
                <CaseStudyCard
                  width="full"
                  image={img("users.webp")}
                  imageAlt="Acquia AI users page listing people, their access level and projects"
                >
                  Who can reach what: admins, project members, and people with no project access.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Destructive actions always ask">
              <div className={body}>
                <p>
                  If a project has permission for something destructive, like publishing, deploying
                  or deleting, the agent will do it, but not straight away. When you ask for one of
                  those actions, a confirmation appears above the chat box, saying what&apos;s about
                  to happen and what it will change. Nothing happens until you approve or reject it.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("chat-approval.webp")}
                  imageAlt="A publish confirmation above the chat box, naming the page and with Reject and Approve buttons"
                >
                  Publishing a new page waits for approval. Which actions stop for approval was my
                  design. A colleague built the confirmation and the usage meter under the composer.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Admins can see everything">
              <div className={body}>
                <p>
                  Org admins get an Activity page showing every AI action in every project, with
                  filters and a link to each transcript. On their first visit a notice explains
                  what&apos;s visible to them, and users are told that admins can review
                  transcripts.
                </p>
              </div>
              <CaseStudyCards>
                <CaseStudyCard
                  width="full"
                  image={img("activity.webp")}
                  imageAlt="Activity page listing AI actions by user, project and mechanism, with a disclosure notice"
                >
                  Activity: who did what, through which project, with the transcript one click away.
                </CaseStudyCard>
              </CaseStudyCards>
            </CaseStudySection>

            <CaseStudySection title="Results">
              <div className={body}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    The first version&apos;s MVP shipped in December 2025, four months after I
                    joined, and the standalone app is still running.
                  </li>
                  <li>
                    Acquia AI is live inside Acquia Source, with all four parts of its model:
                    projects, agent permissions, confirmed destructive actions and the admin
                    activity page.
                  </li>
                  <li>
                    The agent access rules were reviewed and agreed with product and engineering
                    leads.
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
