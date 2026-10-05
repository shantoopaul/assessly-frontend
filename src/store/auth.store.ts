"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "assessly-auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
