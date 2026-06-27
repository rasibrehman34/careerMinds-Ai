export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-emerald-950/50">
        <span aria-hidden="true">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </article>
  )
}
