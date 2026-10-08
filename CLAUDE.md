# Callum Harrod — personal site

Next.js 16 (app router), React 19, Tailwind 4. Plain JavaScript, no TypeScript.
Run it with the `dev` entry in `.claude/launch.json` (port 3000). `next build`
can't reach Google Fonts in the sandbox, so verify with the dev server.

## Who this site is for

The main reader is a hiring manager or a designer on a hiring panel. They are a
user of this site, and they have a job to do here: work out what Callum would
bring to their team. Every change should make that job quicker.

A design engineer on a hiring panel put it like this (paraphrased): they can't
judge what someone would bring without knowing which part of a project that
person was responsible for. Did they design the product, build it, or join to
work on one interaction? And a portfolio that makes them learn a new way to
navigate before they can find the projects has made their part harder, which
says something about how the designer treats users.

Two rules follow from that, and they outrank any visual idea:

1. **Ownership is stated, not implied.** Every case study says up front what
   Callum owned, what he shared, and what other people did.
2. **Navigation is boring on purpose.** Links look like links, sections are
   labelled in plain words, and nothing has to be learned before it can be used.
   Playful things (the ideas canvas, the ball pit, live cursors) can stay, but
   never between a reader and the work.

## Case studies

Before writing, editing or reviewing any case study, load the `case-study`
skill in `.claude/skills/case-study/SKILL.md`. It holds the full checklist. The
short version:

- **Where things live.** Pages are `src/app/case-studies/<slug>/page.jsx`. Card
  data (title, one-liner) is `src/data/caseStudies.js`. Images are
  `public/images/case-studies/<slug>/`,
  as WebP around 2400px wide for product screens.
- **Required order.** Hero (with Role, Team, Timeline, Outcome) → `CaseStudyRole`
  ("My role": owned / shared / others) → the work → results. There are no STAR
  breakdowns; Callum removed them in October 2026. `CaseStudyRole` comes before
  anything else in `<main>`.
- **Password gates.** Every case study is public as of October 2026; Callum chose
  to open up Acquia Source and Acquia AI. The gate pieces below are still in the
  codebase if a future case study needs one. For confidential work, the hero and
  `CaseStudyRole` sit outside the gate, so a reader without the password still
  learns the role and outcome. Screens and detail go inside it. Keep the public role summary free
  of unreleased product detail. The page checks access on the server
  (`await hasCaseStudyAccess()` from `src/lib/caseStudyAccess.js`) and renders
  either the detail or `<PasswordGate />`. Never pass the password or the gated
  content into a client component, or it ships in the page source. The password
  lives in the server-only `CASE_STUDY_PASSWORD` env var.
- **No other names.** Callum is the only person named anywhere on the site,
  gated or not. Where someone else's work appears (a screen or feature he
  didn't build), say so by role ("another designer owned user management") so
  it doesn't read as his.
- **Honesty.** Only claim what Callum did or can back up. If a number, outcome or
  attribution can't be verified from the source material, leave it out and ask.
  Don't upgrade "contributed to" into "led".
- **Show the work early.** Real product screens beat illustrations, stock
  headshots and abstract shapes. The first thing after the role section should
  be the product.
- **Voice.** First person, British spelling, plain and direct, a bit of humour
  where Callum would use it. No em dashes. Avoid the patterns in the `humanizer`
  skill: not-X-but-Y contrasts, one-line closers, forced triads, inflated claims,
  bold labels on every list item.
- **Section titles** are sentence case and must match the `sections` array exactly
  (the ruler builds its links by slugifying titles).

## Components worth knowing

- `CaseStudyFullHero`: title, a brief description (one or two sentences, about 30
  words), `metaItems`.
- `CaseStudyRole`: the "My role" section. Props: `summary`, `owned`, `shared`,
  `others`, optional `note`. Each item is a post-it (about 164px square, tape,
  coloured shadow, slight tilt, 12px text): yellow for "What I owned", orange for
  "What I shared", blue for "What others did". The groups sit side by side on
  large screens and stack below that. The summary uses the same paragraph
  style as the rest of the page.
- `CaseStudySection`, `CaseStudyCards` / `CaseStudyCard` (`width="half" | "full"`),
  `CaseStudySlider`, `CaseStudyBentoGrid`.
- `CaseStudyTableOfContents`: the ruler pinned to the bottom of the screen, with
  a labelled tick per section that scrolls with the page. Callum wants the ruler
  kept, so don't replace or restyle it. Password-gated pages pass it no sections
  while locked, which hides it.

## Things Callum has asked to keep

- The home page layout and copy in `src/app/page.js`. Don't change it as part of
  case study work.
- The case study ruler (above).
