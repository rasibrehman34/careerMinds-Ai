import { useState, useEffect } from 'react'
import { getProfile, updateProfile, uploadAvatar } from '../../services/profileService'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../context/ProfileContext'

export default function ProfileCard() {
  const { user } = useAuth()
  const { refreshProfile } = useProfile()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
  })

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        setLoading(true)
        const { data, error } = await getProfile(user.id)
        
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || '',
            bio: data.bio || '',
          })
          setAvatarPreview(data.avatar_url || '')
        } else {
          const metadata = user.user_metadata || {}
          const fallbackName = metadata.full_name || metadata.name || user.email?.split('@')[0] || ''
          const fallbackAvatar = metadata.avatar_url || metadata.picture || ''

          setFormData({
            full_name: fallbackName,
            avatar_url: fallbackAvatar,
            bio: '',
          })
          setAvatarPreview(fallbackAvatar)
        }

        if (error) {
          console.error('Failed to load profile:', error)
        }
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    let finalAvatarUrl = formData.avatar_url

    if (avatarFile) {
      const { url, error: uploadError } = await uploadAvatar(user.id, avatarFile)
      if (uploadError) {
        setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
        setSaving(false)
        return
      }
      finalAvatarUrl = url
    }

    const updates = {
      ...formData,
      avatar_url: finalAvatarUrl
    }

    const { error } = await updateProfile(user.id, updates)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setAvatarFile(null)
      setFormData((prev) => ({ ...prev, avatar_url: finalAvatarUrl }))
      // Refresh the global profile context so TopNavbar/UserGreeting update instantly
      await refreshProfile()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="h-40 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Personal Information
      </h2>
      
      {message.text && (
        <div className={`mb-6 rounded-md p-4 text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="avatar_url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Profile Picture
            </label>
            <div className="mt-1">
              <input
                type="file"
                name="avatar_file"
                id="avatar_url"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700"
              />
            </div>
            {avatarPreview && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Preview:</span>
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="h-12 w-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>
            <div className="mt-1">
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself and your career goals..."
                className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
