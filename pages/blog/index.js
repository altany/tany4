import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import RepoList from "../../components/github/repoList";
import styles from "../../styles/utils.module.scss";
import { getSortedPostsData } from "../../lib/posts";
import Date from "../../components/date";

export default function Blog({ posts }) {
  return (
    <Layout blog>
      <Head>
        <title>{siteTitle} - Blog</title>
      </Head>
      <section className={styles.blog}>
        <ul>
          {posts.map(({ id, date, title, banner, color }) => (
            <li key={id} style={{ backgroundColor: color }}>
              <Link href="/blog/posts/[id]" as={`/blog/posts/${id}`}>
                <a>
                  <img src={`blog/${banner}`} />
                  <div className={styles.content}>
                    <b>{title}</b>
                    <small>
                      <Date dateString={date} />
                    </small>
                  </div>
                </a>
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
