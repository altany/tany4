import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle, name } from "../components/layout";
import styles from "../styles/utils.module.scss";
import Date from "../components/date";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <header className={styles.header}>
        <h1>Hi, I'm Tania, web developer.</h1>
        <h2>Welcome to my website!</h2>
      </header>

      <section className={styles.introduction}>
        <p>
          My name is {name} and I am a <b>React</b> Developer with many years of
          experience in various <b>front end</b> techonologies.
        </p>
        <p>Feel free to check my website and find out more about my work.</p>
      </section>
    </Layout>
  );
}
