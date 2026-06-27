import { MessageSquarePlus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <MessageSquarePlus className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        No conversations yet.
      </h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        Start a new chat to get career advice, mock interview practice, and personalized guidance.
      </p>
      <Link
        to="/chat"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 transition-colors"
      >
        <MessageSquarePlus className="mr-2 h-5 w-5" />
        Start Your First Career Chat
      </Link>
    </div>
  )
}
