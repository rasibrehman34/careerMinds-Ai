export default function Divider({ label = 'or' }) {
  return (
    <div className="relative my-6" role="separator" aria-label={label}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-stone-200 dark:border-zinc-700" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          {label}
        </span>
      </div>
    </div>
  )
}
