import { useState, useEffect } from 'react'
import { BrainCircuit, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getReports } from '../../services/skillGapService'
import { useAuth } from '../../hooks/useAuth'
import EmptyState from './EmptyState'

export default function RecentSkillGapReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      if (user?.id) {
        setLoading(true)
        const { data } = await getReports(user.id, 3)
        if (data) setReports(data)
        setLoading(false)
      }
    }
    fetchReports()
  }, [user])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
        <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Recent Skill Gap Reports
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-50 p-1.5 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            Recent Skill Gap Reports
          </h2>
        </div>
        <Link
          to="/skill-gap"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          New analysis
        </Link>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={BrainCircuit}
          title="No reports yet"
          description="Run your first Skill Gap Analysis to get started."
        />
      ) : (
        <ul className="space-y-2" role="list" aria-label="Recent skill gap reports">
          {reports.map(report => (
            <li key={report.id}>
              <Link
                to="/skill-gap"
                className="group flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition-colors hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
              >
                <div className="flex-shrink-0 rounded-md bg-violet-50 p-1.5 text-violet-500 dark:bg-violet-900/20 dark:text-violet-400">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {report.career}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {new Date(report.created_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
