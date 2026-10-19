export default function AdminAuditLogsLoading() {
  return (
    <div className="space-y-6">
      <span className="sr-only">Loading audit logs…</span>
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse bg-muted" />
      </div>
      <div className="h-24 w-full animate-pulse bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-16 w-full animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  );
}