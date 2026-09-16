import { getVercelWeek } from "./vercel";
import { getCloudflareWeek } from "./cloudflare";
import { buildReport } from "./report";

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`
export function isCronRequest(req) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.authorization === `Bearer ${secret}`;
}

// Loads both sources for `range` and builds the email; a failed source is noted
// in the report rather than stopping it
export async function collectReport(range) {
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
  const report = buildReport({ label: range.label, shortLabel: range.shortLabel, vercel, cloudflare, errors });
  return { report, problems: errors.length };
}
