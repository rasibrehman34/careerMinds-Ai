import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

export default function DashboardLayout({ children, noPadding = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 dark:bg-zinc-950">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto overflow-x-hidden ${noPadding ? 'flex flex-col' : ''}`}>
          <div className={noPadding ? 'flex-1 flex flex-col' : 'mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
