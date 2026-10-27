export const NAME = "Tania Papazafeiropoulou";
export const SITE_URL = "https://tany4.com/";
export const JOB_TITLE = 'Senior Front-End & Mobile Engineer'
export const CONTACT_EMAIL = "hello@tany4.com";
export const SITE_TITLE = `${NAME} | Senior Front-End & Mobile Engineer`;
export const SITE_DESCRIPTION =
  "Senior front-end and mobile engineer working with React and React Native.";

export const LAST_COMMIT_ENDPOINT = "/api/last-commit";

// The menu, in order. The link at the end of each page goes to the next one.
export const PAGES = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
  { href: "/cv", label: "cv" },
  { href: "/about", label: "about" },
];

// The accounts linked from the footer and listed on the work page
export const PROFILES = [
  { label: "github", value: "altany", href: "http://www.github.com/altany" },
  { label: "gitlab", value: "altany", href: "https://gitlab.com/brief-challenges" },
  { label: "linkedin", value: "/taniapapazaf", href: "http://www.linkedin.com/in/taniapapazaf" },
  { label: "twitter", value: "@_Tany_", href: "https://twitter.com/_Tany_" },
  { label: "codewars", value: "altany", href: "https://www.codewars.com/users/altany" },
];

export const profile = (label) => PROFILES.find((p) => p.label === label);

// The accounts that are hers, for the Person data in the page head. Search engines
// use these to tell her apart from what third-party profile sites say about her.
export const SAME_AS = ["linkedin", "github", "twitter"].map((label) => profile(label).href);

// One address for the PDF, the same one search engines are told is canonical.
// Browsers check it is still current on every open (see next.config.js), so a
// new CV shows up without the link having to change.
export const CV_PDF_URL = "/TaniaPapazafeiropoulou-CV.pdf";

export const CLOUDFLARE_WEB_ANALYTICS_TOKEN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
