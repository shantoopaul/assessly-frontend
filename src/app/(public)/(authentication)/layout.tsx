import type { ReactNode } from "react";

import { AuthProviders } from "@/components/auth/auth-providers";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthProviders>{children}</AuthProviders>;
}