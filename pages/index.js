import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import { SITE_TITLE, NAME, JOB_TITLE } from "../lib/constants";
import styles from "../styles/utils.module.scss";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>

     

      <section className={styles.home}>
        <header className={styles.header}>
          <p>Welcome to my website!</p>
          <h1>Hi, I'm {NAME},</h1>
          <h2>{JOB_TITLE}</h2>
        </header>
        <p>I build mobile and web products that people actually want to use. Over 10 years in front-end engineering, I&apos;ve shipped apps to millions of users, led teams through complex migrations, and helped junior engineers grow into confident contributors.</p>
        <p>What drives me:</p>
        <ul>
          <li>Shipping products that make a real difference</li>
          <li>Making complex things simple for users and developers alike</li>
          <li>Growing teams and creating environments where people do their best work</li>
          <li>Accessibility as a baseline, not an afterthought</li>
          <li>Using AI tools to work smarter, not just faster</li>
        </ul>
        <p>I&apos;ve shared my experience at <Link href="/blog/posts/react-conf-2019">React Conf 2019</Link> and <Link href="/blog/posts/jsvidcon-2020">JS VidCon 2020</Link>, talking about building and scaling the Olio app from scratch.</p>
        <p>Explore <Link href="/work">my work</Link> and <Link href="/blog">writing</Link>.</p>
      </section>
    </Layout>
  );
}
