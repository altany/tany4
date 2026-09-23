import { weeksBefore } from "./period";

const GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";
const HEX_32 = /^[0-9a-f]{32}$/i;
// Filtering by hostname rather than site tag: the site tag is not the beacon token
// and is only shown in the Cloudflare dashboard
const HOSTS = ["tany4.com", "www.tany4.com"];

async function week(r) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !accountTag) throw new Error("CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID is not set");
  if (!HEX_32.test(accountTag)) throw new Error("the Cloudflare account ID is not a 32-character hex value");

  const filter = `{ requestHost_in: ${JSON.stringify(HOSTS)}, datetime_geq: "${r.since}", datetime_leq: "${r.until}" }`;
  const query = `{
    viewer {
      accounts(filter: { accountTag: "${accountTag}" }) {
        pageloads: rumPageloadEventsAdaptiveGroups(limit: 1, filter: ${filter}) {
          count
          sum { visits }
          avg { sampleInterval }
        }
        performance: rumPerformanceEventsAdaptiveGroups(limit: 1, filter: ${filter}) {
          count
          quantiles { pageLoadTimeP50 }
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

  // An empty list rather than an error when the token cannot read the account
  const account = body.data?.viewer?.accounts?.[0];
  if (!account) throw new Error("the API token cannot read this account's analytics");

  const pageloads = account.pageloads?.[0];
  const performance = account.performance?.[0];
  return {
    pageviews: pageloads?.count || 0,
    visits: pageloads?.sum?.visits || 0,
    sampleInterval: pageloads?.avg?.sampleInterval || 1,
    // Median page load time, reported in microseconds
    loadTimeMs: performance?.count ? Math.round(performance.quantiles.pageLoadTimeP50 / 1000) : null,
    // How many page loads that median is taken from; it swings wildly when there are few
    loadTimeSamples: performance?.count || 0,
  };
}

// Cloudflare Web Analytics totals for the week `r` and the week before
export async function getCloudflareWeek(r) {
  const [current, previous] = await Promise.all([week(r), week(weeksBefore(r, 1))]);
  return { current, previous };
}
