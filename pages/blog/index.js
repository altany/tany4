import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import RepoList from "../../components/github/repoList";
import utilStyles from "../../styles/utils.module.scss";
import { getSortedPostsData } from "../../lib/posts";

export default function Blog({ posts }) {
  return (
    <Layout blog>
      <Head>
        <title>{siteTitle} - Blog</title>
      </Head>
      <section>
        <ul>
          {posts.map(({ id, date, title }) => (
            <li key={id}>
              <Link href="/blog/posts/[id]" as={`/blog/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
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
