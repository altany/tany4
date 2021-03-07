import "../styles/global.scss";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageview } from "../lib/analytics";

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    //router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("beforeHistoryChange", handleRouteChange);
    return () => {
      //router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("beforeHistoryChange", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default App;
