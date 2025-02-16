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

export function getTimezoneOffsetFor(date = new Date()) {
  // Format the date to get the equivalent UTC time for the given timezone
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Budapest",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  // Convert formatted local time into a Date object (in local timezone)
  const match = localTime.match(/\d+/g);
  if (!match) throw new Error('Failed to parse date');
  const [month, day, year, hour, minute, second] = match;
  const tzDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

  // Calculate the offset difference in minutes
  return (tzDate.getTime() - date.getTime()) / 60000;
}


export function getStartOfBudapestDayUTC(date = new Date()) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)
  startOfDay.setMilliseconds(0)
  const offset = getTimezoneOffsetFor(startOfDay)
  startOfDay.setMinutes(startOfDay.getMinutes() - offset)
  return startOfDay.toISOString()
}


export function getElapsedTimeInMinSec(dateStr: string): string {
  const start = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  const minutes = Math.floor(diffInSeconds / 60)
  const seconds = diffInSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
} 