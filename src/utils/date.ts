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


export function getStartOfBudapestDayUTC(date = new Date()) {
  // Budapest timezone offset in minutes:
  // - CET (Winter) = UTC+1 → offset = -60 minutes
  // - CEST (Summer) = UTC+2 → offset = -120 minutes
  const budapestOffset = new Date().toLocaleString("en-US", { timeZone: "Europe/Budapest", hour12: false });
  const currentOffset = new Date(budapestOffset).getTimezoneOffset(); // in minutes

  // Get the start of the given day in Budapest time
  const budapestMidnight = new Date(date);
  budapestMidnight.setUTCHours(0, 0, 0, 0); // Set to 00:00:00 UTC

  // Adjust for Budapest's timezone (convert from local to UTC)
  budapestMidnight.setMinutes(budapestMidnight.getMinutes() + currentOffset);

  return budapestMidnight.toISOString();
}


export function getElapsedTimeInMinSec(dateStr: string): string {
  const start = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  
  const minutes = Math.floor(diffInSeconds / 60)
  const seconds = diffInSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
} 