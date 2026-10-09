import apiClient from "@/lib/apiClient";
import type { Role } from "@/constants/roles";
import type {
  User,
  UserListQuery,
  UserListResponse,
  UserStatus,
} from "@/types/user";

type UserMutationResponse = {
  success: true;
  message: string;
  data: Pick<User, "id" | "name" | "email" | "role" | "status">;
};

type DeleteUserResponse = {
  success: true;
  message: string;
  data: null;
};

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
      { method: "GET" },
    );
  },

  updateStatus: (userId: string, status: UserStatus) =>
    apiClient<UserMutationResponse>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { status },
    }),

  updateRole: (userId: string, role: Role) =>
    apiClient<UserMutationResponse>(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: { role },
    }),

  softDelete: (userId: string) =>
    apiClient<DeleteUserResponse>(`/admin/users/${userId}`, {
      method: "DELETE",
    }),
};