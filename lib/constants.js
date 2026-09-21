export const NAME = "Tania Papazafeiropoulou";
export const SITE_URL = "https://tany4.com/";
export const JOB_TITLE = 'Senior Front-End & Mobile Engineer'
export const CONTACT_EMAIL = "hello@tany4.com";
export const SITE_TITLE = `${NAME} | Senior Front-End & Mobile Engineer`;
export const SITE_DESCRIPTION =
  "Senior front-end and mobile engineer working with React and React Native.";

export const LAST_COMMIT_ENDPOINT = "/api/last-commit";

// The PDF is regenerated on every build; the version changes with the CV's content
// (see next.config.js), so a cached copy is never served after the CV changes
export const CV_PDF_URL = `/TaniaPapazafeiropoulou-CV.pdf?v=${process.env.NEXT_PUBLIC_CV_VERSION || "dev"}`;

export const CLOUDFLARE_WEB_ANALYTICS_TOKEN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
