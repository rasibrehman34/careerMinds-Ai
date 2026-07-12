import { useRef } from 'react'

export default function ChatInput({ value, onChange, onSend }) {
  const textareaRef = useRef(null)
  const hasText = value.trim().length > 0

  function handleSubmit(event) {
    event.preventDefault()
    if (!hasText) return
    onSend()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (hasText) onSend()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-stone-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        <label htmlFor="chat-input" className="sr-only">
          Ask your career question
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your career question..."
          className="w-full resize-none rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-600 dark:focus:ring-emerald-950 sm:text-base"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!hasText}
            className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  )
}
