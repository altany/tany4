import Head from "next/head";
import Layout from "../components/layout";
import styles from "../styles/Cv.module.scss";
import { cv } from "../src/cv/cv";
import { SITE_TITLE, SITE_URL } from "../lib/constants";

export default function CvPage() {
  const title = `Resume - ${SITE_TITLE}`;

  return (
    <Layout
      resume
      canonicalUrl={`${SITE_URL}cv`}
      seoTitle={title}
      seoDescription={`${cv.header.name} - ${cv.header.title}`}
    >
      <Head>
        <title>{title}</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.name}>{cv.header.name}</h1>
          <p className={styles.title}>{cv.header.title}</p>
          <div className={styles.contact}>
            <a href={`mailto:${cv.header.email}`} className={styles.contactLink}>
              {cv.header.email}
            </a>
            <span className={styles.contactDivider}>•</span>
            <span>{cv.header.location}</span>
          </div>
        </header>

        <section className={styles.section}>
          <p className={styles.summary}>{cv.summary}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.personalStatement}>{cv.personalStatement}</p>
          <h2 className={styles.sectionHeading}>Where I add the most value</h2>
          <ul className={styles.strengthsList}>
            {cv.strengths.map((strength) => (
              <li key={strength.title} className={styles.strengthItem}>
                <h3 className={styles.strengthTitle}>{strength.title}</h3>
                <p className={styles.strengthDescription}>{strength.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {cv.sidebar.find((s) => s.title === "AI experience") && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeadingAlt}>AI Experience</h2>
            <ul className={styles.bulletList}>
              {cv.sidebar
                .find((s) => s.title === "AI experience")
                ?.bullets?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Experience</h2>
          <div className={styles.timeline}>
            {cv.experience.map((role) => (
              <article
                key={`${role.company}-${role.title}-${role.start}`}
                className={styles.timelineItem}
              >
                <div className={styles.timelineMeta}>
                  <span className={styles.dates}>
                    {role.start} — {role.end}
                  </span>
                </div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.roleTitle}>{role.title}</h3>
                  <p className={styles.company}>{role.company}</p>
                  {role.summary && (
                    <p className={styles.roleSummary}>{role.summary}</p>
                  )}
                  <ul className={styles.bulletList}>
                    {role.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Education</h2>
          <div className={styles.eduGrid}>
            {cv.education.map((edu) => (
              <div
                key={`${edu.institution}-${edu.date}`}
                className={styles.eduCard}
              >
                <span className={styles.eduDate}>{edu.date}</span>
                <h3 className={styles.eduSchool}>{edu.institution}</h3>
                <p className={styles.eduDegree}>{edu.degree}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Languages</h2>
          <div className={styles.languagesList}>
            {cv.languages.map((l) => (
              <div key={l.name} className={styles.languageItem}>
                <span className={styles.languageName}>{l.name}</span>
                <span className={styles.languageLevel}>
                  {l.levelLabel}
                  {l.levelCode && ` (${l.levelCode})`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.twoCol}>
          {cv.sidebar.find((s) => s.title === "Certifications") && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>Certifications</h2>
              {cv.sidebar
                .find((s) => s.title === "Certifications")
                ?.paragraphs?.map((p) => (
                  <p key={p} className={styles.smallText}>
                    {p}
                  </p>
                ))}
            </section>
          )}
          {cv.sidebar.find((s) => s.title === "Hobbies and interests") && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>Interests</h2>
              {cv.sidebar
                .find((s) => s.title === "Hobbies and interests")
                ?.paragraphs?.map((p) => (
                  <p key={p} className={styles.smallText}>
                    {p}
                  </p>
                ))}
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
}
