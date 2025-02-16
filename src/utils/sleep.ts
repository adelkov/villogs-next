import type { sleep_logs } from '@prisma/client'

type SleepLog = Omit<sleep_logs, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

export function calculateDailySleep(sleepLogs: SleepLog[]) {
  const totalMilliseconds = sleepLogs.reduce((acc, log) => {
    const start = new Date(log.started_at)
    const end = log.ended_at ? new Date(log.ended_at) : new Date()
    const duration = end.getTime() - start.getTime()
    return acc + duration
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