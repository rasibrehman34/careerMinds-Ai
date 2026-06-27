export default function LoadingHistory({ count = 6 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skeletons.map((i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
