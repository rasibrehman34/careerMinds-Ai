import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import EmptyState from '../components/dashboard/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getSavedComparisons, deleteRoadmap } from '../services/roadmapService'

/**
 * SavedComparisons page
 * Displays all degree/career comparisons saved by the authenticated user.
 * Reuses DashboardLayout, EmptyState, and roadmapService (deleteRoadmap works for all types).
 */
export default function SavedComparisons() {
  const { user } = useAuth()
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchComparisons()
  }, [user])

  async function fetchComparisons() {
    setLoading(true)
    const { data, error } = await getSavedComparisons(user.id)
    if (error) {
      setError('Failed to load saved comparisons.')
    } else {
      setComparisons(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this comparison? This cannot be undone.')) return
    setDeletingId(id)
    const { error } = await deleteRoadmap(id)
    if (!error) {
      setComparisons(prev => prev.filter(c => c.id !== id))
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
              Saved Comparisons
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your saved AI-generated degree and career comparisons
            </p>
          </div>
          <Link
            to="/chat"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <MessageSquare className="h-4 w-4" />
            New Comparison
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
        {!loading && !error && comparisons.length === 0 && (
          <EmptyState
            icon={BarChart2}
            title="No saved comparisons yet"
            description="Ask the AI to compare degrees or careers (e.g. 'BSCS vs Software Engineering') and click Save Comparison to store it here."
            action={
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Start a comparison
              </Link>
            }
          />
        )}

        {/* Comparison Cards */}
        {!loading && !error && comparisons.length > 0 && (
          <div className="space-y-4">
            {comparisons.map(comparison => (
              <div
                key={comparison.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                      <BarChart2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                        {comparison.title}
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Saved on {formatDate(comparison.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(comparison.id)}
                      disabled={deletingId === comparison.id}
                      aria-label="Delete comparison"
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Expand / Collapse */}
                    <button
                      onClick={() => toggleExpand(comparison.id)}
                      aria-expanded={expandedId === comparison.id}
                      aria-label={expandedId === comparison.id ? 'Collapse comparison' : 'Expand comparison'}
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    >
                      {expandedId === comparison.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === comparison.id && (
                  <div className="border-t border-zinc-200 px-5 py-5 dark:border-zinc-800">
                    {/* overflow-x-auto makes comparison tables scroll horizontally on mobile */}
                    <div className="overflow-x-auto">
                      <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert
                        prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
                        prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                        prose-p:my-1 prose-p:leading-relaxed
                        prose-ul:my-1 prose-ul:pl-4
                        prose-ol:my-1 prose-ol:pl-4
                        prose-li:my-0.5
                        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
                        prose-table:text-sm
                        prose-th:bg-zinc-100 prose-th:px-3 prose-th:py-2 dark:prose-th:bg-zinc-800
                        prose-td:px-3 prose-td:py-2
                      ">
                        <ReactMarkdown>{comparison.content}</ReactMarkdown>
                      </div>
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
