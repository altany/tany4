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

const flag = (code) =>
  /^[A-Z]{2}$/.test(code || "") ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐";

// "/out/linkedin.com" → "linkedin.com", "/download/…-CV.pdf" → "CV (PDF)", "/out/email" → "Email link"
const outboundName = (path) => {
  if (path.startsWith("/download/")) return /cv/i.test(path) ? "CV (PDF)" : path.slice("/download/".length);
  const target = path.slice("/out/".length);
  return target === "email" ? "Email link" : target;
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
  if (!previous || current === null || current === undefined) return null;
  return Math.round(((current - previous) / previous) * 100);
}

// Week-over-week change with whether it is good news: more visitors is good,
// a slower page is not
function change(current, previous, { lowerIsBetter = false } = {}) {
  const pct = percentChange(current, previous);
  if (pct === null) return { text: "no earlier week to compare", short: "first week", tone: "muted" };
  if (pct === 0) return { text: "same as the week before", short: "no change", tone: "muted" };
  const up = pct > 0;
  return {
    text: `${up ? "up" : "down"} ${Math.abs(pct)}% on the week before`,
    short: `${up ? "▲" : "▼"} ${Math.abs(pct)}%`,
    tone: up !== lowerIsBetter ? "good" : "bad",
  };
}

const COLORS = {
  text: "#1f2328",
  muted: "#6b7280",
  border: "#e5e7eb",
  card: "#f9fafb",
  bar: "#6366f1",
  track: "#eef2ff",
  good: "#15803d",
  bad: "#b91c1c",
};

const VERCEL_DASHBOARD = "https://vercel.com/taniapapazaf-6282s-projects/tany4/analytics";
const CLOUDFLARE_DASHBOARD = "https://dash.cloudflare.com/?to=/:account/web-analytics";

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

  const loadTime = cloudflare?.current.loadTimeMs ?? null;
  const tiles = [
    {
      label: "Visitors",
      value: vercel ? number(vercel.totals.visitors) : "–",
      change: vercel && change(vercel.totals.visitors, vercel.previousTotals.visitors),
    },
    {
      label: "Page views",
      value: vercel ? number(vercel.totals.pageviews) : "–",
      change: vercel && change(vercel.totals.pageviews, vercel.previousTotals.pageviews),
    },
    {
      label: "CV downloads",
      value: vercel ? number(vercel.downloads) : "–",
      change: vercel && change(vercel.downloads, vercel.previousDownloads),
    },
    {
      label: "Page load time",
      value: loadTime === null ? "–" : `${number(loadTime)} ms`,
      change: loadTime !== null && change(loadTime, cloudflare.previous.loadTimeMs, { lowerIsBetter: true }),
    },
  ];

  // Lists shown under the numbers; empty ones are left out
  const lists = vercel
    ? [
        {
          title: "Page views by day",
          rows: vercel.days.map((d) => ({ name: formatDay(d.date), value: d.pageviews })),
        },
        { title: "Top pages", rows: vercel.pages.map((r) => ({ name: r.name, value: r.pageviews })) },
        {
          title: "Where visitors came from",
          rows: vercel.referrers.map((r) => ({ name: r.name ? r.name.replace(/^www\./, "") : "Direct or unknown", value: r.visitors })),
        },
        {
          title: "Countries",
          rows: vercel.countries.map((r) => ({ name: countryName(r.name), icon: flag(r.name), value: r.visitors })),
        },
        {
          title: "Link clicks and downloads",
          rows: vercel.outbound
            .map((r) => ({ name: outboundName(r.name), value: r.pageviews }))
            .sort((a, b) => b.value - a.value),
        },
      ].filter((l) => l.rows.length)
    : [];

  const notes = [];
  if (vercel && !vercel.trackedWholeWeek) {
    notes.push("Vercel Web Analytics started on 15 Sept 2026, so this week is incomplete.");
  }
  if (cloudflare) {
    const cf = cloudflare.current;
    notes.push(
      `Cloudflare counted ${number(cf.visits)} visits (${change(cf.visits, cloudflare.previous.visits).text}) and ${number(cf.pageviews)} page views. ` +
        "Page load time is Cloudflare's median." +
        (cf.sampleInterval > 1 || cloudflare.previous.sampleInterval > 1 ? " Its numbers are sampled estimates." : "")
    );
  }

  const text = [
    `tany4.com weekly analytics, ${label}`,
    "",
    ...(warnings.length ? ["Needs a look:", ...warnings.map((w) => `- ${w}`), ""] : []),
    ...tiles.map((t) => `${t.label}: ${t.value}${t.change ? ` (${t.change.text})` : ""}`),
    ...lists.flatMap((l) => ["", `${l.title}:`, ...l.rows.map((r) => `  ${r.name}: ${number(r.value)}`)]),
    ...(notes.length ? ["", ...notes] : []),
    "",
    `Vercel: ${VERCEL_DASHBOARD}`,
    `Cloudflare: ${CLOUDFLARE_DASHBOARD}`,
  ].join("\n");

  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const toneColor = (tone) => COLORS[tone] || COLORS.muted;

  const tileCell = (t, side) =>
    `<td width="50%" valign="top" style="padding:0 ${side === "left" ? "6px" : "0"} 12px ${side === "left" ? "0" : "6px"}">
      <div style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:10px;padding:14px 16px">
        <div style="font-size:13px;color:${COLORS.muted}">${escapeHtml(t.label)}</div>
        <div style="font-size:26px;font-weight:700;color:${COLORS.text};line-height:1.25;margin-top:2px">${escapeHtml(t.value)}</div>
        <div style="font-size:13px;font-weight:600;color:${toneColor(t.change?.tone)};margin-top:2px">${escapeHtml(t.change ? t.change.short : " ")}</div>
      </div>
    </td>`;

  const listHtml = (l) => {
    const max = Math.max(...l.rows.map((r) => r.value), 1);
    return `<h2 style="font-size:15px;color:${COLORS.text};margin:28px 0 8px">${escapeHtml(l.title)}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed">${l.rows
      .map(
        (r) => `<tr>
        <td width="42%" style="padding:5px 12px 5px 0;font-size:14px;color:${COLORS.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.icon ? `${r.icon}&nbsp; ` : ""}${escapeHtml(r.name)}</td>
        <td width="44%" style="padding:5px 0">
          <div style="background:${COLORS.track};border-radius:4px;height:8px"><div style="background:${COLORS.bar};border-radius:4px;height:8px;width:${Math.max(Math.round((r.value / max) * 100), r.value ? 3 : 0)}%"></div></div>
        </td>
        <td width="14%" style="padding:5px 0 5px 12px;font-size:14px;color:${COLORS.text};text-align:right;white-space:nowrap">${number(r.value)}</td>
      </tr>`
      )
      .join("")}</table>`;
  };

  const html = `<div style="background:#ffffff;padding:8px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;font-family:${font};color:${COLORS.text}">
  <tr><td style="padding:8px 16px">
    <div style="font-size:13px;color:${COLORS.muted}"><a href="https://tany4.com" style="color:${COLORS.muted};text-decoration:none">tany4.com</a> · weekly analytics</div>
    <h1 style="font-size:24px;margin:4px 0 16px;color:${COLORS.text}">${escapeHtml(label)}</h1>
    ${
      warnings.length
        ? `<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:12px 16px;margin-bottom:12px">
            <div style="font-weight:600;font-size:14px">Needs a look</div>
            ${warnings.map((w) => `<div style="font-size:14px;margin-top:4px">${escapeHtml(w)}</div>`).join("")}
          </div>`
        : ""
    }
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>${tileCell(tiles[0], "left")}${tileCell(tiles[1], "right")}</tr>
      <tr>${tileCell(tiles[2], "left")}${tileCell(tiles[3], "right")}</tr>
    </table>
    ${lists.map(listHtml).join("")}
    ${notes.map((n) => `<p style="font-size:13px;color:${COLORS.muted};margin:24px 0 0">${escapeHtml(n)}</p>`).join("")}
    <p style="font-size:13px;margin:20px 0 8px;padding-top:16px;border-top:1px solid ${COLORS.border}">
      <a href="${VERCEL_DASHBOARD}" style="color:${COLORS.bar};text-decoration:none;font-weight:600">Open Vercel Analytics</a>
      &nbsp;·&nbsp;
      <a href="${CLOUDFLARE_DASHBOARD}" style="color:${COLORS.bar};text-decoration:none;font-weight:600">Open Cloudflare Web Analytics</a>
    </p>
  </td></tr>
</table>
</div>`;

  return { subject, text, html };
}
