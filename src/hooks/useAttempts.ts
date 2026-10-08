"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { ROLE_HOME } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { attemptsApi } from "@/api/attempts";
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

type EnrollResponse = {
  success: true;
  message: string;
  data: { id: string; status: string };
};

export function useEnrollAssessment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await apiClient<EnrollResponse>(
        `/attempts/enroll/${assessmentId}`,
        { method: "POST" },
      );
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_QUERY_KEY });

      if (res.data.status === "PENDING_PAYMENT") {
        router.push(`/payment/checkout?attemptId=${res.data.id}`);
      } else {
        router.push(ROLE_HOME[user?.role ?? "CANDIDATE"]);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enroll in assessment");
    },
  });
}
