import Head from "next/head";
import styles from "./layout.module.scss";
import utilStyles from "../styles/utils.module.scss";
import Link from "next/link";

const name = "Tania Papazafeiropoulou";
export const siteTitle = "Tania Papazafeiropoulou - Web Developer";

export default function Layout({ children, home }) {
  return (
    <>
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
        <meta name="author" content="Tania Papazafeiropoulou" />
      </Head>

      <navigation className={styles.navigation}>
        <div className={styles.container}>
          <div>
            <Link href="/">
              <a className={`${styles.navLink} ${styles.logo}`}>
                <img src="/profile.svg" alt={name} />
                <div>Tania</div>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/blog">
              <a className={styles.navLink}>
                <div>Blog</div>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/work">
              <a className={styles.navLink}>
                <div>Work</div>
              </a>
            </Link>
          </div>
          <div className={styles.bottom}>
            <div className={styles.navLink}>
              <a href="mailto:hello@tany4.com" target="_email">
                Email
              </a>
            </div>
            <div className={styles.navLink}>
              <a href="http://tany4.com/TaniaPapazafeiropoulou-CV" target="_cv">
                CV
              </a>
            </div>
            <div className={styles.navLink}>
              <a
                href="http://www.linkedin.com/in/taniapapazaf"
                target="_linkedin"
              >
                LinkedIn
              </a>
            </div>
            <div className={styles.navLink}>
              <a href="https://twitter.com/_Tany_" target="_twitter">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </navigation>

      <div className={styles.contentContainer}>
        <header className={styles.header}>
          {home ? (
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          ) : (
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          )}
        </header>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
