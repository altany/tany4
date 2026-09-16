This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## CV

- **Edit CV content**
  - Update `src/cv/cv.ts` (single source of truth)
- **View CV on web**
  - `http://localhost:3000/cv`
- **Regenerate PDF**
  - `npm run cv:pdf`
  - Output: `public/TaniaPapazafeiropoulou-CV.pdf`

The PDF is generated using `@react-pdf/renderer` from `src/cv/pdf/CvPdfDocument.tsx`. No browser or Playwright required.

## Analytics

All cookieless, so no consent banner is needed:

- **Vercel Web Analytics** (`@vercel/analytics`): visitors, pages, referrers, countries, devices. Vercel project → Analytics. Free up to 50,000 events a month, 30 days of history.
  - Clicks on external links, email links and file downloads are recorded as page views under `/out/<site>` (e.g. `/out/linkedin.com`, `/out/email`) and `/download/<file>` (e.g. `/download/TaniaPapazafeiropoulou-CV.pdf`), because custom events need a paid plan. They add to the page-view total.
- **Vercel Speed Insights** (`@vercel/speed-insights`): real-visitor performance score. Vercel project → Speed Insights.
- **Cloudflare Web Analytics**: loaded only when `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is set (production only). Cloudflare dashboard → Web Analytics. 6 months of history.

### Weekly email

Every Monday around 05:00 UTC, Vercel Cron calls `/api/cron/weekly-analytics`, which emails last week's numbers (Monday to Sunday, UTC) to hello@tany4.com. It sends over SMTP from an existing mailbox: Gmail with an app password by default. It includes visitors and page views against the week before, top pages, referrers, countries and link clicks from Vercel, plus Cloudflare's visits, page views and median page load time. It flags days with unusual spikes and runs of days with no traffic.

Vercel project environment variables (Production):

- `CRON_SECRET`: random string. Vercel sends it to the endpoint, and requests without it are rejected.
- `VERCEL_ANALYTICS_TOKEN`: Vercel access token scoped to the personal account, used to read Web Analytics
- `SMTP_USER`: the mailbox that sends the email, e.g. the Gmail address
- `SMTP_PASSWORD`: that mailbox's app password (Google Account → Security → 2-Step Verification → App passwords)
- `SMTP_HOST` (optional): defaults to `smtp.gmail.com`; e.g. `smtp.zoho.com` for a Zoho plan with SMTP access
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Account Analytics Read
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

If a data source fails, the email still goes out and says what couldn't be loaded. To send a test email for the last 7 days, trigger the cron job from the Vercel dashboard, or call the endpoint with the `CRON_SECRET` header and `?range=last-7-days`.

To check the real numbers without sending an email, run the preview job. It builds the email for the last 7 days and writes it to the function logs. It is registered as a cron job (once a year, on 1 January) only so it can be triggered on demand:

```bash
vercel crons run /api/cron/weekly-analytics-preview
vercel logs --environment production --since 5m
```
