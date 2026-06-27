import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { DEFAULT_LOGIN_REDIRECT } from '../utils/protectedRoute'
import AuthLoadingScreen from './auth/AuthLoadingScreen'

/**
 * Redirects authenticated users away from guest-only pages (login, signup, etc.).
 */
export default function PublicRoute({ children, redirectTo = DEFAULT_LOGIN_REDIRECT }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
