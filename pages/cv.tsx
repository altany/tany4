import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import styles from "../styles/Cv.module.scss";
import { cv } from "../src/cv/cv";
import { SITE_TITLE, SITE_URL } from "../lib/constants";

function CvContent() {
  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        {cv.sidebar.map((section) => (
          <section key={section.title} className={styles.sidebarSection}>
            <h2 className={styles.sidebarHeading}>{section.title}</h2>

            {section.paragraphs?.map((p) => (
              <p key={p} className={styles.sidebarParagraph}>
                {p}
              </p>
            ))}

            {section.links && (
              <ul className={styles.sidebarList}>
                {section.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.display || l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {section.bullets && (
              <ul className={styles.sidebarList}>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.name}>{cv.header.name}</h1>
          <div className={styles.contactRow}>
            <span className={styles.contactItem}>{cv.header.email}</span>
            <span className={styles.contactItem}>{cv.header.location}</span>
          </div>
        </header>

        <section className={styles.block}>
          <h2 className={styles.heading}>Experience</h2>
          {cv.experience.map((role) => (
            <article key={`${role.company}-${role.title}-${role.start}`} className={styles.role}>
              <div className={styles.roleMeta}>
                <span className={styles.dates}>{`${role.start} - ${role.end}`}</span>
                <div className={styles.roleTitle}>{role.title}</div>
                <div className={styles.company}>{role.company}</div>
              </div>

              {role.summary && <p className={styles.roleSummary}>{role.summary}</p>}

              <ul className={styles.bullets}>
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.block}>
          <h2 className={styles.heading}>Education</h2>
          {cv.education.map((edu) => (
            <div key={`${edu.institution}-${edu.date}`} className={styles.edu}>
              <div className={styles.eduDate}>{edu.date}</div>
              <div className={styles.eduBody}>
                <div className={styles.eduSchool}>{edu.institution}</div>
                <div className={styles.eduDegree}>{edu.degree}</div>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.block}>
          <h2 className={styles.heading}>Languages</h2>
          <div className={styles.languagesGrid}>
            {cv.languages.map((l) => (
              <div key={l.name} className={styles.languageItem}>
                <div className={styles.languageName}>
                  {l.name}: {l.levelLabel}
                </div>
                {l.levelCode && <div className={styles.languageCode}>{l.levelCode}</div>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CvPage() {
  const router = useRouter();
  const print = router.query.print === "1";
  const title = `${SITE_TITLE} - CV`;

  const content = (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <CvContent />
    </>
  );

  if (print) return content;

  return (
    <Layout
      resume
      canonicalUrl={`${SITE_URL}cv`}
      seoTitle={title}
      seoDescription={`${cv.header.name} - CV`}
    >
      {content}
    </Layout>
  );
}
