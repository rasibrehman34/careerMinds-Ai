export default function AuthLoadingScreen({ message = 'Checking session...' }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-800 dark:border-zinc-700 dark:border-t-emerald-500"
        aria-hidden="true"
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  )
}
