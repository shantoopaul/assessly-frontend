import apiClient from "@/lib/apiClient";
import type {
  EvaluateInput,
  MyReviewsResponse,
  ReviewAttemptResponse,
  ReviewEvaluationResponse,
  ReviewListQuery,
  ReviewQueueResponse,
} from "@/types/review";

const buildQuery = (query: ReviewListQuery): string => {
  const searchParams = new URLSearchParams();
  if (query.page) searchParams.set("page", query.page.toString());
  if (query.limit) searchParams.set("limit", query.limit.toString());
  return searchParams.toString();
};

export const reviewsApi = {
  queue: (query: ReviewListQuery) =>
    apiClient<ReviewQueueResponse>(`/reviews/queue?${buildQuery(query)}`, {
      method: "GET",
    }),

  mine: (query: ReviewListQuery) =>
    apiClient<MyReviewsResponse>(`/reviews/mine?${buildQuery(query)}`, {
      method: "GET",
    }),

  getByAttempt: (attemptId: string) =>
    apiClient<ReviewAttemptResponse>(`/reviews/${attemptId}`, {
      method: "GET",
    }),

  claim: (attemptId: string) =>
    apiClient<ReviewAttemptResponse>(`/reviews/${attemptId}/claim`, {
      method: "POST",
    }),

  evaluate: (attemptId: string, input: EvaluateInput) =>
    apiClient<ReviewEvaluationResponse>(`/reviews/${attemptId}/evaluate`, {
      method: "POST",
      body: input,
    }),
};
