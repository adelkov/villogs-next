import { format, parseISO, startOfDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function formatTime(dateStr: string) {
  return format(parseISO(dateStr), 'HH:mm')
}

export function getElapsedTime(fromTime: string): string {
  const start = new Date(fromTime)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function getStartOfDay(date: Date = new Date()) {
  // Get user's timezone
 const timeZone = 'Europe/Budapest' // Set the correct timezone

  
  // Convert to user's timezone and get start of day
  const zonedDate = toZonedTime(date, timeZone)
  return startOfDay(zonedDate)
}

export function getElapsedTimeInMinSec(dateStr: string): string {
  const start = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  const minutes = Math.floor(diffInSeconds / 60)
  const seconds = diffInSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
} 