import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import styles from "../../styles/utils.module.scss";
import { getSortedPostsData } from "../../lib/posts";
import Date from "../../components/date";
import { SITE_TITLE } from "../../lib/constants";

export default function Blog({ posts = [] }) {
  return (
    <Layout blog>
      <Head>
        <title>{SITE_TITLE} - Blog</title>
      </Head>

      <section className={styles.blog}>
        <h1>Blog</h1>
        <p>
          I write about React, React Native, debugging, testing, performance
          and general engineering practices. These posts capture lessons
          learned from real-world work, conference talks, and experiments.
        </p>
        <ul>
          {posts
            .slice()
            .sort((a, b) => {
              const aHighlight = a.highlight ? 1 : 0;
              const bHighlight = b.highlight ? 1 : 0;
              if (aHighlight !== bHighlight) {
                // highlight:true first
                return bHighlight - aHighlight;
              }
              if (a.date < b.date) return 1;
              if (a.date > b.date) return -1;
              return 0;
            })
            .map(({ id, date, title, subtitle, banner, color, categories, highlight }) => (
              <li key={id} style={{ backgroundColor: color }}>
                <Link href={`/blog/posts/${id}`}>
                  <img src={`blog/${banner}`} alt={`${title} - banner`} />
                  <div className={styles.content}>
                    {highlight && (
                      <span className={styles.featuredBadge}>HIGHLIGHT</span>
                    )}
                    <b>{title}</b>
                    {subtitle && (
                      <b>
                        <small>{subtitle}</small>
                      </b>
                    )}
                    <small>
                      <Date dateString={date} />
                    </small>
                    {Array.isArray(categories) && categories.length > 0 && (
                      <div className={styles.postMeta}>
                        {categories.map((cat) => (
                          <span key={cat} className={styles.postTag}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getSortedPostsData();
  return {
    props: {
      posts,
    },
  };
}
