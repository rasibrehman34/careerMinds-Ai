export default function ChatHeader({ onNewChat }) {
  return (
    <header className="border-b border-stone-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">
            Career<span className="text-emerald-800 dark:text-emerald-400">Mind</span> AI
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your personal career guidance assistant
          </p>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          New chat
        </button>
      </div>
    </header>
  )
}
