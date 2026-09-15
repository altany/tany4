import { weeksBefore } from "./period";

const GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";
const HEX_32 = /^[0-9a-f]{32}$/i;

async function week(r) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  // The Web Analytics site tag; for sites set up with the JS snippet it is the beacon token
  const siteTag = process.env.CLOUDFLARE_SITE_TAG || process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  if (!token || !accountTag || !siteTag) {
    throw new Error("CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID or the site tag is not set");
  }
  if (!HEX_32.test(accountTag) || !HEX_32.test(siteTag)) {
    throw new Error("the Cloudflare account ID or site tag is not a 32-character hex value");
  }

  const query = `{
    viewer {
      accounts(filter: { accountTag: "${accountTag}" }) {
        rumPageloadEventsAdaptiveGroups(
          limit: 1
          filter: { siteTag: "${siteTag}", datetime_geq: "${r.since}", datetime_leq: "${r.until}" }
        ) {
          count
          sum { visits }
          avg { sampleInterval }
        }
      }
    }
  }`;

  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`Cloudflare API returned ${response.status}`);
  const body = await response.json();
  if (body.errors?.length) throw new Error(`Cloudflare API: ${body.errors[0].message}`);

  const group = body.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0];
  return {
    pageviews: group?.count || 0,
    visits: group?.sum?.visits || 0,
    sampleInterval: group?.avg?.sampleInterval || 1,
  };
}

// Cloudflare Web Analytics totals for the week `r` and the week before
export async function getCloudflareWeek(r) {
  const [current, previous] = await Promise.all([week(r), week(weeksBefore(r, 1))]);
  return { current, previous };
}
