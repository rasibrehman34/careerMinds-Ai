import DashboardLayout from '../components/dashboard/DashboardLayout'
import SettingsCard from '../components/dashboard/SettingsCard'

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Account Settings
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Manage your app preferences and account security.
          </p>
        </div>

        <SettingsCard />
      </div>
    </DashboardLayout>
  )
}
