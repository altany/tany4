import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.scss";
import Date from "../components/date";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Welcome to my website!</p>
        <p>I'm Tania and I love beautiful and engaging web apps!</p>
        <p>
          I enjoy building captivating UIs that make user experience easy and
          fun. My favourite technologies at the moment are React / React Native,
          Redux and Node.js. Previously, I have worked with Angular 2 and Ionic
          2.
        </p>
        <p>
          I am currently working for OLIO as a React Native developer. This
          allows me to do my part in reducing social inequality and
          environmental waste, while at the same time writing sick code!
        </p>
      </section>
    </Layout>
  );
}
