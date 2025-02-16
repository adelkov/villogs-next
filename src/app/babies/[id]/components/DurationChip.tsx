'use client'
import { parseISO, differenceInMinutes, differenceInSeconds } from 'date-fns'

interface Props {
  startedAt: string
  endedAt: string
  variant: 'pink' | 'sky' | 'amber'
}

export default function DurationChip({ startedAt, endedAt, variant }: Props) {
  const start = parseISO(startedAt)
  const end = parseISO(endedAt)
  
  const minutes = differenceInMinutes(end, start)
  const seconds = differenceInSeconds(end, start) % 60
  
  // Format to ensure two digits for both minutes and seconds
  const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  
  const bgColor = {
    pink: 'bg-rose-200/90',
    sky: 'bg-cyan-200/90',
    amber: 'bg-orange-100/90'
  }[variant]

  // Using the dark background color from the app
  const textColor = 'text-gray-950'
  
  return (
    <div className={`inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs ${bgColor} ${textColor} font-medium backdrop-blur-sm`}>
      {duration}
    </div>
  )
} 