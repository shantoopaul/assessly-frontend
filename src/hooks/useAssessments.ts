"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assessmentsApi } from "@/api/assessments";
import type {
  AssessmentListQuery,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateQuestionInput,
} from "@/types/assessment";

export const ASSESSMENTS_QUERY_KEY = ["assessments"] as const;
export const MANAGED_ASSESSMENTS_QUERY_KEY = [
  "assessments",
  "managed",
] as const;

const managedDetailKey = (id: string) =>
  [...MANAGED_ASSESSMENTS_QUERY_KEY, "detail", id] as const;

export function useAssessments(query: AssessmentListQuery) {
  return useQuery({
    queryKey: [...ASSESSMENTS_QUERY_KEY, query],
    queryFn: () => assessmentsApi.list(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useManagedAssessments(query: AssessmentListQuery) {
  return useQuery({
    queryKey: [...MANAGED_ASSESSMENTS_QUERY_KEY, query],
    queryFn: () => assessmentsApi.listManaged(query),
    staleTime: 1000 * 30,
  });
}

export function useManagedAssessment(id: string) {
  return useQuery({
    queryKey: managedDetailKey(id),
    queryFn: () => assessmentsApi.getManaged(id),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssessmentInput) => assessmentsApi.create(data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: MANAGED_ASSESSMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to create assessment",
      ),
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentInput }) =>
      assessmentsApi.update(id, data),
    onSuccess: (res, variables) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: MANAGED_ASSESSMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: managedDetailKey(variables.id),
      });
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to update assessment",
      ),
  });
}

export function usePublishAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assessmentsApi.publish(id),
    onSuccess: (res, id) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: MANAGED_ASSESSMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: managedDetailKey(id) });
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to publish assessment",
      ),
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assessmentsApi.softDelete(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: MANAGED_ASSESSMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to delete assessment",
      ),
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assessmentId,
      data,
    }: {
      assessmentId: string;
      data: CreateQuestionInput;
    }) => assessmentsApi.addQuestion(assessmentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MANAGED_ASSESSMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: managedDetailKey(variables.assessmentId),
      });
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error ? error.message : "Failed to add question",
      ),
  });
}
