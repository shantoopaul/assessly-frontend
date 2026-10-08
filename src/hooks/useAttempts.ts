"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { attemptsApi } from "@/api/attempts";
import { useAuthStore } from "@/store/auth.store";
import type { AttemptListQuery } from "@/types/attempt";

export const ATTEMPTS_QUERY_KEY = ["attempts"] as const;

export function useMyAttempts(query: AttemptListQuery) {
  return useQuery({
    queryKey: [...ATTEMPTS_QUERY_KEY, "my", query],
    queryFn: () => attemptsApi.listMine(query),
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: [...ATTEMPTS_QUERY_KEY, "detail", attemptId],
    queryFn: () => attemptsApi.getById(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 15,
  });
}

export function useEnrollAssessment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (assessmentId: string) => attemptsApi.enroll(assessmentId),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_QUERY_KEY });

      if (res.data.status === "PENDING_PAYMENT") {
        router.push(`/payment/checkout?attemptId=${res.data.id}`);
      } else {
        router.push(`/candidate/attempts/${res.data.id}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enroll in assessment");
    },
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) => attemptsApi.start(attemptId),
    onSuccess: (_data, attemptId) => {
      toast.success("Attempt started. Timer is running!");
      queryClient.invalidateQueries({
        queryKey: [...ATTEMPTS_QUERY_KEY, "detail", attemptId],
      });
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start attempt");
    },
  });
}

export function useSaveAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      response,
    }: {
      attemptId: string;
      questionId: string;
      response: unknown;
    }) => attemptsApi.saveAnswer(attemptId, questionId, response),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ATTEMPTS_QUERY_KEY, "detail", variables.attemptId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save answer");
    },
  });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (attemptId: string) => attemptsApi.submit(attemptId),
    onSuccess: (res) => {
      toast.success("Attempt submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ATTEMPTS_QUERY_KEY, "detail", res.data.id],
      });
      router.push("/candidate/attempts");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit attempt");
    },
  });
}
