const features = [
  'AI-powered career guidance',
  'Explore degrees and salaries',
  'Build your skills roadmap',
]

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside
        className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-emerald-900 px-10 py-12 text-white lg:flex xl:px-14"
        aria-hidden="true"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
            CareerMind AI
          </p>
          <h2 className="mt-6 max-w-md text-3xl font-bold leading-tight xl:text-4xl">
            Plan your future with confidence and clarity.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100">
            Join thousands of students exploring careers, degrees, and skills with
            personalized AI guidance.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-emerald-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-800 text-xs">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-12 h-48 w-full max-w-md">
          <div className="absolute inset-0 rounded-3xl border border-emerald-700/60 bg-emerald-800/40" />
          <div className="absolute left-6 top-6 h-16 w-16 rounded-2xl bg-emerald-700/70" />
          <div className="absolute right-8 top-10 h-10 w-10 rounded-full bg-amber-500/80" />
          <div className="absolute bottom-8 left-10 rounded-xl border border-emerald-600/50 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-100">
            <p className="font-semibold">Career Snapshot</p>
            <p className="mt-1 text-emerald-200">Software Engineer · High demand</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col justify-center bg-stone-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-10 xl:px-16">
        <p className="mb-6 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100 lg:hidden">
          Career<span className="text-emerald-800 dark:text-emerald-400">Mind</span> AI
        </p>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
