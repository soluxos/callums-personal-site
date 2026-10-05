// Server component. Draws the contribution calendar and the three repos worked on
// most, from data in src/lib/github.js. Renders nothing if GitHub can't be reached.

import FadeInUp from "@/components/FadeInUp/FadeInUp";
import { MIN_WEEKS, PROFILE_URL, getContributions, getTopRepos } from "@/lib/github";

// Weeks shown below the md breakpoint, so the squares stay big enough to read.
const MOBILE_WEEKS = MIN_WEEKS;

// GitHub's light theme: an empty day, then its four contribution levels.
const LEVEL_COLOURS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

// Sunday-first rows, labelled the way GitHub labels them.
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// The two labels above the graph and the repo cards share one style.
const LABEL = "text-[16px] font-medium leading-[1.5]";

// Octicons (MIT): repo and lock, as GitHub shows them on repo cards.
const REPO_ICON =
  "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z";
const LOCK_ICON =
  "M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z";

function RepoCard({ repo, total, unit }) {
  const share = total ? Math.round((repo.count / total) * 100) : 0;
  return (
    <li
      className={`relative flex min-w-0 flex-col gap-3 rounded-[16px] bg-white p-5 ${repo.url ? "transition-colors hover:bg-[#fafbfc]" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="#59636e"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d={repo.isPrivate ? LOCK_ICON : REPO_ICON} />
        </svg>
        {repo.url ? (
          // The link stretches over the whole card, so anywhere on it opens the repo.
          <a
            href={repo.url}
            className="min-w-0 truncate text-[14px] font-semibold leading-[1.5] text-[#0969da] after:absolute after:inset-0 after:rounded-[16px] after:content-[''] hover:underline"
          >
            {repo.name}
          </a>
        ) : (
          <span className="min-w-0 truncate text-[14px] font-semibold leading-[1.5] text-[#1f2328]">
            {repo.name}
          </span>
        )}
        <span
          className={`ml-auto shrink-0 rounded-full px-[7px] text-[12px] font-medium leading-[18px] ${
            repo.isPrivate ? "bg-[#fff8c5] text-[#9a6700]" : "bg-[#eff2f5] text-[#59636e]"
          }`}
        >
          {repo.isPrivate ? "Private" : "Public"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-2 overflow-hidden rounded-full bg-[#ebedf0]" aria-hidden="true">
          <div className="h-full rounded-full bg-[#40c463]" style={{ width: `${share}%` }} />
        </div>
        <p className="text-[12px] leading-[1.5] text-[#59636e]">
          {repo.count.toLocaleString("en-GB")} {unit} · {share}% of the year&apos;s {unit}
        </p>
      </div>
    </li>
  );
}

function formatDay({ date, count }) {
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  if (count === 0) return `No contributions on ${day}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

// Tooltips are centred on their square, except near either edge of the graph,
// where they line up with it instead so they stay on screen.
function tooltipAlign(i, weekCount) {
  const center = "after:left-1/2 after:-translate-x-1/2";
  if (weekCount - 1 - i < 6) return "after:right-0";
  if (i < 6) return "after:left-0";
  // The first weeks shown on small screens sit at the left edge there.
  const mobileIndex = i - (weekCount - MOBILE_WEEKS);
  if (mobileIndex >= 0 && mobileIndex < 6) {
    return "after:left-0 md:after:left-1/2 md:after:-translate-x-1/2";
  }
  return center;
}

// A month label sits above the first week that starts in a new month.
function monthLabel(week, previousWeek) {
  const first = week.find(Boolean);
  const before = previousWeek?.find(Boolean);
  if (!first) return null;
  if (before && before.date.slice(0, 7) === first.date.slice(0, 7)) return null;
  return new Date(`${first.date}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });
}

export default async function GitHubContributions() {
  const data = await getContributions();
  if (!data) return null;

  const { weeks, total } = data;
  const days = weeks.flat().filter(Boolean);
  const topRepos = await getTopRepos(days[0].date, days[days.length - 1].date, total);
  // Drop a month label when the next one starts within two weeks, so they don't overlap.
  const labels = weeks.map((week, i) => monthLabel(week, weeks[i - 1]));
  labels.forEach((label, i) => {
    if (label && (labels[i + 1] || labels[i + 2])) labels[i] = null;
  });
  const totalText = `${total.toLocaleString("en-GB")} contributions in the last year`;

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

        <div className="flex flex-col gap-2">
          <p className={LABEL}>{totalText}</p>

          <div className="rounded-[16px] bg-white px-5 pb-4 pt-5">
            {/* One grid column per week. Older weeks drop out on small screens. */}
            <div
              role="img"
              aria-label={`${totalText} on GitHub`}
              className="grid grid-flow-col grid-rows-[auto_repeat(7,auto)] gap-[3px] grid-cols-[auto_repeat(var(--mobile-weeks),minmax(0,1fr))] md:grid-cols-[auto_repeat(var(--weeks),minmax(0,1fr))]"
              style={{
                "--weeks": weeks.length,
                "--mobile-weeks": Math.min(MOBILE_WEEKS, weeks.length),
              }}
            >
              <span className="h-[15px]" />
              {DAY_LABELS.map((label, d) => (
                <span key={d} className="relative w-[28px]" aria-hidden="true">
                  {label && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12px] leading-none text-[#59636e]">
                      {label}
                    </span>
                  )}
                </span>
              ))}

              {weeks.map((week, i) => {
                const visibility = i < weeks.length - MOBILE_WEEKS ? "hidden md:block" : "block";
                return [
                  <span
                    key={`${i}-month`}
                    className={`relative h-[15px] ${visibility}`}
                    aria-hidden="true"
                  >
                    {labels[i] && (
                      <span className="absolute bottom-[3px] left-0 whitespace-nowrap text-[12px] leading-none text-[#59636e]">
                        {labels[i]}
                      </span>
                    )}
                  </span>,
                  ...week.map((day, d) =>
                    day ? (
                      <span
                        key={`${i}-${d}`}
                        data-tip={formatDay(day)}
                        aria-hidden="true"
                        className={`relative aspect-square rounded-[2px] ${visibility} ${tooltipAlign(i, weeks.length)} after:pointer-events-none after:absolute after:bottom-[calc(100%+6px)] after:z-10 after:whitespace-nowrap after:rounded-[6px] after:bg-[#25292e] after:px-2 after:py-1 after:text-[12px] after:leading-[1.5] after:text-white after:opacity-0 after:content-[attr(data-tip)] hover:after:opacity-100`}
                        style={{ backgroundColor: LEVEL_COLOURS[day.level] }}
                      />
                    ) : (
                      <span key={`${i}-${d}`} className={`aspect-square ${visibility}`} />
                    )
                  ),
                ];
              })}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 text-[12px] leading-[1.5] text-[#59636e]">
              <p>
                <span className="md:hidden">Showing the last six months</span>
              </p>
              <div className="flex items-center gap-[3px]" aria-hidden="true">
                <span className="mr-1">Less</span>
                {LEVEL_COLOURS.map(colour => (
                  <span
                    key={colour}
                    className="h-[10px] w-[10px] rounded-[2px]"
                    style={{ backgroundColor: colour }}
                  />
                ))}
                <span className="ml-1">More</span>
              </div>
            </div>
          </div>

          {topRepos && (
            <div className="mt-4 flex flex-col gap-2">
              <h3 className={LABEL}>Most worked on this year</h3>
              <ul className="grid gap-3 md:grid-cols-3">
                {topRepos.repos.map(repo => (
                  <RepoCard
                    key={repo.name}
                    repo={repo}
                    total={topRepos.total}
                    unit={topRepos.unit}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </FadeInUp>
  );
}
