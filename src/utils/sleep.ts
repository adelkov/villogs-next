import type { sleep_logs } from '@prisma/client'
import { getDate, isBefore, startOfDay } from 'date-fns'

type SleepLog = Omit<sleep_logs, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

export function calculateDailySleep(sleepLogs: SleepLog[]) {
  const totalMilliseconds = sleepLogs.reduce((acc, log) => {
    const startTime = startOfDay(new Date())
    const start = isBefore(new Date(log.started_at), startTime) ? new Date(startTime) : new Date(log.started_at)

    const end = log.ended_at ? new Date(log.ended_at) : new Date()
    return acc + (end.getTime() - start.getTime())
  }, 0)

  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(totalMilliseconds / 1000)
  
  // Calculate hours and minutes properly
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return {
    totalSeconds,
    formatted: {
      hours,
      minutes
    },
    asString: `${hours}h ${minutes}m`
  }
} 