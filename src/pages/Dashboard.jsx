import { MessageSquare, Bookmark, Activity, Users } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import UserGreeting from '../components/dashboard/UserGreeting'
import StatsCard from '../components/dashboard/StatsCard'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivity from '../components/dashboard/RecentActivity'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Chats',
      value: '0',
      description: 'Start a new conversation',
      icon: MessageSquare,
      trend: 'up',
    },
    {
      title: 'Saved Careers',
      value: '0',
      description: 'Explore new paths',
      icon: Bookmark,
      trend: 'up',
    },
    {
      title: 'Account Status',
      value: 'Active',
      description: 'All systems operational',
      icon: Activity,
    },
    {
      title: 'Profile Completion',
      value: '75%',
      description: 'Add a bio to reach 100%',
      icon: Users,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <UserGreeting />
        
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Quick Actions
          </h2>
          <QuickActions />
        </div>

        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
