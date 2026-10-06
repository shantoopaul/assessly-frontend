"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";

export const ADMIN_STATS_QUERY_KEY = ["admin", "stats"] as const;

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: () => adminApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
