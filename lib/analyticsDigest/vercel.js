import { weeksBefore } from "./period";

// tany4 on the personal Hobby account; identifiers, not credentials
const PROJECT_ID = "prj_9Dt7bnuKWq1TbB2e1ZpibHboYtsF";
const TEAM_ID = "team_4Y69bYMsJxEOwQEHr8VHUiIZ";
const API = "https://api.vercel.com/v1/query/web-analytics/visits";

// Link clicks and downloads are recorded as page views under these paths
const isVirtualPath = (path) => path.startsWith("/out/") || path.startsWith("/download/");

async function query(endpoint, params) {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  if (!token) throw new Error("VERCEL_ANALYTICS_TOKEN is not set");

  const url = new URL(`${API}/${endpoint}`);
  url.search = new URLSearchParams({ projectId: PROJECT_ID, teamId: TEAM_ID, ...params }).toString();
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Vercel API returned ${response.status} for ${endpoint}`);
  return (await response.json()).data;
}

// Aggregates round `until` up to the next hour or day, so the last millisecond of the
// range covers exactly the whole last day
const window = (r) => ({ since: r.since, until: r.until });
// Counts round `until` down to midnight and exclude it, so they need the midnight after
const countWindow = (r) => ({ since: r.since, until: new Date(Date.parse(r.until) + 1).toISOString() });

async function totals(r) {
  const [count, paths] = await Promise.all([
    query("count", countWindow(r)),
    query("aggregate", { ...window(r), by: "requestPath", limit: "100" }),
  ]);
  const virtualViews = paths
    .filter((p) => isVirtualPath(p.requestPath))
    .reduce((sum, p) => sum + p.pageviews, 0);
  return {
    visitors: count.visitors,
    pageviews: Math.max(count.pageviews - virtualViews, 0),
    paths,
  };
}

// The API leaves out days with no traffic; put them back as zeros so a silent
// week reads as quiet days rather than no days
function everyDay(r, rows) {
  const pageviews = new Map(rows.map((d) => [d.timestamp.slice(0, 10), d.pageviews]));
  const days = [];
  for (let t = Date.parse(r.since); t <= Date.parse(r.until); t += 24 * 60 * 60 * 1000) {
    const date = new Date(t).toISOString();
    days.push({ date, pageviews: pageviews.get(date.slice(0, 10)) || 0 });
  }
  return days;
}

// Production analytics for the week `r`, with the week before and the three weeks
// before that as a baseline for spotting unusual days
export async function getVercelWeek(r) {
  const previous = weeksBefore(r, 1);
  const baseline = weeksBefore(r, 3);

  const [current, before, days, baselineDays, referrers, countries] = await Promise.all([
    totals(r),
    totals(previous),
    query("aggregate", { ...window(r), by: "day" }),
    query("aggregate", { ...window(baseline), by: "day" }),
    query("aggregate", { ...window(r), by: "referrerHostname", limit: "10" }),
    query("aggregate", { ...window(r), by: "country", limit: "10" }),
  ]);

  return {
    totals: { visitors: current.visitors, pageviews: current.pageviews },
    previousTotals: { visitors: before.visitors, pageviews: before.pageviews },
    days: everyDay(r, days),
    baselineDays: everyDay(baseline, baselineDays),
    pages: current.paths
      .filter((p) => !isVirtualPath(p.requestPath))
      .slice(0, 10)
      .map((p) => ({ name: p.requestPath, pageviews: p.pageviews })),
    referrers: referrers.map((x) => ({ name: x.referrerHostname, visitors: x.visitors })),
    countries: countries.map((x) => ({ name: x.country, visitors: x.visitors })),
    outbound: current.paths
      .filter((p) => isVirtualPath(p.requestPath))
      .map((p) => ({ name: p.requestPath, pageviews: p.pageviews })),
  };
}
