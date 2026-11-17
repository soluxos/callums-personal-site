---
name: case-study
description: Write, rewrite or review a portfolio case study on Callum's site so a hiring manager can tell in seconds what he owned, what he shared and what others did. Use for any work in src/app/case-studies or src/data/caseStudies.js, and whenever someone asks to add, improve, critique or "rip apart" a case study.
---

# Case study standard

The reader is a hiring manager. They are deciding what Callum would bring to
their team, and they can't do that if they don't know which part of a project he
was responsible for. Write for that reader first.

## 1. Gather facts before writing

Case studies are built from evidence, never from guesses.

- Read the existing page and any source material the user gives
  (Figma files, prototype repos, live URLs, docs).
- For code, use git to establish attribution: `git shortlog -sne --all`, commit
  messages, merge titles. Use it to work out what is and isn't Callum's.
- Write down three lists before any prose: **owned** (Callum did it, start to
  finish), **shared** (done with others), **others** (someone else's work that
  appears in the story or the screenshots).
- **Never name anyone but Callum**, on any page, gated or not. Describe other
  people by role ("another designer", "an engineer"), and only where their work
  appears on the page and would otherwise read as his.
- Anything you can't verify goes in a list of questions for the user. Don't
  write it into the page.

## 2. Structure

Every case study page follows this order:

1. **Hero** (`CaseStudyFullHero`). A brief description, one or two sentences and
   about 30 words, that says what the product is and what Callum did on it, in
   plain words. Detail belongs further down the page. `metaItems`: Role, Team,
   Timeline, Outcome.
2. **The problem** (`CaseStudySection` with a `lead`). The `lead` is the
   question the project answered, in one sentence ("How do you make half a dozen
   products feel like one platform?"). Under it, a paragraph or two of context,
   each two or three lines at most on a desktop (about 250 characters). Keep it
   brief: the reader should reach the role section in seconds. The component
   sets it left aligned, the question in large type, with room above and below. This section is always first in `<main>` and
   outside any password gate. Union Roasted calls it "The brief".
3. **My role** (`CaseStudyRole`). One or two sentences answering "did he design
   it, build it, or join to work on one part?", then the owned / shared / others
   lists. It comes straight after the problem, and always outside any password
   gate. The hero's Role and Team already say who he was before this.
4. **The work.** Real screens first, then the decisions. Each section should
   name a decision and why it was made, with a screen that shows it. Captions say
   what the reader is looking at.
5. **Who built what** (for team projects, optional). What Callum built versus
   what the team built, by role, with no names. On gated pages this goes inside
   the gate.
6. **Results.** Concrete and verifiable. If there's no number, say what's true
   now (it shipped, who uses it, what it replaced). There are no STAR breakdowns
   any more.
7. **Reflection** (completed projects only). What Callum would keep or change,
   and what carried into later work. It's opinion, so it has to be his: draft it
   only from what he has said or what's on the page, and check it with him before
   it ships. Projects he's still working on (Acquia AI, Acquia Source, EvenUI)
   don't get one yet.

Also update the card in `src/data/caseStudies.js`. `status` and `years` show as
the one line under the card ("Acquia AI / Live 2025 to now"). Take them from the
hero, and use Live (in use now), Launched (his own product, released) or Shipped
(released, and he has moved on). `description` is one line of what it is, read
to screen readers only; don't put it back on screen. The card's background is
the same deeper shade of the wall for every project, set in
`CaseStudyPreviewCard`. The thumbnail is a reel: a short loop of the
product being used, in `reels/<Name>Reel.jsx` and registered by slug in
`CaseStudyThumbnail.jsx`. The rules are in CLAUDE.md under
`CaseStudyPreviewCard`; read them before touching a reel. In short: the reel
shows the tool being used (typing, pressing, results arriving), it fills the
card edge to edge (40px in, or running off an edge; never a shrunken island),
real pixel sizes on the shared 800x640 canvas (`ProductFrame`), separate
floating pieces with no window behind them, the product's own fonts, colours,
icons and logo (captured at 2x from the real thing where possible, otherwise
read from the live product), every piece in a fixed place, eased motion, no
screen recordings, never empty, and never a state the product doesn't have.

## 3. Review checklist

Run this on every draft, and when asked to critique an existing case study.

- [ ] Does the page open with the problem as a question, and is it short enough
      that the role section is close behind?
- [ ] Could a reader say what Callum owned after reading only the hero and the
      role section? If they'd have to guess, rewrite the role section.
- [ ] Does a completed project end with a Reflection that Callum has checked?
- [ ] Is anything in "owned" really shared? Does any screen show someone else's
      work without saying so (by role)? Is anyone other than Callum named? Remove
      the name.
- [ ] Does every claim trace back to evidence? Numbers, dates, "shipped", "led".
- [ ] Do the `sections` array entries match the section titles exactly?
- [ ] Does every image have alt text that describes that image (not "Description",
      not another project's name)?
- [ ] Are the images real work? Replace decorative filler with product screens.
- [ ] Is the first product screen visible without scrolling past a wall of text?
- [ ] No leftover or copy-pasted content from another case study.
- [ ] No defensive framing ("this isn't a typical case study"). If the process
      was unusual, say what happened.
- [ ] Voice: first person, British spelling, no em dashes, none of the humanizer
      skill's tells (not-X-but-Y, one-line closers, forced triads, inflation).
- [ ] Mobile: the page reads correctly at 375px wide.
- [ ] Navigation: nothing new to learn. Every section has a labelled tick on the
      ruler (`CaseStudyTableOfContents`). Keep the ruler; Callum wants it.

## 4. Finish

Run the dev server, open the page, check the console, click through the section
links, and check a password-gated page both locked and unlocked. Report anything
you couldn't verify back to the user as questions.
