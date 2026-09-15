import "../styles/global.scss";
import { useEffect } from "react";
import Script from "next/script";
import { pageview } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CLOUDFLARE_WEB_ANALYTICS_TOKEN } from "../lib/constants";
import { outboundPath } from "../lib/outboundLink";

const MyApp = ({ Component, pageProps }) => {
  // Record clicks on external links, email and file downloads as Vercel page views
  // under /out/... and /download/..., since custom events need a paid plan
  useEffect(() => {
    const handleClick = (event) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const path = outboundPath(link.getAttribute("href"), window.location.origin);
      if (path) pageview({ route: path, path });
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("auxclick", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("auxclick", handleClick, true);
    };
  }, []);

  return (
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
};

export default MyApp;
