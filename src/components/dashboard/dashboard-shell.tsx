"use client";

import { useState, type ReactNode } from "react";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import type { Role } from "@/constants/roles";

type DashboardShellProps = {
  role: Role;
  children: ReactNode;
};

export default function DashboardShell({
  role,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        role={role}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <DashboardHeader role={role} onMenuClick={() => setMobileOpen(true)} />

        <main
          id="main-content"
          className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
