import { useState, useEffect } from 'react'
import { getCareerProfile, upsertCareerProfile } from '../../services/careerProfileService'
import { useAuth } from '../../hooks/useAuth'

export default function CareerProfileCard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    education: '',
    degree: '',
    semester: '',
    career_goal: '',
    current_skills: '',
    current_learning: '',
    interests: '',
    preferred_work: '',
  })

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        setLoading(true)
        const { data } = await getCareerProfile(user.id)
        
        if (data) {
          setFormData({
            education: data.education || '',
            degree: data.degree || '',
            semester: data.semester || '',
            career_goal: data.career_goal || '',
            current_skills: data.current_skills?.join(', ') || '',
            current_learning: data.current_learning?.join(', ') || '',
            interests: data.interests?.join(', ') || '',
            preferred_work: data.preferred_work?.join(', ') || '',
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

    // Convert comma separated strings to arrays
    const formattedData = {
      ...formData,
      current_skills: formData.current_skills.split(',').map(s => s.trim()).filter(Boolean),
      current_learning: formData.current_learning.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      preferred_work: formData.preferred_work.split(',').map(s => s.trim()).filter(Boolean),
    }

    const { error } = await upsertCareerProfile(user.id, formattedData)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update career profile.' })
    } else {
      setMessage({ type: 'success', text: 'Career profile updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 mt-8">
        <div className="h-8 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="h-40 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Career Profile
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
          
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Education Level
            </label>
            <input
              type="text"
              name="education"
              id="education"
              placeholder="e.g., Bachelor's, Master's, Bootcamp"
              value={formData.education}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Degree / Major
            </label>
            <input
              type="text"
              name="degree"
              id="degree"
              placeholder="e.g., Computer Science, Software Engineering"
              value={formData.degree}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current Semester / Year
            </label>
            <input
              type="text"
              name="semester"
              id="semester"
              placeholder="e.g., 3rd Semester, Senior Year"
              value={formData.semester}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="career_goal" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Career Goal
            </label>
            <input
              type="text"
              name="career_goal"
              id="career_goal"
              placeholder="e.g., Become an AI Engineer"
              value={formData.career_goal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="current_skills" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current Skills (comma separated)
            </label>
            <input
              type="text"
              name="current_skills"
              id="current_skills"
              placeholder="e.g., HTML, CSS, JavaScript, React"
              value={formData.current_skills}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="current_learning" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Currently Learning (comma separated)
            </label>
            <input
              type="text"
              name="current_learning"
              id="current_learning"
              placeholder="e.g., Node.js, Python, Tailwind"
              value={formData.current_learning}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="interests" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Interests (comma separated)
            </label>
            <input
              type="text"
              name="interests"
              id="interests"
              placeholder="e.g., Artificial Intelligence, UI/UX, Cyber Security"
              value={formData.interests}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="preferred_work" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preferred Work Environment (comma separated)
            </label>
            <input
              type="text"
              name="preferred_work"
              id="preferred_work"
              placeholder="e.g., Remote, Freelance, Startup"
              value={formData.preferred_work}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Career Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
