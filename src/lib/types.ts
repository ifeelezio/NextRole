export type ResumeLayout =
  | "minimal"
  | "modern"
  | "professional"
  | "developer"
  | "creative"
  | "executive";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies?: string;
  date?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  link?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  heading: string;
  items: CustomSectionItem[];
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ResumeSettings {
  template: ResumeLayout;
  fontFamily: "inter" | "serif" | "mono";
  fontSize: "small" | "medium" | "large";
  lineHeight: "compact" | "normal" | "relaxed";
  accentColor: string;
  margins: "compact" | "normal" | "spacious";
  sectionSpacing: "compact" | "normal" | "spacious";
}

export interface ResumeData {
  id?: string;
  title: string;
  updatedAt?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string; // Comma-separated or multi-line
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
  customSections: CustomSection[];
  settings: ResumeSettings;
}

// Backwards compatibility aliases
export type Experience = ExperienceItem;
export type Education = EducationItem;
