import Head from "next/head";
import Layout from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/utils.module.scss";
import { SITE_TITLE } from "../../../lib/constants";

export default function Post({ data }) {
  return (
    <Layout noPadding>
      <Head>
        <title>
          {data.title} - {SITE_TITLE}
        </title>
      </Head>
      <div className={styles.post}>
        <div className={styles.title}>
          <h1>{data.title}</h1>
          {data.subtitle && <h2>{data.subtitle}</h2>}
        </div>
        <article>
          <Date dateString={data.date} />
          <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = await getPostData(params.id);
  return {
    props: {
      data,
    },
  };
}
