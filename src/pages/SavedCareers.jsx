import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import EmptyState from '../components/dashboard/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getSavedRoadmaps, deleteRoadmap } from '../services/roadmapService'

/**
 * SavedCareers page
 * Displays all roadmaps saved by the authenticated user.
 * Reuses DashboardLayout, EmptyState, and the existing Sidebar navigation.
 */
export default function SavedCareers() {
  const { user } = useAuth()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchRoadmaps()
  }, [user])

  async function fetchRoadmaps() {
    setLoading(true)
    const { data, error } = await getSavedRoadmaps(user.id)
    if (error) {
      setError('Failed to load saved roadmaps.')
    } else {
      setRoadmaps(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this roadmap? This cannot be undone.')) return
    setDeletingId(id)
    const { error } = await deleteRoadmap(id)
    if (!error) {
      setRoadmaps(prev => prev.filter(r => r.id !== id))
      if (expandedId === id) setExpandedId(null)
    } else {
      alert('Failed to delete. Please try again.')
    }
    setDeletingId(null)
  }

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Saved Careers
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your saved AI-generated career roadmaps
            </p>
          </div>
          <Link
            to="/chat"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            New Roadmap
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && roadmaps.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="No saved roadmaps yet"
            description="Ask the AI to generate a career roadmap (e.g. 'I want to become a React Developer') and click Save Roadmap to store it here."
            action={
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Start a conversation
              </Link>
            }
          />
        )}

        {/* Roadmap Cards */}
        {!loading && !error && roadmaps.length > 0 && (
          <div className="space-y-4">
            {roadmaps.map(roadmap => (
              <div
                key={roadmap.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <Bookmark className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                        {roadmap.title}
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Saved on {formatDate(roadmap.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(roadmap.id)}
                      disabled={deletingId === roadmap.id}
                      aria-label="Delete roadmap"
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Expand / Collapse */}
                    <button
                      onClick={() => toggleExpand(roadmap.id)}
                      aria-expanded={expandedId === roadmap.id}
                      aria-label={expandedId === roadmap.id ? 'Collapse roadmap' : 'Expand roadmap'}
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    >
                      {expandedId === roadmap.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === roadmap.id && (
                  <div className="border-t border-zinc-200 px-5 py-5 dark:border-zinc-800">
                    <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert
                      prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
                      prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                      prose-p:my-1 prose-p:leading-relaxed
                      prose-ul:my-1 prose-ul:pl-4
                      prose-ol:my-1 prose-ol:pl-4
                      prose-li:my-0.5
                      prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
                    ">
                      <ReactMarkdown>{roadmap.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
