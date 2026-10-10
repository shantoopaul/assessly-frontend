import apiClient from "@/lib/apiClient";
import type {
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
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

  googleLogin: (input: GoogleLoginInput) =>
    apiClient<AuthResponse>("/auth/google", {
      method: "POST",
      body: input,
    }),

  logout: () =>
    apiClient<ApiEnvelope<null>>("/auth/logout", {
      method: "POST",
      body: {},
    }),

  me: () => apiClient<ApiEnvelope<AuthUser>>("/users/me"),

  updateMe: (input: UpdateProfileInput) =>
    apiClient<ApiEnvelope<AuthUser>>("/users/me", {
      method: "PATCH",
      body: input,
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    return apiClient<ApiEnvelope<AuthUser>>("/users/me/avatar", {
      method: "PATCH",
      body: formData,
    });
  },
};