export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <span className="sr-only">Loading dashboard...</span>

      <div className="space-y-3">
        <div className="h-4 w-36 animate-pulse bg-muted" />
        <div className="h-9 w-72 max-w-full animate-pulse bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-4 border bg-card p-5">
            <div className="h-8 w-8 animate-pulse bg-muted" />
            <div className="h-5 w-36 animate-pulse bg-muted" />
            <div className="h-4 w-full animate-pulse bg-muted" />
            <div className="h-4 w-3/4 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
