import Head from "next/head";
import styles from "./layout.module.scss";
import utilStyles from "../styles/utils.module.scss";
import Link from "next/link";
import useSWR from "swr";

export const name = "Tania Papazafeiropoulou";
export const siteTitle = `${name} - Web Developer`;

const fetcher = (url) => fetch(url).then((r) => r.json());
const lastCommitEndpoint =
  "https://github-api-altany.herokuapp.com/last-commit/tany4";

export default function Layout({ children, home, blog, work }) {
  return (
    <>
      <HtmlHead home={home} />
      <Navigation blog={blog} work={work} />
      <StatusBar />
      <Content home={home}>{children}</Content>
      <Footer />
    </>
  );
}

const HtmlHead = ({ home }) => (
  <Head>
    <link rel="icon" href="/favicon.ico" />
    <meta
      name="description"
      property="og:description"
      content="Hi, I'm Tania! I am a React Native developer and have been a Front-end developer for years. I love beautiful and engaging web apps."
    />
    <meta name="image" property="og:image" content="logo.svg" />
    <meta name="og:title" content={siteTitle} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="author" content={name} />
  </Head>
);

const Navigation = ({ blog, work }) => (
  <nav className={styles.navigation}>
    <div className={styles.container}>
      <ul className={styles.topLinks}>
        <li className={styles.logo}>
          <logo>
            <Link href="/">
              <a>
                <img src="/profile.svg" alt={name} />
              </a>
            </Link>
          </logo>
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
      <ul className={styles.bottomLinks}>
        <li>
          <a
            href="http://tany4.com/TaniaPapazafeiropoulou-CV"
            target="_cv"
            title="Tania's resume"
          >
            <img src="resume.svg" alt="resume" />
          </a>
        </li>
        <li>
          <a
            href="mailto:hello@tany4.com"
            target="_email"
            title="hello@tany4.com"
          >
            <img src="email.svg" alt="hello@tany4.com" />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/_Tany_"
            target="_twitter"
            title="@_Tany_"
          >
            <img src="twitter.svg" alt="Twitter" />
          </a>
        </li>
        <li>
          <a
            href="http://www.linkedin.com/in/taniapapazaf"
            target="_linkedin"
            title="/in/taniapapazaf"
          >
            <img src="linkedin.svg" alt="Linkedin" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

const StatusBar = () => (
  <aside className={styles.statusBar}>
    <span className={styles.name}>Tania</span>
    <span className={styles.title}>Front end &amp; Mobile developer</span>
  </aside>
);

const Content = ({ home, children }) => (
  <div className={styles.contentContainer}>
    <header className={styles.header}>
      {home && (
        <>
          <h1>Hi, I'm Tania, web developer.</h1>
          <h2>Welcome to my website!</h2>
        </>
      )}
    </header>
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
