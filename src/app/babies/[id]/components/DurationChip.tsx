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
    pink: 'bg-pink-400/20',
    sky: 'bg-sky-900/40',
    amber: 'bg-amber-400/20'
  }[variant]

  const textColor = {
    pink: 'text-pink-300',
    sky: 'text-sky-200',
    amber: 'text-amber-200'
  }[variant]
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
      {duration}
    </div>
  )
} 