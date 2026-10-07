import apiClient from "@/lib/apiClient";
import type { AttemptListQuery, AttemptListResponse } from "@/types/attempt";

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
};
