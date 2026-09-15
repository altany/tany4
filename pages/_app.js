import "../styles/global.scss";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CLOUDFLARE_WEB_ANALYTICS_TOKEN } from "../lib/constants";

const MyApp = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Analytics />
    <SpeedInsights />
    {/* Cloudflare Web Analytics, only where a site token is configured */}
    {CLOUDFLARE_WEB_ANALYTICS_TOKEN && (
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN })}
        strategy="afterInteractive"
      />
    )}
  </>
);

export default MyApp;
