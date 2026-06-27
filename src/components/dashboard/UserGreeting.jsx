import { useAuth } from '../../hooks/useAuth'

export default function UserGreeting() {
  const { user } = useAuth()
  
  // Extract user details
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Welcome back, {fullName.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Here's an overview of your account and recent activity.
          </p>
        </div>
        
        <div className="flex flex-col gap-1 text-sm md:text-right">
          <div className="flex items-center gap-2 md:justify-end">
            <span className="text-zinc-500 dark:text-zinc-400">Email:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{email}</span>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <span className="text-zinc-500 dark:text-zinc-400">Member since:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{createdDate}</span>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <span className="text-zinc-500 dark:text-zinc-400">Logged in via:</span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 capitalize">
              {provider}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
