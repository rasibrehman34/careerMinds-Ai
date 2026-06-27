export default function AuthCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}
