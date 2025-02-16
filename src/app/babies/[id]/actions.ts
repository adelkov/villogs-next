'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleSleep(babyId: string) {
  const ongoingSleep = await prisma.sleep_logs.findFirst({
    where: {
      baby_id: BigInt(babyId),
      ended_at: null
    }
  })

  if (ongoingSleep) {
    // End sleep
    await prisma.sleep_logs.update({
      where: { id: ongoingSleep.id },
      data: { ended_at: new Date().toISOString() }
    })
  } else {
    // Start new sleep
    await prisma.sleep_logs.create({
      data: {
        baby_id: BigInt(babyId),
        started_at: new Date().toISOString(),
      }
    })
  }

  revalidatePath(`/babies/${babyId}`)
}

export async function toggleFeeding(babyId: string, side: 'left' | 'right' = 'left') {
  const ongoingFeed = await prisma.breast_feed_logs.findFirst({
    where: {
      baby_id: BigInt(babyId),
      ended_at: null
    }
  })

  if (ongoingFeed) {
    // End feeding
    await prisma.breast_feed_logs.update({
      where: { id: ongoingFeed.id },
      data: { ended_at: new Date().toISOString() }
    })
  } else {
    // Start new feeding
    await prisma.breast_feed_logs.create({
      data: {
        baby_id: BigInt(babyId),
        started_at: new Date().toISOString(),
        side: side
      }
    })
  }

  revalidatePath(`/babies/${babyId}`)
}

export async function logDiaper(babyId: string, type: 'pee' | 'poop' | 'both' | 'empty') {
  await prisma.diaper_change_logs.create({
    data: {
      baby_id: BigInt(babyId),
      started_at: new Date().toISOString(),
      type
    }
  })
  
  revalidatePath(`/babies/${babyId}`)
}

type LogType = 'sleep' | 'feed' | 'diaper'

interface EditLogData {
  startedAt?: string
  endedAt?: string | null
  side?: 'left' | 'right'
  type?: string
}

export async function deleteLog(id: string, type: LogType) {
  const table = {
    sleep: 'sleep_logs',
    feed: 'breast_feed_logs',
    diaper: 'diaper_change_logs'
  }[type]

  await prisma[table].delete({
    where: { id: BigInt(id) }
  })

  revalidatePath('/babies/[id]')
}

export async function editLog(id: string, type: LogType, data: EditLogData) {
  const table = {
    sleep: 'sleep_logs',
    feed: 'breast_feed_logs',
    diaper: 'diaper_change_logs'
  }[type]

  await prisma[table].update({
    where: { id: BigInt(id) },
    data: {
      ...(data.startedAt && { started_at: data.startedAt }),
      ...(data.endedAt !== undefined && { ended_at: data.endedAt }),
      ...(data.side && { side: data.side }),
      ...(data.type && { type: data.type })
    }
  })

  revalidatePath('/babies/[id]')
} 