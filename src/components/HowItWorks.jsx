import SectionTitle from './SectionTitle'

const steps = [
  {
    number: '01',
    title: 'Ask your question',
    description: 'Share what you want to know about degrees, jobs, salaries, or skills.',
  },
  {
    number: '02',
    title: 'AI analyzes your request',
    description: 'CareerMind AI breaks down your question and finds the most relevant insights.',
  },
  {
    number: '03',
    title: 'Receive personalized career guidance',
    description: 'Get clear recommendations you can use to make confident career decisions.',
  },
]

export default function HowItWorks() {
  return (
    <section
      className="border-y border-stone-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900 sm:py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          label="How it works"
          title="Three simple steps to clarity"
          description="From question to actionable guidance in minutes."
        />

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500">
                Step {step.number}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
