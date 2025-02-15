import Link from 'next/link'
import { IconHome, IconMoon, IconBabyCarriage, IconDroplet } from '@tabler/icons-react'

export default function BabyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <nav className="p-6 space-y-8">
          <div className="px-3 py-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Baby Monitor</h2>
          </div>
          
          <div className="space-y-1">
            <Link 
              href={`/babies/${params.id}`}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IconHome className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link 
              href={`/babies/${params.id}/feeds`}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IconBabyCarriage className="w-5 h-5 mr-3" />
              Feeding History
            </Link>
            <Link 
              href={`/babies/${params.id}/sleep`}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IconMoon className="w-5 h-5 mr-3" />
              Sleep Tracking
            </Link>
            <Link 
              href={`/babies/${params.id}/diapers`}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IconDroplet className="w-5 h-5 mr-3" />
              Diaper Changes
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 