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
        <p>Welcome to my website!</p>
        <h1>Hi, I'm {NAME},</h1>
        <h2>{JOB_TITLE}</h2>
      </header>

      <section className={styles.introduction}>
        <p>I specialise in building fast, accessible and user-focused mobile and web experiences. With 10+ years in front-end engineering and 2.5 years as a tech lead, I&apos;ve delivered production React Native apps, led cross-functional teams, improved performance, and shaped product direction.</p>
        <p>I&apos;m passionate about:</p>
        <ul>
          <li>React &amp; React Native mobile development</li>
          <li>Accessibility and performance</li>
          <li>Mentoring engineers & cross-team collaboration</li>
          <li>AI-assisted developer productivity</li>
          <li>Using technology to create positive impact</li>
        </ul>
        <p>I&apos;ve spoken at <Link href="/blog/posts/react-conf-2019">React Conf 2019</Link> and <Link href="/posts/jsvidcon-2020">JS VidCon 2020</Link> about how we built and scaled the Olio React Native app.</p>
        <p>Explore <Link href="/work">my work</Link> and <Link href="/blog">publications</Link>.</p>
      </section>
    </Layout>
  );
}
