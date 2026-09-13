export interface AcademicCourse {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}
export interface AcademicTerm {
  slug: string;
  title: string;
  period?: string;
  kind: "semester" | "research";
  courses: AcademicCourse[];
}
export interface AcademicLink {
  label: string;
  url: string;
}
export interface AcademicWeek {
  week: number;
  title?: string;
  status: "in-progress" | "complete";
  topic?: string;
  concepts?: string[];
  lab?: string;
  notebooks?: AcademicLink[];
  code?: AcademicLink[];
  resources?: AcademicLink[];
  takeaways?: string;
  projectConnection?: string;
  body: string;
}
