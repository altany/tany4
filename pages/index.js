import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import { SITE_TITLE, NAME, JOB_TITLE } from "../lib/constants";
import styles from "../styles/utils.module.scss";
import Date from "../components/date";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>

      <header className={styles.header}>
        <h1>Welcome to my website!</h1>
        <h2>Hi, I&apos;m {NAME}, a {JOB_TITLE}.</h2>
      </header>

      <section className={styles.introduction}>
        <p>
          With years of experience in various <b>frontend</b> technologies, I was recently promoted to a Technical Lead at Olio.
        </p>
        <p>
          Explore my journey and discover more about <Link href="/work">my work</Link> in the world of <b>React</b> development.
        </p>
      </section>
    </Layout>
  );
}
