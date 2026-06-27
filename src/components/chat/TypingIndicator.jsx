export default function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="AI is typing">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-stone-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s] dark:bg-zinc-500" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s] dark:bg-zinc-500" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500" />
      </div>
    </div>
  )
}
