import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import SplitPage from "../../components/splitPage";
import Outline from "../../components/outline";
import Terminal from "../../components/terminal";
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
    { label: "App Store", icon: "apple", href: "https://apps.apple.com/us/app/youth-ready-first-r1/id6761061980" },
    { label: "Google Play", icon: "play", href: "https://play.google.com/store/apps/details?id=org.readycollective.r1methodapp" },
  ],
  bullets: [
    "Built food logging for young athletes. It rates food in simple, child-appropriate terms instead of counting calories, and uses an LLM with its running cost kept under control.",
    "Designed how the team ships risky changes: each one goes out switched off and is turned on through code review, so releases stay small and easy to undo.",
    "Built the progress logic for Mind and Energy, which responds to what athletes actually do. Much of the work was turning product and specialist decisions into rules the code follows.",
    "Co-built a web version of the app used for demos, so it can be shown without a phone.",
    "Built family sharing, so a child can be shared with a second parent and a coach. It was rolled out in stages because it changes who can see a child's data.",
    "Built daily check-in reminders and a welcome-back flow for athletes returning after a break, with children's privacy built in.",
    "Wrote the release smoke-test protocol the team runs before every release.",
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
      "Led on app performance, spotting problems early and fixing them as they came up, for example on the item list and map views.",
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
      "Built Tomorrow's Collections, which shows partners their next-day pickups. I kept its rules explicit instead of hardcoding them, so later changes stayed small.",
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

// Store logos as inline SVG (from Simple Icons, CC0), so they render the same everywhere
const STORE_ICONS = {
  apple:
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
  play:
    "M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z",
};

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
        <h1 className={styles.title}>My work</h1>
        <p className={styles.lede}>Selected projects, most recent first.</p>
        <Terminal
          label="The tools I use most"
          steps={[
            {
              command: "cat stack.txt",
              output: [
                "react native · react · typescript · expo",
                "next.js · node.js · express",
                "redux · zustand · tanstack query",
                "jest · react testing library · ci/cd",
              ],
            },
          ]}
        />

        <Project project={R1}>
          {R1.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className={styles.buttons}>
            {R1.stores.map(({ label, icon, href }) => (
              <a key={href} className={`${styles.button} ${styles.withIcon}`} href={href} target="_store" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
                  <path d={STORE_ICONS[icon]} />
                </svg>
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
            communication, and being honest about the trade-offs between speed, quality and complexity. I also like
            keeping dependencies up to date and logs clean, so real problems stand out.
          </p>
          <p>
            I like pairing and mentoring, and working with backend and design until something makes sense technically
            and still feels good to use. I can explain technical trade-offs to people who aren&apos;t engineers,
            plainly and without promising things we can&apos;t deliver.
          </p>
        </div>
      </SplitPage>
    </Layout>
  );
}
