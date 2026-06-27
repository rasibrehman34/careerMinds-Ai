import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLoadingScreen from '../components/auth/AuthLoadingScreen'
import { DEFAULT_LOGOUT_REDIRECT } from '../utils/protectedRoute'

export default function Signout() {
  const { signOut } = useAuth()
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    signOut().then(({ error: signOutError }) => {
      if (signOutError) {
        setError(signOutError.message)
        return
      }
      setDone(true)
    })
  }, [signOut])

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center text-red-700 dark:text-red-300">
        {error}
      </div>
    )
  }

  if (done) {
    return <Navigate to={DEFAULT_LOGOUT_REDIRECT} replace />
  }

  return <AuthLoadingScreen message="Signing out..." />
}
