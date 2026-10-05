import apiClient from "@/lib/apiClient";
import type {
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@/types/auth";

export const authApi = {
  login: (input: LoginInput) =>
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    }),

  register: (input: RegisterInput) =>
    apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
    }),

  logout: () =>
    apiClient<ApiEnvelope<null>>("/auth/logout", {
      method: "POST",
      body: {},
    }),

  me: () => apiClient<ApiEnvelope<AuthUser>>("/users/me"),
};
