import { prisma } from '@/lib/prisma'
import { getStartOfDay } from '@/utils/date'
import { convertBigIntsToStrings } from '@/utils/prisma'
import { createTimeline } from '@/utils/timeline'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ActionBar from './components/ActionBar'
import ActionBarSkeleton from './components/ActionBarSkeleton'
import TimelineWrapper from './components/TimelineWrapper'
import type { Prisma } from '@prisma/client'

// Define the return type of getBaby using Prisma's inferred types
type BabyWithLogs = Prisma.babiesGetPayload<{
  include: {
    breast_feed_logs: true
    sleep_logs: true
    diaper_change_logs: true
  }
}>

// Define the type after BigInt conversion
type BabyWithStringIds = Omit<BabyWithLogs, 'id' | 'breast_feed_logs' | 'sleep_logs' | 'diaper_change_logs'> & {
  id: string
  breast_feed_logs: Array<Omit<BabyWithLogs['breast_feed_logs'][number], 'id' | 'baby_id'> & {
    id: string
    baby_id: string
  }>
  sleep_logs: Array<Omit<BabyWithLogs['sleep_logs'][number], 'id' | 'baby_id'> & {
    id: string
    baby_id: string
  }>
  diaper_change_logs: Array<Omit<BabyWithLogs['diaper_change_logs'][number], 'id' | 'baby_id'> & {
    id: string
    baby_id: string
  }>
}

async function getBaby(id: string): Promise<BabyWithStringIds> {
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

  return convertBigIntsToStrings(baby) as unknown as BabyWithStringIds
}

interface PageProps {
  params: { id: string }
}

export default async function BabyDashboard({ params }: PageProps) {
  const id = await Promise.resolve(params.id)
  const baby = await getBaby(id)
  
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
      <header className="mb-2">
        <h1 className="text-3xl font-bold mb-2 text-gray-100">{baby.name}</h1>
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