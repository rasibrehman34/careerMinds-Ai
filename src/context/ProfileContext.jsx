import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getProfile } from '../services/profileService'

const ProfileContext = createContext(null)

/**
 * Provides the user's profile (from the `profiles` table) to the entire app.
 * Components should use useProfile() instead of reading from user_metadata directly,
 * so that updates made in ProfileCard are reflected everywhere immediately and
 * persist correctly after logout/login.
 */
export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null)
      setLoadingProfile(false)
      return
    }

    setLoadingProfile(true)
    const { data } = await getProfile(user.id)

    if (data) {
      setProfile(data)
    } else {
      // Fallback to auth metadata when no profile row exists yet
      const meta = user.user_metadata || {}
      setProfile({
        full_name: meta.full_name || meta.name || user.email?.split('@')[0] || '',
        avatar_url: meta.avatar_url || meta.picture || '',
        bio: '',
      })
    }

    setLoadingProfile(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Derived display values with sensible fallbacks
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
  const firstName = fullName.split(' ')[0]

  const value = useMemo(
    () => ({
      profile,
      fullName,
      avatarUrl,
      firstName,
      loadingProfile,
      /** Call this after a successful profile save to refresh everywhere */
      refreshProfile: fetchProfile,
    }),
    [profile, fullName, avatarUrl, firstName, loadingProfile, fetchProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within a ProfileProvider')
  return context
}
