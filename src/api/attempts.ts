import apiClient from "@/lib/apiClient";
import type {
  AttemptDetail,
  AttemptListQuery,
  AttemptListResponse,
  SaveAnswerResponse,
  StartAttemptResponse,
  SubmitAttemptResponse,
} from "@/types/attempt";

export const attemptsApi = {
  listMine: (query: AttemptListQuery) => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set("page", query.page.toString());
    if (query.limit) searchParams.set("limit", query.limit.toString());
    if (query.status) searchParams.set("status", query.status);

    return apiClient<AttemptListResponse>(
      `/attempts/my?${searchParams.toString()}`,
      { method: "GET" },
    );
  },

  getById: (attemptId: string) =>
    apiClient<{ success: true; message: string; data: AttemptDetail }>(
      `/attempts/${attemptId}`,
      { method: "GET" },
    ),

  start: (attemptId: string) =>
    apiClient<StartAttemptResponse>(`/attempts/${attemptId}/start`, {
      method: "POST",
    }),

  saveAnswer: (attemptId: string, questionId: string, response: unknown) =>
    apiClient<SaveAnswerResponse>(
      `/attempts/${attemptId}/answers/${questionId}`,
      { method: "PUT", body: { response } },
    ),

  submit: (attemptId: string) =>
    apiClient<SubmitAttemptResponse>(`/attempts/${attemptId}/submit`, {
      method: "POST",
    }),

  enroll: (assessmentId: string) =>
    apiClient<{
      success: true;
      message: string;
      data: { id: string; status: string };
    }>(`/attempts/enroll/${assessmentId}`, { method: "POST" }),
};
