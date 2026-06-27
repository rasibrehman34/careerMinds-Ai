import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import Button from './Button'
import { useAuth } from '../hooks/useAuth'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? 'text-emerald-800 dark:text-emerald-400'
      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100'
  }`

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/chat', label: 'Chat' },
]

export default function Header() {
  const { user, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Career<span className="text-emerald-800 dark:text-emerald-400">Mind</span> AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="hidden max-w-[140px] truncate text-sm text-zinc-500 dark:text-zinc-400 lg:inline">
                  {user.email}
                </span>
                <Button to="/signout" variant="secondary" size="sm">
                  Sign out
                </Button>
              </div>
            ) : (
              <Button to="/login" variant="primary" size="sm">
                Sign In
              </Button>
            )
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-stone-200 px-4 py-4 dark:border-zinc-800 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {!loading && (
              <li>
                {user ? (
                  <Button to="/signout" variant="secondary" size="sm" className="w-full">
                    Sign out
                  </Button>
                ) : (
                  <Button to="/login" variant="primary" size="sm" className="w-full">
                    Sign In
                  </Button>
                )}
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
