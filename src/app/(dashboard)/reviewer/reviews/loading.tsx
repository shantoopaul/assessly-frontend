export default function ReviewerQueueLoading() {
	return (
	  <div className="space-y-6">
		<span className="sr-only">Loading review queue…</span>
  
		<div className="space-y-3">
		  <div className="h-7 w-56 animate-pulse bg-muted" />
		  <div className="h-4 w-72 animate-pulse bg-muted" />
		</div>
  
		<div className="border bg-card p-6">
		  <div className="h-5 w-48 animate-pulse bg-muted" />
		  <div className="mt-6 space-y-3">
			{Array.from({ length: 5 }, (_, index) => (
			  <div
				key={index}
				className="h-14 w-full animate-pulse bg-muted"
			  />
			))}
		  </div>
		</div>
	  </div>
	);
  }