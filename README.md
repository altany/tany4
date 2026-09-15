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

## Tests

- `npm run lint`
- `npm test` builds the site if needed, runs the e2e tests against it in headless Chrome, then the unit tests

GitHub Actions runs lint and `npm test` on every pull request and push to `main`.

## Deploy

The site is hosted on Vercel (Hobby plan).

- Every push to `main` deploys to production at https://tany4.com
- Every pull request gets a preview deployment
- Environment variables are set in the Vercel project: `OPENAI_API_KEY` (chat) and `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` (production only)
- A Vercel Firewall rule rate-limits `/api/chat` to 10 requests per minute per IP

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
- **Vercel Speed Insights** (`@vercel/speed-insights`): real-visitor performance score. Vercel project → Speed Insights.
- **Cloudflare Web Analytics**: loaded only when `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is set (production only). Cloudflare dashboard → Web Analytics. 6 months of history.
