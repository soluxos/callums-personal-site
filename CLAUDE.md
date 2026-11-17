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
   Playful things (the ideas canvas, the ball pit) can stay, but
   never between a reader and the work.

## The blue wall

As of November 2026 every page, the ideas board included, sits on the blue wall with white
text. `SiteShell` draws it (`Daylight` with a blue tint) and wraps the site in `.bluewall`.

- **Text.** The grey text classes in the code (`text-[#484848]`, `text-[#6b6b6b]` and their
  neighbours) were written for a light wall. `.bluewall` in `src/app/globals.css` turns them
  white wherever they sit on the wall: the primary greys to full white, the secondary greys to
  a soft white (66%). Keep using those classes for text on the wall. Don't put red, mid-grey or
  another blue straight on it.
- **Cards.** A card is a see-through white: `bg-card` (`--color-card`, `rgba(255, 255, 255,
  0.2)`, set once in `globals.css`). Callum asked for this in place of the old grey `#e2e6e7`.
  Text on a card must be full white, because the soft white drops under 4.5:1 there; `.bluewall
  .bg-card` already does this for the grey classes.
- **Light surfaces.** Post-its, polaroids, the phone menu and tooltips keep dark ink. Inside
  `bg-white` the greys are put back by `globals.css`; a post-it sets its ink inline
  (`color: "#2a2a2a"`), because a grey text class on it would turn white.
- The case study preview cards are the exception to `bg-card`: they sit in a deeper shade of the
  wall (see below).

## Site-wide design rules

Callum approved these after a full audit in November 2026. Keep new work on them.

- **Text.** Two levels only: full white, and quiet white at 66% for everything secondary (body
  copy, nav, footer, meta, tags). He knows 66% on the wall is about 3:1 and has accepted it;
  don't raise it. Body copy is 14px Satoshi medium at line height 1.5, everywhere, including
  bubbles and post-its. Captions and small notes are 13px.
- **Headings.** Page titles are 64px at 1.15 (40px on phones in the case study hero). Section
  headings are 24px on every page. The wordmark and all other headings in that typeface are
  regular weight.
- **Measure.** 588px for body copy, 480px for intros and hero descriptions.
- **Links.** An inline link is full white and underlined (`underline-offset-2`), 14px, and
  fades to 66% on hover. "↗" marks a link that leaves the site; "→" one that stays on it. Nav
  and footer links are quiet (66%) and go full white on hover; the nav's current page is full
  white.
- **Buttons.** Solid white, square corners, 13px semibold label in `#0046d5`. No dark or
  rounded buttons.
- **Spacing.** 120px between sections on every page. 160px above and below the case study
  hero and the footer (96px on phones), and 160px between the nav and the top of a page. The
  home hero is centred and stays where it is.
- **Corners.** 4px for paper (post-its, book covers), 8px for images and screens, 16px for
  cards and containers. Polaroids, the contribution grid and the ball pit keep their own.
- **Copy.** "GitHub", not "Github". Date ranges are written "Aug 2025 to now", with "to" and
  no dash.

## Case studies

Before writing, editing or reviewing any case study, load the `case-study`
skill in `.claude/skills/case-study/SKILL.md`. It holds the full checklist. The
short version:

- **Where things live.** Pages are `src/app/case-studies/<slug>/page.jsx`. Card
  data (title, one-liner, status and years) is `src/data/caseStudies.js`. Images are
  `public/images/case-studies/<slug>/`,
  as WebP around 2400px wide for product screens.
- **Required order.** Hero (with Role, Team, Timeline, Outcome) → the problem
  (`CaseStudySection` with a `lead`: the question the project answered, then a
  short paragraph or two) → `CaseStudyRole` ("My role": owned / shared / others)
  → the work → results → a Reflection on completed projects. Callum asked for
  the problem first in November 2026; it stays short so the role section is
  close behind, and the hero already states Role and Team. The problem is left
  aligned like the rest of the page: the title as a small label, the question in
  large type, with room above and below it. Each paragraph under it is two or
  three lines at most on a desktop (Callum, November 2026; it was centred like a
  pull quote before that, and he had it changed). There are no STAR
  breakdowns; Callum removed them in October 2026. Reflections are his opinions,
  so draft them only from what he's said or what's on the page, and check them
  with him.
- **Password gates.** Every case study is public as of October 2026; Callum chose
  to open up Acquia Source and Acquia AI. The gate pieces below are still in the
  codebase if a future case study needs one. For confidential work, the hero, the
  problem and `CaseStudyRole` sit outside the gate, so a reader without the password still
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

- `CaseStudyFullHero`: logo, title, a brief description (one or two sentences, about 30
  words, set small at 14px), an optional `link`, then `metaItems` on four even columns (no
  rule or divider above them; Callum had one removed). The description and the meta values are
  white at 66% (`text-white/[0.66]`) and the hero has 160px of padding above and below on
  desktop (96px on phones); both are Callum's numbers. It has no background of its own: Callum had the gradients removed in November
  2026, so it sits straight on the blue wall. If the hero has a button (the `link`), it is a
  solid white, square-cornered button with a small label (13px); Callum asked for that in
  November 2026, so don't go back to an underlined link or a pill.
- `CaseStudyRole`: the "My role" section. Props: `summary`, `owned`, `shared`,
  `others`, optional `note`. Each item is a post-it (tape, coloured shadow, slight tilt):
  yellow for "What I owned", orange for "What I shared", blue for "What others did". Every
  note is the same size and sits on one shared grid (six columns on wide screens, four on
  tablets, two on phones). A group is as wide as its notes, so short groups share a row and
  every note lines up with the ones above it. A note is square but grows if its text needs
  the room, and the rest of its group grows with it. Callum asked for this in November 2026 because
  the old layout (groups of different widths, notes wrapping on their own) looked uneven;
  keep the groups and the notes on the same columns and gaps. The summary uses the same
  paragraph style as the rest of the page.
- `SideProjects`: the "Some side projects" cards on the home page, two across. Each is a film
  of the live site being scrolled, 1280x800 (16:10) in `public/videos/<name>.mp4` with its first
  frame as `<name>.jpg`. Callum asked for fresh recordings and bigger cards in November 2026.
  The films play only while on screen and hold on the poster for reduced motion. Your Next
  Tale's film is his bookcase page (`/u/callum`); the "Made in Framer" badge is hidden in the
  three template films.
- `SkillBadges`: the ball pit on About. It starts when it scrolls into view, runs in fixed
  steps, puts things to rest once they settle, and takes only as many balls as half fill it
  (fewer and smaller on phones). Badges are measured after fonts load; keep that.
- `CaseStudySection` (optional `lead`, the problem statement: with one, the section
  is left aligned, the title a small label over the question in large type),
  `CaseStudyCards` / `CaseStudyCard` (`width="half" | "full"`), `CaseStudySlider`,
  `CaseStudyBentoGrid`.
- `CaseStudyPreviewCard`: the cards on the home page and /case-studies. Each
  sits in a deeper shade of the wall (set in the component, the same for
  every card; Callum tried light grey in November 2026 and went back to
  this). The card is a label stuck over a reel, a short loop of the product
  being used. The label shows the project's logo (the hero's, white) with its
  name under it, and its bottom right corner is peeled back so a little of
  the reel shows and moves underneath. Hovering or focusing the card peels
  the label back across the card; it ends up lifted along the left edge and
  lies back down on leaving. On phones, with no hover, it peels when the card
  is on screen. Callum's rules for the peel (November 2026): it has to read
  as a physical label, so its edges curl (no straight folds), it is matt and
  close to the card's own colour (not shiny), its shadow is faint, it is
  allowed to overflow the card, and it never disappears when peeled.
  `CaseStudyThumbnail` holds the peel and picks the logo and reel by slug from
  `src/components/case-study/reels/`. Callum's rules for reels, all learned the
  hard way:
  - **Real size, one canvas.** Every reel is drawn at its product's real pixel
    sizes on the same 800x640 canvas, which scales as a whole to the card
    (`ProductFrame` in `reels/source.jsx`). No shrunken screenshots.
  - **Show the tool being used.** Each reel is a little story of the product
    doing its job, with a pointer: Acquia AI builds a site in a conversation,
    Canvas edits a component's text and image, Source moves between pages,
    EvenUI scans a page and finds issues, Site Studio adds and reorders
    elements and shows the page they make. Text is typed, buttons are pressed,
    results arrive. A reel that only fades between stills isn't done.
  - **Fill the card, edge to edge.** The UI spans the whole card: 40px in from
    the sides, or running off an edge (cut by the card, or faded out). Never a
    shrunken island with empty bands round it, never a piece narrower than the
    one above it for no reason, and never anything scaled down to fit. Show
    more of the real UI instead.
  - **Clean and modular.** The product's pieces float on the card as separate
    modules. No app window, browser frame or page background behind them.
    Union Roasted is the agreed exception: its card is the site itself, full
    bleed.
  - **Never deviate from the product's design tokens.** Fonts, colours, sizes,
    spacing, icons and logos are the product's own. Anything that has to
    change as it's used (typed text, a ticking checklist, a picked option) is
    code built from values read off the live product: Acquia AI and Source
    from the prototype's computed styles, EvenUI from the running app's.
    Anything that only has to be shown is a 2x capture of the real thing
    (EvenUI's scanned page and fix card, Source asset cards, Canvas and Union
    Roasted crops). Measuring from a screenshot is the last resort (Site
    Studio, Canvas's panel). Fonts: Proxima Nova for Acquia, Inter for Canvas,
    Roboto for Site Studio, JetBrains Mono for EvenUI's code (all in
    `public/fonts`), Satoshi for EvenUI. Icons and logos come from the product
    (`reels/sourceIcons.js` is generated, don't hand-edit). Hover and pressed
    looks come from the product's own CSS; if you can't find one, leave it
    out rather than guess.
  - **No screen recordings** (too soft), no approximated UI, and never a state
    or result the product doesn't have.
  - **Nothing moves to make room.** Every piece keeps a fixed place and changes
    in place. The one thing that scrolls is a conversation, as a whole strip
    (Acquia AI). Motion eases on the shared springs (`soft`, `swift`); nothing
    snaps or cuts.
  - **Never empty.** The first frame already has the product on it.
  - Reels only play while the card is on screen, and hold on one frame for
    reduced motion (`useReel` in `reels/shared.jsx`, which also has the typing,
    count-up and ticker helpers).
  Under the card is one line: "Acquia AI / Live 2025 to now". Callum doesn't
  want more text on the cards than that; the one-liner is read to screen
  readers only.
- `CaseStudyTableOfContents`: the ruler pinned to the bottom of the screen, with
  a labelled tick per section that scrolls with the page. Callum wants the ruler
  kept, so don't replace or restyle it. Its colours follow the blue wall (a
  deeper frosted strip, white ticks and labels); its shape and behaviour are his. Password-gated pages pass it no sections
  while locked, which hides it.

## Things Callum has asked to keep

- The home page layout and copy in `src/app/page.js`. Don't change it as part of
  case study work.
- The case study ruler (above).
