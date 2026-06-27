import SectionTitle from './SectionTitle'
import Accordion from './Accordion'

const faqs = [
  {
    question: 'What is CareerMind AI?',
    answer:
      'CareerMind AI is a career guidance platform that helps students explore degrees, jobs, salaries, skills, and industry trends through an AI-powered chat experience.',
  },
  {
    question: 'Who is CareerMind AI for?',
    answer:
      'It is built for students, graduates, and anyone early in their career journey who wants clearer direction before making important decisions.',
  },
  {
    question: 'Do I need prior career knowledge to use it?',
    answer:
      'No. You can start with basic questions like “Which degree should I choose?” or “What skills do I need for this role?” and build from there.',
  },
  {
    question: 'Is CareerMind AI free to use?',
    answer:
      'You can create a free account to start exploring. Premium features may be added later as the platform grows.',
  },
  {
    question: 'Will my questions be saved?',
    answer:
      'When account features are enabled, your chat history can help provide more personalized guidance over time.',
  },
]

export default function FAQ() {
  return (
    <section
      className="border-t border-stone-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionTitle
          label="FAQ"
          title="Frequently asked questions"
          description="Quick answers to help you get started with CareerMind AI."
        />
        <Accordion items={faqs} />
      </div>
    </section>
  )
}
