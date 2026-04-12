import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import { SITE_TITLE } from "../lib/constants";
import styles from "../styles/utils.module.scss";

export default function NotFound() {
  return (
    <Layout seoTitle={`404 - Page not found | ${SITE_TITLE}`}>
      <Head>
        <title>{`404 - Page not found | ${SITE_TITLE}`}</title>
      </Head>
      <div className={styles.notFound}>
        <h1>404</h1>
        <p>This page doesn't exist.</p>
        <Link href="/">Go home</Link>
      </div>
    </Layout>
  );
}
