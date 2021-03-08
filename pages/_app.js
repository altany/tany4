import "../styles/global.scss";
import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { GTM_TRACKING_ID } from "../lib/constants";

const MyApp = ({ Component, pageProps }) => {
  // Google Tag Manager
  useEffect(() => {
    console.log(GTM_TRACKING_ID);

    TagManager.initialize({ gtmId: GTM_TRACKING_ID });
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
