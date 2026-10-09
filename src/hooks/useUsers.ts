"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/api/users";
import type { Role } from "@/constants/roles";
import type { UserListQuery, UserStatus } from "@/types/user";

export const USERS_QUERY_KEY = ["users", "list"] as const;

export function useUsers(query: UserListQuery) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, query],
    queryFn: () => usersApi.list(query),
    staleTime: 1000 * 30,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      usersApi.updateStatus(userId, status),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      usersApi.updateRole(userId, role),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.softDelete(userId),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}
