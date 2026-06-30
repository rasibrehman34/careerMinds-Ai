import { useAuth } from '../../hooks/useAuth'

// Determine the greeting based on the current hour
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function UserGreeting({ totalConversations = 0, loadingStats = false }) {
  const { user } = useAuth()
  
  // Extract user details
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'
  const firstName = fullName.split(' ')[0]
  const email = user?.email
  const provider = user?.app_metadata?.provider || 'Email'
  
  // Format creation date
  const createdDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently'

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* Left: Greeting */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-zinc-500 dark:text-zinc-400">
            Here's an overview of your career journey.
          </p>
        </div>

        {/* Right: User meta + stats */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:justify-end">
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Email</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{email}</span>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Member since</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{createdDate}</span>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Total Conversations</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {loadingStats ? '—' : totalConversations}
            </span>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Signed in via</span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 capitalize dark:bg-zinc-800 dark:text-zinc-200">
              {provider}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
