'use client'
import { parseISO, differenceInSeconds } from 'date-fns'

interface Props {
  startedAt: string
  endedAt: string
  variant: 'pink' | 'sky' | 'amber'
}

export default function DurationChip({ startedAt, endedAt, variant }: Props) {
  const start = parseISO(startedAt)
  const end = parseISO(endedAt)
  
  const totalSeconds = differenceInSeconds(end, start)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  // Format to ensure two digits for minutes and seconds, and include hours if necessary
  const duration = hours > 0 ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const bgColor = {
    pink: 'bg-rose-200/90',
    sky: 'bg-cyan-200/90',
    amber: 'bg-orange-100/90'
  }[variant]

  // Using the dark background color from the app
  const textColor = 'text-gray-950'
  
  return (
    <div className={`inline-flex font-bold font-mono items-center px-2.5 py-1.5 rounded-xl text-xs ${bgColor} ${textColor} backdrop-blur-sm`}>
      {duration}
    </div>
  )
} 