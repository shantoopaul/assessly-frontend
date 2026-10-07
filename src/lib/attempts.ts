import type { AttemptStatus } from "@/types/attempt";

export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  READY: "Ready",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  EVALUATED: "Evaluated",
  CANCELLED: "Cancelled",
};

export const ATTEMPT_STATUS_STYLES: Record<AttemptStatus, string> = {
  PENDING_PAYMENT:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  READY: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  IN_PROGRESS:
    "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  SUBMITTED:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  UNDER_REVIEW:
    "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  EVALUATED:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  CANCELLED: "bg-muted text-muted-foreground",
};

export const ATTEMPT_STATUS_ORDER: AttemptStatus[] = [
  "PENDING_PAYMENT",
  "READY",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "EVALUATED",
  "CANCELLED",
];

export function isAttemptStatus(value: string | null): value is AttemptStatus {
  return value !== null && (ATTEMPT_STATUS_ORDER as string[]).includes(value);
}
