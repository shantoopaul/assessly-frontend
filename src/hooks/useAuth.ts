"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { ROLE_HOME } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import type { GoogleLoginInput, LoginInput, RegisterInput } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, hydrated, setUser, clear } = useAuthStore();

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const res = await authApi.me();
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: hydrated && Boolean(user),
  });

  useEffect(() => {
    if (meQuery.isSuccess) {
      setUser(meQuery.data);
    } else if (meQuery.isFetched && meQuery.isError) {
      clear();
    }
  }, [
    meQuery.isSuccess,
    meQuery.isFetched,
    meQuery.isError,
    meQuery.data,
    setUser,
    clear,
  ]);

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
      setUser(res.data.user);
      queryClient.setQueryData(AUTH_QUERY_KEY, res.data.user);
      toast.success("Welcome back!");
      router.replace(ROLE_HOME[res.data.user.role]);
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
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (input: GoogleLoginInput) => authApi.googleLogin(input),
    onSuccess: (res) => {
      setUser(res.data.user);
      queryClient.setQueryData(AUTH_QUERY_KEY, res.data.user);
      toast.success(`Signed in as ${res.data.user.name}`);
      router.replace(ROLE_HOME[res.data.user.role]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google sign-in failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clear();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      toast.success("Signed out");
      router.replace("/login");
    },
    onError: () => {
      clear();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
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
    googleLogin: googleLoginMutation.mutate,
    isGoogleLoggingIn: googleLoginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}