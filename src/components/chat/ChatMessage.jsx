import ReactMarkdown from 'react-markdown'
import { Bookmark, BookmarkCheck } from 'lucide-react'

/**
 * ChatMessage component.
 * Renders user messages as plain text.
 * Renders AI messages as formatted markdown.
 * Shows a Save button for all AI responses (roadmaps, comparisons, and general advice).
 */
export default function ChatMessage({
  message,
  onSaveRoadmap,
  onSaveComparison,
  onSaveResponse,
  onSaveProfile,
  onDismissProfile,
  isSaved = false,
}) {
  const isUser = message.role === 'user'
  const isError = !isUser && message.content?.startsWith('Error:')
  const showSaveRoadmap = !isUser && message.isRoadmap && onSaveRoadmap
  const showSaveComparison = !isUser && message.isComparison && onSaveComparison
  const showSaveResponse = !isUser && !isError && !showSaveRoadmap && !showSaveComparison && onSaveResponse
  const showSaveAction = showSaveRoadmap || showSaveComparison || showSaveResponse

  // Parse Profile Proposal if it exists
  let displayContent = message.content
  let profileProposal = null
  const proposalRegex = /\[PROFILE_PROPOSAL\](.*?)\[\/PROFILE_PROPOSAL\]/s
  
  if (!isUser && displayContent) {
    const match = displayContent.match(proposalRegex)
    if (match && match[1]) {
      try {
        profileProposal = JSON.parse(match[1])
        displayContent = displayContent.replace(proposalRegex, '').trim()
      } catch (e) {
        console.error('Failed to parse profile proposal:', e)
      }
    }
  }

  function handleSave() {
    if (showSaveRoadmap) onSaveRoadmap(message)
    else if (showSaveComparison) onSaveComparison(message)
    else if (showSaveResponse) onSaveResponse(message)
  }

  const saveLabel = message.isComparison ? 'Comparison' : message.isRoadmap ? 'Roadmap' : 'Response'

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
            {displayContent && (
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
                <ReactMarkdown>{displayContent}</ReactMarkdown>
              </div>
            )}
            
            {profileProposal && (
              <div className={`mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 ${displayContent ? 'border-t-0' : ''}`}>
                <p className="mb-3 text-sm font-medium text-blue-900 dark:text-blue-100">
                  {profileProposal.message}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSaveProfile) onSaveProfile(profileProposal, message.id)
                    }}
                    disabled={message.profileProposalHandled}
                    className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                  >
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    Save to Profile
                  </button>
                  <button
                    onClick={() => {
                      if (onDismissProfile) onDismissProfile(message.id)
                    }}
                    disabled={message.profileProposalHandled}
                    className="rounded-md px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            )}
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
