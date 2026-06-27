export default function ScrollToBottomButton({ visible, onClick }) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to bottom"
      className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-md transition-colors hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      ↓ New messages
    </button>
  )
}
