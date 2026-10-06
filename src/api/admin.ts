import apiClient from "@/lib/apiClient";
import type { AdminStatsResponse } from "@/types/admin";

export const adminApi = {
  getStats: () =>
    apiClient<AdminStatsResponse>("/admin/stats", {
      method: "GET",
    }),
};
