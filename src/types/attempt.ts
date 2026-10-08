import type { Difficulty } from "./assessment";
import type { PaymentStatus } from "./payment";

export type AttemptStatus =
  | "PENDING_PAYMENT"
  | "READY"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "EVALUATED"
  | "CANCELLED";

export type AttemptListItem = {
  id: string;
  attemptNo: number;
  status: AttemptStatus;
  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
  evaluatedAt: string | null;
  finalScore: number | null;
  passed: boolean | null;
  createdAt: string;
  assessment: {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
  };
  payment: {
    id: string;
    status: PaymentStatus;
    amountCents: number;
    currency: string;
  } | null;
};

export type AttemptListResponse = {
  success: true;
  message: string;
  data: AttemptListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AttemptListQuery = {
  page?: number;
  limit?: number;
  status?: AttemptStatus;
};

export type AttemptQuestionAnswer = {
  id: string;
  response: unknown;
  autoScore: number | null;
  reviewerScore: number | null;
  feedback: string | null;
};

export type AttemptQuestion = {
  id: string;
  prompt: string;
  type: "MCQ" | "TEXT" | "CODE";
  options: string[] | null;
  points: number;
  order: number;
  answers: AttemptQuestionAnswer[];
};

export type AttemptReview = {
  feedback: string;
  decision: "PASS" | "FAIL";
  totalScore: number;
  createdAt: string;
};

export type AttemptDetailSummary = {
  id: string;
  attemptNo: number;
  status: AttemptStatus;
  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
  evaluatedAt: string | null;
  autoScore: number | null;
  finalScore: number | null;
  passed: boolean | null;
  assessment: {
    id: string;
    title: string;
    passingScore: number;
    durationMinutes?: number;
    feeCents?: number;
    currency?: string;
  };
  payment: {
    id: string;
    status: PaymentStatus;
    amountCents: number;
    currency: string;
  } | null;
  review: AttemptReview | null;
};

export type AttemptDetailFull = AttemptDetailSummary & {
  assessment: AttemptDetailSummary["assessment"] & {
    questions: AttemptQuestion[];
  };
};

export type AttemptDetail = AttemptDetailSummary | AttemptDetailFull;

export type StartAttemptResponse = {
  success: true;
  message: string;
  data: AttemptDetailFull;
};

export type SaveAnswerResponse = {
  success: true;
  message: string;
  data: {
    id: string;
    questionId: string;
    response: unknown;
    updatedAt: string;
  };
};

export type SubmitAttemptResponse = {
  success: true;
  message: string;
  data: {
    id: string;
    status: AttemptStatus;
    submittedAt: string;
    autoScore: number;
  };
};
