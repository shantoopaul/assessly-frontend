"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reviewsApi } from "@/api/reviews";
import type { EvaluateInput, ReviewListQuery } from "@/types/review";

export const REVIEWS_QUERY_KEY = ["reviews"] as const;

export function useReviewQueue(query: ReviewListQuery) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, "queue", query],
    queryFn: () => reviewsApi.queue(query),
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useMyReviews(query: ReviewListQuery) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, "mine", query],
    queryFn: () => reviewsApi.mine(query),
    staleTime: 1000 * 30,
  });
}

export function useReviewAttempt(attemptId: string) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, "attempt", attemptId],
    queryFn: () => reviewsApi.getByAttempt(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useClaimAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) => reviewsApi.claim(attemptId),
    onSuccess: (_data, attemptId) => {
      toast.success("Attempt claimed for review");
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...REVIEWS_QUERY_KEY, "attempt", attemptId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to claim attempt");
    },
  });
}

export function useEvaluateAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      input,
    }: {
      attemptId: string;
      input: EvaluateInput;
    }) => reviewsApi.evaluate(attemptId, input),
    onSuccess: (_data, variables) => {
      toast.success("Attempt evaluated successfully");
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...REVIEWS_QUERY_KEY, "attempt", variables.attemptId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to evaluate attempt");
    },
  });
}
