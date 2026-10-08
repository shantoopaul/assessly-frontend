import type { Role } from "@/constants/roles";

export type AuditLogActor = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuditLog = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: AuditLogActor | null;
};

export type AuditLogListResponse = {
  success: true;
  message: string;
  data: AuditLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AuditLogListQuery = {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
};
