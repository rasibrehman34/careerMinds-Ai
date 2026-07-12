import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

export default function ChatMessages({
  messages,
  isTyping = false,
  messagesEndRef,
  containerRef,
  onSaveRoadmap,
  onSaveComparison,
  onSaveResponse,
  onSaveProfile,
  onDismissProfile,
  savedRoadmapIds = [],
  savedComparisonIds = [],
  savedResponseIds = [],
}) {
  return (
    <div
      ref={containerRef}
      className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:space-y-6 sm:px-6"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onSaveRoadmap={onSaveRoadmap}
          onSaveComparison={onSaveComparison}
          onSaveResponse={onSaveResponse}
          onSaveProfile={onSaveProfile}
          onDismissProfile={onDismissProfile}
          isSaved={
            savedRoadmapIds.includes(message.id) ||
            savedComparisonIds.includes(message.id) ||
            savedResponseIds.includes(message.id)
          }
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}
