"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useReel } from "./shared";
import { Inline, Pointer, Prime, ProductFrame, Sym, module, soft } from "./source";

// Acquia Source: one navigation for every product. The navigation floats on the card as its own
// piece. The pointer opens Sites, then Digital assets, and that product's cards arrive beside
// it while the navigation stays put.
//
// The navigation and the cards are rebuilt at the prototype's real sizes with its own logo,
// icons, colours and type (a 240px navigation with 40px rows on a 44px pitch; 352px cards).
// Two things differ from the product on purpose, at Callum's request: the cards have no border,
// and the site cards show a light gradient where the product shows a screenshot of the site.
// The asset cards are 2x captures of the prototype's own, since their content is an image.
//
// Steps: home, press Sites, its section opens, press its Sites page, hold, press Digital assets,
// its section opens, press Assets, hold, back to Home, press.
const STEPS = [1500, 300, 850, 300, 1900, 300, 850, 300, 2200, 950, 300];

const NAV = [
  { id: "home", label: "Home" },
  { id: "ai", label: "AI", more: true, compose: true },
  { id: "sites", label: "Sites", more: true, children: ["Sites", "User access", "Subscriptions"] },
  { id: "cloud", label: "Cloud", more: true },
  {
    id: "assets",
    label: "Digital assets",
    more: true,
    children: ["Assets", "Insights", "Portals", "Entries", "Templates", "Workflow", "Admin"],
  },
  { id: "governance", label: "Web Governance", more: true },
  { id: "aeo", label: "AEO Insights" },
  { id: "more", label: "More", more: true },
];

// The dashboard's three cards, with the prototype's own figures.
const SCORES = [
  {
    icon: "spellcheck",
    title: "Content Quality",
    about: "Review content for errors and consistency",
    label: "Quality score",
    score: "86",
    change: "+3 vs last scan",
    rows: [
      ["Misspellings", "128"],
      ["Broken links", "42"],
      ["Pages with issues", "316"],
    ],
  },
  {
    icon: "speed",
    title: "Site Performance",
    about: "Monitor search visibility across all pages",
    label: "SEO score",
    score: "78",
    change: "-2 vs last scan",
    down: true,
    rows: [
      ["SEO issues", "214"],
      ["Average page load", "1.8s"],
      ["Pages scanned", "4,820"],
    ],
  },
  {
    icon: "accessibility_new",
    title: "Accessibility",
    about: "Identify barriers for users with disabilities",
    label: "Accessibility score",
    score: "91",
    change: "+1 vs last scan",
    rows: [
      ["Level A issues", "37"],
      ["Level AA issues", "96"],
      ["Pages with issues", "188"],
    ],
  },
];

// The sites, each with a light gradient standing in for its screenshot.
const SITES = [
  {
    name: "Careers",
    domain: "careers.signal.com",
    tint: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
  },
  {
    name: "Finance",
    domain: "finance.signal.io",
    tint: "linear-gradient(135deg, #d1fae5 0%, #cffafe 100%)",
  },
  {
    name: "Intranet",
    domain: "intranet.signal.io",
    tint: "linear-gradient(135deg, #fef3c7 0%, #ffe4e6 100%)",
  },
  {
    name: "Investors",
    domain: "investors.signal.com",
    tint: "linear-gradient(135deg, #e0f2fe 0%, #fae8ff 100%)",
  },
];

const img = name => `/images/case-studies/acquia-source/${name}.webp`;
const ASSETS = [
  { src: img("module-asset-0"), w: 251, h: 331 },
  { src: img("module-asset-1"), w: 251, h: 331 },
  { src: img("module-asset-2"), w: 251, h: 311 },
  { src: img("module-asset-0"), w: 251, h: 331 },
];

// Where each product's cards sit on the 800 x 640 canvas, level with the top of the
// navigation. Some run off the right and the bottom, where they fade out.
const PAGES = {
  home: SCORES.map((score, i) => ({
    score,
    w: 352,
    h: 433,
    x: 304 + (i % 2) * 368,
    y: 40 + Math.floor(i / 2) * 449,
  })),
  sites: SITES.map((site, i) => ({
    site,
    w: 352,
    h: 379,
    x: 304 + (i % 2) * 368,
    y: 40 + Math.floor(i / 2) * 395,
  })),
  assets: ASSETS.map((asset, i) => ({
    asset,
    w: asset.w,
    h: asset.h,
    x: 304 + (i % 2) * 267,
    y: 40 + Math.floor(i / 2) * 347,
  })),
};

const button =
  "flex h-[31px] items-center rounded-[6px] border border-[#e5e7eb] bg-white px-[10px] leading-[21px] text-[#036bb5]";

// A dashboard card: a score, how it has changed, and three figures behind it.
function ScoreCard({ icon, title, about, label, score, change, down, rows }) {
  return (
    <div className="flex size-full flex-col p-[20px]">
      <span className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#f2f9fc] text-[#036bb5]">
        <Sym name={icon} size={16} />
      </span>
      <p className="mt-[16px] text-[18px] leading-[27px] font-semibold text-[#1f2937]">{title}</p>
      <p className="mt-[4px] leading-[21px] text-[#4b5563]">{about}</p>
      <p className="mt-[24px] leading-[16px] font-medium text-[#4b5563]">{label}</p>
      <p className="mt-[4px] flex items-center justify-between">
        <span className="text-[24px] leading-[32px] font-semibold text-[#111827]">{score}</span>
        <span
          className={`flex h-[24px] items-center gap-[4px] rounded-[4px] px-[8px] leading-[14px] font-semibold ${
            down ? "bg-[#fee2e2] text-[#991b1b]" : "bg-[#dcfce7] text-[#166534]"
          }`}
        >
          <Prime name={down ? "arrow_down" : "arrow_up"} size={12} />
          {change}
        </span>
      </p>
      <div className="mt-[13px]">
        {rows.map(([name, value]) => (
          <p
            key={name}
            className="flex h-[45px] items-center justify-between border-t border-[#e5e7eb] leading-[20px]"
          >
            <span className="font-medium text-[#4b5563]">{name}</span>
            <span className="font-semibold text-[#111827]">{value}</span>
          </p>
        ))}
      </div>
      <p className="mt-auto flex justify-end border-t border-[#e5e7eb] pt-[16px]">
        <span className={button}>View in Web Governance</span>
      </p>
    </div>
  );
}

// A site: what it's called, where it lives, whether it's published, and its two actions.
function SiteCard({ name, domain, tint }) {
  return (
    <div className="flex size-full flex-col">
      <div className="relative h-[180px] shrink-0" style={{ background: tint }}>
        <span className="absolute top-[10px] left-[10px] flex h-[24px] items-center rounded-[4px] bg-[#dcfce7] px-[8px] leading-[14px] font-semibold text-[#166534]">
          Custom
        </span>
        <span className="absolute top-[10px] right-[10px] flex size-[24px] items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#036bb5]">
          <Prime name="star" size={14} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-[20px] pt-[19px] pb-[20px]">
        <p className="text-[18px] leading-[28px] font-semibold text-[#036bb5] underline">{name}</p>
        <p className="mt-[2px] flex items-center gap-[4px] text-[#036bb5]">
          <span className="underline">{domain}</span>
          <Inline name="external" width={14} />
        </p>
        <p className="mt-[8px] flex h-[24px] w-fit items-center gap-[4px] rounded-[4px] bg-[#f0f3f5] px-[8px] leading-[14px] font-semibold text-[#374151]">
          <Prime name="check_circle" size={12} />
          Published
        </p>
        <p className="mt-auto flex items-center gap-[8px] border-t border-[#e5e7eb] pt-[16px]">
          <span className="flex h-[35px] items-center rounded-[6px] border border-[#e5e7eb] bg-white px-[8px] leading-[21px] text-[#036bb5]">
            Overview
          </span>
          <span className={button}>Edit site</span>
          <span className="ml-auto flex size-[24px] items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white text-[#036bb5]">
            <Prime name="ellipsis_h" size={14} />
          </span>
        </p>
      </div>
    </div>
  );
}

// The navigation's measurements, in the product's pixels, from the top of the canvas.
const NAV_TOP = 40;
const FIRST_ROW = NAV_TOP + 56;
const ROW = 40;
const CHILD = 36;
const GAP = 4;

// Where the middle of a row is, given which section is open.
function rowY(open, id, child = -1) {
  let y = FIRST_ROW;
  for (const item of NAV) {
    if (item.id === id && child < 0) return y + ROW / 2;
    y += ROW + GAP;
    if (item.id === open && item.children) {
      for (let i = 0; i < item.children.length; i++) {
        if (item.id === id && i === child) return y + CHILD / 2;
        y += CHILD + GAP;
      }
    }
  }
  return y;
}

const lit = { type: "spring", stiffness: 380, damping: 36 };

export default function AcquiaSourceReel() {
  const { ref, step } = useReel(STEPS, 8);
  const open = step >= 2 && step <= 5 ? "sites" : step >= 6 ? "assets" : null;
  const page = step <= 3 ? "home" : step <= 7 ? "sites" : "assets";
  // The row that's lit: the page you're on, or nothing while its section is closed.
  const current = page === "home" ? "home" : open === page ? `${page}-0` : null;

  let pointer = { x: 136, y: rowY(null, "sites") };
  if (step === 2 || step === 3) pointer = { x: 152, y: rowY("sites", "sites", 0) };
  if (step === 4 || step === 5) pointer = { x: 144, y: rowY("sites", "assets") };
  if (step >= 6) pointer = { x: 152, y: rowY("assets", "assets", 0) };
  if (step >= 9) pointer = { x: 136, y: rowY("assets", "home") };

  return (
    <ProductFrame reelRef={ref}>
      {/* The product's cards. They fade out towards the right and the bottom of the card. */}
      <div className="absolute inset-0 [mask-composite:intersect] [mask-image:linear-gradient(to_right,black_78%,transparent_97%),linear-gradient(to_bottom,black_74%,transparent_96%)]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={page}
            className="absolute inset-0"
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
          >
            {PAGES[page].map(({ score, site, asset, w, h, x, y }, i) => (
              <motion.div
                key={i}
                className={`absolute overflow-hidden rounded-[12px] bg-white ${module}`}
                style={{ left: x, top: y, width: w, height: h }}
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  ...soft,
                  delay: 0.05 + i * 0.07,
                  opacity: { duration: 0.4, delay: 0.05 + i * 0.07 },
                }}
              >
                {score && <ScoreCard {...score} />}
                {site && <SiteCard {...site} />}
                {asset && (
                  // Drawn a pixel past the card on every side, which trims the capture's own border.
                  <Image
                    src={asset.src}
                    width={w * 2}
                    height={h * 2}
                    alt=""
                    sizes="(min-width: 768px) 22vw, 44vw"
                    className="absolute -top-px -left-px block max-w-none"
                    style={{ width: w + 2, height: h + 2 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The navigation: one piece, the same for every product. */}
      <nav
        className={`absolute left-[40px] flex w-[240px] flex-col overflow-hidden rounded-[12px] bg-white ${module}`}
        style={{ top: NAV_TOP, height: 560 }}
      >
        <div className="flex h-[56px] shrink-0 items-center px-[16px]">
          <Inline name="logo" width={145} height={31} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-[4px] overflow-hidden px-[4px] [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)]">
          {NAV.map(({ id, label, more, compose, children }) => {
            const here = current === id;
            const expanded = open === id;
            return (
              <div key={id} className="flex shrink-0 flex-col">
                <p
                  className={`relative flex h-[40px] items-center gap-[8px] rounded-[4px] pr-[12px] pl-[15px] leading-[21px] text-[#141a1f] ${
                    here || expanded ? "font-medium" : ""
                  }`}
                >
                  {here && (
                    <motion.span
                      layoutId="source-lit"
                      className="absolute inset-0 rounded-[4px] bg-[#d3ecf8]"
                      transition={lit}
                    >
                      <span className="absolute top-[10px] left-0 h-[20px] w-[2px] bg-[#024e85]" />
                    </motion.span>
                  )}
                  <motion.span
                    className="absolute inset-0 rounded-[4px] bg-[#f1f5f9]"
                    initial={false}
                    animate={{ opacity: expanded && !here ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <Inline name={id} width={18} className="relative mr-[3px]" />
                  <span className="relative flex-1">{label}</span>
                  {compose && (
                    <Sym
                      name="edit_square"
                      size={14}
                      className="relative mr-[2px] text-[#668499]"
                    />
                  )}
                  {more && (
                    <motion.span
                      className="relative flex"
                      initial={false}
                      animate={{ rotate: expanded ? 0 : -90 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Inline name="chevron" width={10} />
                    </motion.span>
                  )}
                </p>
                <AnimatePresence initial={false}>
                  {children && expanded && (
                    <motion.div
                      className="ml-[24px] overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: soft, opacity: { duration: 0.25 } }}
                    >
                      <div className="flex flex-col gap-[4px] pt-[4px] pl-[4px] shadow-[inset_1px_0_0_0_#d3dee3]">
                        {children.map((child, i) => (
                          <motion.p
                            key={child}
                            className={`relative flex h-[36px] shrink-0 items-center rounded-[4px] pr-[12px] pl-[16px] leading-[21px] text-[#52697a] ${
                              current === `${id}-${i}` ? "font-medium" : ""
                            }`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.06 + i * 0.035, ease: "easeOut" }}
                          >
                            {current === `${id}-${i}` && (
                              <motion.span
                                layoutId="source-lit"
                                className="absolute inset-0 rounded-[4px] bg-[#d3ecf8]"
                                transition={lit}
                              >
                                <span className="absolute top-[8px] left-0 h-[20px] w-[2px] bg-[#024e85]" />
                              </motion.span>
                            )}
                            <span className="relative flex-1">{child}</span>
                            {child === "User access" && (
                              <span className="relative flex -rotate-90">
                                <Inline name="chevron" width={10} />
                              </span>
                            )}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="shrink-0 px-[4px] pt-[4px] pb-[4px]">
          <p className="flex h-[40px] items-center gap-[8px] rounded-[4px] pr-[12px] pl-[15px] leading-[21px] text-[#516f7e] shadow-[inset_0_0_0_1px_#c2ced6]">
            <span className="mr-[3px] flex size-[18px] items-center justify-center rounded-[4px] bg-[#036bb5] text-[11px] leading-none font-bold text-white">
              S
            </span>
            <span className="flex-1">The Signal</span>
            <Sym name="unfold_more" size={16} className="text-[#668499]" />
          </p>
        </div>
      </nav>

      <Pointer {...pointer} press={[1, 3, 5, 7, 10].includes(step)} />
    </ProductFrame>
  );
}
