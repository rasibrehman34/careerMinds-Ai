import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../../services/profileService'
import { useAuth } from '../../hooks/useAuth'

export default function ProfileCard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    const { error } = await updateProfile(user.id, formData)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Auto-hide success message after 3 seconds
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
              Profile Picture URL
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="avatar_url"
                id="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            {formData.avatar_url && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Preview:</span>
                <img 
                  src={formData.avatar_url} 
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
