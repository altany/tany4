const GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";

// Temporary: works out why Cloudflare's own weekly email reports a much higher median
// page load time than this digest does. Writes the breakdown to the function logs.
async function graphql(query) {
  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const body = await response.json();
  if (body.errors?.length) throw new Error(body.errors[0].message);
  return body.data?.viewer?.accounts?.[0];
}

export async function loadTimeBreakdown({ since, until }) {
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  const window = `datetime_geq: "${since}", datetime_leq: "${until}"`;
  const hosts = ["tany4.com", "www.tany4.com"];

  const data = await graphql(`{
    viewer {
      accounts(filter: { accountTag: "${accountTag}" }) {
        allHosts: rumPerformanceEventsAdaptiveGroups(limit: 20, filter: { ${window} }, orderBy: [count_DESC]) {
          count
          dimensions { requestHost }
          quantiles { pageLoadTimeP50 }
        }
        allHostsTotal: rumPerformanceEventsAdaptiveGroups(limit: 1, filter: { ${window} }) {
          count
          quantiles { pageLoadTimeP50 }
        }
        siteHostsOnly: rumPerformanceEventsAdaptiveGroups(limit: 1, filter: { requestHost_in: ${JSON.stringify(hosts)}, ${window} }) {
          count
          quantiles { pageLoadTimeP50 }
        }
        byDevice: rumPerformanceEventsAdaptiveGroups(limit: 10, filter: { requestHost_in: ${JSON.stringify(hosts)}, ${window} }, orderBy: [count_DESC]) {
          count
          dimensions { deviceType }
          quantiles { pageLoadTimeP50 }
        }
        byDay: rumPerformanceEventsAdaptiveGroups(limit: 40, filter: { requestHost_in: ${JSON.stringify(hosts)}, ${window} }, orderBy: [date_ASC]) {
          count
          dimensions { date }
          quantiles { pageLoadTimeP50 }
        }
      }
    }
  }`);

  const ms = (micro) => (micro == null ? "–" : `${Math.round(micro / 1000)} ms`);
  const lines = [
    `window ${since} → ${until}`,
    `every host together: ${data.allHostsTotal?.[0]?.count ?? 0} samples, p50 ${ms(data.allHostsTotal?.[0]?.quantiles?.pageLoadTimeP50)}`,
    `tany4.com only:      ${data.siteHostsOnly?.[0]?.count ?? 0} samples, p50 ${ms(data.siteHostsOnly?.[0]?.quantiles?.pageLoadTimeP50)}`,
    "per host:",
    ...data.allHosts.map((r) => `  ${r.dimensions.requestHost}: ${r.count} samples, p50 ${ms(r.quantiles.pageLoadTimeP50)}`),
    "per device (tany4.com):",
    ...data.byDevice.map((r) => `  ${r.dimensions.deviceType || "unknown"}: ${r.count} samples, p50 ${ms(r.quantiles.pageLoadTimeP50)}`),
    "per day (tany4.com):",
    ...data.byDay.map((r) => `  ${r.dimensions.date}: ${r.count} samples, p50 ${ms(r.quantiles.pageLoadTimeP50)}`),
  ];
  return lines.join("\n");
}
