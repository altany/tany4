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

export default function Layout({ children, home }) {
  return (
    <>
      <HtmlHead home={home} />
      <Navigation />
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

const Navigation = () => (
  <nav className={styles.navigation}>
    <div className={styles.container}>
      <ul className={styles.topLinks}>
        <li className={styles.logo}>
          <logo>
            <Link href="/">
              <a>
                <img src="/profile.svg" alt={name} />
                <div>Tania</div>
              </a>
            </Link>
          </logo>
        </li>
        <li>
          <Link href="/work">
            <a>
              <div>Work</div>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <a>
              <div>Blog</div>
            </a>
          </Link>
        </li>
      </ul>
      <ul className={styles.bottomLinks}>
        <li>
          <a href="http://tany4.com/TaniaPapazafeiropoulou-CV" target="_cv">
            <img src="resume.svg" alt="resume" />
          </a>
        </li>
        <li>
          <a href="mailto:hello@tany4.com" target="_email">
            <img src="email.svg" alt="hello@tany4.com" />
          </a>
        </li>
        <li>
          <a href="https://twitter.com/_Tany_" target="_twitter">
            <img src="twitter.svg" alt="Twitter" />
          </a>
        </li>
        <li>
          <a href="http://www.linkedin.com/in/taniapapazaf" target="_linkedin">
            <img src="linkedin.svg" alt="Linkedin" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

const Content = ({ home, children }) => (
  <div className={styles.contentContainer}>
    <header className={styles.header}>
      {home ? (
        <>
          <h1 className={utilStyles.heading2Xl}>
            Hi, I'm Tania. Welcome to my website!
          </h1>
          <h2 className={utilStyles.headingLg}>
            Front end development, Mobile development
          </h2>
        </>
      ) : (
        <>
          <h2 className={utilStyles.headingLg}>
            <Link href="/">
              <a className={utilStyles.colorInherit}>{name}</a>
            </Link>
          </h2>
          <h3 className={utilStyles.headingLMd}>
            Front end development, Mobile development
          </h3>
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
