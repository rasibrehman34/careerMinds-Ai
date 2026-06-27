import SectionTitle from './SectionTitle'
import FeatureCard from './FeatureCard'

const features = [
  {
    icon: '🧭',
    title: 'AI Career Guidance',
    description: 'Get clear, personalized answers to career questions based on your goals and interests.',
  },
  {
    icon: '🎓',
    title: 'Degree Explorer',
    description: 'Compare degrees, subjects, and academic paths that match your future ambitions.',
  },
  {
    icon: '💰',
    title: 'Salary Insights',
    description: 'Understand earning potential across roles, industries, and experience levels.',
  },
  {
    icon: '📈',
    title: 'Future Scope',
    description: 'Discover which careers are growing and which skills will stay in demand.',
  },
  {
    icon: '🛠️',
    title: 'Skills Roadmap',
    description: 'Learn what to study, practice, and build to become job-ready step by step.',
  },
  {
    icon: '✨',
    title: 'Personalized Suggestions',
    description: 'Receive recommendations tailored to your background, strengths, and preferences.',
  },
]

export default function Features() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          label="Features"
          title="Everything you need to plan your career"
          description="CareerMind AI helps students explore opportunities with practical, easy-to-understand guidance."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
