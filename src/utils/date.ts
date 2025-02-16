import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatTime(dateStr: string) {
  return format(parseISO(dateStr), 'HH:mm')
}

export function getElapsedTime(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr))
}

export function getStartOfDay() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function getElapsedTimeInMinSec(dateStr: string): string {
  const start = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  const minutes = Math.floor(diffInSeconds / 60)
  const seconds = diffInSeconds % 60
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
} 