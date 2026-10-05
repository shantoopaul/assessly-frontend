"use client";

import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "../auth/logout-button";

type DashboardHeaderProps = {
  role: string;
  onMenuClick: () => void;
};

export default function DashboardHeader({
  role,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          aria-controls="dashboard-navigation"
          onClick={onMenuClick}
        >
          <Menu />
        </Button>

        <Separator orientation="vertical" className="h-6 md:hidden" />

        <div>
          <p className="text-sm font-semibold">Assessly</p>
          <p className="text-xs text-muted-foreground">
            {role.charAt(0) + role.slice(1).toLowerCase()} workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell />
        </Button>

        <LogoutButton className="hidden sm:inline-flex" />
      </div>
    </header>
  );
}
