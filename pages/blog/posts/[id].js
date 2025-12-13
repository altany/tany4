import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/utils.module.scss";
import { NAME, SITE_URL, JOB_TITLE } from "../../../lib/constants";

export default function Post({ data }) {
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  const canonicalUrl = `${baseUrl}/blog/posts/${data.id}`;
  const seoTitle = `${data.title} - ${NAME}`;
  const seoDescription = data.description || undefined;

  return (
    <Layout
      noPadding
      seoImage={data.banner ? `/blog/${data.banner}` : undefined}
      canonicalUrl={canonicalUrl}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      ogType="article"
    >
      <Head>
        <title>{seoTitle}</title>

        {(() => {
          const description = seoDescription;
          const imageUrl = data.banner
            ? `${baseUrl}/blog/${data.banner}`
            : undefined;

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
            description,
            author: {
              '@type': 'Person',
              name: NAME,
            },
            image: imageUrl ? [imageUrl] : undefined,
          };

          return (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              />
            </>
          );
        })()}
      </Head>
      <div className={styles.post}>
        <div className={styles.title}>
          <div className={styles.breadcrumbs}>
            <Link href="/blog">Blog</Link>
            {Array.isArray(data.categories) && data.categories.length > 0 && (
              <>
                <span>→</span>
                <span>{data.categories[0]}</span>
              </>
            )}
            <span>→</span>
            <span>{data.title}</span>
          </div>
          <h1>{data.title}</h1>
          {data.subtitle && <h2>{data.subtitle}</h2>}
        </div>
        <article>
          {data.banner && (
            <img
              src={`/blog/${data.banner}`}
              alt={data.title}
              className={styles.postBanner}
              style={{backgroundColor:data.color || 'white'}}
            />
          )}
          <div className={styles.postHeaderMeta}>
            <div className={styles.postMetaTop}>
              <span>
                <Date dateString={data.date} />
              </span>
              {typeof data.readingTimeMinutes === "number" && (
                <span>{`${data.readingTimeMinutes} min read`}</span>
              )}
            </div>
            {data.updated && (
              <div className={styles.postUpdated}>
                Last updated <Date dateString={data.updated} />
              </div>
            )}
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
          <div className={styles.postAuthor}>
            <p>
              Written by {NAME} - {JOB_TITLE}.
            </p>
          </div>
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
