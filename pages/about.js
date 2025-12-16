import Head from "next/head";
import Layout from "../components/layout";
import { SITE_TITLE, SITE_URL } from "../lib/constants";
import styles from "../styles/utils.module.scss";

export default function About() {
  const seoDescription =
    "A more personal (but privacy-conscious) introduction to Tania.";

  return (
    <Layout about canonicalUrl={`${SITE_URL}about`} seoTitle={`${SITE_TITLE} - About`} seoDescription={seoDescription}>
      <Head>
        <title>{`${SITE_TITLE} - About`}</title>
      </Head>

      <section className={styles.home}>
        <header className={styles.header}>
          <h1>About</h1>
        </header>

        <p>
          Under construction...
        </p>
      </section>
    </Layout>
  );
}
