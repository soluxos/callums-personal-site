// Server component. The contribution calendar as nothing but its grid of squares: no card,
// labels, key or repos. Hovering a square shows that day's count. Used on the home page.
// Data comes from src/lib/github.js, and it renders nothing if GitHub can't be reached.

import FadeInUp from "@/components/FadeInUp/FadeInUp";
import { MIN_WEEKS, PROFILE_URL, getContributions } from "@/lib/github";

// Weeks shown below the md breakpoint, so the squares stay big enough to see.
const MOBILE_WEEKS = MIN_WEEKS;

// An empty day, then four levels. On a dark wall the squares are white, and busier days are
// more solid.
const COLOURS = {
  dark: [
    "rgb(255 255 255 / 0.1)",
    "rgb(255 255 255 / 0.3)",
    "rgb(255 255 255 / 0.5)",
    "rgb(255 255 255 / 0.75)",
    "rgb(255 255 255)",
  ],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

function formatDay({ date, count }) {
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  if (count === 0) return `No contributions on ${day}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

// Tooltips are centred on their square, except near either edge of the grid, where they line up
// with it instead so they stay on screen.
function tooltipAlign(i, weekCount) {
  if (weekCount - 1 - i < 6) return "after:right-0";
  if (i < 6) return "after:left-0";
  // The first weeks shown on small screens sit at the left edge there.
  const mobileIndex = i - (weekCount - MOBILE_WEEKS);
  if (mobileIndex >= 0 && mobileIndex < 6) {
    return "after:left-0 md:after:left-1/2 md:after:-translate-x-1/2";
  }
  return "after:left-1/2 after:-translate-x-1/2";
}

// The tooltip: the day's count, in a small label above the square while it's hovered.
const TOOLTIP = {
  dark: "after:bg-white after:text-[#1f2328]",
  light: "after:bg-[#25292e] after:text-white",
};

export default async function GitHubGrid({ tone = "dark" }) {
  const data = await getContributions();
  if (!data) return null;

  const { weeks, total } = data;
  const colours = COLOURS[tone] || COLOURS.dark;

  return (
    <FadeInUp>
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-ppmondwest text-[24px] leading-[1.25]">GitHub contributions</h2>
          <a
            href={PROFILE_URL}
            className="shrink-0 text-[13px] font-medium text-[#6b6b6b] transition-colors hover:text-[#2a2a2a]"
          >
            View on GitHub →
          </a>
        </div>

        {/* One grid column per week. Older weeks drop out on small screens. */}
        <div
          role="img"
          aria-label={`${total.toLocaleString("en-GB")} contributions on GitHub in the last year`}
          className="grid grid-flow-col grid-rows-7 gap-[3px] grid-cols-[repeat(var(--mobile-weeks),minmax(0,1fr))] md:grid-cols-[repeat(var(--weeks),minmax(0,1fr))]"
          style={{
            "--weeks": weeks.length,
            "--mobile-weeks": Math.min(MOBILE_WEEKS, weeks.length),
          }}
        >
          {weeks.map((week, i) => {
            const visibility = i < weeks.length - MOBILE_WEEKS ? "hidden md:block" : "block";
            return week.map((day, d) =>
              day ? (
                <span
                  key={`${i}-${d}`}
                  data-tip={formatDay(day)}
                  aria-hidden="true"
                  className={`relative aspect-square rounded-[3px] ${visibility} ${tooltipAlign(i, weeks.length)} ${TOOLTIP[tone] || TOOLTIP.dark} after:pointer-events-none after:absolute after:bottom-[calc(100%+6px)] after:z-10 after:whitespace-nowrap after:rounded-[6px] after:px-2 after:py-1 after:text-[12px] after:font-medium after:leading-[1.5] after:opacity-0 after:shadow-[0_4px_16px_rgba(0,0,0,0.18)] after:transition-opacity after:content-[attr(data-tip)] hover:outline-2 hover:outline-white/70 hover:after:opacity-100`}
                  style={{ backgroundColor: colours[day.level] }}
                />
              ) : (
                <span key={`${i}-${d}`} className={`aspect-square ${visibility}`} />
              )
            );
          })}
        </div>
      </section>
    </FadeInUp>
  );
}
