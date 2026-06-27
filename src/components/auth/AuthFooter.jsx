import { Link } from 'react-router-dom'

export default function AuthFooter({ text, linkText, linkTo }) {
  return (
    <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
      {text}{' '}
      <Link
        to={linkTo}
        className="font-semibold text-emerald-800 transition-colors hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:text-emerald-400 dark:hover:text-emerald-300 dark:focus:ring-offset-zinc-900"
      >
        {linkText}
      </Link>
    </p>
  )
}
