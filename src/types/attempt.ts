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
