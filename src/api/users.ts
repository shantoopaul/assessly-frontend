import apiClient from "@/lib/apiClient";
import type { UserListQuery, UserListResponse } from "@/types/user";

export const usersApi = {
  list: (query: UserListQuery) => {
    const searchParams = new URLSearchParams();
    if (query.page) searchParams.set("page", query.page.toString());
    if (query.limit) searchParams.set("limit", query.limit.toString());
    if (query.search) searchParams.set("search", query.search);
    if (query.role) searchParams.set("role", query.role);
    if (query.status) searchParams.set("status", query.status);
    if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

    return apiClient<UserListResponse>(
      `/admin/users?${searchParams.toString()}`,
      {
        method: "GET",
      },
    );
  },
};
