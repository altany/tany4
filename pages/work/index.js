import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import SplitPage from "../../components/splitPage";
import Outline from "../../components/outline";
import { SITE_TITLE, SITE_URL } from "../../lib/constants";
import styles from "../../styles/page.module.scss";

const R1 = {
  id: "r1",
  name: "Ready First (R1)",
  meta: "The Ready Collective · Senior Mobile Engineer · 2026– · React Native, Expo, TypeScript, Node.js",
  intro: [
    "A readiness app for youth athletes aged 6 to 17, used by families and coaches. Parents do simple daily check-ins, and R1 turns them into a daily readiness signal (Rebuilding, Rising or Ready) across Mind, Body and Energy, with guidance on movement, confidence and recovery.",
    "I joined the live app in May 2026 and work across the React Native app and the Node.js backend.",
  ],
  stores: [
    { label: "App Store", href: "https://apps.apple.com/us/app/youth-ready-first-r1/id6761061980" },
    { label: "▶ Google Play", href: "https://play.google.com/store/apps/details?id=org.readycollective.r1methodapp" },
  ],
  bullets: [
    "Built food logging. Athletes log what they eat and each food gets one of three ratings, never calories or macros, because the users are children. Behind it: a classification pipeline, a food catalogue mirrored into Postgres with nightly syncs, and an LLM step that reads a label into its ingredients, with its cost per request capped and logged.",
    "Designed the feature-flag system. Risky changes ship dark behind a flag declared per environment in the backend repo, so turning one on is a reviewed commit. The app never keeps its own flags: an endpoint returns 404 when its flag is off, and the app hides that screen.",
    "Built the zone engines for Mind and Energy. An athlete's zone moves on what they actually do over rolling windows, like logging and completed sessions, not on how they rate themselves. Most of the work was reconciling the spec, the founder's decisions and code that had drifted from both.",
    "Built most of R1 Now, the free tools a family can use before starting the programme. It's the first screen every new account sees. I also extended the browser preview mode we use to demo the app without a phone.",
    "Built the backend for sharing a child with a second parent and a coach, where access follows the child, not whoever pays. It shipped behind a flag with a staged rollout, because it changes who can see a child's data.",
    "Built the daily check-in reminder and the welcome-back flow for athletes who've been away. Reminders never show a child's name on a lock screen.",
    "Wrote the release smoke-test protocol and the iOS simulator setup that runs it. Before each release it checks every stored record against the database.",
  ],
};

const OLIO = [
  {
    id: "collections",
    name: "Collection re-architecture",
    meta: "Olio · Tech lead, sole front-end engineer · 2025 · React, TypeScript",
    bullets: [
      "Volunteers pick up surplus food from stores in timeslots set by each business. The scheduling system behind this was 10 years old, and small changes kept breaking things.",
      "With the backend tech lead, I documented how it actually behaved before changing it, then migrated it in production in small steps, behind feature flags with one-click rollback.",
      "Rolled out over about two weeks with no disruption to volunteers. Two long-standing bugs that caused support tickets every week are gone.",
      "Added E2E tests for core flows that had none. The charity work that followed became a small change instead of a rewrite.",
    ],
  },
  {
    id: "consumer-app",
    name: "Olio React Native consumer app",
    meta: "Olio · Core contributor, release owner · 2018–2025 · React Native, TypeScript",
    bullets: [
      "One of the first front-end engineers on the React Native app. We shipped the MVP in 3 months with a small team.",
      "Ran the App Store and Google Play releases from 2021 to 2025, coordinating with product, QA and backend.",
      "Made map markers and clusters re-render only when their data changes, which fixed slow list and map views.",
      "Kept React Native current across major version upgrades.",
    ],
  },
  {
    id: "volunteers",
    name: "Volunteer platform",
    meta: "Olio · Key architect · 2019–2025 · React, TypeScript",
    bullets: [
      "Moved the platform from Rails views to a React SPA, setting up routing, navigation, configuration and linting from scratch. Thousands of volunteers moved over without major issues.",
      "Extended it from Olio volunteers to charity volunteers, with their own collection flows.",
    ],
  },
  {
    id: "partners",
    name: "Partner tools",
    meta: "Olio · Front-End Tech Lead · 2023–2026 · React, TypeScript",
    bullets: [
      "Built Tomorrow's Collections, which shows next-day pickups with windows that differ per business. I kept the timing rules explicit instead of hardcoding them, so later changes stayed small.",
      "Redesigned the store confirmation flow on my own, mostly in the partner tools and partly across the other platforms. Issue reports dropped by about 90%.",
      "Led internationalisation: moved date and time handling to Luxon, added Chinese, and set up translation syncing with Loco.",
      "Mentored mid-level engineers through pairing and code review.",
    ],
  },
  {
    id: "prototypes",
    name: "Prototypes",
    meta: "Olio · Hackathons & discovery · React, React Native, AI tooling",
    bullets: [
      "An early partner platform concept that fed into the Sainsbury's trial, and an AI-assisted appointment planner.",
    ],
  },
];

const PROFILES = [
  { label: "github", value: "altany", href: "http://www.github.com/altany" },
  { label: "gitlab", value: "altany", href: "https://gitlab.com/brief-challenges" },
  { label: "linkedin", value: "/taniapapazaf", href: "http://www.linkedin.com/in/taniapapazaf" },
  { label: "twitter", value: "@_Tany_", href: "https://twitter.com/_Tany_" },
  { label: "codewars", value: "altany", href: "https://www.codewars.com/users/altany" },
];

const OUTLINE = [
  ...[R1, ...OLIO].map((p) => ({ id: p.id, text: p.name })),
  { id: "how-i-work", text: "How I work as a tech lead" },
];

const Project = ({ project, children }) => (
  <article className={styles.card} id={project.id}>
    <span className={styles.cardMeta}>{project.meta}</span>
    <h3>{project.name}</h3>
    {children}
    <ul className={styles.bullets}>
      {project.bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  </article>
);

export default function Work() {
  const seoDescription =
    "Selected projects across React, React Native, TypeScript and Node.js.";

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

      <SplitPage
        side={
          <>
            <div className={styles.label}>Outline</div>
            <Outline items={OUTLINE} />

            <div className={styles.label}>Talks</div>
            <ul className={styles.rows}>
              <li>
                <Link href="/blog/posts/react-conf-2019">
                  <span className={styles.rowTitle}>Using React Native to save the world</span>
                  <span className={styles.rowMeta}>React Conf 2019 · JS VidCon 2020</span>
                </Link>
              </li>
            </ul>

            <div className={`${styles.label} ${styles.spaced}`}>Elsewhere</div>
            <ul className={styles.kv}>
              {PROFILES.map(({ label, value, href }) => (
                <li key={label}>
                  <span>{label}</span>
                  <a href={href} target={`_${label}`}>
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          </>
        }
      >
        <div className={styles.kicker}>Work</div>
        <h1 className={styles.title}>My work</h1>
        <p className={styles.lede}>Selected projects, most recent first.</p>

        <Project project={R1}>
          {R1.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className={styles.buttons}>
            {R1.stores.map(({ label, href }) => (
              <a key={href} className={styles.button} href={href} target="_store" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </div>
        </Project>

        {OLIO.map((project) => (
          <Project key={project.id} project={project} />
        ))}

        <h2 className={styles.heading} id="how-i-work">
          How I work as a tech lead
        </h2>
        <div className={styles.prose}>
          <p>
            I aim to keep the front-end simple, predictable and well-tested. I am a fan of small PRs, clear written
            communication, and being honest about the trade-offs between speed, quality and complexity.
          </p>
          <p>
            I enjoy pairing, mentoring, and working closely with back-end and design to find solutions that make sense
            technically and still feel good to use. I&apos;m also comfortable talking with non-technical stakeholders
            and explaining technical considerations in a straightforward way, without making promises we can&apos;t
            keep.
          </p>
        </div>
      </SplitPage>
    </Layout>
  );
}
