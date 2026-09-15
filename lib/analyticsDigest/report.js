const number = (n) => Number(n || 0).toLocaleString("en-GB");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const countryName = (code) => {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch (e) {
    return code;
  }
};

const formatDay = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

// Days with at least three times the usual daily page views (and at least 20),
// where "usual" is the median day of the weeks before
export function findSpikes(days, baselineDays) {
  const usual = median((baselineDays || []).map((d) => d.pageviews));
  const threshold = Math.max(usual * 3, 20);
  return (days || []).filter((d) => d.pageviews >= threshold);
}

// Longest run of consecutive days with no page views
export function longestQuietStreak(days) {
  let longest = 0;
  let current = 0;
  for (const day of days || []) {
    current = day.pageviews === 0 ? current + 1 : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

export function percentChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const vsLastWeek = (current, previous) => {
  const pct = percentChange(current, previous);
  return pct === null ? "no data for the week before" : `${pct > 0 ? "+" : ""}${pct}% vs the week before`;
};

export function buildReport({ label, shortLabel = label, vercel, cloudflare, errors = [] }) {
  const warnings = [];

  if (vercel) {
    const spikes = findSpikes(vercel.days, vercel.baselineDays);
    if (spikes.length) {
      warnings.push(
        `Traffic spike on ${spikes.map((d) => `${formatDay(d.date)} (${number(d.pageviews)} page views)`).join(", ")}`
      );
    }
    const quiet = longestQuietStreak(vercel.days);
    if (quiet >= 3) {
      warnings.push(`${quiet} days in a row with no page views. Check the site and its analytics are working.`);
    }
  }
  for (const error of errors) warnings.push(`Could not load ${error}`);

  // Sent from the owner's own Gmail, so the inbox shows "me" as the sender;
  // the subject has to identify the email on its own
  const subject = [
    `${warnings.length ? "⚠️" : "📊"} tany4.com analytics · ${shortLabel}:`,
    vercel ? `${number(vercel.totals.visitors)} visitors` : "data unavailable",
    warnings.length ? "(needs a look)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const sections = [];

  if (vercel) {
    sections.push({
      title: "Vercel Web Analytics",
      lines: [
        `Visitors: ${number(vercel.totals.visitors)} (${vsLastWeek(vercel.totals.visitors, vercel.previousTotals.visitors)})`,
        `Page views: ${number(vercel.totals.pageviews)} (${vsLastWeek(vercel.totals.pageviews, vercel.previousTotals.pageviews)})`,
      ],
      tables: [
        { title: "Top pages", rows: vercel.pages.map((r) => [r.name, number(r.pageviews)]) },
        {
          title: "Where visitors came from",
          rows: vercel.referrers.map((r) => [r.name || "Direct / unknown", number(r.visitors)]),
        },
        { title: "Countries", rows: vercel.countries.map((r) => [countryName(r.name), number(r.visitors)]) },
        {
          title: "Link clicks and downloads",
          rows: vercel.outbound.map((r) => [r.name, number(r.pageviews)]),
          empty: "None recorded",
        },
      ],
    });
  }

  if (cloudflare) {
    const sampled = cloudflare.current.sampleInterval > 1 || cloudflare.previous.sampleInterval > 1;
    sections.push({
      title: "Cloudflare Web Analytics",
      lines: [
        `Visits: ${number(cloudflare.current.visits)} (${vsLastWeek(cloudflare.current.visits, cloudflare.previous.visits)})`,
        `Page views: ${number(cloudflare.current.pageviews)} (${vsLastWeek(cloudflare.current.pageviews, cloudflare.previous.pageviews)})`,
        sampled ? "Cloudflare samples data older than about a week, so these are estimates and small changes may be noise." : "",
      ].filter(Boolean),
      tables: [],
    });
  }

  const text = [
    `tany4.com weekly analytics, ${label}`,
    "",
    ...(warnings.length ? ["Needs a look:", ...warnings.map((w) => `- ${w}`), ""] : ["Nothing unusual.", ""]),
    ...sections.flatMap((s) => [
      s.title,
      ...s.lines,
      ...s.tables.flatMap((t) => [
        "",
        `${t.title}:`,
        ...(t.rows.length ? t.rows.map(([name, value]) => `  ${name}: ${value}`) : [`  ${t.empty || "No data"}`]),
      ]),
      "",
    ]),
  ].join("\n");

  const table = (t) =>
    `<h3 style="margin:20px 0 6px;font-size:15px">${escapeHtml(t.title)}</h3>` +
    (t.rows.length
      ? `<table style="border-collapse:collapse;width:100%;max-width:520px">${t.rows
          .map(
            ([name, value]) =>
              `<tr><td style="padding:4px 12px 4px 0;border-bottom:1px solid #eee">${escapeHtml(name)}</td><td style="padding:4px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(value)}</td></tr>`
          )
          .join("")}</table>`
      : `<p style="color:#666;margin:0">${escapeHtml(t.empty || "No data")}</p>`);

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#222;line-height:1.5">
<h1 style="font-size:20px;margin:0 0 12px">tany4.com weekly analytics, ${escapeHtml(label)}</h1>
${
  warnings.length
    ? `<div style="background:#fff4e5;border:1px solid #f0c36d;padding:10px 14px;border-radius:6px"><strong>Needs a look</strong><ul style="margin:6px 0 0;padding-left:18px">${warnings
        .map((w) => `<li>${escapeHtml(w)}</li>`)
        .join("")}</ul></div>`
    : `<p style="margin:0">Nothing unusual.</p>`
}
${sections
  .map(
    (s) =>
      `<h2 style="font-size:17px;margin:24px 0 6px">${escapeHtml(s.title)}</h2>${s.lines
        .map((l) => `<p style="margin:2px 0">${escapeHtml(l)}</p>`)
        .join("")}${s.tables.map(table).join("")}`
  )
  .join("")}
</div>`;

  return { subject, text, html };
}
