import Button from './Button'

export default function Hero() {
  return (
    <section className="border-b border-stone-200 dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
            AI Career Guidance
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl lg:text-[3.25rem]">
            Your Career Starts With The Right Guidance.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Ask anything about your future. Explore degrees, career paths, salaries,
            required skills and industry trends using AI-powered career guidance.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/signup" size="lg">
              Start Exploring
            </Button>
            <Button to="/chat" variant="secondary" size="lg">
              Open AI Chat
            </Button>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-3xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900" />
          <div className="absolute left-8 top-8 h-24 w-24 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60" />
          <div className="absolute right-10 top-16 h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-950/50" />
          <div className="absolute bottom-20 left-12 h-14 w-14 rounded-xl bg-stone-200 dark:bg-zinc-800" />
          <div className="absolute inset-x-10 bottom-10 rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Career Snapshot
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Software Engineer · Growth +18%
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Skills: React, Problem Solving, Communication
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-zinc-800">
              <div className="h-full w-3/4 rounded-full bg-emerald-800 dark:bg-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
