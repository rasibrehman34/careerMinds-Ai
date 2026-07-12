import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLoadingScreen from '../components/auth/AuthLoadingScreen'
import { DEFAULT_LOGOUT_REDIRECT } from '../utils/protectedRoute'

export default function Signout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function logout() {
      const { error: signOutError } = await signOut()
      if (cancelled) return

      if (signOutError) {
        setError(signOutError.message)
        return
      }

      navigate(DEFAULT_LOGOUT_REDIRECT, { replace: true })
    }

    logout()

    return () => {
      cancelled = true
    }
  }, [signOut, navigate])

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center text-red-700 dark:text-red-300">
        {error}
      </div>
    )
  }

  return <AuthLoadingScreen message="Signing out..." />
}
