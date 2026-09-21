import Head from "next/head";
import Layout from "../components/layout";
import SplitPage from "../components/splitPage";
import styles from "../styles/page.module.scss";
import { cv } from "../src/cv/cv";
import { SITE_TITLE, SITE_URL, CV_PDF_URL } from "../lib/constants";

// The web CV and the PDF share src/cv/cv.ts, so both always say the same thing
const sidebar = (title: string) => cv.sidebar.find((s) => s.title === title);

export default function CvPage() {
  const title = `Resume - ${SITE_TITLE}`;
  const skills = sidebar("Skills");
  const ai = sidebar("AI experience");
  const certifications = sidebar("Certifications");
  const interests = sidebar("Hobbies and interests");

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

      <SplitPage
        side={
          <>
            <div className={styles.label}>Education</div>
            <ul className={styles.kv}>
              {cv.education.map((edu) => (
                <li key={`${edu.institution}-${edu.date}`}>
                  <span>
                    {edu.degree}
                    <br />
                    <span className={styles.rowMeta}>
                      {edu.institution} · {edu.date}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.label}>Languages</div>
            <ul className={styles.kv}>
              {cv.languages.map((l) => (
                <li key={l.name}>
                  <span>{l.name}</span>
                  <b>
                    {l.levelLabel}
                    {l.levelCode && ` (${l.levelCode})`}
                  </b>
                </li>
              ))}
            </ul>
            {certifications?.paragraphs && (
              <>
                <div className={styles.label}>Certifications</div>
                <ul className={styles.kv}>
                  <li>
                    <span>{certifications.paragraphs[0]}</span>
                    <b>{certifications.paragraphs[1]}</b>
                  </li>
                </ul>
              </>
            )}
          </>
        }
      >
        <div className={styles.kicker}>CV</div>
        <h1 className={styles.title}>{cv.header.name}</h1>
        <div className={styles.meta}>
          {cv.header.title} · {cv.header.location} ·{" "}
          <a href={`mailto:${cv.header.email}`}>{cv.header.email}</a>
        </div>
        <p className={styles.lede}>{cv.personalStatement}</p>
        <div className={styles.prose}>
          <p>{cv.summary}</p>
        </div>
        <div className={styles.buttons}>
          <a className={`${styles.button} ${styles.primary}`} href={CV_PDF_URL} target="_cv" rel="noopener noreferrer">
            ↓ download pdf
          </a>
        </div>

        <h2 className={styles.heading}>Where I add the most value</h2>
        <div className={styles.strengths}>
          {cv.strengths.map((s) => (
            <div key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>

        {ai?.bullets && (
          <>
            <h2 className={styles.heading}>AI experience</h2>
            <ul className={styles.bullets}>
              {ai.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </>
        )}

        {skills?.bullets && (
          <>
            <h2 className={styles.heading}>Skills</h2>
            <div className={styles.tags}>
              {skills.bullets.map((s) => (
                <span key={s} className={styles.tag}>
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        <h2 className={styles.heading}>Experience</h2>
        {cv.experience.map((role) => (
          <article key={`${role.company}-${role.title}-${role.start}`} className={styles.role}>
            <div className={styles.dates}>
              {role.start} – {role.end}
            </div>
            <div>
              <h3>
                {role.title} <span>· {role.company}</span>
              </h3>
              {role.summary && <p>{role.summary}</p>}
              {role.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}

        {interests?.paragraphs && (
          <>
            <h2 className={styles.heading}>Interests</h2>
            <div className={styles.prose}>
              <p>{interests.paragraphs[0]}</p>
            </div>
          </>
        )}
      </SplitPage>
    </Layout>
  );
}
