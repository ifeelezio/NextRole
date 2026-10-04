import { z } from "zod";

const textList = (max = 30) => z.array(z.string().trim().min(1).max(500)).max(max);
const percent = z
  .number()
  .min(0)
  .max(100)
  .transform((n) => Math.round(n));
const fiveQuestions = z.array(z.string().trim().min(1).max(600)).length(5);

// ---- AI responses (validated before anything is saved) ----
export const analysisSchema = z.object({
  score: percent,
  skills: textList(60),
  strengths: textList(),
  weaknesses: textList(),
  missing_skills: textList(),
  suggestions: textList(),
});

export const jobAnalysisSchema = z.object({
  match_percentage: percent,
  matching_skills: textList(60),
  missing_skills: textList(),
  relevant_experience: textList(),
  suggestions: textList(),
});

export const interviewSchema = z.object({
  technical_questions: fiveQuestions,
  hr_questions: fiveQuestions,
  project_questions: fiveQuestions,
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
export type JobAnalysisResult = z.infer<typeof jobAnalysisSchema>;
export type InterviewQuestions = z.infer<typeof interviewSchema>;

// ---- Request bodies ----
export const uuidSchema = z.string().uuid();

export const jobDescriptionSchema = z
  .string()
  .trim()
  .min(50, "Job description must be at least 50 characters.")
  .max(10000, "Job description must be at most 10,000 characters.");

export const analyzeRequestSchema = z.object({ resumeId: uuidSchema });

export const jobRequestSchema = z.object({
  resumeId: uuidSchema,
  jobDescription: jobDescriptionSchema,
});

export const resumeRequestSchema = z.object({
  filePath: z.string().min(1).max(300),
  fileName: z.string().trim().min(1).max(255),
});

export const builderAssistantRequestSchema = z.object({
  action: z.enum([
    "audit_and_ask",
    "improve_all",
    "tailor",
    "answer_and_apply",
    "custom_prompt",
    "step_interview",
    "generate_field_project",
  ]),
  resumeData: z.record(z.string(), z.any()).optional().default({}),
  targetRole: z.string().trim().max(200).optional(),
  jobDescription: z.string().trim().max(10000).optional(),
  userPrompt: z.string().trim().max(2000).optional(),
  fieldOrTopic: z.string().trim().max(300).optional(),
  stepAnswer: z
    .object({
      questionId: z.string().trim().max(100),
      section: z.string().trim().max(50),
      question: z.string().trim().max(500),
      answer: z.string().trim().max(2000),
    })
    .optional(),
  qaAnswers: z
    .array(
      z.object({
        question: z.string().trim().max(500),
        answer: z.string().trim().max(1000),
      })
    )
    .optional(),
});

export const generatedProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.string(),
  link: z.string().optional(),
  date: z.string().optional(),
});

export type BuilderAssistantRequest = z.infer<typeof builderAssistantRequestSchema>;

