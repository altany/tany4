import Head from "next/head";
import Layout from "../components/layout";
import { SITE_TITLE, SITE_URL } from "../lib/constants";
import styles from "../styles/utils.module.scss";

const PawDivider = () => (
  <div className={styles.aboutDivider} aria-hidden="true">
    <img src="/paw.svg" alt="" />
  </div>
);


export default function About() {
  const seoDescription =
    "A more personal (but privacy-conscious) introduction to Tania.";

  return (
    <Layout about canonicalUrl={`${SITE_URL}about`} seoTitle={`${SITE_TITLE} - About`} seoDescription={seoDescription}>
      <Head>
        <title>{`${SITE_TITLE} - About`}</title>
      </Head>

      <section className={`${styles.home} ${styles.about}`}>
        <header className={styles.header}>
          <h1>Outside of code</h1>
        </header>

        <p>
          I am someone who enjoys building things, but I don&apos;t think work is the most
          interesting thing about a person.
        </p>

        <PawDivider />

        <p>
          Outside of tech, I care a lot about having a balanced and intentional life.
          I like movement (dancing, running, swimming), not in a competitive way, but
          as a way to stay grounded and clear my head. Movies are another constant
          for me, especially the kind that make you think a bit longer after they
          end.
        </p>

        <PawDivider />

        <p>
          A big part of my everyday life is my dog, Mario. He&apos;s my companion, my
          reminder to slow down, and a very good excuse to step away from screens.
          Working from home has given me the chance to spend more time with him,
          which has quietly become one of the things I value most. Being around him is one of the simplest ways I recharge, even if we just sit next to each other.
        </p>

        <figure className={styles.aboutPhoto}>
          <img src="/Mario.png" alt="Mario" loading="lazy" />
          <figcaption>Mario, making sure I take screen breaks.</figcaption>
        </figure>

        <PawDivider />

        <p>
          If you&apos;re here, I hope you find something useful, interesting, or
          familiar.
        </p>
      </section>
    </Layout>
  );
}
