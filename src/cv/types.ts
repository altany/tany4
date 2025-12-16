export type CvLink = {
  label: string;
  href: string;
  display?: string;
};

export type CvHeader = {
  name: string;
  title: string;
  email: string;
  location: string;
  links: CvLink[];
};

export type CvSidebarSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: CvLink[];
};

export type CvExperienceRole = {
  start: string;
  end: string;
  title: string;
  company: string;
  summary?: string;
  bullets: string[];
};

export type CvEducationItem = {
  date: string;
  institution: string;
  degree: string;
};

export type CvLanguage = {
  name: string;
  levelLabel: string;
  levelCode?: string;
};

export type Cv = {
  header: CvHeader;
  sidebar: CvSidebarSection[];
  experience: CvExperienceRole[];
  education: CvEducationItem[];
  languages: CvLanguage[];
};
