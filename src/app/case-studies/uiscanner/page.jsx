import CaseStudyCard from "@/components/case-study/CaseStudyCard";
import CaseStudyCards from "@/components/case-study/CaseStudyCards";
import CaseStudyFullHero from "@/components/case-study/CaseStudyFullHero";
import CaseStudyLayout from "@/components/case-study/CaseStudyLayout";
import CaseStudyRole from "@/components/case-study/CaseStudyRole";
import CaseStudySection from "@/components/case-study/CaseStudySection";
import CaseStudySlider from "@/components/case-study/CaseStudySlider";
import STARBreakdown from "@/components/case-study/STARBreakdown";
import { pageMetadata } from "@/lib/metadata";

const img = name => `/images/case-studies/uiscanner/${name}`;

const body = "max-w-[588px] space-y-4 text-[14px] font-medium leading-[1.5] text-[#656565]";
const caption = "text-[13px] font-medium text-[#6b6b6b]";
const shot = "h-auto w-full rounded-[12px] border border-[#dfdfdf]";

export const metadata = pageMetadata({
  title: "UIScanner · Callum Harrod",
  description:
    "I designed and built UIScanner, a desktop app that finds inconsistent UI on any web page, and launched it for Mac and Windows with a paid Pro tier.",
  path: "/case-studies/uiscanner",
});

export default function UIScannerCaseStudy() {
  const sections = [
    { label: "My role", id: "my-role" },
    "The problem",
    "Where it started",
    "Judging a page by its own rules",
    "Pointing at the exact element",
    "Making it look like a real tool",
    "From one page to a whole site",
    "Scan once, switch devices",
    "Checking what AI agents build",
    "Selling it",
    "Shipping updates",
    "Results",
    "STAR breakdown",
  ];

  return (
    <>
      <CaseStudyFullHero
        title="UIScanner"
        description="UIScanner is a desktop app I designed and built that checks any web page for inconsistent UI: spacing off the grid, one-off type styles, near-duplicate colours, and stray radii and borders. Every issue is pinned to the element it's on, with the CSS behind it and the fix. It works on live sites, local dev servers and prototypes, and AI coding agents can use it to check what they build. It's out for Mac and Windows, with a paid Pro tier on Lemon Squeezy."
        logo="/images/logos/uiscanner-logo.svg"
        logoAlt="UIScanner icon"
        preset="midnight"
        metaItems={[
          { label: "Role", value: "Solo: product, design, build and launch" },
          { label: "Team", value: "Just me" },
          { label: "Timeline", value: "Oct 2026 - Now" },
          {
            label: "Outcome",
            value: "1.0.2 out for Mac and Windows, with Pro at $49.99 on Lemon Squeezy",
          },
        ]}
      />
      <CaseStudyLayout sections={sections}>
        <main className="flex flex-col gap-[120px] mt-20">
          <CaseStudyRole
            summary="UIScanner is my product. I came up with it, designed it and built it, then launched it with Free and Pro plans, a store and releases for Mac and Windows."
            owned={[
              "The idea for a tool that checks any page, live or local, for one-off spacing, type, colours, radii and borders, and points to each one",
              "Everything it does: page scans, whole-site audits, design systems from pages, tokens files or git repos, comparisons, CI checks and support for AI agents",
              "The design, from the navigation, report and sitemap canvas to the scan box, both themes, motion and the icon",
              "How the scanner decides what's inconsistent, including working out each page's own spacing system instead of assuming a 4px grid",
              "Free and Pro, the pricing, and the Lemon Squeezy store",
              "Releases for Mac and Windows, published as Nifty, with updates from inside the app",
              "Testing on real sites and products, and fixing what that turned up",
            ]}
            note="Every screen on this page is the real app. Halcyon, the site in most of them, is a demo site I made for the screenshots."
          />

          <section className="flex w-full flex-col gap-3">
            <CaseStudySlider
              images={[
                {
                  src: img("report.webp"),
                  alt: "A UIScanner page report for Halcyon's home page: a score of 79, the issue list on the left, the page in the middle with a button outlined, and the suggested fix on the right",
                },
                {
                  src: img("site-map.webp"),
                  alt: "A UIScanner site audit of Halcyon: an average score of 94 across 18 pages, laid out as a sitemap with a score on every page",
                },
                {
                  src: img("scans.webp"),
                  alt: "The UIScanner home screen: a scan box at the top and recent scans below, each with a page preview and a score",
                },
                {
                  src: img("report-dark.webp"),
                  alt: "The same UIScanner page report in dark mode",
                },
              ]}
            />
            <p className={caption}>
              UIScanner 1.0.2: a page report with one issue selected, a whole-site audit on its
              sitemap, the scan history, and the report in dark mode.
            </p>
          </section>

          <CaseStudySection title="The problem">
            <div className={body}>
              <p>
                Most inconsistent UI is small: a 22px gap where everything else uses 24, or a blue
                one shade off the brand blue. It&apos;s hard to see in a screenshot review, and
                finding it by hand means inspecting elements one at a time. AI agents add to it,
                because they build pages faster than anyone can check them.
              </p>
              <p>
                I wanted a tool that looks at a rendered page the way a picky designer would, flags
                every value that doesn&apos;t fit with the rest, and shows exactly where it is. It
                had to work on a live site, a local dev server or a single HTML file, and AI coding
                agents had to be able to use it to check the prototypes they build.
              </p>
            </div>
          </CaseStudySection>

          <CaseStudySection title="Where it started">
            <div className={body}>
              <p>
                The first version ran in a browser. You pasted in an address and got a list of
                issues, each one outlined on a screenshot of the page. It found real problems
                straight away, and using it on real pages showed me what it needed next.
              </p>
              <p>
                It needed to be a desktop app, with the live page inside it. It needed to cope with
                sites built on different rules, and the fix for each issue had to be impossible to
                miss. From then on I worked in short loops: change something, use it on a real
                page, and decide whether it was good enough.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="half"
                image={img("first-version.webp")}
                imageAlt="The first version of UIScanner in a browser: a list of issues on the left, a test page in the middle with one element outlined, and a suggested fix on the right"
              >
                The first version: a report in the browser, with one issue outlined on a test page.
              </CaseStudyCard>
              <CaseStudyCard
                width="half"
                image={img("history-1-first-desktop-build.webp")}
                imageAlt="The first desktop build of UIScanner: a large headline, a scan box and cards explaining what it checks"
              >
                The first desktop build. It worked, but it didn&apos;t look like a tool yet.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Judging a page by its own rules">
            <div className={body}>
              <p>
                The first version judged spacing against fixed grids of 4, 5 and 8px. That falls
                apart for a team on a 6px grid, or one with a deliberate scale like 4, 6, 10, 14 and
                20. Values get flagged all over the page, and people learn to ignore a tool that
                cries wolf.
              </p>
              <p>
                So UIScanner works out each page&apos;s own system before judging anything. It
                looks for the coarsest grid that explains the page, from 4 to 12px, then for a short
                set of values the page sticks to. If neither fits, it says the page has no
                consistent system and only flags near-duplicates and one-offs. On four real product
                sites it found a 4px grid on one, an uneven scale on another, and no consistent
                system on the other two.
              </p>
              <p>
                When a team has a design system, that becomes the rulebook instead. UIScanner can
                learn one from a few pages that get it right, import a tokens file, or read the
                tokens straight out of a git repo. Every report says which rules it used.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="full"
                image={img("consistency.webp")}
                imageAlt="UIScanner's consistency view for a site audit: a bar for each of Halcyon's pages showing how much of its spacing sits on the site's 4px grid"
              >
                Every page in a site audit measured against the site&apos;s own spacing system,
                least consistent first.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("design-system.webp")}
                imageAlt="A UIScanner design system page for Halcyon, with its colours, spacing scale and an export panel of CSS variables"
              >
                A design system learned from Halcyon&apos;s own pages, ready to export as CSS
                variables, a Tailwind theme or tokens.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Pointing at the exact element">
            <div className={body}>
              <p>
                Every issue points to where it is. Each one is numbered on a screenshot of the page,
                and selecting it outlines the element with its selector and the value that&apos;s
                off. The inspector shows the CSS rule the value came from, with its file and line,
                traced back to the original source file when the site has source maps.
              </p>
              <p>
                In early versions the inspector was one long panel and the fix was easy to miss, so
                I split it into parts that each do one job. It now reads top to bottom: what&apos;s
                wrong, the fix in large type with paste-ready CSS and a prompt for an AI agent, how
                the value is used across the page, and the elements affected. If a value is
                deliberate, like a brand colour used once, you can mark it as intentional and it
                stops counting against the score.
              </p>
              <p>
                The Live tab loads the real page inside the app and outlines the element there, so
                you can check it in context.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="full"
                image={img("issue-pinned.webp")}
                imageAlt="Close-up of a UIScanner report: a button on Halcyon's home page outlined with its selector, and the suggested fix replacing #2463eb with the brand colour #2563eb"
              >
                A button one shade off the brand blue. The fix names the token to use and gives the
                CSS to paste.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Making it look like a real tool">
            <div className={body}>
              <p>
                I wanted it to look like an industry-standard tool and be intuitive enough that
                anyone could pick it up. The first desktop build had a top bar like a website, so I
                moved the navigation into a sidebar. When you open a report, the sidebar folds into
                a rail of square icons and the page gets the room.
              </p>
              <p>
                I kept the interface monochrome, with black buttons in light mode and white in
                dark, so colour only ever means something: severity and scores. Animation, built
                with Motion, makes panels and highlights move smoothly, and the type is Satoshi.
                Getting it to feel finished took a lot of small passes: an even rhythm in the
                sidebar, a getting-started card that didn&apos;t look like an afterthought,
                right-click menus, undo instead of confirm boxes, a native menu bar and a settings
                page. I even rebuilt the sidebar animation, because it juddered when a report
                opened.
              </p>
              <p>
                The icon went through the same process. The first ones were violet with a glowing
                orange dot. I wanted something modern, clean, minimal and single-colour, and landed
                on a frame around a single element.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="half"
                image={img("history-2-top-bar.webp")}
                imageAlt="An early build of UIScanner with a top bar, violet buttons and a getting-started checklist"
              >
                An early build with a top bar and violet buttons. It looked like a website.
              </CaseStudyCard>
              <CaseStudyCard
                width="half"
                image={img("history-3-sidebar.webp")}
                imageAlt="A later build of UIScanner with a sidebar, still with violet buttons"
              >
                The sidebar came next. The violet went soon after.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("scans.webp")}
                imageAlt="UIScanner 1.0.2's home screen with a black New scan button, the scan box and a grid of recent scans"
              >
                Version 1.0.2: monochrome, set in Satoshi, with every scan shown as a preview.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("logo-options.webp")}
                imageAlt="Six single-colour UIScanner icon options, each shown as an app icon, at small sizes and beside the wordmark"
              >
                Single-colour icon options at the sizes the app uses. Number 6 became the icon.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="From one page to a whole site">
            <div className={body}>
              <p>
                A page scan can&apos;t tell you whether a site holds together, so I added
                whole-site audits. Every page UIScanner finds goes on a sitemap with its score, so
                it&apos;s easy to see what to fix. It follows the site&apos;s links and sitemap,
                scans every page, and lays them out with the home page at the top, sections beneath
                it and child pages under those.
              </p>
              <p>
                The first map wrapped sections onto new rows, which broke down on sites with a lot
                of top-level pages, so I turned it into an endless canvas that pans and zooms like
                Figma, with a minimap. Zoomed out, the scores stay readable and the cards tint by
                score, so the whole site reads as a heat map. Issues across pages groups the same
                problem on several pages into one fix, since it usually lives in a shared component
                or stylesheet.
              </p>
              <p>
                Early versions asked how many pages to scan before starting, which nobody can know
                up front. Now it scans every page it finds, up to 200, and shows a running count.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="full"
                image={img("site-map-close.webp")}
                imageAlt="A closer view of the Halcyon sitemap: the home page above a row of sections, each card showing a page preview, its score and issue counts"
              >
                Halcyon&apos;s sitemap, zoomed in. The minimap in the corner shows where you are
                along the row.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("issues-across-pages.webp")}
                imageAlt="UIScanner's Issues across pages tab filtered to spacing, with a 22px value off the 4px grid expanded to show the two pages it appears on"
              >
                One spacing issue on two pages, with a link to fix it on each.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Scan once, switch devices">
            <div className={body}>
              <p>
                The scan box used to put everything up front: page or whole site with a hint beside
                it, the address, then desktop, laptop, tablet or mobile, a design system and
                options, over three rows. It wasn&apos;t intuitive, and the device was the wrong
                thing to ask for first. It should be something you change once you&apos;ve seen
                the result.
              </p>
              <p>
                Now the box is the address with one quiet row underneath, and the device switch
                lives on the result. Every report and site audit has one above the page. A size
                you&apos;ve already scanned swaps in straight away, and one you haven&apos;t is
                scanned with the same settings while the report stays on screen.
              </p>
              <p>
                Testing on a real dashboard turned up another problem: a report saying &quot;1
                element is below captured area&quot;, which nobody can work with. Some apps scroll
                inside a panel instead of the page, so the screenshot only caught the first screen.
                Scans now let those panels out to their full height before capturing, and anything
                that&apos;s off screen on the live page too, like a card past the end of a carousel,
                gets an arrow pointing to where it is.
              </p>
            </div>
            <section className="w-full">
              <div className="flex flex-col gap-3 rounded-[16px] bg-[#ededed] p-5 md:p-10">
                <img
                  alt="The old UIScanner scan box: Single page and Whole site with a hint, the address field, then device buttons, Add a design system and Options on a third row"
                  className={shot}
                  src={img("composer-before.webp")}
                />
                <p className={caption}>Before: three rows, with the device picked up front.</p>
                <img
                  alt="The new UIScanner scan box: the address field with Page, Whole site, the design system, Options and Scan page on one row beneath it"
                  className={`${shot} mt-4`}
                  src={img("composer-after.webp")}
                />
                <p className={caption}>After: the address, and one row underneath.</p>
              </div>
            </section>
            <CaseStudyCards>
              <CaseStudyCard
                width="full"
                image={img("report-mobile.webp")}
                imageAlt="A UIScanner report for Halcyon's home page at mobile size, switched from the device bar above the page"
              >
                The same report on mobile, one click from the desktop scan.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Checking what AI agents build">
            <div className={body}>
              <p>
                I wanted AI coding agents to check their own work with UIScanner while they build
                prototypes. It runs an MCP server, the standard way agents like Claude Code connect
                to tools, with 14 tools. An agent can fetch a design system as CSS variables or a
                Tailwind theme before it starts, scan what it built, read each issue&apos;s selector
                and the CSS line behind it, look at a screenshot of the problem, and compare before
                and after to show a fix worked.
              </p>
              <p>
                One button connects UIScanner to Claude Code, and another adds it to a
                prototype&apos;s repo with a skill that walks the agent through building, scanning,
                fixing and checking. Scans an agent runs show up in the app with a label, and a
                command line tool lets a team fail a pull request that adds new issues.
              </p>
              <p>
                Testing it from a real project showed that agents only load their tools when a
                session starts, so after connecting, the app now tells you to open a new session.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="full"
                image={img("claude-code.webp")}
                imageAlt="UIScanner's Claude Code page: the MCP server ready, Claude Code connected, a form to add UIScanner to a prototype repo, and example prompts"
              >
                Connect once, add it to a prototype repo, or copy a prompt to try.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("compare.webp")}
                imageAlt="A UIScanner comparison of Halcyon's pricing page: 86 before and 100 after, with 17 issues fixed and every category at 100"
              >
                Before and after on the pricing page. Agents run the same comparison to check their
                fixes.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Selling it">
            <div className={body}>
              <p>
                I wanted UIScanner to be good enough to sell, with a free mode and a paid one.
                Whole-site audits and shareable HTML reports are Pro, and everything else is free:
                single-page scans, design systems, Claude Code, comparisons and CI. Pro is $49.99,
                once, for up to three computers, and every install starts with a 14-day Pro trial.
              </p>
              <p>
                I set up the store on Lemon Squeezy, which handles checkout and issues the licence
                keys. The app checks keys against Lemon Squeezy&apos;s public licence API, so
                there&apos;s no secret key inside it for anyone to find. I also made the nine images
                for the store listing from a demo site, with a script that rebuilds them whenever
                the UI changes.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="half"
                image={img("upgrade.webp")}
                imageAlt="The UIScanner Pro window over a site audit, listing site audits and shareable reports, with Buy UIScanner Pro and I have a licence key buttons"
              >
                On Free, auditing a site again opens this instead.
              </CaseStudyCard>
              <CaseStudyCard
                width="half"
                image={img("licence.webp")}
                imageAlt="UIScanner Settings with the Licence section showing UIScanner Pro licensed to Halcyon Design, activated on this Mac, never expiring"
              >
                An active licence in Settings, with the computer it&apos;s on.
              </CaseStudyCard>
              <CaseStudyCard
                width="full"
                image={img("shareable-report.webp")}
                imageAlt="A UIScanner shareable report open in a browser: Halcyon's site audit with an average score of 94, category scores and page previews"
              >
                A shareable report: a whole site audit as one HTML file that works offline.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Shipping updates">
            <div className={body}>
              <p>
                When a new version is out, an &quot;Update available&quot; row appears in the
                sidebar. One click downloads it, checks it against the release&apos;s hash, swaps it
                in and restarts on a What&apos;s new note. It won&apos;t restart in the middle of a
                scan, and it warns you first if an agent is using the app. Releases are published
                on GitHub, and putting one out takes three steps: bump the version, write
                what&apos;s new in the changelog, and run one command.
              </p>
              <p>
                The Mac app runs on Apple silicon and Intel, and there&apos;s a Windows installer
                that needs no admin rights. Both name Nifty as the publisher. Neither is code-signed
                yet, so macOS and Windows both warn people the first time they open it.
              </p>
            </div>
            <CaseStudyCards>
              <CaseStudyCard
                width="half"
                image={img("update-row.webp")}
                imageAlt="Two crops of the UIScanner sidebar: an Update available row offering version 1.0.1, and below it the same row downloading at 37%"
              >
                The update row in the sidebar, offered and then downloading.
              </CaseStudyCard>
              <CaseStudyCard
                width="half"
                image={img("whats-new.webp")}
                imageAlt="UIScanner's What's new window after updating from 1.0.0 to 1.0.1, describing the new Windows version"
              >
                What&apos;s new after restarting, taken from the changelog.
              </CaseStudyCard>
            </CaseStudyCards>
          </CaseStudySection>

          <CaseStudySection title="Results">
            <div className={body}>
              <ul className="list-disc space-y-2 pl-5">
                <li>UIScanner 1.0.2 is out for Mac and Windows.</li>
                <li>UIScanner Pro is on sale through Lemon Squeezy at $49.99.</li>
                <li>Mac copies update themselves from the sidebar, from public GitHub Releases.</li>
                <li>
                  It works three ways: as a desktop app, a command line tool, and an MCP server with
                  14 tools for AI agents.
                </li>
              </ul>
            </div>
          </CaseStudySection>

          <STARBreakdown caseStudyId="uiscanner" />
        </main>
      </CaseStudyLayout>
    </>
  );
}
