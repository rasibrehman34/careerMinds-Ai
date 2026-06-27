import ChatWelcome from './ChatWelcome'
import SuggestedQuestions from './SuggestedQuestions'

export default function EmptyState({ onSelectQuestion }) {
  return (
    <section
      className="flex flex-1 flex-col justify-center gap-8 overflow-y-auto px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Chat welcome"
    >
      <ChatWelcome />
      <SuggestedQuestions onSelect={onSelectQuestion} />
    </section>
  )
}
