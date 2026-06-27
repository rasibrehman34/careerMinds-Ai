import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLoadingScreen from './auth/AuthLoadingScreen'

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
