import { previousWeek, last7Days } from "../../../lib/analyticsDigest/period";
import { getVercelWeek } from "../../../lib/analyticsDigest/vercel";
import { getCloudflareWeek } from "../../../lib/analyticsDigest/cloudflare";
import { buildReport } from "../../../lib/analyticsDigest/report";
import { sendReport } from "../../../lib/analyticsDigest/email";

// Emails last week's analytics. Vercel Cron calls this every Monday with
// `Authorization: Bearer $CRON_SECRET`; `?range=last-7-days` sends a test email mid-week.
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const range = req.query.range === "last-7-days" ? last7Days() : previousWeek();
  const errors = [];

  const [vercel, cloudflare] = await Promise.all([
    getVercelWeek(range).catch((e) => {
      console.error("[weekly-analytics] Vercel:", e.message);
      errors.push(`Vercel Web Analytics (${e.message})`);
      return null;
    }),
    getCloudflareWeek(range).catch((e) => {
      console.error("[weekly-analytics] Cloudflare:", e.message);
      errors.push(`Cloudflare Web Analytics (${e.message})`);
      return null;
    }),
  ]);

  try {
    const id = await sendReport(buildReport({ label: range.label, shortLabel: range.shortLabel, vercel, cloudflare, errors }));
    res.status(200).json({ sent: true, id, problems: errors.length });
  } catch (e) {
    console.error("[weekly-analytics] email:", e.message);
    res.status(500).json({ sent: false });
  }
}
