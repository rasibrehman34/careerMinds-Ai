import PageLayout from '../components/PageLayout'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

const highlights = [
  {
    icon: '🎯',
    title: 'Built for students',
    description: 'CareerMinds AI focuses on clear answers, study help, and a simple user experience.',
  },
  {
    icon: '⚛️',
    title: 'Modern stack',
    description: 'React, Tailwind CSS, and Supabase power a fast and maintainable full-stack app.',
  },
  {
    icon: '🌗',
    title: 'Light & dark themes',
    description: 'Switch themes anytime with one click. Your preference is saved automatically.',
  },
]

export default function About() {
  return (
    <PageLayout>
      <PageHeader
        title="About CareerMinds AI"
        description="We help students learn with an approachable AI chat experience and a clean, theme-aware interface."
      />

      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">
          CareerMinds AI is a learning companion designed to make studying less overwhelming.
          Sign up, start a chat, and get help with concepts, revision, and homework-style questions.
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          This project uses reusable React components and React Context for theme management—no extra state libraries required.
        </p>
      </div>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </section>
    </PageLayout>
  )
}
