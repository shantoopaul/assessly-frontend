import apiClient from "@/lib/apiClient";
import type {
  Assessment,
  AssessmentListQuery,
  AssessmentListResponse,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateQuestionInput,
  ManagedAssessmentResponse,
  Question,
  UpdateQuestionInput,
} from "@/types/assessment";

export const assessmentsApi = {
  list: (query: AssessmentListQuery) => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set("page", query.page.toString());
    if (query.limit) searchParams.set("limit", query.limit.toString());
    if (query.search) searchParams.set("search", query.search);
    if (query.difficulty) searchParams.set("difficulty", query.difficulty);
    if (query.status) searchParams.set("status", query.status);
    if (query.sortBy) searchParams.set("sortBy", query.sortBy);
    if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);
    return apiClient<AssessmentListResponse>(
      `/assessments?${searchParams.toString()}`,
      { method: "GET" },
    );
  },

  getById: (id: string) =>
    apiClient<{ success: true; message: string; data: Assessment }>(
      `/assessments/${id}`,
      { method: "GET" },
    ),

  listManaged: (query: AssessmentListQuery) => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set("page", query.page.toString());
    if (query.limit) searchParams.set("limit", query.limit.toString());
    if (query.search) searchParams.set("search", query.search);
    if (query.status) searchParams.set("status", query.status);
    return apiClient<AssessmentListResponse>(
      `/assessments/manage/mine?${searchParams.toString()}`,
      { method: "GET" },
    );
  },

  getManaged: (id: string) =>
    apiClient<ManagedAssessmentResponse>(`/assessments/manage/${id}`, {
      method: "GET",
    }),

  create: (data: CreateAssessmentInput) =>
    apiClient<{ success: true; message: string; data: Assessment }>(
      "/assessments",
      { method: "POST", body: data },
    ),

  update: (id: string, data: UpdateAssessmentInput) =>
    apiClient<{ success: true; message: string; data: Assessment }>(
      `/assessments/${id}`,
      { method: "PATCH", body: data },
    ),

  publish: (id: string) =>
    apiClient<{ success: true; message: string; data: Assessment }>(
      `/assessments/${id}/publish`,
      { method: "PATCH" },
    ),

  softDelete: (id: string) =>
    apiClient<{ success: true; message: string; data: null }>(
      `/assessments/${id}`,
      { method: "DELETE" },
    ),

  addQuestion: (assessmentId: string, data: CreateQuestionInput) =>
    apiClient<{ success: true; message: string; data: Question }>(
      `/assessments/${assessmentId}/questions`,
      { method: "POST", body: data },
    ),

  updateQuestion: (
    assessmentId: string,
    questionId: string,
    data: UpdateQuestionInput,
  ) =>
    apiClient<{ success: true; message: string; data: Question }>(
      `/assessments/${assessmentId}/questions/${questionId}`,
      { method: "PATCH", body: data },
    ),

  deleteQuestion: (assessmentId: string, questionId: string) =>
    apiClient<{ success: true; message: string; data: null }>(
      `/assessments/${assessmentId}/questions/${questionId}`,
      { method: "DELETE" },
    ),
};
