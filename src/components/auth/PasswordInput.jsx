import { useState } from 'react'
import AuthInput from './AuthInput'

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false)

  return (
    <AuthInput
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={props.autoComplete || 'current-password'}
      rightAction={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  )
}
