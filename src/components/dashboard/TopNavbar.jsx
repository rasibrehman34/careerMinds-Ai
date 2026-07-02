import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'
import { useAuth } from '../../hooks/useAuth'

export default function TopNavbar({ toggleSidebar }) {
  const { user } = useAuth()

  // Try to get a display name or avatar from metadata
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-4">


        <ThemeToggle />

        <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {fullName}
            </span>
          </div>
          <Link
            to="/profile"
            title="Go to profile"
            className="h-8 w-8 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-transparent transition-all hover:ring-blue-500 dark:bg-zinc-800"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
