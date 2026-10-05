// Server only. Data for the homepage's GitHub section. Every function returns null
// when GitHub can't be reached or answers in a shape we don't expect, so the page
// leaves the section out instead of showing something wrong.

export const USERNAME = "soluxos";
export const PROFILE_URL = `https://github.com/${USERNAME}`;
const REVALIDATE_SECONDS = 60 * 60 * 12;
const USER_AGENT = "callum-harrod-portfolio";

// Weeks of the calendar we need at minimum (the graph shows 26 on small screens).
export const MIN_WEEKS = 26;

// The contribution calendar from the public HTML the profile page loads. No token.
export async function getContributions() {
  try {
    const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Tooltips hold the counts ("3 contributions on October 1st."), keyed by cell id.
    const counts = {};
    for (const [, id, text] of html.matchAll(
      /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)</g
    )) {
      counts[id] = Number(text.match(/^(\d+) contributions?/)?.[1] ?? 0);
    }

    // Cell ids are contribution-day-component-<weekday>-<week>.
    const weeks = [];
    const cells = html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-(\d+)-(\d+))" data-level="(\d)"/g
    );
    for (const [, date, id, weekday, week, level] of cells) {
      weeks[week] ??= Array(7).fill(null);
      weeks[week][weekday] = { date, level: Number(level), count: counts[id] ?? 0 };
    }
    if (weeks.length < MIN_WEEKS) return null;

    const heading = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
    const total = heading
      ? Number(heading[1].replace(/,/g, ""))
      : weeks.flat().reduce((sum, day) => sum + (day?.count ?? 0), 0);

    return { weeks: Array.from(weeks, week => week ?? Array(7).fill(null)), total };
  } catch {
    return null;
  }
}

const shortName = fullName =>
  fullName.startsWith(`${USERNAME}/`) ? fullName.slice(USERNAME.length + 1) : fullName;

// With a token, commit search names every repo, private ones included. It counts
// commits rather than GitHub's wider "contributions", so the cards say commits.
// Search stops at 1,000 results; past that the shares would be wrong, so we bail.
async function getTopReposFromSearch(firstDate, token) {
  const query = encodeURIComponent(`author:${USERNAME} author-date:>=${firstDate}`);
  const repos = new Map();
  let counted = 0;

  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/search/commits?q=${query}&per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "User-Agent": USER_AGENT,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) return null;
    const {
      items = [],
      total_count: totalCount,
      incomplete_results: incomplete,
    } = await res.json();
    if (incomplete || totalCount > 1000) return null;

    for (const { repository } of items) {
      const entry = repos.get(repository.full_name) ?? {
        name: shortName(repository.full_name),
        count: 0,
        isPrivate: repository.private,
        // Only public repos get a link; a visitor couldn't open a private one.
        url: repository.private ? null : `https://github.com/${repository.full_name}`,
      };
      entry.count += 1;
      repos.set(repository.full_name, entry);
    }
    counted += items.length;
    if (counted >= totalCount || items.length < 100) break;
  }

  if (!counted) return null;
  const ranked = [...repos.values()].sort((a, b) => b.count - a.count);
  return { repos: ranked.slice(0, 3), total: counted, unit: "commits" };
}

// Without a token, the profile timeline (a month at a time) names public repos and
// rolls private work into one count. All months or nothing, so a failed request
// can't produce a misleading ranking.
async function getTopReposFromTimeline(firstDate, lastDate, total) {
  const end = new Date(`${lastDate}T00:00:00Z`);
  const ranges = [];
  for (
    let month = new Date(`${firstDate.slice(0, 7)}-01T00:00:00Z`);
    month <= end;
    month.setUTCMonth(month.getUTCMonth() + 1)
  ) {
    const monthEnd = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0));
    ranges.push({
      from: ranges.length ? month.toISOString().slice(0, 10) : firstDate,
      to: (monthEnd < end ? monthEnd : end).toISOString().slice(0, 10),
    });
  }

  const pages = await Promise.all(
    ranges.map(async ({ from, to }) => {
      const res = await fetch(`${PROFILE_URL}?tab=overview&from=${from}&to=${to}`, {
        headers: { "User-Agent": USER_AGENT, "X-Requested-With": "XMLHttpRequest" },
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!res.ok) throw new Error(`GitHub timeline ${res.status}`);
      return res.text();
    })
  );

  const repos = new Map();
  let privateCount = 0;
  for (const html of pages) {
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");
    for (const [, name, count] of text.matchAll(/([\w.-]+\/[\w.-]+) (\d+) commits?\b/g)) {
      repos.set(name, (repos.get(name) ?? 0) + Number(count));
    }
    privateCount += Number(text.match(/(\d+) contributions? in private repositories/)?.[1] ?? 0);
  }

  const ranked = [...repos].map(([name, count]) => ({
    name: shortName(name),
    count,
    isPrivate: false,
    url: `https://github.com/${name}`,
  }));
  if (privateCount) {
    ranked.push({ name: "Private repositories", count: privateCount, isPrivate: true, url: null });
  }
  if (!ranked.length) return null;
  ranked.sort((a, b) => b.count - a.count);
  return { repos: ranked.slice(0, 3), total, unit: "contributions" };
}

// The three repos worked on most since `firstDate`. Uses GITHUB_TOKEN when it's set
// (server-only, never sent to the browser), and the public timeline otherwise.
export async function getTopRepos(firstDate, lastDate, total) {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const fromSearch = await getTopReposFromSearch(firstDate, token);
      if (fromSearch) return fromSearch;
    }
    return await getTopReposFromTimeline(firstDate, lastDate, total);
  } catch {
    return null;
  }
}
