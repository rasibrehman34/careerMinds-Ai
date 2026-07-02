import { useState, useEffect } from 'react'
import { MessageSquare, Bookmark, GitCompareArrows, CalendarDays } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import UserGreeting from '../components/dashboard/UserGreeting'
import StatsCard from '../components/dashboard/StatsCard'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivity from '../components/dashboard/RecentActivity'
import CareerGoals from '../components/dashboard/CareerGoals'
import CareerSnapshot from '../components/dashboard/CareerSnapshot'
import AIRecommendation from '../components/dashboard/AIRecommendation'
import RecentSkillGapReports from '../components/dashboard/RecentSkillGapReports'
import { useAuth } from '../hooks/useAuth'
import { getCareerProfile } from '../services/careerProfileService'
import { getChatHistory } from '../services/chatHistoryService'
import { getSavedRoadmaps, getSavedComparisons } from '../services/roadmapService'

export default function Dashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState({
    conversations: 0,
    roadmaps: 0,
    comparisons: 0,
    lastActive: 'No activity yet',
  })
  const [recentTitles, setRecentTitles] = useState([])
  const [careerProfile, setCareerProfile] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    async function fetchDashboardStats() {
      setLoadingStats(true)
      // Fetch all in parallel for performance
      const [convResult, roadmapResult, compResult, profileResult] = await Promise.all([
        getChatHistory(user.id, 100),
        getSavedRoadmaps(user.id),
        getSavedComparisons(user.id),
        getCareerProfile(user.id)
      ])

      const conversations = convResult.data || []
      const roadmaps = roadmapResult.data || []
      const comparisons = compResult.data || []
      setCareerProfile(profileResult.data || null)

      // Determine last active date from most recent conversation
      let lastActive = 'No activity yet'
      if (conversations.length > 0) {
        const mostRecent = conversations.reduce((a, b) =>
          new Date(b.updated_at) > new Date(a.updated_at) ? b : a
        )
        lastActive = new Date(mostRecent.updated_at).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      }

      setStats({
        conversations: conversations.length,
        roadmaps: roadmaps.length,
        comparisons: comparisons.length,
        lastActive,
      })

      // Pass recent titles to AI Recommendation widget
      setRecentTitles(conversations.slice(0, 5).map(c => c.title))
      setLoadingStats(false)
    }

    fetchDashboardStats()
  }, [user])

  const statsCards = [
    {
      title: 'Total Conversations',
      value: loadingStats ? '—' : String(stats.conversations),
      description: stats.conversations === 0 ? 'Start your first chat' : 'AI sessions completed',
      icon: MessageSquare,
      trend: 'up',
    },
    {
      title: 'Saved Roadmaps',
      value: loadingStats ? '—' : String(stats.roadmaps),
      description: stats.roadmaps === 0 ? 'Save your first roadmap' : 'Career paths saved',
      icon: Bookmark,
      trend: 'up',
    },
    {
      title: 'Saved Comparisons',
      value: loadingStats ? '—' : String(stats.comparisons),
      description: stats.comparisons === 0 ? 'Compare degrees to get started' : 'Degree comparisons saved',
      icon: GitCompareArrows,
      trend: 'up',
    },
    {
      title: 'Last Active',
      value: loadingStats ? '—' : (stats.conversations > 0 ? stats.lastActive.split(' ').slice(0, 2).join(' ') : 'N/A'),
      description: loadingStats ? 'Loading...' : stats.lastActive,
      icon: CalendarDays,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Welcome Card */}
        <UserGreeting totalConversations={stats.conversations} loadingStats={loadingStats} />

        {/* AI Recommendation */}
        {!loadingStats && (
          <AIRecommendation recentTitles={recentTitles} />
        )}

        {/* Career Activity Stats */}
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Career Activity
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Quick Actions
          </h2>
          <QuickActions />
        </div>

        {/* Snapshot & Goals */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CareerSnapshot profile={careerProfile} loading={loadingStats} />
          <CareerGoals />
        </div>

        {/* Recent Conversations */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <RecentActivity />
          <RecentSkillGapReports />
        </div>

      </div>
    </DashboardLayout>
  )
}
