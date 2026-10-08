"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
import type { AuditLogListQuery } from "@/types/audit";

export const AUDIT_LOGS_QUERY_KEY = ["admin", "audit-logs"] as const;

export function useAuditLogs(query: AuditLogListQuery) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, query],
    queryFn: () => adminApi.listAuditLogs(query),
    staleTime: 1000 * 30, // 30 seconds
  });
}
