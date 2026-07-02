import { Link } from 'react-router-dom'
import { Target, Lightbulb, Code2, Briefcase, ChevronRight } from 'lucide-react'
import { calculateProfileCompletion } from '../../services/careerProfileService'

export default function CareerSnapshot({ profile, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
        <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800 mb-4"></div>
        <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800 mb-4"></div>
        <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    )
  }

  const completionPercent = calculateProfileCompletion(profile)
  const isComplete = completionPercent === 100

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Career Profile Snapshot
        </h2>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
          isComplete 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {completionPercent}% Complete
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {/* Career Goal */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Goal</p>
            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
              {profile?.career_goal || 'Not set'}
            </p>
          </div>
        </div>

        {/* Top Skills */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
            <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Top Skills</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {profile?.current_skills?.length > 0 ? (
                profile.current_skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-900 dark:text-zinc-100">Not set</p>
              )}
              {profile?.current_skills?.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  +{profile.current_skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Currently Learning */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Learning</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {profile?.current_learning?.length > 0 ? (
                profile.current_learning.slice(0, 3).map((item, i) => (
                  <span key={i} className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-900 dark:text-zinc-100">Not set</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Link 
          to="/profile" 
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isComplete ? 'Update Profile' : 'Complete Your Profile'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
