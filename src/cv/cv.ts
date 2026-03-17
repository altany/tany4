import type { Cv } from "./types";
import { CONTACT_EMAIL, NAME } from "../../lib/constants";

export const cv: Cv = {
  header: {
    name: NAME,
    title: "Senior Front-End Engineer & Tech Lead",
    email: CONTACT_EMAIL,
    location: "United Kingdom / Greece",
    website: "tany4.com",
  },
  personalStatement: "I'm most comfortable where product complexity meets real users.",
  summary: "Front-End Engineer with 10+ years of experience building React and React Native applications used by millions of users. Strong focus on performance, accessibility, and shipping reliable UI that holds up at scale. Comfortable owning complex systems end-to-end and working closely with product, design and backend teams.",
  strengths: [
    {
      title: "Shipping complex front-end systems",
      description: "Building React and React Native applications that handle real-world workflows, edge cases, and scale without becoming brittle.",
    },
    {
      title: "Front-end architecture & maintainability",
      description: "Designing predictable UI patterns, managing complex state and async data, and keeping large codebases easy to evolve.",
    },
    {
      title: "Performance & accessibility",
      description: "Improving runtime performance, accessibility and reliability through thoughtful UI design, refactoring and monitoring.",
    },
    {
      title: "Cross-functional collaboration",
      description: "Working closely with product, design, backend and operations to turn complex, messy requirements into clear, maintainable solutions.",
    },
  ],
  sidebar: [
    {
      title: "AI experience",
      bullets: [
        "Daily user of AI-assisted development tools for coding, debugging, documentation and repo-wide analysis",
        "Support engineers in using AI confidently and safely",
        "Strong interest in prompt engineering and improving developer workflows",
        "Exploring how AI can support front-end applications and workflow automation",
      ],
    },
    {
      title: "Skills",
      bullets: [
        "React & React Native (Production Applications)",
        "TypeScript & Modern JavaScript (ES6+)",
        "Front-End Architecture & Scalable UI Systems",
        "State Management (Redux, Zustand, TanStack Query)",
        "Mobile Performance Optimisation & Reliability",
        "API Integration & Back-End Collaboration",
        "Testing & Quality (Jest, React Testing Library, CI/CD)",
        "Accessibility (WCAG) & Web/Mobile Best Practices",
        "AI-Assisted Development & Developer Tooling",
        "Technical Leadership, Mentoring & Code Reviews",
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
      start: "08/2023",
      end: "Current",
      title: "Front-End Tech Lead",
      company: "Olio",
      summary:
        "A growing B2C/B2B scale-up focused on food redistribution. Joined when the engineering team was <20; contributed across its growth to 100+ employees and millions of users.",
      bullets: [
        "Owned front-end direction across partner and volunteer platforms, balancing product needs, UX quality and maintainability.",
        "Led re-architecture of a 10-year-old scheduling system. Incremental migration with feature flags and rollback, zero user disruption, eliminated long-standing bugs.",
        "Led i18n initiative across the partner platform: Luxon integration for locale-aware date/time handling, added Chinese language support.",
        "Improved performance, accessibility and reliability through refactoring, monitoring and reducing technical debt.",
        "Worked closely with product, design, operations and backend to turn complex workflows into clear, maintainable UI solutions.",
        "Prototyped new ideas during internal hackathons (partner platform, AI-assisted appointment planner) to validate concepts and inform next steps.",
        "Mentored engineers through pairing and code reviews while remaining a strong IC, writing production code daily and unblocking complex technical problems.",
      ],
    },
    {
      start: "09/2018",
      end: "08/2023",
      title: "Senior Front-End Developer",
      company: "Olio",
      bullets: [
        "Promoted from Mid-Level to Senior within 1 year based on performance.",
        "Key contributor to building and stabilising Olio's React Native consumer app from scratch. Helped ship the initial version within 3 months as part of a small team.",
        "Managed regular App Store and Google Play release cycles, coordinating with product, QA and backend teams.",
        "Optimised map marker and cluster rendering so it only runs when data changes, improving performance on list and map views.",
        "Led migration of the Volunteers platform from Rails views to a modern React SPA. Established routing, navigation, and component patterns from scratch.",
        "Extended the Volunteers platform beyond the initial migration: designed and built new flows to support charity volunteers alongside Olio volunteers.",
      ],
    },
    {
      start: "08/2017",
      end: "08/2018",
      title: "Front-End & App Developer",
      company: "Esquared Technologies",
      bullets: [
        "Delivered features on an Angular2 app, working closely with founders and designers.",
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
        "Developed editorial and publishing tools for websites including PC Advisor, Macworld, ComputerWorld, Digital Arts Online and TechWorld.",
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
