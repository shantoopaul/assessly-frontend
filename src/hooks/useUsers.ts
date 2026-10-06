"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import type { UserListQuery } from "@/types/user";

export const USERS_QUERY_KEY = ["users", "list"] as const;

export function useUsers(query: UserListQuery) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, query],
    queryFn: () => usersApi.list(query),
    staleTime: 1000 * 30, // 30 seconds
  });
}
