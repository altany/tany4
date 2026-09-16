import { previousWeek, last7Days } from "../../../lib/analyticsDigest/period";
import { collectReport } from "../../../lib/analyticsDigest/run";

// Returns the weekly email as JSON instead of sending it, so a pull request can be
// checked against real analytics before merging. Only on preview deployments, which
// Vercel Authentication keeps private; open it with
// `vercel curl /api/cron/weekly-analytics-preview --deployment <preview url>`.
// `?range=last-7-days` for the last 7 days instead of last week.
export default async function handler(req, res) {
  if (process.env.VERCEL_ENV !== "preview") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const range = req.query.range === "last-7-days" ? last7Days() : previousWeek();
  const { report, problems } = await collectReport(range);
  res.status(200).json({ problems, subject: report.subject, text: report.text });
}
