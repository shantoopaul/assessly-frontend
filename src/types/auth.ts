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

export type GoogleLoginInput = {
  credential: string;
};

export type GoogleCredentialResponse = {
  credential: string;
  clientId: string;
  select_by: string;
};

export type GoogleIdConfiguration = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: "signin" | "signup" | "use";
  use_fedcm_for_prompt?: boolean;
};

export type GoogleButtonText =
  | "signin_with"
  | "signup_with"
  | "continue_with"
  | "signin";

export type GoogleButtonOptions = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: GoogleButtonText;
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
};

export type GoogleAccountsId = {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
};

export type GoogleAccounts = {
  id: GoogleAccountsId;
};

export type GoogleNamespace = {
  accounts: GoogleAccounts;
};

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}
