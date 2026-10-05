export const ROLES = {
  CANDIDATE: "CANDIDATE",
  REVIEWER: "REVIEWER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
