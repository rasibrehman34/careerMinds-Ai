export default function SectionTitle({ label, title, description, align = 'center' }) {
  const alignment =
    align === 'center'
      ? 'mx-auto text-center'
      : 'text-left'

  return (
    <div className={`mb-10 max-w-2xl sm:mb-12 ${alignment}`}>
      {label && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          {label}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
