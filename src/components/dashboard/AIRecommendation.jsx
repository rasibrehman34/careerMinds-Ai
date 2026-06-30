import { useState, useEffect } from 'react'
import { Sparkles, Loader } from 'lucide-react'
import { generateDashboardRecommendation } from '../../services/geminiService'

const CACHE_KEY = 'careermind_dashboard_recommendation'
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

/**
 * AIRecommendation widget
 * Fetches a personalized career recommendation from Gemini based on the user's
 * recent conversation titles. Caches the result in sessionStorage to avoid
 * redundant API calls on navigation.
 */
export default function AIRecommendation({ recentTitles = [] }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecommendation() {
      // Check cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
          const { text, timestamp } = JSON.parse(cached)
          const isRecent = (Date.now() - timestamp) < CACHE_DURATION_MS
          if (isRecent && text) {
            setRecommendation(text)
            setLoading(false)
            return
          }
        }
      } catch (_) { /* ignore parse errors */ }

      // Fetch from Gemini
      setLoading(true)
      const result = await generateDashboardRecommendation(recentTitles)
      if (result.success && result.message) {
        setRecommendation(result.message)
        // Cache the result
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ text: result.message, timestamp: Date.now() }))
        } catch (_) { /* ignore storage errors */ }
      } else {
        setError('Could not generate a recommendation at this time.')
      }
      setLoading(false)
    }

    fetchRecommendation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once per mount

  return (
    <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6 shadow-sm dark:border-violet-900/40 dark:from-violet-950/30 dark:to-blue-950/30">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 p-2.5 text-white shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
            AI Career Recommendation
          </p>

          {loading ? (
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Loader className="h-4 w-4 animate-spin text-violet-500" />
              <span>Generating your personalized recommendation…</span>
            </div>
          ) : error ? (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{error}</p>
          ) : (
            <p className="mt-1.5 text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
