"use client";

import { ScrollText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuditFilterForm } from "@/components/admin/audit-filter-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import type { AuditLogListQuery } from "@/types/audit";

const ACTION_STYLES: Record<string, string> = {
  AUTH_REGISTER:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  AUTH_LOGIN:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  AUTH_GOOGLE_LOGIN:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  AUTH_LOGOUT: "bg-muted text-muted-foreground",
  ASSESSMENT_CREATE:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  ASSESSMENT_PUBLISH:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  ASSESSMENT_UPDATE:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  ASSESSMENT_SOFT_DELETE: "bg-destructive/10 text-destructive",
  QUESTION_CREATE:
    "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  QUESTION_UPDATE:
    "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  QUESTION_SOFT_DELETE: "bg-destructive/10 text-destructive",
  ATTEMPT_ENROLL:
    "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  ATTEMPT_START:
    "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  ATTEMPT_SUBMIT:
    "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
  PAYMENT_INITIATE:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  PAYMENT_CONFIRM:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  CHECKOUT_SESSION_CREATED:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  REVIEW_CLAIM:
    "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  REVIEW_EVALUATE:
    "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
  ADMIN_USER_STATUS_UPDATE: "bg-destructive/10 text-destructive",
  ADMIN_USER_ROLE_UPDATE: "bg-destructive/10 text-destructive",
  ADMIN_USER_SOFT_DELETE: "bg-destructive/10 text-destructive",
  PROFILE_UPDATE: "bg-muted text-muted-foreground",
  PROFILE_AVATAR_UPDATE: "bg-muted text-muted-foreground",
};

const getActionStyle = (action: string): string =>
  ACTION_STYLES[action] ?? "bg-muted text-muted-foreground";

const formatMetadata = (
  metadata: Record<string, unknown> | null,
): string | null => {
  if (!metadata) return null;
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;

  return entries
    .map(([key, value]) => {
      if (value === null || value === undefined) return `${key}: —`;
      if (typeof value === "object") return `${key}: ${JSON.stringify(value)}`;
      return `${key}: ${String(value)}`;
    })
    .join(" · ");
};

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query: AuditLogListQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    action: searchParams.get("action") || undefined,
    entityType: searchParams.get("entityType") || undefined,
  };

  const { data, isLoading, isError } = useAuditLogs(query);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-56 animate-pulse bg-muted" />
          <div className="h-4 w-96 max-w-full animate-pulse bg-muted" />
        </div>
        <div className="h-24 w-full animate-pulse bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load audit logs. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const logs = data.data;
  const meta = data.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Every critical action recorded across the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <AuditFilterForm />
        </CardHeader>

        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ScrollText
                className="mb-4 h-12 w-12 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">No audit logs found</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                No entries match your current filters. Try clearing the action
                or entity filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3 pl-2">Action</th>
                    <th className="pb-3">Entity</th>
                    <th className="pb-3">Actor</th>
                    <th className="pb-3">Details</th>
                    <th className="pb-3 pr-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const metadataText = formatMetadata(log.metadata);

                    return (
                      <tr key={log.id} className="border-b last:border-0">
                        <td className="py-3 pl-2 align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionStyle(log.action)}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 align-top">
                          <p className="font-medium">{log.entityType}</p>
                          <p className="max-w-50 truncate font-mono text-xs text-muted-foreground">
                            {log.entityId ?? "—"}
                          </p>
                        </td>
                        <td className="py-3 align-top">
                          {log.actor ? (
                            <>
                              <p className="font-medium">{log.actor.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.actor.email}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              System
                            </p>
                          )}
                        </td>
                        <td className="max-w-80 py-3 align-top">
                          <p className="truncate text-xs text-muted-foreground">
                            {metadataText ?? "—"}
                          </p>
                        </td>
                        <td className="py-3 pr-2 align-top text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                entries
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => goToPage(meta.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => goToPage(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
