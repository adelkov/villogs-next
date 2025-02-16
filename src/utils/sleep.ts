import { parseISO, isWithinInterval, startOfDay, endOfDay, min, max } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { sleep_logs } from '@prisma/client'

type SleepLog = Omit<sleep_logs, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

export function calculateDailySleep(sleepLogs: SleepLog[], date: Date = new Date()) {
  // Get user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Convert the input date to the user's timezone and get day boundaries
  const zonedDate = toZonedTime(date, timeZone)
  const dayStart = startOfDay(zonedDate)
  const dayEnd = endOfDay(zonedDate)
  
  let totalSleepSeconds = 0

  sleepLogs.forEach(log => {
    // Convert UTC timestamps to user's timezone
    const sleepStart = toZonedTime(parseISO(log.started_at), timeZone)
    const sleepEnd = log.ended_at ? toZonedTime(parseISO(log.ended_at), timeZone) : new Date()

    // Check if sleep interval overlaps with the day in user's timezone
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