import type { Role } from "@/constants/roles";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "BLOCKED";
  avatarUrl: string | null;
  createdAt: string;
};

export type AuthResponse = {
  success: true;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfileInput = {
  name: string;
};
