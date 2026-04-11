import "../styles/global.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import TagManager from "react-gtm-module";
import { NEXT_PUBLIC_GTM_TRACKING_ID } from "../lib/constants";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // Initialise GTM once
  useEffect(() => {
    TagManager.initialize({ gtmId: NEXT_PUBLIC_GTM_TRACKING_ID });
  }, []);

  // Send a pageview event to the GTM dataLayer on every route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      TagManager.dataLayer({
        dataLayer: {
          event: "pageview",
          page: url,
        },
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default MyApp;
