import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { 
  IconMilk, 
  IconMoon, 
  IconDroplet, 
  IconClock 
} from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { use } from 'react'

async function getBaby(id: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  console.log('Fetching data for date:', today.toISOString())  // Debug log

  const baby = await prisma.babies.findUnique({
    where: {
      id: BigInt(id)
    },
    include: {
      breast_feed_logs: {
        where: {
          OR: [
            { started_at: { gte: today.toISOString() } },
            { ended_at: { gte: today.toISOString() } },
            { ended_at: null }
          ]
        },
        orderBy: { started_at: 'desc' }
      },
      sleep_logs: {
        where: {
          OR: [
            { started_at: { gte: today.toISOString() } },
            { ended_at: { gte: today.toISOString() } },
            { ended_at: null }
          ]
        },
        orderBy: { started_at: 'desc' }
      },
      diaper_change_logs: {
        where: {
          started_at: { gte: today.toISOString() }
        },
        orderBy: { started_at: 'desc' }
      }
    }
  })

  if (!baby) {
    notFound()
  }

  // Debug log
  console.log('Retrieved data:', {
    breast_feed_logs: baby.breast_feed_logs.length,
    sleep_logs: baby.sleep_logs.length,
    diaper_change_logs: baby.diaper_change_logs.length
  })

  return {
    ...baby,
    id: baby.id.toString(),
    breast_feed_logs: baby.breast_feed_logs.map(log => ({
      ...log,
      id: log.id.toString(),
      baby_id: log.baby_id.toString()
    })),
    sleep_logs: baby.sleep_logs.map(log => ({
      ...log,
      id: log.id.toString(),
      baby_id: log.baby_id.toString()
    })),
    diaper_change_logs: baby.diaper_change_logs.map(log => ({
      ...log,
      id: log.id.toString(),
      baby_id: log.baby_id.toString()
    }))
  }
}

function formatTime(dateStr: string) {
  return format(parseISO(dateStr), 'HH:mm')
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function BabyDashboard({ params }: PageProps) {
  const { id } = use(params)
  const baby = use(getBaby(id))

  // Debug log
  console.log('Rendering data:', {
    name: baby.name,
    activities: {
      feeds: baby.breast_feed_logs.length,
      sleep: baby.sleep_logs.length,
      diapers: baby.diaper_change_logs.length
    }
  })

  return (
    <div className="p-8 bg-gray-950">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-100">{baby.name}</h1>
        <p className="text-gray-400">Today&apos;s Activities</p>
      </header>

      {/* Action Buttons - now always horizontal */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {/* Sleep Action */}
        <div className="bg-gray-900 border border-violet-800 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-800 transition-colors flex-1 min-w-[120px]">
          <div className="bg-violet-900/40 p-3 rounded-full mb-2">
            <IconMoon className="w-6 h-6 text-violet-200" />
          </div>
          <h3 className="font-medium text-violet-100">Sleep</h3>
        </div>

        {/* Breastfeeding Action */}
        <div className="bg-gray-900 border border-pink-900 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-800 transition-colors flex-1 min-w-[120px]">
          <div className="bg-pink-900/40 p-3 rounded-full mb-2">
            <IconMilk className="w-6 h-6 text-pink-300" />
          </div>
          <h3 className="font-medium text-pink-100">Feed</h3>
        </div>

        {/* Diaper Change Action */}
        <div className="bg-gray-900 border border-green-900 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-800 transition-colors flex-1 min-w-[120px]">
          <div className="bg-green-900/40 p-3 rounded-full mb-2">
            <IconDroplet className="w-6 h-6 text-green-300" />
          </div>
          <h3 className="font-medium text-green-100">Diaper</h3>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Debug output */}
        <div className="text-sm text-gray-400">
          Found {baby.breast_feed_logs.length} feeds, {baby.sleep_logs.length} sleep logs, and {baby.diaper_change_logs.length} diaper changes
        </div>

        {/* Active/Recent Feeds */}
        {baby.breast_feed_logs.map(feed => (
          <div 
            key={feed.id}
            className="bg-gray-900 border border-pink-900 rounded-lg p-4 flex items-center"
          >
            <div className="bg-pink-100 dark:bg-pink-900/40 p-3 rounded-full mr-4">
              <IconMilk className="w-6 h-6 text-pink-500 dark:text-pink-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-pink-900 dark:text-pink-100">
                Breastfeeding - {feed.side} side
              </h3>
              <p className="text-sm text-pink-600 dark:text-pink-300">
                Started at {formatTime(feed.started_at)}
                {feed.ended_at ? ` - Ended at ${formatTime(feed.ended_at)}` : ' (Ongoing)'}
              </p>
            </div>
            <IconClock className="w-5 h-5 text-pink-400 dark:text-pink-300" />
          </div>
        ))}

        {/* Sleep Logs */}
        {baby.sleep_logs.map(sleep => (
          <div 
            key={sleep.id}
            className="bg-gray-900 border border-violet-800 rounded-lg p-4 flex items-center"
          >
            <div className="bg-violet-900/40 p-3 rounded-full mr-4">
              <IconMoon className="w-6 h-6 text-violet-200" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-violet-100">Sleep Time</h3>
              <p className="text-sm text-violet-200">
                Started at {formatTime(sleep.started_at)}
                {sleep.ended_at 
                  ? ` - Ended at ${formatTime(sleep.ended_at)}` 
                  : ' (Still sleeping)'
                }
              </p>
            </div>
            <IconClock className="w-5 h-5 text-violet-200" />
          </div>
        ))}

        {/* Diaper Changes */}
        {baby.diaper_change_logs.map(change => (
          <div 
            key={change.id}
            className="bg-gray-900 border border-green-900 rounded-lg p-4 flex items-center"
          >
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mr-4">
              <IconDroplet className="w-6 h-6 text-green-500 dark:text-green-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-900 dark:text-green-100">
                Diaper Change - {change.type}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                At {formatTime(change.started_at)}
              </p>
            </div>
            <IconClock className="w-5 h-5 text-green-400 dark:text-green-300" />
          </div>
        ))}

        {/* No activities message */}
        {baby.breast_feed_logs.length === 0 && 
         baby.sleep_logs.length === 0 && 
         baby.diaper_change_logs.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No activities recorded today
          </div>
        )}

      </div>
    </div>
  )
} 