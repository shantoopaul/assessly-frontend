"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@/api/payments";
import { toastApiError } from "@/lib/toast";

export const PAYMENTS_QUERY_KEY = ["payments"] as const;

export function usePaymentByAttempt(attemptId: string | null) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, "attempt", attemptId],
    queryFn: () => paymentsApi.getByAttempt(attemptId as string),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 30,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (attemptId: string) =>
      paymentsApi.createCheckoutSession(attemptId),
    onError: (error) => toastApiError(error, "Failed to start checkout"),
  });
}
