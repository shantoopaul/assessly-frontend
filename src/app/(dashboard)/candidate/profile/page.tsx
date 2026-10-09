"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Camera,
  Loader2,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_QUERY_KEY, useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
});

type ProfileValues = z.infer<typeof profileSchema>;

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CandidateProfilePage() {
  const { user } = useAuth();

  if (!user) return <ProfileSkeleton />;

  return <ProfileView user={user} />;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-80 w-full" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </div>
  );
}

function ProfileView({ user }: { user: AuthUser }) {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: user.name } satisfies ProfileValues,
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      try {
        const res = await authApi.updateMe(value);
        setUser(res.data);
        await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update profile",
        );
      }
    },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type as (typeof ACCEPTED_AVATAR_TYPES)[number])) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be 2MB or smaller");
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const res = await authApi.uploadAvatar(file);
      setUser(res.data);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar",
      );
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
      event.target.value = "";
    }
  };

  const displayedAvatar = previewUrl ?? user.avatarUrl;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Profile &amp; Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              {displayedAvatar ? (
                <Image
                  src={displayedAvatar}
                  alt={`${user.name}'s avatar`}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-2 ring-border">
                  {getInitials(user.name)}
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_AVATAR_TYPES.join(",")}
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload profile image"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera aria-hidden="true" />
              {isUploading ? "Uploading…" : "Change avatar"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              JPEG, PNG, or WebP. Max 2MB.
            </p>

            <div className="w-full border-t pt-4">
              <p className="text-center text-sm font-semibold">{user.name}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.status === "ACTIVE"
                      ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
                noValidate
              >
                <form.Field name="name">
                  {(field) => (
                    <Field
                      label="Full name"
                      htmlFor={field.name}
                      error={
                        field.state.meta.isTouched && !field.state.meta.isValid
                          ? field.state.meta.errors[0]?.message
                          : undefined
                      }
                    >
                      <Input
                        id={field.name}
                        name={field.name}
                        autoComplete="name"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      />
                    </Field>
                  )}
                </form.Field>

                <Field
                  label="Email"
                  htmlFor="email"
                  hint="Email address cannot be changed."
                >
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    readOnly
                  />
                </Field>

                <form.Subscribe
                  selector={(s) =>
                    [s.canSubmit, s.isSubmitting, s.isDirty] as const
                  }
                >
                  {([canSubmit, isSubmitting, isDirty]) => (
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!canSubmit || isSubmitting || !isDirty}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" aria-hidden="true" />
                            Saving…
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  )}
                </form.Subscribe>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={<Mail aria-hidden="true" />}
                label="Email"
                value={user.email}
              />
              <DetailRow
                icon={<Shield aria-hidden="true" />}
                label="Role"
                value={user.role}
              />
              <DetailRow
                icon={<UserIcon aria-hidden="true" />}
                label="Status"
                value={user.status}
              />
              <DetailRow
                icon={<CalendarDays aria-hidden="true" />}
                label="Member since"
                value={new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="[&_svg]:size-3.5">{icon}</span>
        {label}
      </span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}