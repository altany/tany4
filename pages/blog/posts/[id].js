import Head from "next/head";
import Layout from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/utils.module.scss";

export default function Post({ data }) {
  return (
    <Layout>
      <Head>
        <title>{data.title}</title>
      </Head>
      <article>
        <h1>{data.title}</h1>
        <Date dateString={data.date} />
        <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
      </article>
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
