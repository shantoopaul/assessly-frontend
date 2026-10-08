import apiClient from "@/lib/apiClient";
import type { AdminStatsResponse } from "@/types/admin";
import type { AuditLogListQuery, AuditLogListResponse } from "@/types/audit";

export const adminApi = {
  getStats: () =>
    apiClient<AdminStatsResponse>("/admin/stats", {
      method: "GET",
    }),

  listAuditLogs: (query: AuditLogListQuery) => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set("page", query.page.toString());
    if (query.limit) searchParams.set("limit", query.limit.toString());
    if (query.action) searchParams.set("action", query.action);
    if (query.entityType) searchParams.set("entityType", query.entityType);

    return apiClient<AuditLogListResponse>(
      `/admin/audit-logs?${searchParams.toString()}`,
      { method: "GET" },
    );
  },
};
