import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import styles from "../../styles/utils.module.scss";
import { getSortedPostsData } from "../../lib/posts";
import Date from "../../components/date";
import { SITE_TITLE, SITE_URL } from "../../lib/constants";

export default function Blog({ posts = [] }) {
  const seoDescription =
    "Articles on React, React Native, AI tooling, debugging, testing, performance, and engineering practices.";

  return (
    <Layout
      blog
      canonicalUrl= {`${SITE_URL}blog`}
      seoTitle={ `${SITE_TITLE} - Blog`}
      seoDescription={seoDescription}
    >
      <Head>
        <title>{`${SITE_TITLE} - Blog`}</title>
      </Head>

      <section className={styles.blog}>
        <header className={styles.header}>
            <h1>Blog</h1>
          <h2>
            I write about React, React Native, AI tooling, debugging, testing, performance and general engineering practices. These posts capture lessons
            learned from real-world work, conference talks, and experiments.
          </h2>
        </header>
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
            .map(({ id, date, title, subtitle, banner, color, categories, highlight, description, new: isNew }) => (
              <li key={id} style={{ backgroundColor: color }}>
                <Link href={`/blog/posts/${id}`}>
                  <img src={`blog/${banner}`} alt={`${title} - banner`} />
                  <div className={styles.content}>
                    {isNew && <span className={styles.newBadge}>New</span>}
                    {highlight && (
                      <span className={styles.featuredBadge}>Highlight</span>
                    )}
                    <div className={styles.postTitle}>{title}</div>
                    {subtitle && (
                      <div className={styles.postSubtitle}>
                        <small>{subtitle}</small>
                      </div>
                    )}
                    <small>
                      <Date dateString={date} />
                    </small>
                    {description && (
                      <p className={styles.postExcerpt}>{description}</p>
                    )}
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
