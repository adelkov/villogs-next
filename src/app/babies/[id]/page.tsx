import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getStartOfDay } from '@/utils/date'
import { createTimeline } from '@/utils/timeline'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ActionBar from './components/ActionBar'
import ActionBarSkeleton from './components/ActionBarSkeleton'
import TimelineWrapper from './components/TimelineWrapper'
import type { breast_feed_logs, sleep_logs, diaper_change_logs } from '@prisma/client'

type ConvertedLog<T> = Omit<T, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

interface BabyWithLogs {
  id: string
  name: string
  breast_feed_logs: ConvertedLog<breast_feed_logs>[]
  sleep_logs: ConvertedLog<sleep_logs>[]
  diaper_change_logs: ConvertedLog<diaper_change_logs>[]
}

async function getBaby(id: string): Promise<BabyWithLogs> {
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

  return {
    id: baby.id.toString(),
    name: baby.name,
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

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const babyId = (await params).id
  const baby = await getBaby(babyId)
  
  return {
    title: `${baby.name}'s Activities`,
    description: 'Track your baby\'s daily activities'
  }
}

export default async function BabyDashboard({ params }: Props) {
  const babyId = (await params).id
  const baby = await getBaby(babyId)
  
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
          babyId={baby.id}
          activeSleep={activeSleep}
          lastSleep={lastSleep}
          activeFeeding={activeFeeding}
        />
      </Suspense>

      <TimelineWrapper activities={timeline} />
    </div>
  )
} 