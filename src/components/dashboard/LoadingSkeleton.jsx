export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (type === 'card') {
    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="mt-6 space-y-3 animate-pulse">
              <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </>
    )
  }

  if (type === 'stat') {
    return (
      <>
        {skeletons.map((i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-4 h-8 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </>
    )
  }

  if (type === 'profile') {
    return (
      <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3 flex-1">
            <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-24 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    )
  }

  return null
}
