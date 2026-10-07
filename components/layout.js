import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import dynamic from "next/dynamic";
import styles from "./layout.module.scss";
import useTheme from "../hooks/useTheme";
import {
  NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  LAST_COMMIT_ENDPOINT,
  JOB_TITLE,
  CONTACT_EMAIL,
  profile,
} from "../lib/constants";

const ChatWidget = dynamic(() => import("./chatWidget"), { ssr: false });

const PAGES = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
  { href: "/cv", label: "cv" },
  { href: "/about", label: "about" },
];

// The accounts the footer links to, in the order they are shown
const FOOTER_PROFILES = ["linkedin", "github", "twitter"];

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Layout({
  children,
  active = "",
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
      <div className={styles.shell}>
        <Navigation active={active} />
        <main className={styles.main}>{children}</main>
      </div>
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
      <title>{resolvedTitle}</title>
      <link rel="icon" href="/favicon.ico" />
      {/* What this site is, in plain text, for an assistant that would otherwise
          work it out by reading every page */}
      <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
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
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" href={`${SITE_URL}profile.png`} />
    </Head>
  );
};

const Navigation = ({ active }) => (
  <nav className={styles.rail} data-testid="navigation" aria-label="Main">
    <Link href="/" className={styles.brand} aria-label={`${NAME}, home`}>
      <span className={styles.avatar} aria-hidden="true" />
      tania
    </Link>
    <ul className={styles.links}>
      {PAGES.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={active === label ? styles.active : undefined}
            aria-current={active === label ? "page" : undefined}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
    <span className={styles.grow} />
    <ThemeToggle />
    <Footer />
  </nav>
);

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  // The server can't know the theme, so render an empty button of the same size until hydration
  if (!theme) {
    return <span className={styles.themeToggle} aria-hidden="true" />;
  }

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.themeToggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      ◐ {theme}
    </button>
  );
};

const Footer = () => {
  const { data } = useSWR(LAST_COMMIT_ENDPOINT, fetcher);

  return (
    <div className={styles.foot}>
      {FOOTER_PROFILES.map((label, i) => {
        const { value, href } = profile(label);
        return (
          <Fragment key={label}>
            {i > 0 && " · "}
            <a href={href} target={`_${label}`} title={`${label} profile - ${value}`}>
              {label}
            </a>
          </Fragment>
        );
      })}
      <br />
      <a href={`mailto:${CONTACT_EMAIL}`} title={`Email - ${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
      <br />
      <a href="/llms.txt" title="What this site is, in plain text, for AI assistants">
        llms.txt
      </a>
      {data && (
        <div className={styles.updated}>
          updated{" "}
          <a href={data.link} target="_lastCommit">
            {data.date}
          </a>
        </div>
      )}
    </div>
  );
};
