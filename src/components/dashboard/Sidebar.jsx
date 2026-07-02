import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Bookmark,
  BarChart2,
  BrainCircuit,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation()
  const { signOut } = useAuth()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Chat History', path: '/chat-history', icon: History },
    { name: 'Saved Careers', path: '/saved-careers', icon: Bookmark },
    { name: 'Saved Comparisons', path: '/dashboard/saved-comparisons', icon: BarChart2 },
    { name: 'Skill Gap', path: '/skill-gap', icon: BrainCircuit },
  ]

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col justify-between border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:flex lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } flex`}
      >
        <div>
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                CareerMind AI
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
                    }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50'
                    }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
    </>
  )
}
