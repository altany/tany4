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
          {data.banner && (
            <img
              src={`/blog/${data.banner}`}
              alt={data.title}
              className={styles.postBanner}
            />
          )}
          <div className={styles.postHeaderMeta}>
            <Date dateString={data.date} />
            {Array.isArray(data.categories) && data.categories.length > 0 && (
              <div className={styles.postMeta}>
                {data.categories.map((cat) => (
                  <span key={cat} className={styles.postTag}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
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
