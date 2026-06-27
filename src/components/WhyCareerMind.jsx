import SectionTitle from './SectionTitle'
import FeatureCard from './FeatureCard'

const reasons = [
  {
    icon: '🎯',
    title: 'Built for students',
    description: 'Designed around real student questions about education, careers, and future planning.',
  },
  {
    icon: '⚡',
    title: 'Fast and simple',
    description: 'No complicated dashboards. Ask a question and get helpful guidance quickly.',
  },
  {
    icon: '🔍',
    title: 'Smarter decisions',
    description: 'Compare options with structured insights instead of guessing your next move.',
  },
  {
    icon: '🌍',
    title: 'Industry-aware',
    description: 'Explore trends, demand, and skills that matter in today’s job market.',
  },
]

export default function WhyCareerMind() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="why-careermind-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          label="Why CareerMind"
          title="Why students choose CareerMind AI"
          description="Make career planning less confusing and more confident with guidance that feels practical, not overwhelming."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {reasons.map((reason) => (
            <FeatureCard key={reason.title} {...reason} />
          ))}
        </div>
      </div>
    </section>
  )
}
