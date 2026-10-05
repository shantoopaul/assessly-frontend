"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { ROLE_HOME } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import type { LoginInput, RegisterInput } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, hydrated, setUser, clear } = useAuthStore();

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const res = await authApi.me();
      setUser(res.data);
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: hydrated && !user,
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
      setUser(res.data.user);
      queryClient.setQueryData(AUTH_QUERY_KEY, res.data.user);
      toast.success("Welcome back!");
      router.replace(ROLE_HOME[res.data.user.role]);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (res) => {
      setUser(res.data.user);
      queryClient.setQueryData(AUTH_QUERY_KEY, res.data.user);
      toast.success("Account created. Welcome to Assessly!");
      router.replace(ROLE_HOME[res.data.user.role]);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clear();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Signed out");
      router.replace("/login");
      router.refresh();
    },
    onError: () => {
      clear();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      router.replace("/login");
    },
  });

  return {
    user,
    hydrated,
    isAuthenticated: Boolean(user),
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
