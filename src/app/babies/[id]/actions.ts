'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { withAuth } from '@/lib/auth'
import type { diaper_change_logs_type } from '@prisma/client'

export const toggleSleep = withAuth(async (session, babyId: string) => {
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
})

export const toggleFeeding = withAuth(async (session, babyId: string, side: 'left' | 'right' = 'left') => {
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
})

export const logDiaper = withAuth(async (session, babyId: string, type: 'pee' | 'poop' | 'both' | 'empty') => {
  await prisma.diaper_change_logs.create({
    data: {
      baby_id: BigInt(babyId),
      started_at: new Date().toISOString(),
      type
    }
  })
  
  revalidatePath(`/babies/${babyId}`)
})

type LogType = 'sleep' | 'feed' | 'diaper'

interface EditLogData {
  startedAt?: string
  endedAt?: string | null
  side?: 'left' | 'right'
  type?: diaper_change_logs_type
  diaperType?: diaper_change_logs_type
}

// Handle each table type separately
async function deleteFromTable(type: LogType, id: string) {
  switch (type) {
    case 'sleep':
      return prisma.sleep_logs.delete({
        where: { id: BigInt(id) }
      })
    case 'feed':
      return prisma.breast_feed_logs.delete({
        where: { id: BigInt(id) }
      })
    case 'diaper':
      return prisma.diaper_change_logs.delete({
        where: { id: BigInt(id) }
      })
    default:
      throw new Error('Invalid log type')
  }
}

async function updateTable(type: LogType, id: string, data: EditLogData) {
  switch (type) {
    case 'sleep':
      return prisma.sleep_logs.update({
        where: { id: BigInt(id) },
        data: {
          ...(data.startedAt && { started_at: data.startedAt }),
          ...(data.endedAt !== undefined && { ended_at: data.endedAt })
        }
      })
    case 'feed':
      return prisma.breast_feed_logs.update({
        where: { id: BigInt(id) },
        data: {
          ...(data.startedAt && { started_at: data.startedAt }),
          ...(data.endedAt !== undefined && { ended_at: data.endedAt }),
          ...(data.side && { side: data.side })
        }
      })
    case 'diaper':
      return prisma.diaper_change_logs.update({
        where: { id: BigInt(id) },
        data: {
          ...(data.startedAt && { started_at: data.startedAt }),
          ...(data.type && { type: data.type as diaper_change_logs_type })
        }
      })
    default:
      throw new Error('Invalid log type')
  }
}

export const deleteLog = withAuth(async (session, id: string, type: LogType) => {
  await prisma.$transaction(async () => {
    await deleteFromTable(type, id)
  })

  revalidatePath('/babies/[id]')
})

export const editLog = withAuth(async (session, id: string, type: LogType, data: EditLogData) => {
  console.log('editLog', id, type, data)
  await prisma.$transaction(async () => {

    // of tupe is diaper, we need to rename diaperType to type
    if (type === 'diaper') {
      data.type = data.diaperType
      delete data.diaperType
    }

    await updateTable(type, id, data)
  })

  revalidatePath('/babies/[id]')
}) 