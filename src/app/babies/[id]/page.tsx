import { notFound } from 'next/navigation'
import { 
  IconMilk, 
  IconMoon, 
  IconDroplet, 
  IconClock 
} from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { getStartOfDay } from '@/utils/date'
import { convertBigIntsToStrings } from '@/utils/prisma'
import ActionBar from './components/ActionBar'
import ActionBarSkeleton from './components/ActionBarSkeleton'
import { createTimeline } from '@/utils/timeline'

async function getBaby(id: string) {
  const today = getStartOfDay()

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

  return convertBigIntsToStrings(baby)
}

function formatTime(dateStr: string) {
  return format(parseISO(dateStr), 'HH:mm')
}

interface PageProps {
  params: { id: string }
}

export default async function BabyDashboard({ params }: PageProps) {
  const baby = await getBaby(params.id)

  const activeSleep = baby.sleep_logs.find(log => !log.ended_at) || null
  const lastSleep = !activeSleep ? baby.sleep_logs[0] || null : null
  const activeFeeding = baby.breast_feed_logs.find(log => !log.ended_at) || null

  const timeline = createTimeline(
    baby.breast_feed_logs,
    baby.sleep_logs,
    baby.diaper_change_logs
  )

  return (
    <div className="p-8 bg-gray-950">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-100">{baby.name}</h1>
        <p className="text-gray-400">Today&apos;s Activities</p>
      </header>

      <Suspense fallback={<ActionBarSkeleton />}>
        <ActionBar 
          babyId={params.id}
          activeSleep={activeSleep}
          lastSleep={lastSleep}
          activeFeeding={activeFeeding}
        />
      </Suspense>

      <div className="grid gap-6">
        {timeline.map(activity => {
          switch (activity.type) {
            case 'feed':
              return (
                <div 
                  key={activity.id}
                  className="bg-gray-900 border border-pink-900 rounded-lg p-4 flex items-center"
                >
                  <div className="bg-pink-900/40 p-3 rounded-full mr-4">
                    <IconMilk className="w-6 h-6 text-pink-200" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-pink-100">
                      Breastfeeding - {activity.details.side} side
                    </h3>
                    <p className="text-sm text-pink-200">
                      Started at {formatTime(activity.started_at)}
                      {activity.ended_at 
                        ? ` - Ended at ${formatTime(activity.ended_at)}` 
                        : ' (Ongoing)'
                      }
                    </p>
                  </div>
                  <IconClock className="w-5 h-5 text-pink-200" />
                </div>
              )

            case 'sleep':
              return (
                <div 
                  key={activity.id}
                  className="bg-gray-900 border border-violet-800 rounded-lg p-4 flex items-center"
                >
                  <div className="bg-violet-900/40 p-3 rounded-full mr-4">
                    <IconMoon className="w-6 h-6 text-violet-200" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-violet-100">Sleep Time</h3>
                    <p className="text-sm text-violet-200">
                      Started at {formatTime(activity.started_at)}
                      {activity.ended_at 
                        ? ` - Ended at ${formatTime(activity.ended_at)}` 
                        : ' (Still sleeping)'
                      }
                    </p>
                  </div>
                  <IconClock className="w-5 h-5 text-violet-200" />
                </div>
              )

            case 'diaper':
              return (
                <div 
                  key={activity.id}
                  className="bg-gray-900 border border-green-900 rounded-lg p-4 flex items-center"
                >
                  <div className="bg-green-900/40 p-3 rounded-full mr-4">
                    <IconDroplet className="w-6 h-6 text-green-200" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-green-100">
                      Diaper Change - {activity.details.diaperType}
                    </h3>
                    <p className="text-sm text-green-200">
                      At {formatTime(activity.started_at)}
                    </p>
                  </div>
                  <IconClock className="w-5 h-5 text-green-200" />
                </div>
              )
          }
        })}

        {timeline.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No activities recorded today
          </div>
        )}
      </div>
    </div>
  )
} 