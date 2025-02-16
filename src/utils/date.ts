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