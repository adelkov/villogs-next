'use client'
import { useState, useEffect, useTransition } from 'react'
import { 
  IconMilk, 
  IconMoon, 
  IconDroplet 
} from '@tabler/icons-react'
import { getElapsedTime } from '@/utils/date'
import { toggleSleep, startFeeding, logDiaper } from '../actions'

interface SleepLog {
  id: string
  started_at: string
  ended_at: string | null
}

interface ActionBarProps {
  babyId: string
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null
}

function SleepStatusBar({ activeSleep, lastSleep }: { 
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null 
}) {
  const [elapsedTime, setElapsedTime] = useState('')

  useEffect(() => {
    const updateElapsedTime = () => {
      const referenceTime = activeSleep 
        ? activeSleep.started_at 
        : lastSleep?.ended_at

      if (referenceTime) {
        setElapsedTime(getElapsedTime(referenceTime))
      }
    }

    updateElapsedTime()
    const interval = setInterval(updateElapsedTime, 60000)
    return () => clearInterval(interval)
  }, [activeSleep, lastSleep])

  if (!activeSleep && !lastSleep) return null

  return (
    <div className={`
      mb-8 p-4 rounded-lg flex items-center justify-between
      ${activeSleep 
        ? 'bg-violet-900/20 border border-violet-800' 
        : 'bg-gray-900 border border-gray-800'
      }
    `}>
      <div className="flex items-center gap-3">
        <div className={`
          w-3 h-3 rounded-full animate-pulse
          ${activeSleep ? 'bg-violet-400' : 'bg-gray-400'}
        `} />
        <span className="font-medium text-lg text-gray-100">
          {activeSleep ? 'Baby is sleeping' : 'Baby is awake'}
        </span>
      </div>
      <div className="text-sm text-gray-300">
        {activeSleep 
          ? `Sleeping for ${elapsedTime}`
          : `Awake for ${elapsedTime}`
        }
      </div>
    </div>
  )
}

export default function ActionBar({ 
  babyId,
  activeSleep, 
  lastSleep,
}: ActionBarProps) {
  const [isPending, startTransition] = useTransition()
  
  const handleSleepClick = () => {
    startTransition(async () => {
      await toggleSleep(babyId)
    })
  }

  const handleFeedClick = () => {
    startTransition(async () => {
      await startFeeding(babyId)
    })
  }

  const handleDiaperClick = () => {
    startTransition(async () => {
      await logDiaper(babyId)
    })
  }

  return (
    <div>
      <SleepStatusBar activeSleep={activeSleep} lastSleep={lastSleep} />
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={handleSleepClick}
          disabled={isPending}
          className={`
            bg-gray-900 border border-violet-800 rounded-lg p-4 
            flex flex-col items-center 
            hover:bg-gray-800 transition-colors flex-1 min-w-[120px]
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="bg-violet-900/40 p-3 rounded-full mb-2">
            <IconMoon className="w-6 h-6 text-violet-200" />
          </div>
          <h3 className="font-medium text-violet-100">
            {activeSleep ? 'End Sleep' : 'Sleep'}
          </h3>
        </button>

        <button 
          onClick={handleFeedClick}
          disabled={isPending}
          className={`
            bg-gray-900 border border-pink-900 rounded-lg p-4 
            flex flex-col items-center 
            hover:bg-gray-800 transition-colors flex-1 min-w-[120px]
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="bg-pink-900/40 p-3 rounded-full mb-2">
            <IconMilk className="w-6 h-6 text-pink-300" />
          </div>
          <h3 className="font-medium text-pink-100">Feed</h3>
        </button>

        <button 
          onClick={handleDiaperClick}
          disabled={isPending}
          className={`
            bg-gray-900 border border-green-900 rounded-lg p-4 
            flex flex-col items-center 
            hover:bg-gray-800 transition-colors flex-1 min-w-[120px]
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="bg-green-900/40 p-3 rounded-full mb-2">
            <IconDroplet className="w-6 h-6 text-green-300" />
          </div>
          <h3 className="font-medium text-green-100">Diaper</h3>
        </button>
      </div>
    </div>
  )
} 