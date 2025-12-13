import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../lib/constants";
import Icon from "../../components/icon";
import {
  GITHUB,
  GITLAB,
  STACKOVERFLOW,
  CODEWARS,
  LINKEDIN,
  TWITTER,
} from "../../lib/icons";
import styles from "../../styles/utils.module.scss";

export default function Work() {
  const seoDescription =
    "Selected projects and leadership impact across React, React Native, TypeScript, testing, performance and accessibility.";

  return (
    <Layout
      work
      canonicalUrl={`${SITE_URL}work`}
      seoTitle={`${SITE_TITLE} - My work`}
      seoDescription={seoDescription}
    >
      <Head>
        <title>{`${SITE_TITLE} - My work`}</title>
      </Head>
      <div className={styles.work}>
        <header>
          <h1>My work</h1>
          <h3>
            Front-End Tech Lead & Senior React / React Native Engineer, focused
            on shipping user-facing products and leading teams.
          </h3>
        </header>
        <div>
          <section className={styles.git}>
            <div className={styles.label}>GIT</div>
            <div className={styles.curly}>{"{"}</div>
            <ul>
              <li>
                <a
                  href="http://www.github.com/altany"
                  target="_github"
                  title="Github profile - altany"
                >
                  <b>Hub</b>
                  <Icon icon={GITHUB} />
                  altany
                </a>
              </li>

              <li>
                <a
                  href="https://gitlab.com/brief-challenges"
                  target="_gitlab"
                  title="Gitlab profile - altany"
                >
                  <b>Lab</b>
                  <Icon icon={GITLAB} />
                  altany
                </a>
              </li>
            </ul>
          </section>
          <ul className={styles.links}>
            <li>
              <a
                href="https://twitter.com/_Tany_"
                target="_twitter"
                title="Twitter profile - @_Tany_"
              >
                <Icon icon={TWITTER} />
                @_Tany_
              </a>
            </li>
            <li>
              <a
                href="http://www.linkedin.com/in/taniapapazaf"
                target="_linkedin"
                title="Linkedin profile - in/taniapapazaf"
              >
                <Icon icon={LINKEDIN} />
                /taniapapazaf
              </a>
            </li>
            <li>
              <a
                href="https://stackoverflow.com/users/2075902/tany4"
                target="_stackoverflow"
                title="StackOverflow profile - tany4"
              >
                <Icon icon={STACKOVERFLOW} />
                tany4
              </a>
            </li>
          </ul>
          <section className={styles.codewars}>
            Do you enjoy code challenges? Find me at CodeWars!
            <a
              href="https://www.codewars.com/users/altany"
              target="_codewars"
              title="Codewars - altany"
            >
              <Icon icon={CODEWARS} />
              <img
                src="https://www.codewars.com/users/altany/badges/small"
                alt="codewars profile badge"
              />
            </a>
          </section>
        </div>
        <section className={styles.workIntroSection}>
          <p>
            As a Front-End Tech Lead and seasoned Senior React / React Native Engineer, I've had the privilege of driving the development of user-facing products and leading high-performing teams. Below, you'll find a curated selection of projects that showcase my technical expertise and leadership capabilities.
          </p>
        </section>

        <section className={styles.experienceGrid}>
          <article className={styles.experienceCard}>
            <h2>Olio React Native consumer app</h2>
            <p className={styles.experienceRole}>Senior Front-End Engineer</p>
            <p className={styles.experienceTech}>
              React Native, TypeScript, testing, CI/CD
            </p>
            <ul>
              <li>
                Helped build, improve, and maintain the core React Native app
                used by Olio&apos;s community across onboarding, browsing, and posting flows.
              </li>
              <li>
                Worked on performance improvements, accessibility fixes, and
                general stability as the app grew.
              </li>
              <li>
                Supported the team with PR reviews, debugging tricky issues,
                and working closely with product and backend.
              </li>
              <li>
                Impact: a more stable and responsive app experience across the
                areas people use most.
              </li>
            </ul>
          </article>

          <article className={styles.experienceCard}>
            <h2>Olio Volunteers platform migration and feature expansion</h2>
            <p className={styles.experienceRole}>
              Senior Front-End Engineer / Tech Lead
            </p>
            <p className={styles.experienceTech}>
              React, TypeScript, Ruby on Rails, testing, CI/CD
            </p>
            <ul>
              <li>
                Migrated the volunteer platform from Rails to React to make
                the platform faster and easier to work with.
              </li>
              <li>
                Built and shipped many new features that expanded what
                volunteers could do, well beyond the original migration.
              </li>
              <li>
                Introduced shared components and small accessibility
                improvements to keep things consistent and easier to maintain.
              </li>
              <li>
                Worked closely with operations and support teams to understand
                issues real volunteers were facing and fix them.
              </li>
              <li>
                As a tech lead later on, helped extend the platform from
                supporting only Olio volunteers to supporting charity volunteers
                too.
              </li>
              <li>
                Impact: a faster, more flexible and capable platform that
                supported more volunteers and was easier to improve over time.
              </li>
            </ul>
          </article>

          <article className={styles.experienceCard}>
            <h2>Partner tools & integration interfaces</h2>
            <p className={styles.experienceRole}>Front-End Tech Lead</p>
            <p className={styles.experienceTech}>
              React, TypeScript, data visualisation, testing, CI/CD
            </p>
            <ul>
              <li>
                Worked on internal dashboards and tools that surface important
                food-rescue metrics and operational data.
              </li>
              <li>
                Helped teams decide how to balance real-time data needs with
                performance and implementation complexity.
              </li>
              <li>
                Worked closely with product, design, data and commercial teams
                so the UI matched what partners actually needed.
              </li>
              <li>
                Impact: clearer insight into how partners operate and smoother
                workflows across different types of organisations.
              </li>
            </ul>
          </article>

          <article className={styles.experienceCard}>
            <h2>Prototyping & experiments</h2>
            <p className={styles.experienceRole}>Hackathons & discovery work</p>
            <p className={styles.experienceTech}>React, React Native, APIs, AI tooling</p>
            <ul>
              <li>
                Built several prototypes, including an early partner platform
                concept that eventually fed into the Sainsbury&apos;s trial and
                helped shape Charity SaaS.
              </li>
              <li>
                Created an AI-assisted appointment planner for faster and
                smarter scheduling.
              </li>
              <li>
                Focused on building simple, realistic prototypes quickly so
                teams could test ideas with real user flows.
              </li>
              <li>
                Used what we learned from these experiments to help decide what
                should (or shouldn&apos;t) move into proper development.
              </li>
              <li>
                Enjoy working in early-stage, ambiguous spaces and turning
                loose ideas into something concrete enough to evaluate.
              </li>
              <li>
                Impact: early insights that influenced product direction before
                any major build started.
              </li>
            </ul>
          </article>
        </section>

        <section className={styles.leadershipSection}>
          <h2>How I work as a tech lead</h2>
          <p>
            I aim to keep the front-end simple, predictable and well-tested. I
            am a fan of small PRs, clear written communication, and being
            honest about the trade-offs between speed, quality and complexity.
            I enjoy pairing, mentoring, and working closely with backend and
            design to find solutions that make sense technically and still feel
            good to use. I&apos;m also comfortable talking with non-technical
            stakeholders and explaining technical considerations in a
            straightforward way, without making promises we can&apos;t keep.
          </p>
        </section>

        <section className={styles.talksSection}>
          <h2>Talks</h2>
          <p>
            Although I don&apos;t actively pursue speaking opportunities, I&apos;ve
            previously shared engineering learnings at industry events:
          </p>
          <ul>
            <li>
              Using React Native to save the world - presented at <Link href="/blog/posts/react-conf-2019">React Conf 2019</Link> and <Link href="/blog/posts/jsvidcon-2020">JS VidCon 2020</Link>
            </li>
            
          </ul>
        </section>
      </div>
    </Layout>
  );
}
