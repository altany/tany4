export type CvHeader = {
  name: string;
  title: string;
  email: string;
  location: string;
  website?: string;
};

export type CvSidebarSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
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

export type CvStrength = {
  title: string;
  description: string;
};

export type Cv = {
  header: CvHeader;
  personalStatement: string;
  strengths: CvStrength[];
  sidebar: CvSidebarSection[];
  experience: CvExperienceRole[];
  education: CvEducationItem[];
  languages: CvLanguage[];
};
