export type Difficulty = "JUNIOR" | "MID" | "SENIOR";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionType = "MCQ" | "TEXT" | "CODE";

export type Assessment = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScore: number;
  feeCents: number;
  currency: string;
  status: AssessmentStatus;
  createdAt: string;
  creator?: { id: string; name: string };
  _count?: { questions: number };
};

export type ManagedAssessment = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScore: number;
  feeCents: number;
  currency: string;
  status: AssessmentStatus;
  createdById: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  _count: { attempts: number };
};

export type Question = {
  id: string;
  assessmentId: string;
  prompt: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentListResponse = {
  success: true;
  message: string;
  data: Assessment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AssessmentListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: Difficulty;
  status?: AssessmentStatus;
  sortBy?: "createdAt" | "title" | "feeCents" | "durationMinutes";
  sortOrder?: "asc" | "desc";
};

export type CreateAssessmentInput = {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScore: number;
  feeCents: number;
  currency: string;
};

export type UpdateAssessmentInput = Partial<CreateAssessmentInput>;

export type CreateQuestionInput = {
  prompt: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
};

export type ManagedAssessmentResponse = {
  success: true;
  message: string;
  data: ManagedAssessment;
};

export type UpdateQuestionInput = {
  prompt?: string;
  type?: QuestionType;
  options?: string[] | null;
  correctAnswer?: string | null;
  points?: number;
  order?: number;
};
