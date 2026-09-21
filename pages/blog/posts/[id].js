import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/layout";
import SplitPage from "../../../components/splitPage";
import Outline from "../../../components/outline";
import PostRows from "../../../components/postRows";
import { getAllPostIds, getPostData, getSortedPostsData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/page.module.scss";
import { NAME, SITE_URL, JOB_TITLE } from "../../../lib/constants";
import { smallBanner } from "../../../lib/images";

export default function Post({ data, others = [] }) {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  const canonicalUrl = `${baseUrl}/blog/posts/${data.id}`;
  const seoTitle = `${data.title} - ${NAME}`;
  const seoDescription = data.description || undefined;
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const headings = data.headings || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: data.title,
    datePublished: data.date,
    dateModified: data.updated || data.date,
    description: seoDescription,
    author: {
      '@type': 'Person',
      name: NAME,
    },
    image: data.banner ? [`${baseUrl}/blog/${data.banner}`] : undefined,
  };

  return (
    <Layout
      blog
      seoImage={data.banner ? `/blog/${data.banner}` : undefined}
      canonicalUrl={canonicalUrl}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      ogType="article"
    >
      <Head>
        <title>{seoTitle}</title>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <SplitPage
        side={
          <>
            {headings.length > 0 && (
              <>
                <div className={styles.label}>Outline</div>
                <Outline items={headings} />
              </>
            )}
            {others.length > 0 && (
              <>
                <div className={styles.label}>More posts</div>
                <PostRows posts={others} />
              </>
            )}
          </>
        }
      >
        <div className={styles.kicker}>
          <Link href="/blog">blog</Link>
          {categories.length > 0 && ` / ${categories.map((c) => c.toLowerCase()).join(" · ")}`}
        </div>
        <h1 className={styles.title}>{data.title}</h1>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
        <div className={styles.meta}>
          <Date dateString={data.date} />
          {typeof data.readingTimeMinutes === "number" && ` · ${data.readingTimeMinutes} min read`}
          {data.updated && (
            <>
              {" · updated "}
              <Date dateString={data.updated} />
            </>
          )}
          {data.new && <span className={styles.badgeNew}>new</span>}
        </div>

        {data.banner && (
          <img
            src={smallBanner(data.banner)}
            alt=""
            className={styles.banner}
            style={{ backgroundColor: data.color || "white" }}
          />
        )}

        <article className={styles.article} dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        <p className={styles.author}>
          Written by {NAME}, {JOB_TITLE}.
        </p>
      </SplitPage>
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
  // The two most recent other posts, for the side pane
  const others = getSortedPostsData()
    .filter((p) => p.id !== params.id)
    .slice(0, 2)
    .map(({ id, title, date, categories = [], new: isNew = false }) => ({ id, title, date, categories, new: isNew }));
  return {
    props: {
      data,
      others,
    },
  };
}
