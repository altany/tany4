import Head from "next/head";
import styles from "./layout.module.scss";
import Link from "next/link";
import useSWR from "swr";
import Icon from "./icon";
import fetcher from "../lib/fetcher";
import { LINKEDIN, ENVELOPE, RESUME, TWITTER } from "../lib/icons";
import {
  NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  LAST_COMMIT_ENDPOINT,
} from "../lib/constants";

export default function Layout({ children, noPadding, blog, work }) {
  return (
    <>
      <HtmlHead />
      <Navigation blog={blog} work={work} />
      <StatusBar />
      <Content noPadding={noPadding}>{children}</Content>
      <Footer />
    </>
  );
}

const HtmlHead = () => (
  <Head lang="en">
    <link rel="icon" href="/favicon.ico" />
    <meta name="author" content={NAME} />
    <meta property="og:description" content={SITE_DESCRIPTION} />
    <meta property="og:image" content={`${SITE_URL}profile.png`} />
    <meta property="og:title" content={SITE_TITLE} />
    <meta property="og:url" content={SITE_URL} />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@_Tany_" />
    <meta name="twitter:title" content={SITE_TITLE} />
    <meta name="twitter:description" content={SITE_DESCRIPTION} />
    <meta name="twitter:creator" content="@_Tany_" />
    <meta name="twitter:image" content={`${SITE_URL}profile.png`} />
    <meta name="twitter:image:alt" content="Tania's photo" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link rel="apple-touch-icon" href={`${SITE_URL}profile.png`} />
  </Head>
);

const Navigation = ({ blog, work }) => (
  <nav className={styles.navigation}>
    <div className={styles.container}>
      <ul className={styles.topLinks}>
        <li className={styles.logo}>
          <Link href="/">
            <a title="Home">
              <img src="/profile.svg" alt={NAME} />
            </a>
          </Link>
        </li>
        <li className={work && styles.active}>
          <Link href="/work">
            <a title="Check out my work">
              <div>Work</div>
            </a>
          </Link>
        </li>
        <li className={blog && styles.active}>
          <Link href="/blog">
            <a title="Blog">
              <div>Blog</div>
            </a>
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
          href={`${SITE_URL}TaniaPapazafeiropoulou-CV`}
          target="_cv"
          title="Resume - Tania Papapazafeiropoulou"
        >
          <Icon icon={RESUME} />
        </a>
      </li>
      <li>
        <a
          href="mailto:hello@tany4.com"
          target="_email"
          title="Email - hello@tany4.com"
        >
          <Icon icon={ENVELOPE} />
        </a>
      </li>
    </ul>
  );
};

const StatusBar = () => (
  <aside className={styles.statusBar}>
    <Link href="/">
      <a className={styles.name}>Tania</a>
    </Link>
    <span className={styles.title}>Front end &amp; Mobile developer</span>
    {/* TODO: Add conferences link with animated dropdown */}
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
