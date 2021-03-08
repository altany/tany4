import "../styles/global.scss";
import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { NEXT_PUBLIC_GTM_TRACKING_ID } from "../lib/constants";

const MyApp = ({ Component, pageProps }) => {
  // Google Tag Manager
  useEffect(() => {
    TagManager.initialize({ gtmId: NEXT_PUBLIC_GTM_TRACKING_ID });
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
