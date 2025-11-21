export function SkeletonRestaurantHeader() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-48 w-full bg-muted md:h-64" />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="space-y-3">
          <div className="h-8 w-1/3 rounded-lg bg-muted" />
          <div className="h-4 w-2/3 rounded-lg bg-muted" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-1/2 rounded-lg bg-muted" />
            <div className="h-4 w-1/2 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonMenuItems() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 h-32 rounded-lg bg-muted" />
          <div className="mb-2 h-4 w-3/4 rounded-lg bg-muted" />
          <div className="mb-3 space-y-2">
            <div className="h-3 w-full rounded-lg bg-muted" />
            <div className="h-3 w-2/3 rounded-lg bg-muted" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-6 w-16 rounded-lg bg-muted" />
            <div className="h-8 w-20 rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
