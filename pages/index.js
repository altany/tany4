import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import SplitPage from "../components/splitPage";
import PostRows from "../components/postRows";
import { SITE_TITLE, JOB_TITLE, CV_PDF_URL } from "../lib/constants";
import { getSortedPostsData } from "../lib/posts";
import styles from "../styles/page.module.scss";

const DRIVES = [
  "Shipping products that make a real difference",
  "Making complex things simple for users and developers alike",
  "Accessibility as a baseline, not an afterthought",
  "Using AI tools to work smarter, not just faster",
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
          I&apos;ve shipped apps to millions of users, led complex migrations, and collaborated with
          engineers to deliver at scale.
        </p>

        <div className={styles.term} aria-label="What drives me">
          <div>
            <span className={styles.prompt}>tania@tany4</span> ~ % cat what-drives-me.txt
          </div>
          {DRIVES.map((line) => (
            <div key={line}>
              <span className={styles.mark}>›</span> {line}
            </div>
          ))}
          <div>
            <span className={styles.prompt}>tania@tany4</span> ~ % <span className={styles.caret} />
          </div>
        </div>

        <p className={`${styles.lede} ${styles.inline}`}>
          I&apos;ve shared my experience at <Link href="/blog/posts/react-conf-2019">React Conf 2019</Link> and{" "}
          <Link href="/blog/posts/jsvidcon-2020">JS VidCon 2020</Link>, talking about building and scaling the Olio
          app from scratch.
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
