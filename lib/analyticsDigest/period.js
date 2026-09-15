const DAY = 24 * 60 * 60 * 1000;

const formatDate = (date, withYear) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });

// A range from `start` (inclusive) to `end` (exclusive), both UTC midnights.
// `until` is the last millisecond before `end`.
function range(start, end) {
  const lastDay = new Date(end.getTime() - DAY);
  const sameMonth = start.getUTCMonth() === lastDay.getUTCMonth();
  return {
    since: start.toISOString(),
    until: new Date(end.getTime() - 1).toISOString(),
    label: `${formatDate(start, false)} – ${formatDate(lastDay, true)}`,
    // Fits an inbox subject line: "7–13 Sept" or "31 Aug – 6 Sept"
    shortLabel: sameMonth
      ? `${start.getUTCDate()}–${formatDate(lastDay, false)}`
      : `${formatDate(start, false)} – ${formatDate(lastDay, false)}`,
  };
}

// The Monday-to-Sunday week (UTC) before the week containing `now`
export function previousWeek(now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysSinceMonday = (new Date(today).getUTCDay() + 6) % 7;
  const thisMonday = today - daysSinceMonday * DAY;
  return range(new Date(thisMonday - 7 * DAY), new Date(thisMonday));
}

// The `weeks` weeks immediately before the one `r` covers
export function weeksBefore(r, weeks = 1) {
  const start = new Date(r.since).getTime();
  return range(new Date(start - weeks * 7 * DAY), new Date(start));
}

// The 7 full days before today (UTC), for a test email mid-week
export function last7Days(now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return range(new Date(today - 7 * DAY), new Date(today));
}
