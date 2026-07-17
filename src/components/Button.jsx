import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600',
  secondary:
    'border border-stone-300 bg-white text-zinc-900 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
  accent:
    'bg-amber-600 text-white hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500',
  ghost:
    'text-zinc-700 hover:bg-stone-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  to,
  ...props
}) {
  const classes = `inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
