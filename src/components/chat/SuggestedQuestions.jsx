const defaultQuestions = [
  'Which degree should I choose after FSC?',
  'Is BSCS better than Software Engineering?',
  'What is the salary of AI Engineers?',
  'Tell me the roadmap for Full Stack Development.',
  'Which degree has the highest future scope?',
  'Which programming language should I learn first?',
]

export default function SuggestedQuestions({ questions = defaultQuestions, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm leading-relaxed text-zinc-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
        >
          {question}
        </button>
      ))}
    </div>
  )
}
