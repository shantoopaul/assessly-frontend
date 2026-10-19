import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewerAssessmentsLoading() {
  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="h-24 w-full animate-pulse bg-muted" />
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 w-full animate-pulse bg-muted" />
      ))}
    </div>
  </div>
  );
}