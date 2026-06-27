import { Link } from 'react-router-dom'
import { MessageSquare, History, User, Compass } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    {
      name: 'Start AI Chat',
      description: 'Get career advice and guidance.',
      href: '/chat',
      icon: MessageSquare,
      color: 'bg-indigo-500',
    },
    {
      name: 'View Chat History',
      description: 'Review your previous conversations.',
      href: '/chat-history',
      icon: History,
      color: 'bg-emerald-500',
    },
    {
      name: 'Explore Careers',
      description: 'Discover new career paths.',
      href: '/saved-careers',
      icon: Compass,
      color: 'bg-blue-500',
    },
    {
      name: 'Edit Profile',
      description: 'Update your personal information.',
      href: '/profile',
      icon: User,
      color: 'bg-violet-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          to={action.href}
          className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div>
            <span
              className={`inline-flex rounded-lg p-3 ring-4 ring-white dark:ring-zinc-900 ${action.color} text-white`}
            >
              <action.icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {action.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {action.description}
            </p>
          </div>
          <span
            className="pointer-events-none absolute right-6 top-6 text-zinc-300 group-hover:text-zinc-400 dark:text-zinc-700 dark:group-hover:text-zinc-600 transition-colors"
            aria-hidden="true"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  )
}
