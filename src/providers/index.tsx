"use client";
import type { ReactNode } from "react";
import { AuthBootstrap } from "./auth-bootstrap";
import QueryProvider from "./query.provider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <AuthBootstrap />
      {children}
    </QueryProvider>
  );
};

export default Providers;
