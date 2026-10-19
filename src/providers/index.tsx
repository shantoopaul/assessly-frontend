"use client";
import type { ReactNode } from "react";
import { ConfirmDialogProvider } from "@/components/shared/confirm-dialog-provider";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProvider from "./query.provider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
};
export default Providers;