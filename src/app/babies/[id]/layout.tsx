'use client'
import Link from 'next/link'
import { useState } from 'react'
import { use } from 'react'
import { signOut } from 'next-auth/react'
import { 
  IconHome, 
  IconMenu2,
  IconX,
  IconChartBar,
  IconList,
  IconLogout
} from '@tabler/icons-react'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function BabyLayout({ children, params }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { id } = use(params)

  return (
    <div className="flex h-screen">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed bottom-1 rounded-full right-1 w-12 h-12 bg-gray-900 bg-opacity-60 backdrop-blur-sm border-b border-gray-800 flex items-center justify-center z-20">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-300 hover:text-white"
        >
          {isSidebarOpen ? (
            <IconX className="w-6 h-6" />
          ) : (
            <IconMenu2 className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out z-10
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <nav className="h-full flex flex-col">
          <div className="p-6 mt-4 md:mt-0">
            <div className="px-3 py-2">
              <h2 className="text-lg font-semibold text-gray-100">Baby Monitor</h2>
            </div>
          </div>
          
          {/* Navigation moved to bottom */}
          <div className="mt-auto p-1 space-y-1">
            <Link 
              href={`/babies/${id}`}
              className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IconHome className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link 
              href={`/babies/${id}/sleep-logs`}
              className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IconList className="w-5 h-5 mr-3" />
              Sleep Logs
            </Link>
            <Link 
              href={`/babies/${id}/sleep-stats`}
              className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IconChartBar className="w-5 h-5 mr-3" />
              Sleep Stats
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <IconLogout className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto md:pt-0 pt-2">
        {children}
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
} 