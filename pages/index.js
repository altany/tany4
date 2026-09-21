import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import SplitPage from "../components/splitPage";
import PostRows from "../components/postRows";
import Terminal, { Mark } from "../components/terminal";
import { SITE_TITLE, JOB_TITLE, CV_PDF_URL } from "../lib/constants";
import { getSortedPostsData } from "../lib/posts";
import styles from "../styles/page.module.scss";

const DRIVES = [
  "Building things people use every day",
  "Making complicated things simple, for users and for the next developer",
  "Accessibility from the start",
  "Using AI tools where they actually help",
];

export default function Home({ posts = [] }) {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>

      <SplitPage
        side={
          <>
            <div className={styles.label}>Latest posts</div>
            <PostRows posts={posts.slice(0, 4)} />
            <Link className={styles.more} href="/blog">
              all posts →
            </Link>
          </>
        }
      >
        <div className={styles.kicker}>{JOB_TITLE}</div>
        <h1 className={styles.title}>
          Hi, I&apos;m Tania. <span>I&apos;ve been building web and mobile apps for 13 years.</span>
        </h1>
        <p className={styles.lede}>
          Some of the apps I&apos;ve worked on are used by millions of people. I&apos;ve led big migrations on
          live systems, and I work best close to design, product and backend.
        </p>

        <Terminal
          label="What drives me"
          steps={[
            {
              command: "cat what-drives-me.txt",
              output: DRIVES.map((line) => (
                <>
                  <Mark /> {line}
                </>
              )),
            },
          ]}
        />

        <p className={`${styles.lede} ${styles.inline}`}>
          I spoke at <Link href="/blog/posts/react-conf-2019">React Conf 2019</Link> and{" "}
          <Link href="/blog/posts/jsvidcon-2020">JS VidCon 2020</Link> about how we built the Olio app in React
          Native with a small team.
        </p>

        <div className={styles.buttons}>
          <Link className={`${styles.button} ${styles.primary}`} href="/work">
            see my work
          </Link>
          <a className={styles.button} href={CV_PDF_URL} target="_cv" rel="noopener noreferrer">
            ↓ download cv
          </a>
        </div>
      </SplitPage>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: getSortedPostsData().map(({ id, title, date, categories = [], new: isNew = false }) => ({
        id,
        title,
        date,
        categories,
        new: isNew,
      })),
    },
  };
}
