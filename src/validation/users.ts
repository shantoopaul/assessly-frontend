import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum([ROLES.CANDIDATE, ROLES.REVIEWER, ROLES.ADMIN]).optional(),
  status: z.enum(["ACTIVE", "BLOCKED"] as const).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type UserFilterValues = z.infer<typeof userFilterSchema>;
