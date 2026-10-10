import type { Difficulty, QuestionType } from "./assessment";

export type ReviewDecision = "PASS" | "FAIL";

export type ReviewStatus = "UNDER_REVIEW" | "EVALUATED";

export type ReviewAnswer = {
  id: string;
  response: unknown;
  autoScore: number | null;
  reviewerScore: number | null;
  feedback: string | null;
};

export type ReviewQuestion = {
  id: string;
  prompt: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  points: number;
  order: number;
  answers: ReviewAnswer[];
};

export type ReviewQueueItem = {
  id: string;
  submittedAt: string | null;
  attemptNo: number;
  assessment: {
    id: string;
    title: string;
    difficulty: Difficulty;
  };
  candidate: {
    id: string;
    name: string;
  };
};

export type ReviewAttemptDetail = {
  id: string;
  status: ReviewStatus;
  autoScore: number | null;
  finalScore: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
    passingScore: number;
    questions: ReviewQuestion[];
  };
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  review: {
    feedback: string;
    decision: ReviewDecision;
    totalScore: number;
    createdAt: string;
  } | null;
};

export type ReviewQueueResponse = {
  success: true;
  message: string;
  data: ReviewQueueItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ReviewAttemptResponse = {
  success: true;
  message: string;
  data: ReviewAttemptDetail;
};

export type EvaluateAnswerInput = {
  answerId: string;
  score: number;
  feedback?: string;
};

export type EvaluateInput = {
  feedback: string;
  answers: EvaluateAnswerInput[];
};

export type ReviewEvaluation = {
  id: string;
  attemptId: string;
  reviewerId: string;
  feedback: string;
  decision: ReviewDecision;
  totalScore: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewEvaluationResponse = {
  success: true;
  message: string;
  data: ReviewEvaluation;
};

export type ReviewListQuery = {
  page?: number;
  limit?: number;
};

export type MyReviewItem = {
  id: string;
  status: ReviewStatus;
  submittedAt: string | null;
  evaluatedAt: string | null;
  finalScore: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
  };
  candidate: {
    id: string;
    name: string;
  };
};

export type MyReviewsResponse = {
  success: true;
  message: string;
  data: MyReviewItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
