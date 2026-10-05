"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartNoAxesCombined,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAVIGATION: Record<Role, NavItem[]> = {
  CANDIDATE: [
    {
      label: "Overview",
      href: ROUTES.candidate,
      icon: LayoutDashboard,
    },
    {
      label: "Assessments",
      href: "/candidate/assessments",
      icon: BookOpen,
    },
    {
      label: "My attempts",
      href: "/candidate/attempts",
      icon: ClipboardCheck,
    },
    {
      label: "Payments",
      href: "/candidate/payments",
      icon: CreditCard,
    },
    {
      label: "Profile",
      href: "/candidate/profile",
      icon: Settings,
    },
  ],
  REVIEWER: [
    {
      label: "Overview",
      href: ROUTES.reviewer,
      icon: LayoutDashboard,
    },
    {
      label: "My assessments",
      href: "/reviewer/assessments",
      icon: BookOpen,
    },
    {
      label: "Review queue",
      href: "/reviewer/reviews",
      icon: ClipboardCheck,
    },
    {
      label: "Analytics",
      href: "/reviewer/analytics",
      icon: ChartNoAxesCombined,
    },
    {
      label: "Profile",
      href: "/reviewer/profile",
      icon: Settings,
    },
  ],
  ADMIN: [
    {
      label: "Overview",
      href: ROUTES.admin,
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Assessments",
      href: "/admin/assessments",
      icon: BookOpen,
    },
    {
      label: "Audit logs",
      href: "/admin/audit-logs",
      icon: ShieldCheck,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: ChartNoAxesCombined,
    },
  ],
};

type DashboardSidebarProps = {
  role: Role;
  mobileOpen: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  role,
  mobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = NAVIGATION[role];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="dashboard-navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r bg-card transition-transform duration-200",
          "md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary"
            onClick={onClose}
          >
            Assessly
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <div className="border-b px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <p className="mt-1 font-medium">
            {role === "ADMIN"
              ? "Administration"
              : role === "REVIEWER"
                ? "Reviewer workspace"
                : "Candidate workspace"}
          </p>
        </div>

        <nav
          aria-label="Dashboard navigation"
          className="flex-1 space-y-1 overflow-y-auto p-3"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !==
                ROUTES[role.toLowerCase() as keyof typeof ROUTES] &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5",
                  "text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            Developer assessment platform
          </p>
        </div>
      </aside>
    </>
  );
}
