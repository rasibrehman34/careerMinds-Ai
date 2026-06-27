import { useState } from 'react'
import ThemeToggle from '../ThemeToggle'
import { Trash2, AlertTriangle } from 'lucide-react'

export default function SettingsCard() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
  })

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Theme</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Toggle between light and dark mode.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Notification Settings (Placeholder) */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email Notifications</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Receive updates about your account activity.</p>
            </div>
            <button
              onClick={() => toggleNotification('email')}
              className={`${
                notifications.email ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900`}
            >
              <span
                className={`${
                  notifications.email ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Marketing Emails</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Receive tips and offers from CareerMind AI.</p>
            </div>
            <button
              onClick={() => toggleNotification('marketing')}
              className={`${
                notifications.marketing ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900`}
            >
              <span
                className={`${
                  notifications.marketing ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-red-700 dark:text-red-300 mb-6">
          Permanently delete your account and all of your data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="flex items-center gap-4 text-red-600 dark:text-red-500 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Delete account
              </h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="inline-flex justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Delete functionality not yet implemented in Supabase placeholder.')
                  setShowDeleteModal(false)
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
