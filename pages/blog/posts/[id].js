import Head from "next/head";
import Layout from "../../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../../components/date";
import styles from "../../../styles/utils.module.scss";
import { NAME, SITE_URL } from "../../../lib/constants";

export default function Post({ data }) {
  return (
    <Layout noPadding>
      <Head>
        <title>{`${data.title} - ${NAME}`}</title>
     
        {data.description && (
          <meta name="description" content={data.description} />
        )}

      
        {(() => {
          const baseUrl = SITE_URL.endsWith("/")
            ? SITE_URL.slice(0, -1)
            : SITE_URL;
          const canonicalUrl = `${baseUrl}/blog/posts/${data.id}`;
          const description = data.description || undefined;
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
              <link rel="canonical" href={canonicalUrl} />

              {/** Open Graph */}
              <meta property="og:type" content="article" />
              <meta property="og:title" content={`${data.title} - ${NAME}`} />
              {description && (
                <meta property="og:description" content={description} />
              )}
              <meta property="og:url" content={canonicalUrl} />
              {imageUrl && <meta property="og:image" content={imageUrl} />}

              {/** Twitter Card */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta
                name="twitter:title"
                content={`${data.title} - ${NAME}`}
              />
              {description && (
                <meta
                  name="twitter:description"
                  content={description}
                />
              )}
              {imageUrl && (
                <meta name="twitter:image" content={imageUrl} />
              )}

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
