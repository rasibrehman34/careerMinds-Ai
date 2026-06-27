export default function Card({ title, description, icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-lg dark:bg-indigo-900/40">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </article>
  )
}
