import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import SplitPage from "../components/splitPage";
import Terminal from "../components/terminal";
import { SITE_TITLE } from "../lib/constants";
import styles from "../styles/page.module.scss";

export default function NotFound() {
  return (
    <Layout seoTitle={`404 - Page not found | ${SITE_TITLE}`}>
      <Head>
        <title>{`404 - Page not found | ${SITE_TITLE}`}</title>
      </Head>
      <SplitPage>
        <div className={styles.kicker}>404</div>
        <h1 className={styles.title}>This page doesn&apos;t exist.</h1>
        <Terminal steps={[{ command: "cd this-page", output: ["cd: no such file or directory"] }]} />
        <div className={styles.buttons}>
          <Link className={`${styles.button} ${styles.primary}`} href="/">
            go home
          </Link>
        </div>
      </SplitPage>
    </Layout>
  );
}
