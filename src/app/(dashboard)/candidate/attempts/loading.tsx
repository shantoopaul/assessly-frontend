export default function CandidateAttemptsLoading() {
  return (
    <div className="space-y-6">
      <span className="sr-only">Loading attempts…</span>
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse bg-muted" />
        <div className="h-4 w-72 animate-pulse bg-muted" />
      </div>
      <div className="h-24 w-full animate-pulse bg-muted" aria-hidden="true" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 w-full animate-pulse bg-muted" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}