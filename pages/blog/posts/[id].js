import Head from "next/head";
import Layout, { siteTitle, name } from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/utils.module.scss";

export default function Post({ data }) {
  return (
    <Layout noPadding>
      <Head>
        <title>
          {data.title} - {siteTitle}
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
