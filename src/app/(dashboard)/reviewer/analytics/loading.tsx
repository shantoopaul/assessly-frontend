export default function ReviewerAnalyticsLoading() {
  return (
    <div className="space-y-6">
      <span className="sr-only">Loading reviewer analytics…</span>

      <div className="space-y-3">
        <div className="h-7 w-56 animate-pulse bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse bg-muted"
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse bg-muted" aria-hidden="true" />
        <div className="h-80 animate-pulse bg-muted" aria-hidden="true" />
      </div>

      <div className="h-48 animate-pulse bg-muted" aria-hidden="true" />
    </div>
  );
}
