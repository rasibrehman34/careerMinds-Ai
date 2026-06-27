export default function StatsCard({ title, value, description, icon: Icon, trend }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {description && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
            </span>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
