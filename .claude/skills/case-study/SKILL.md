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
2. **My role** (`CaseStudyRole`). One or two sentences answering "did he design
   it, build it, or join to work on one part?", then the owned / shared / others
   lists. This section is always first in `<main>` and always outside any
   password gate.
3. **The work.** Real screens first, then the problem and the decisions. Each
   section should name a decision and why it was made, with a screen that shows
   it. Captions say what the reader is looking at.
4. **Who built what** (for team projects, optional). What Callum built versus
   what the team built, by role, with no names. On gated pages this goes inside
   the gate.
5. **Results.** Concrete and verifiable. If there's no number, say what's true
   now (it shipped, who uses it, what it replaced). This is the last section;
   there are no STAR breakdowns any more.

Also update the card's `description` in `src/data/caseStudies.js` (one line
of what it is). The cards deliberately show no role or date text underneath;
don't add any.

## 3. Review checklist

Run this on every draft, and when asked to critique an existing case study.

- [ ] Could a reader say what Callum owned after reading only the hero and the
      role section? If they'd have to guess, rewrite the role section.
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
