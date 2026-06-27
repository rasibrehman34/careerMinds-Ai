import { Search } from 'lucide-react'

export default function HistorySearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative flex-1 max-w-lg">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
