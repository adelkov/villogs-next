import { getElapsedTimeInMinSec } from '@/utils/date'

interface Props {
  startedAt: string
  endedAt: string
  variant: 'pink' | 'sky' | 'amber'
}

export default function DurationChip({ startedAt, endedAt, variant }: Props) {
  const duration = getElapsedTimeInMinSec(startedAt, endedAt)
  
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