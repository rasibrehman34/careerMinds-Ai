import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

export default function ChatMessages({
  messages,
  isTyping = false,
  messagesEndRef,
  containerRef,
  onSaveRoadmap,
  onSaveComparison,
  onSaveProfile,
  onDismissProfile,
  savedRoadmapIds = [],
  savedComparisonIds = [],
}) {
  return (
    <div
      ref={containerRef}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
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
          onSaveProfile={onSaveProfile}
          onDismissProfile={onDismissProfile}
          isSaved={
            savedRoadmapIds.includes(message.id) ||
            savedComparisonIds.includes(message.id)
          }
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}
