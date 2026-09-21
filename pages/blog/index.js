import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/layout";
import SplitPage from "../../components/splitPage";
import PostRows from "../../components/postRows";
import { getSortedPostsData } from "../../lib/posts";
import { SITE_TITLE, SITE_URL } from "../../lib/constants";
import styles from "../../styles/page.module.scss";

export default function Blog({ posts = [] }) {
  const [topic, setTopic] = useState(null);
  const seoDescription =
    "Articles on React, React Native, AI tooling, debugging, testing, performance, and engineering practices.";

  const topics = [...new Set(posts.flatMap((p) => p.categories || []))];
  const shown = topic ? posts.filter((p) => (p.categories || []).includes(topic)) : posts;
  const highlights = posts.filter((p) => p.highlight);

  return (
    <Layout blog canonicalUrl={`${SITE_URL}blog`} seoTitle={`${SITE_TITLE} - Blog`} seoDescription={seoDescription}>
      <Head>
        <title>{`${SITE_TITLE} - Blog`}</title>
      </Head>

      <SplitPage
        side={
          <>
            <div className={styles.label}>Filter</div>
            <div className={styles.tags} role="group" aria-label="Filter posts by topic">
              <button
                type="button"
                className={`${styles.tag} ${topic === null ? styles.tagOn : ""}`}
                aria-pressed={topic === null}
                onClick={() => setTopic(null)}
              >
                all · {posts.length}
              </button>
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.tag} ${topic === t ? styles.tagOn : ""}`}
                  aria-pressed={topic === t}
                  onClick={() => setTopic(topic === t ? null : t)}
                >
                  {t.toLowerCase()}
                </button>
              ))}
            </div>

            {highlights.length > 0 && (
              <>
                <div className={`${styles.label} ${styles.spaced}`}>Highlight</div>
                <ul className={styles.rows}>
                  {highlights.map((p) => (
                    <li key={p.id}>
                      <Link href={`/blog/posts/${p.id}`}>
                        <span className={styles.rowTitle}>{p.title}</span>
                        {p.subtitle && <span className={styles.rowMeta}>{p.subtitle}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        }
      >
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.lede}>
          I write about React, React Native, AI tooling, debugging, testing, performance and general engineering
          practices. These posts capture lessons learned from real-world work, conference talks, and experiments.
        </p>
        <PostRows posts={shown} withExcerpt />
      </SplitPage>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: getSortedPostsData(),
    },
  };
}
