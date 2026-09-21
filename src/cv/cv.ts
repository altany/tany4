import type { Cv } from "./types";
import { CONTACT_EMAIL, NAME } from "../../lib/constants";

export const cv: Cv = {
  header: {
    name: NAME,
    title: "Senior Front-End & Mobile Engineer & Tech Lead",
    email: CONTACT_EMAIL,
    location: "United Kingdom / Greece",
    website: "tany4.com",
  },
  personalStatement: "I like working on products with real complexity and real users.",
  summary: "Developer for 13 years, most of them on React and React Native apps used by millions of people. I own systems end to end, work closely with product, design and backend, and care about performance and accessibility.",
  strengths: [
    {
      title: "Shipping cross-platform apps",
      description: "Building React and React Native applications for web, iOS and Android that handle real-world workflows, edge cases, and scale without becoming brittle.",
    },
    {
      title: "Front-end architecture that stays easy to change",
      description: "Designing predictable UI patterns, managing complex state and async data, and keeping large codebases easy to evolve.",
    },
    {
      title: "Performance & accessibility",
      description: "Improving runtime performance, accessibility and reliability through thoughtful UI design, refactoring and monitoring.",
    },
    {
      title: "Working closely with product, design and backend",
      description: "Working closely with product, design, backend and operations to turn complex, messy requirements into clear, maintainable solutions.",
    },
  ],
  sidebar: [
    {
      title: "AI experience",
      bullets: [
        "Use AI tools every day for coding, debugging, documentation and finding my way around large codebases",
        "Help other engineers use AI tools well and safely",
        "Interested in how prompts and tooling change the way developers work",
        "Build small AI features and automations, in apps and in my own workflow",
      ],
    },
    {
      title: "Skills",
      bullets: [
        "React & React Native",
        "TypeScript & JavaScript",
        "Cross-platform mobile architecture",
        "State management (Redux, Zustand, TanStack Query)",
        "Mobile performance & reliability",
        "App Store & Google Play releases",
        "APIs & working with backend",
        "Testing (Jest, React Testing Library, CI/CD)",
        "Accessibility (WCAG)",
        "AI-assisted development & tooling",
        "Tech leadership, mentoring & code review",
      ],
    },
    {
      title: "Certifications",
      paragraphs: ["Completed Leadership Training: Human Leadership", "July 2024"],
    },
    {
      title: "Hobbies and interests",
      paragraphs: [
        "I enjoy dancing, running, swimming, watching movies and spending time with my dog, Mario.",
      ],
    },
  ],
  experience: [
    {
      start: "05/2026",
      end: "Present",
      title: "Senior Mobile Engineer (Contract)",
      company: "The Ready Collective",
      summary:
        "Joined the R1 app in May 2026 on a three-month contract, now continuing month to month. Working alongside a former Olio colleague.",
      bullets: [
        "Built food logging for young athletes, with child-appropriate food ratings and an LLM step whose running cost is kept under control.",
        "Designed how the team ships risky changes behind feature flags, turned on through code review.",
        "Built the Mind and Energy progress logic and family sharing, so a child can be shared with a second parent and a coach.",
        "Wrote the release smoke-test protocol the team runs before every release.",
        "Contributing to the Next.js web app.",
      ],
    },
    {
      start: "08/2023",
      end: "03/2026",
      title: "Front-End Tech Lead",
      company: "Olio",
      summary:
        "A food-sharing app used by millions of people. I joined when there were fewer than 20 people and 3 developers, and worked there as it grew to over 100.",
      bullets: [
        "Set the front-end direction for the partner and volunteer platforms, weighing product needs against UX and long-term maintenance.",
        "Led the rebuild of a 10-year-old scheduling system, migrated in small steps with feature flags and rollback. No disruption to users, and long-standing bugs gone.",
        "Led internationalisation of the partner platform: locale-aware dates and times with Luxon, and Chinese as a new language.",
        "Refactored, monitored and paid down tech debt to keep the apps fast, accessible and reliable.",
        "Worked with product, design, operations and backend to turn complicated workflows into screens people could actually use.",
        "Built hackathon prototypes, such as a partner platform and an AI-assisted appointment planner, to test ideas before committing to them.",
        "Mentored engineers through pairing and code review, while still writing production code every day and helping unblock hard problems.",
      ],
    },
    {
      start: "09/2018",
      end: "08/2023",
      title: "Senior Front-End Developer",
      company: "Olio",
      bullets: [
        "Promoted from mid-level to senior within a year.",
        "One of a small team that built Olio's React Native app from scratch and shipped the first version in 3 months.",
        "Ran the App Store and Google Play releases, coordinating with product, QA and backend.",
        "Led on app performance, spotting problems early and fixing them as they came up, for example on the item list and map views.",
        "Led the move of the volunteer platform from Rails views to a React SPA, setting up routing, navigation and component patterns from scratch.",
        "Then designed and built the flows that let charity volunteers use it alongside Olio volunteers.",
      ],
    },
    {
      start: "08/2017",
      end: "08/2018",
      title: "Front-End & App Developer",
      company: "Esquared Technologies",
      bullets: [
        "Built features for an Angular 2 app, working directly with the founders and designers.",
      ],
    },
    {
      start: "03/2016",
      end: "08/2017",
      title: "Web Developer",
      company: "Cult Beauty",
      bullets: [
        "Built UI features for a high-traffic e-commerce site. Worked on checkout and payment flows, integrating third-party payment methods including Klarna and PayPal. Contributed to both frontend and backend PHP code.",
      ],
    },
    {
      start: "07/2014",
      end: "02/2016",
      title: "Web Developer",
      company: "IDG UK",
      bullets: [
        "Built editorial and publishing tools for sites including PC Advisor, Macworld, ComputerWorld, Digital Arts Online and TechWorld.",
      ],
    },
    {
      start: "01/2013",
      end: "07/2014",
      title: "Junior Software Developer",
      company: "Kantar Worldpanel",
      bullets: ["Built internal data tools and reporting automations."],
    },
  ],
  education: [
    {
      date: "09/2010",
      institution: "University of Patras",
      degree: "MEng: Computer Engineering & Informatics",
    },
    {
      date: "08/2012",
      institution: "University of Edinburgh",
      degree: "MSc: Bioinformatics",
    },
  ],
  languages: [
    { name: "Greek", levelLabel: "First Language" },
    { name: "English", levelCode: "C2", levelLabel: "Proficient" },
    { name: "French", levelCode: "A1", levelLabel: "Beginner" },
  ],
};