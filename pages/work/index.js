import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import { SITE_TITLE, SITE_URL } from "../../lib/constants";
import Icon from "../../components/icon";
import {
  GITHUB,
  GITLAB,
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
            Front-End Tech Lead & Senior React / React Native Engineer. Here
            you will find highlights from key projects, plus my Git
            and developer profiles below.
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
            <p className={styles.experienceRole}>Senior Front-End Engineer, Release Owner</p>
            <p className={styles.experienceTech}>
              React Native, TypeScript
            </p>
            <ul>
              <li>
                Joined as one of the first front-end engineers and helped ship the React Native MVP in 3 months.
              </li>
              <li>
                Owned the release process for 4+ years, coordinating weekly releases to millions of users across iOS and Android.
              </li>
              <li>
                Drove major React Native version upgrades, keeping the app modern while avoiding breaking changes.
              </li>
              <li>
                Fixed long-standing development environment issues that were blocking the team, improving day-to-day productivity.
              </li>
            </ul>
          </article>

          <article className={styles.experienceCard}>
            <h2>Volunteers platform</h2>
            <p className={styles.experienceRole}>
              Key architect during Rails → React migration
            </p>
            <p className={styles.experienceTech}>
              React, TypeScript
            </p>
            <ul>
              <li>
                Helped migrate the volunteer platform from server-rendered Rails views to a React SPA, establishing patterns the team still uses today.
              </li>
              <li>
                Led a major rearchitecture of how collections are displayed, grouping by schedule to match how volunteers actually think about their pickups.
              </li>
              <li>
                Extended the platform to support charity volunteers alongside Olio volunteers, a key step in the company&apos;s growth.
              </li>
              <li>
                Cleaned up years of accumulated feature flags and deprecated code, making the codebase easier for new joiners to navigate.
              </li>
            </ul>
          </article>

          <article className={styles.experienceCard}>
            <h2>Partner tools</h2>
            <p className={styles.experienceRole}>Front-End Tech Lead</p>
            <p className={styles.experienceTech}>
              React, TypeScript
            </p>
            <ul>
              <li>
                Led front-end development for the partner-facing dashboard used by supermarkets and food businesses.
              </li>
              <li>
                Built the collections feature, which lets partners see upcoming pickups and plan staffing accordingly.
              </li>
              <li>
                Added multi-language support to enable international expansion, working closely with ops teams to get translations right.
              </li>
              <li>
                Mentored mid-level engineers through complex features, pairing regularly and reviewing code to help them grow.
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
            I enjoy pairing, mentoring, and working closely with back-end and
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
