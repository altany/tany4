import Head from "next/head";
import Layout from "../components/layout";
import SplitPage from "../components/splitPage";
import { SITE_TITLE, SITE_URL } from "../lib/constants";
import styles from "../styles/page.module.scss";

export default function About() {
  const seoDescription =
    "A more personal (but privacy-conscious) introduction to Tania.";

  return (
    <Layout about canonicalUrl={`${SITE_URL}about`} seoTitle={`${SITE_TITLE} - About`} seoDescription={seoDescription}>
      <Head>
        <title>{`${SITE_TITLE} - About`}</title>
      </Head>

      <SplitPage
        side={
          <>
            <figure className={styles.photo}>
              <img src="/Mario-720.webp" alt="Mario" loading="lazy" decoding="async" />
              <figcaption>Mario, making sure I take screen breaks.</figcaption>
            </figure>
            <div className={styles.label}>Also</div>
            <div className={styles.tags}>
              {["dancing", "running", "swimming", "movies"].map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </>
        }
      >
        <div className={styles.kicker}>About</div>
        <h1 className={styles.title}>Outside of code</h1>
        <div className={styles.prose}>
          <p className={styles.lede}>
            I am someone who enjoys building things, but I don&apos;t think work is the most interesting thing about a
            person.
          </p>
          <p>
            Outside of tech, I care a lot about having a balanced and intentional life. I like movement (dancing,
            running, swimming), not in a competitive way, but as a way to stay grounded and clear my head. Movies are
            another constant for me, especially the kind that make you think a bit longer after they end.
          </p>
          <p>
            A big part of my everyday life is my dog, Mario. He&apos;s my companion, my reminder to slow down, and a
            very good excuse to step away from screens. Working from home has given me the chance to spend more time
            with him, which has quietly become one of the things I value most. Being around him is one of the simplest
            ways I recharge, even if we just sit next to each other.
          </p>
          <p>If you&apos;re here, I hope you find something useful, interesting, or familiar.</p>
        </div>
      </SplitPage>
    </Layout>
  );
}
