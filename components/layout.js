import Head from "next/head";
import styles from "./layout.module.scss";
import Link from "next/link";
import useSWR from "swr";
import dynamic from "next/dynamic";
import Icon from "./icon";
import fetcher from "../lib/fetcher";
import { LINKEDIN, ENVELOPE, TWITTER } from "../lib/icons";
import {
  NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  LAST_COMMIT_ENDPOINT,
  JOB_TITLE,
  CONTACT_EMAIL,
} from "../lib/constants";

const ChatWidget = dynamic(() => import("./chatWidget"), { ssr: false });

export default function Layout({
  children,
  noPadding = false,
  blog = false,
  work = false,
  about = false,
  resume = false,
  seoImage = "",
  seoTitle = "",
  seoDescription = "",
  canonicalUrl = "",
  ogType = "",
}) {
  return (
    <>
      <HtmlHead
        seoImage={seoImage}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        canonicalUrl={canonicalUrl}
        ogType={ogType}
      />
      <Navigation blog={blog} work={work} about={about} resume={resume} />
      <StatusBar />
      <Content noPadding={noPadding}>{children}</Content>
      <Footer />
      <ChatWidget />
    </>
  );
}

const HtmlHead = ({ seoImage, seoTitle, seoDescription, canonicalUrl, ogType }) => {
  const defaultImagePath = "profile.png";
  const resolvedImage = seoImage || defaultImagePath;
  const resolvedTitle = seoTitle || SITE_TITLE;
  const resolvedDescription = seoDescription || SITE_DESCRIPTION;
  const resolvedCanonicalUrl = canonicalUrl || SITE_URL;
  const resolvedOgType = ogType || "website";
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_TITLE,
        url: SITE_URL,
      },
      {
        '@type': 'Person',
        name: NAME,
        jobTitle: JOB_TITLE,
        url: SITE_URL,
      },
    ],
  };

  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="author" content={NAME} />
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedCanonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <meta property="og:description" content={resolvedDescription} />
      <meta
        property="og:image"
        content={`${SITE_URL}${resolvedImage.replace(/^\//, "")}`}
      />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:url" content={resolvedCanonicalUrl} />
      <meta property="og:type" content={resolvedOgType} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@_Tany_" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:creator" content="@_Tany_" />
      <meta
        name="twitter:image"
        content={`${SITE_URL}${resolvedImage.replace(/^\//, "")}`}
      />
      <meta name="twitter:image:alt" content={resolvedTitle} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <link rel="apple-touch-icon" href={`${SITE_URL}profile.png`} />
    </Head>
  );
};

const Navigation = ({ blog, work, about, resume }) => (
  <nav className={styles.navigation} data-testid="navigation">
    <div className={styles.container}>
      <ul className={styles.topLinks}>
        <li className={styles.logo}>
          <Link href="/" title="Home">
            <img src="/profile.svg" alt={`${NAME} avatar`} />
          </Link>
        </li>
        <li className={work ? styles.active : undefined}>
          <Link
            href="/work"
            title="Check out my work"
            aria-label="Check out my work"
          >
            <div>Work</div>
          </Link>
        </li>
        <li className={blog ? styles.active : undefined}>
          <Link href="/blog" title="Blog">
            <div>Blog</div>
          </Link>
        </li>
        
        <li className={resume ? styles.active : undefined}>
          <Link href="/cv" title="Resume">
            <div>CV</div>
          </Link>
        </li>
        <li className={about ? styles.active : undefined}>
          <Link href="/about" title="About">
            <div>About</div>
          </Link>
        </li>
      </ul>
      <BottomLinks />
    </div>
  </nav>
);

const BottomLinks = () => {
  return (
    <ul className={styles.bottomLinks}>
      <li>
        <a
          href="http://www.linkedin.com/in/taniapapazaf"
          target="_linkedin"
          title="Linkedin profile - in/taniapapazaf"
        >
          <Icon icon={LINKEDIN} />
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/_Tany_"
          target="_twitter"
          title="Twitter profile - @_Tany_"
        >
          <Icon icon={TWITTER} />
        </a>
      </li>
      <li>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          target="_email"
          title={`Email - ${CONTACT_EMAIL}`}
        >
          <Icon icon={ENVELOPE} />
        </a>
      </li>
    </ul>
  );
};

const StatusBar = () => (
  <aside className={styles.statusBar}>
    <Link href="/" className={styles.name}>
      Tania
    </Link>
    <span className={styles.title}>{JOB_TITLE}</span>
    <a
      href="/TaniaPapazafeiropoulou-CV.pdf?version=12/2025"
      className={styles.downloadCv}
      target="_cv"
      rel="noopener noreferrer"
      title="Download CV"
    >
      Download CV
    </a>
  </aside>
);

const Content = ({ children, noPadding }) => (
  <div
    className={`${styles.contentContainer} ${
      noPadding ? styles.noPadding : ""
    }`}
  >
    <main>{children}</main>
  </div>
);

const Footer = () => {
  const { data, error } = useSWR(LAST_COMMIT_ENDPOINT, fetcher);

  return (
    <footer className={styles.footer}>
      <aside className={styles.created}>
        {`Created by `}
        <a href="http://www.linkedin.com/in/taniapapazaf" target="_linkedin">
          <b>{NAME}</b>
        </a>
        {data && (
          <span>
            {` |  Last updated: `}
            <a href={data.link} target="_lastCommit">
              <b>{data.date}</b>
            </a>
          </span>
        )}
      </aside>
    </footer>
  );
};
