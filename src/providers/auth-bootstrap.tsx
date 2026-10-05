"use client";

import { useEffect } from "react";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";

export function AuthBootstrap() {
  const { user, hydrated, setUser, clear } = useAuthStore();

  useEffect(() => {
    if (!hydrated || user) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.me();
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) clear();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, user, setUser, clear]);

  return null;
}
