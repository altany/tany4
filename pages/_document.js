import Document, { Html, Head, Main, NextScript } from "next/document";
import { AnalyticsScript } from "../lib/analytics";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <AnalyticsScript />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
