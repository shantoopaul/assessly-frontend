"use client";

import { ProfileSkeleton, ProfileView } from "@/components/shared/profile-view";
import { useAuth } from "@/hooks/useAuth";

export default function AdminProfilePage() {
  const { user } = useAuth();

  if (!user) return <ProfileSkeleton />;

  return (
    <ProfileView
      user={user}
      title="Administrator Profile"
      description="Manage your administrator account information and preferences."
    />
  );
}
