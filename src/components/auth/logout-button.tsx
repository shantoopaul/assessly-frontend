"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton({ className }: { className?: string }) {
  const { logout, isLoggingOut } = useAuth();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => logout()}
      disabled={isLoggingOut}
    >
      <LogOut />
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
