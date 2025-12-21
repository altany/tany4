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
      title: "Hands-on leadership & cross-functional collaboration",
      description: "Leading by example through pairing, code reviews and day-to-day implementation, while working closely with product, design, backend and operations to turn complex, messy requirements into clear, usable solutions.",
    }
  ],
  sidebar: [
    {
      title: "Summary",
      paragraphs: [
        "Front-End Engineer with 10+ years of experience building and leading scalable React and React Native applications. Strong focus on architecture, performance, accessibility, and developer experience. Comfortable operating as both a senior IC and a front-end tech lead."
      ],
    },
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
  "Technical Leadership, Mentoring & Code Reviews"
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
        "Contributed to early planning and technical decisions, raising feasibility concerns and shaping approaches before delivery.",
        "Led architectural work in complex React apps, simplifying scheduling/grouping logic and reducing edge cases.",
        "Worked closely with product, design, operations and backend to turn real-world workflows into clear, maintainable UI solutions.",
        "Helped extend volunteer support from Olio volunteers to charity volunteers, enabling new flows and broader operational use.",
        "Prototyped new ideas during internal hackathons (partner platform, AI-assisted appointment planner) to validate concepts and inform next steps.",
        "Improved performance, accessibility and reliability through refactoring, monitoring and reducing technical debt.",
        "Mentored engineers through pairing and code reviews while remaining a strong IC, writing production code daily and unblocking teammates.",
      ],
    },
    {
      start: "09/2018",
      end: "08/2023",
      title: "Senior Front-End Developer",
      company: "Olio",
      bullets: [
        "Promoted from Mid-Level to Senior within 1 year based on performance.",
        "Key contributor to Olio's React Native app, helping build and stabilise the product within months as part of a small team.",
        "Delivered and maintained user-facing features across core app areas with a focus on performance and reliability.",
        "Played a major role in migrating the Volunteers platform from Rails views to a React-based front end.",
        "Expanded the Volunteers platform beyond the initial migration by designing and implementing new features and improving workflows.",
        "Improved stability and maintainability by addressing long-standing issues and reducing technical debt.",
        "Partnered with backend, product and support teams to prioritise work based on real user needs.",
      ],
    },
    {
      start: "01/2017",
      end: "01/2018",
      title: "Front-End & App Developer",
      company: "Esquared Technologies",
      bullets: [
        "Delivered features on an Angular2 app, working closely with founders and designers",
      ],
    },
    {
      start: "01/2016",
      end: "12/2017",
      title: "Web Developer",
      company: "Cult Beauty",
      bullets: [
        "Built UI features and improved performance for a high-traffic e-commerce site",
      ],
    },
    {
      start: "01/2015",
      end: "12/2016",
      title: "Web Developer",
      company: "IDG UK",
      bullets: [
        "Developed editorial and publishing tools for websites including PC Advisor, Macworld, ComputerWorld, Digital Arts Online and TechWorld",
      ],
    },
    {
      start: "01/2014",
      end: "12/2015",
      title: "Junior Software Developer",
      company: "Kantar Worldpanel",
      bullets: ["Built internal data tools and reporting automations"],
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
