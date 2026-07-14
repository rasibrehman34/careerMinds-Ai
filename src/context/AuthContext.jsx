import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  getSession,
  onAuthStateChange,
  resetPassword as resetPasswordRequest,
  signIn as signInRequest,
  signInWithGoogle as signInWithGoogleRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
  deleteAccount as deleteAccountRequest,
} from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getSession().then(({ data: { session: activeSession } }) => {
      if (mounted) {
        setSession(activeSession)
        setLoading(false)
      }
    })

    const { data: { subscription } } = onAuthStateChange((_event, activeSession) => {
      if (mounted) {
        setSession(activeSession)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async ({ email, password, fullName }) => {
    return signUpRequest({ email, password, fullName })
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    return signInRequest({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    return signOutRequest()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    return signInWithGoogleRequest()
  }, [])

  const resetPassword = useCallback(async (email) => {
    return resetPasswordRequest(email)
  }, [])

  const deleteAccount = useCallback(async () => {
    return deleteAccountRequest()
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      resetPassword,
      deleteAccount,
    }),
    [session, loading, signUp, signIn, signOut, signInWithGoogle, resetPassword, deleteAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
