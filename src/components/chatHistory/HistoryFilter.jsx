export default function HistoryFilter({ filter, setFilter }) {
  return (
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="block w-full sm:w-auto rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="alphabetical">Alphabetical (A-Z)</option>
    </select>
  )
}
