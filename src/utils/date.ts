import { format, parseISO } from 'date-fns'

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
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
} 