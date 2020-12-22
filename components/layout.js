import Head from "next/head";
import styles from "./layout.module.scss";
import Link from "next/link";
import useSWR from "swr";
import Icon from "./icon";

import { LINKEDIN, ENVELOPE, RESUME, TWITTER } from "../lib/icons";

export const name = "Tania Papazafeiropoulou";
export const siteTitle = `${name} - Web Developer`;
const siteDescription =
  "Hi, I'm Tania! I am a React Native developer and have been a Front-end developer for years. I love building beautiful and engaging web apps.";

const fetcher = (url) => fetch(url).then((r) => r.json());
const lastCommitEndpoint =
  "https://github-api-altany.herokuapp.com/last-commit/tany4";

export default function Layout({ children, blog, work }) {
  return (
    <>
      <HtmlHead />
      <Navigation blog={blog} work={work} />
      <StatusBar />
      <Content>{children}</Content>
      <Footer />
    </>
  );
}

const HtmlHead = () => (
  <Head lang="en">
    <link rel="icon" href="/favicon.ico" />
    <meta
      name="description"
      property="og:description"
      content={siteDescription}
    />
    <meta
      name="image"
      property="og:image"
      content="https://tany4-inprogress.herokuapp.com/profile.png"
    />
    <meta name="author" content={name} />

    <meta name="og:title" content={siteTitle} />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@_Tany_" />
    <meta name="twitter:title" content={siteTitle} />
    <meta name="twitter:description" content={siteDescription} />
    <meta name="twitter:creator" content="@_Tany_" />
    <meta
      name="twitter:image"
      content="https://tany4-inprogress.herokuapp.com/profile.png"
    />
    <meta name="twitter:image:alt" content="Tania's photo" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link
      rel="apple-touch-icon"
      href="https://tany4-inprogress.herokuapp.com/profile.png"
    />
  </Head>
);

const Navigation = ({ blog, work }) => (
  <nav className={styles.navigation}>
    <div className={styles.container}>
      <ul className={styles.topLinks}>
        <li className={styles.logo}>
          <Link href="/">
            <a>
              <img src="/profile.svg" alt={name} />
            </a>
          </Link>
        </li>
        <li className={work && styles.active}>
          <Link href="/work">
            <a>
              <div>Work</div>
            </a>
          </Link>
        </li>
        <li className={blog && styles.active}>
          <Link href="/blog">
            <a>
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
          title="/in/taniapapazaf"
        >
          <Icon icon={LINKEDIN} />
        </a>
      </li>
      <li>
        <a href="https://twitter.com/_Tany_" target="_twitter" title="@_Tany_">
          <Icon icon={TWITTER} />
        </a>
      </li>
      <li>
        <a
          href="http://tany4.com/TaniaPapazafeiropoulou-CV"
          target="_cv"
          title="Tania's resume"
        >
          <Icon icon={RESUME} />
        </a>
      </li>
      <li>
        <a
          href="mailto:hello@tany4.com"
          target="_email"
          title="hello@tany4.com"
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

const Content = ({ children }) => (
  <div className={styles.contentContainer}>
    <main>{children}</main>
  </div>
);

const Footer = () => {
  const { data, error } = useSWR(lastCommitEndpoint, fetcher);

  return (
    <footer className={styles.footer}>
      <aside className={styles.created}>
        {`Created by `}
        <a href="http://www.linkedin.com/in/taniapapazaf" target="_linkedin">
          <b>{name}</b>
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
