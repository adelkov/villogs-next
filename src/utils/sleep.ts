import { parseISO, isWithinInterval, startOfDay, endOfDay, min, max } from 'date-fns'
import type { sleep_logs } from '@prisma/client'

type SleepLog = Omit<sleep_logs, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

export function calculateDailySleep(sleepLogs: SleepLog[], date: Date = new Date()) {
  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)
  
  let totalSleepSeconds = 0

  sleepLogs.forEach(log => {
    const sleepStart = parseISO(log.started_at)
    // If sleep hasn't ended yet, use current time
    const sleepEnd = log.ended_at ? parseISO(log.ended_at) : new Date()

    // Check if sleep interval overlaps with the day
    if (isWithinInterval(sleepStart, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(sleepEnd, { start: dayStart, end: dayEnd }) ||
        (sleepStart <= dayStart && sleepEnd >= dayEnd)) {
      
      // Calculate the overlap duration
      const overlapStart = max([sleepStart, dayStart])
      const overlapEnd = min([sleepEnd, dayEnd])
      
      const durationSeconds = (overlapEnd.getTime() - overlapStart.getTime()) / 1000
      totalSleepSeconds += durationSeconds
    }
  })

  // Convert to hours, minutes
  const hours = Math.floor(totalSleepSeconds / 3600)
  const minutes = Math.floor((totalSleepSeconds % 3600) / 60)

  return {
    totalSeconds: totalSleepSeconds,
    formatted: {
      hours,
      minutes
    },
    asString: `${hours}h ${minutes}m`
  }
} 