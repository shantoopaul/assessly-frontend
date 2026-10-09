"use client";

import { ProfileSkeleton, ProfileView } from "@/components/shared/profile-view";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewerProfilePage() {
  const { user } = useAuth();

  if (!user) return <ProfileSkeleton />;

  return (
    <ProfileView
      user={user}
      title="Reviewer Profile"
      description="Manage your reviewer account information and preferences."
    />
  );
}