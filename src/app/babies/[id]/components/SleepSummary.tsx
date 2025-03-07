'use client'
import { IconMoon } from '@tabler/icons-react'
import { calculateDailySleep } from '@/utils/sleep'
import type { SleepSummary } from '@/types/sleep'
import type { SleepLog } from '@/types/prisma'

interface Props {
  sleepLogs: SleepLog[]
}

export default function SleepSummary({ sleepLogs }: Props) {
  const dailySleep = calculateDailySleep(sleepLogs)
  const { hours, minutes } = dailySleep.formatted
  

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-cyan-300/10 p-2 rounded-full">
          <IconMoon className="w-5 h-5 text-cyan-200" />
        </div>
        <div>
          <h3 className="text-gray-200 font-medium">Total Sleep Today</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-cyan-200 font-mono">
              {hours}
            </span>
            <span className="text-sm text-cyan-200/70 font-medium">hours</span>
            <span className="text-2xl font-bold text-cyan-200 font-mono ml-2">
              {minutes}
            </span>
            <span className="text-sm text-cyan-200/70 font-medium">minutes</span>
          </div>
        </div>
      </div>
      
    </div>
  )
} 