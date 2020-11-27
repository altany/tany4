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
      <section className={utilStyles.introduction}>
        <p>Welcome!</p>
        <p>
          My name is Tania and I am a React Developer with many years of
          experience in various front-end techonologies.
        </p>
        <p>Feel free to check my website and find out more about my work.</p>
      </section>
    </Layout>
  );
}
