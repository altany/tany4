import { previousWeek, last7Days } from "../../../lib/analyticsDigest/period";
import { isCronRequest, collectReport } from "../../../lib/analyticsDigest/run";
import { sendReport } from "../../../lib/analyticsDigest/email";

// Emails last week's analytics. Vercel Cron calls this every Monday with
// `Authorization: Bearer $CRON_SECRET`; `?range=last-7-days` sends a test email mid-week.
export default async function handler(req, res) {
  if (!isCronRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const range = req.query.range === "last-7-days" ? last7Days() : previousWeek();
  const { report, problems } = await collectReport(range);

  try {
    const id = await sendReport(report);
    res.status(200).json({ sent: true, id, problems });
  } catch (e) {
    console.error("[weekly-analytics] email:", e.message);
    res.status(500).json({ sent: false });
  }
}
