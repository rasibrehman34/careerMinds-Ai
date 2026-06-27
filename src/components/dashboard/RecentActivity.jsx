import { useState, useEffect } from 'react'
import { MessageSquare, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from './EmptyState'
import { getChatHistory } from '../../services/chatHistoryService'
import { useAuth } from '../../hooks/useAuth'

export default function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      if (user?.id) {
        setLoading(true)
        // Fetch top 5
        const { data } = await getChatHistory(user.id, 5)
        if (data) {
          // Format data to match activity structure
          const formatted = data.map(chat => ({
            id: chat.id,
            title: chat.title,
            description: chat.first_message ? `started with "${chat.first_message.substring(0, 30)}..."` : 'started a new conversation.',
            date: new Date(chat.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            href: `/chat/${chat.id}`
          }))
          setActivities(formatted)
        }
        setLoading(false)
      }
    }
    fetchRecent()
  }, [user])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6">
          Recent Activity
        </h2>
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="You haven't started any chats yet."
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Recent Activity
        </h2>
        <Link to="/chat-history" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all
        </Link>
      </div>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-white dark:bg-zinc-800 dark:ring-zinc-900">
                      <MessageSquare className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      <Link to={activity.href} className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
                        {activity.title}
                      </Link>{' '}
                      {activity.description}{' '}
                      <span className="whitespace-nowrap text-xs ml-2">{activity.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
