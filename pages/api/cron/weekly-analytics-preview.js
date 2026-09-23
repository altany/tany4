import { previousWeek, last7Days } from "../../../lib/analyticsDigest/period";
import { isCronRequest, collectReport } from "../../../lib/analyticsDigest/run";
import { loadTimeBreakdown } from "../../../lib/analyticsDigest/loadTimeDebug";

// Builds the weekly email for last week and for the last 7 days and writes it to the function logs
// instead of sending it, to check the real numbers without filling the inbox.
// Run it with `vercel crons run /api/cron/weekly-analytics-preview`, then `vercel logs`.
export default async function handler(req, res) {
  if (!isCronRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const results = await Promise.all([previousWeek(), last7Days()].map(collectReport));
  for (const { report } of results) {
    console.log(`[weekly-analytics-preview] ${report.subject}\n\n${report.text}`);
  }
  // Temporary: the same week Cloudflare's own email covers (Sun–Sat), plus our Mon–Sun week
  for (const window of [
    { since: "2026-09-13T00:00:00Z", until: "2026-09-19T23:59:59Z" },
    previousWeek(),
  ]) {
    try {
      console.log(`[loadtime-debug]\n${await loadTimeBreakdown(window)}`);
    } catch (e) {
      console.error("[loadtime-debug]", e.message);
    }
  }

  res.status(200).json({
    sent: false,
    reports: results.map(({ report, problems }) => ({ subject: report.subject, problems })),
  });
}
