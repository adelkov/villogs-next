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
import TimelineWrapper from './components/TimelineWrapper'
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
  const id = await Promise.resolve(params.id)
  const baby = await getBaby(id)
  
  const convertedBaby = convertBigIntsToStrings(baby)

  const activeSleep = convertedBaby.sleep_logs.find(log => !log.ended_at) || null
  const lastSleep = !activeSleep ? convertedBaby.sleep_logs[0] || null : null
  const activeFeeding = convertedBaby.breast_feed_logs.find(log => !log.ended_at) || null

  const timeline = createTimeline(
    convertedBaby.breast_feed_logs,
    convertedBaby.sleep_logs,
    convertedBaby.diaper_change_logs
  )

  return (
    <div className="p-8 bg-gray-950">
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-2 text-gray-100">{convertedBaby.name}</h1>
        <p className="text-gray-400">Today&apos;s Activities</p>
      </header>

      <Suspense fallback={<ActionBarSkeleton />}>
        <ActionBar 
          babyId={id}
          activeSleep={activeSleep}
          lastSleep={lastSleep}
          activeFeeding={activeFeeding}
        />
      </Suspense>

      <TimelineWrapper activities={timeline} />
    </div>
  )
} 