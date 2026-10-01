import type { AnalysisResult, JobAnalysisResult } from "@/lib/schemas";

export type { AnalysisResult, JobAnalysisResult, InterviewQuestions } from "@/lib/schemas";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string | null;
  resume_text: string | null;
  created_at: string;
}

export interface Analysis extends AnalysisResult {
  id: string;
  user_id: string;
  resume_id: string;
  created_at: string;
}

export interface JobAnalysis extends JobAnalysisResult {
  id: string;
  user_id: string;
  resume_id: string;
  job_description: string;
  created_at: string;
}
