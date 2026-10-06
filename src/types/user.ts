import type { Role } from "@/constants/roles";

export type UserStatus = "ACTIVE" | "BLOCKED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserListResponse = {
  success: true;
  message: string;
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UserListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  sortOrder?: "asc" | "desc";
};
