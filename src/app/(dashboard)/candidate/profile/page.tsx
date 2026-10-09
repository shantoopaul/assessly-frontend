"use client";

import { ProfileSkeleton, ProfileView } from "@/components/shared/profile-view";
import { useAuth } from "@/hooks/useAuth";

export default function CandidateProfilePage() {
  const { user } = useAuth();

  if (!user) return <ProfileSkeleton />;

  return (
    <ProfileView
      user={user}
      title="Profile & Settings"
      description="Manage your personal information and account preferences."
    />
  );
}
