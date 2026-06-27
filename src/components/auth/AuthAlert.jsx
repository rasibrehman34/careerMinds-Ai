export default function AuthAlert({ type = 'error', message }) {
  if (!message) return null

  const styles = {
    error:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  }

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}
    >
      {message}
    </div>
  )
}
