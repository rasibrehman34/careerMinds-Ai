import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/chat', label: 'Chat' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Career<span className="text-emerald-800 dark:text-emerald-400">Mind</span> AI
            </p>
            <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              Smart career guidance for students who want clarity, direction, and confidence.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-600 transition-colors hover:text-emerald-800 dark:text-zinc-400 dark:hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          © {year} CareerMind AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
