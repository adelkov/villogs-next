'use client'
import { IconMoon } from '@tabler/icons-react'
import type { sleep_logs } from '@prisma/client'
import { calculateDailySleep } from '@/utils/sleep'

type SleepLog = Omit<sleep_logs, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

interface Props {
  sleepLogs: SleepLog[]
}

export default function SleepSummary({ sleepLogs }: Props) {
  const dailySleep = calculateDailySleep(sleepLogs)
  const { hours, minutes } = dailySleep.formatted
  

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-cyan-300/10 p-2 rounded-full">
          <IconMoon className="w-5 h-5 text-cyan-200" />
        </div>
        <div>
          <h3 className="text-gray-200 font-medium">Total Sleep Today</h3>
          <p className="text-cyan-200 text-2xl font-bold">
            {hours}h {minutes}m
          </p>
        </div>
      </div>
      
    </div>
  )
} 