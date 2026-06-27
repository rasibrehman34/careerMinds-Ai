import ReactMarkdown from 'react-markdown'
import { Bookmark, BookmarkCheck } from 'lucide-react'

/**
 * ChatMessage component.
 * Renders user messages as plain text.
 * Renders AI messages as formatted markdown.
 * Shows a Save button for roadmap and comparison AI responses.
 */
export default function ChatMessage({
  message,
  onSaveRoadmap,
  onSaveComparison,
  isSaved = false,
}) {
  const isUser = message.role === 'user'
  const showSaveRoadmap = !isUser && message.isRoadmap && onSaveRoadmap
  const showSaveComparison = !isUser && message.isComparison && onSaveComparison
  const showSaveAction = showSaveRoadmap || showSaveComparison

  function handleSave() {
    if (showSaveRoadmap) onSaveRoadmap(message)
    else if (showSaveComparison) onSaveComparison(message)
  }

  const saveLabel = message.isComparison ? 'Comparison' : 'Roadmap'

  return (
    <article
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={isUser ? 'Your message' : 'AI message'}
    >
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] sm:text-base ${
          isUser
            ? 'rounded-br-md bg-emerald-800 text-white dark:bg-emerald-700'
            : 'rounded-bl-md border border-stone-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          /* Overflow-x-auto allows tables to scroll horizontally on mobile */
          <div className="overflow-x-auto">
            <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert
              prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
              prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
              prose-p:my-1 prose-p:leading-relaxed
              prose-ul:my-1 prose-ul:pl-4
              prose-ol:my-1 prose-ol:pl-4
              prose-li:my-0.5
              prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
              prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 dark:prose-code:bg-zinc-800
              prose-table:text-sm
              prose-th:bg-zinc-100 prose-th:px-3 prose-th:py-2 dark:prose-th:bg-zinc-800
              prose-td:px-3 prose-td:py-2
            ">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Save Button — shown for roadmap AND comparison AI responses */}
        {showSaveAction && (
          <div className="mt-3 border-t border-stone-200 pt-3 dark:border-zinc-700">
            <button
              onClick={handleSave}
              disabled={isSaved}
              aria-label={isSaved ? `${saveLabel} already saved` : `Save this ${saveLabel.toLowerCase()}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSaved
                  ? 'cursor-default text-green-600 dark:text-green-400'
                  : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  {saveLabel} Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save {saveLabel}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
