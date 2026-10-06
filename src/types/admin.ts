export type AdminStats = {
  users: { total: number; candidates: number; reviewers: number };
  assessments: { published: number };
  attempts: { total: number; evaluated: number };
  payments: { successfulCount: number; grossAmountInMinorUnits: number };
};

export type AdminStatsResponse = {
  success: boolean;
  message: string;
  data: AdminStats;
};
