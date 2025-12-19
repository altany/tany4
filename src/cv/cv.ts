import type { Cv } from "./types";
import { CONTACT_EMAIL } from "../../lib/constants";

export const cv: Cv = {
  header: {
    name: "Tania Papazafeiropoulou",
    title: "Senior Front-End Engineer & Tech Lead",
    email: CONTACT_EMAIL,
    location: "United Kingdom / Greece",
    links: [
      { label: "tany4.com", href: "https://tany4.com" },
      {
        label: "linkedin.com/in/taniapapazaf",
        href: "https://linkedin.com/in/taniapapazaf",
      },
    ],
  },
  sidebar: [
    {
      title: "Summary",
      paragraphs: [
        "Senior Front-End Engineer & Tech Lead with 10+ years of experience building and leading scalable React and React Native applications. Strong focus on high-quality UI architecture, performance, accessibility, and developer experience. Experienced mentoring engineers, leading technical decisions, and delivering impact across multiple product areas.",
      ],
    },
    {
      title: "Websites, portfolios and profiles",
      links: [
        { label: "tany4.com", href: "https://tany4.com" },
        {
          label: "linkedin.com/in/taniapapazaf",
          href: "https://linkedin.com/in/taniapapazaf",
        },
      ],
    },
    {
      title: "AI experience",
      bullets: [
        "Daily user of AI-assisted development tools for debugging, documentation, repo-wide analysis, and improving developer workflows",
        "Support engineers in using AI confidently and safely",
        "Strong interest in prompt engineering and improving developer workflows",
        "Exploring how AI can support front-end applications and workflow automation",
      ],
    },
    {
      title: "Skills",
      bullets: [
        "React & React Native Development",
        "TypeScript & Modern JavaScript",
        "Front-End Architecture & Scalable UI",
        "State Management",
        "Mobile App Performance & Optimisation",
        "API Integration & Back-End Collaboration",
        "Testing (Jest, React Testing Library, CI/CD)",
        "Accessibility & Web/Mobile Best Practices",
        "AI-Assisted Development",
        "Mentoring, Code Reviews & Cross-Team Collaboration",
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
        "Led and mentored a team of 3-5 engineers, supporting delivery and quality",
        "Contributed to early planning and technical decisions (scope, feasibility, risks)",
        "Led and implemented complex front-end features using React, TypeScript, and shared UI patterns across multiple product areas.",
        "Improved cross-team collaboration and streamlined delivery processes",
        "Built a partner platform prototype during a hackathon; the concept later informed production features and partner integrations",
        "Built an AI-assisted appointment planner prototype with product, design and backend",
        "Reduced tech debt, improved accessibility and strengthened monitoring/debugging",
        "Helped extend volunteer support from Olio volunteers to charity volunteers",
        "Interviewed candidates and contributed to hiring and promotion decisions",
        "Strong IC: wrote code daily and unblocked teammates",
      ],
    },
    {
      start: "09/2018",
      end: "08/2023",
      title: "Senior Front-End Developer",
      company: "Olio",
      bullets: [
        "Promoted from Mid-Level to Senior within 18 months based on performance",
        "Helped build Olio’s React Native app within 3 months as part of a small team",
        "Delivered features, improvements and long-term maintenance across major app areas",
        "Key contributor to the Volunteers platform migration (Ruby on Rails → React)",
        "Expanded the Volunteers platform with new features, improved functionality and increased stability",
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
