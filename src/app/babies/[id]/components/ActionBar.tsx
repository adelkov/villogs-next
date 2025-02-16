'use client'
import { useState, useEffect, useTransition } from 'react'
import { 
  IconMilk, 
  IconMoon, 
  IconDroplet 
} from '@tabler/icons-react'
import { getElapsedTime, getElapsedTimeInMinSec } from '@/utils/date'
import { toggleSleep, startFeeding, logDiaper, toggleFeeding } from '../actions'

interface SleepLog {
  id: string
  started_at: string
  ended_at: string | null
}

interface FeedLog {
  id: string
  started_at: string
  ended_at: string | null
  side: 'left' | 'right'
}

interface ActionBarProps {
  babyId: string
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null
  activeFeeding: FeedLog | null
}

function StatusBar({ 
  activeSleep, 
  lastSleep,
  activeFeeding 
}: { 
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null
  activeFeeding: FeedLog | null
}) {
  const [elapsedTime, setElapsedTime] = useState('')
  const [feedingTime, setFeedingTime] = useState('')
  const [awakeTime, setAwakeTime] = useState('')

  useEffect(() => {
    const updateTimes = () => {
      // Update feeding time if active - update every second for feeding
      if (activeFeeding) {
        setFeedingTime(getElapsedTimeInMinSec(activeFeeding.started_at))
      }

      // Update sleep/awake time
      const referenceTime = activeSleep 
        ? activeSleep.started_at 
        : lastSleep?.ended_at

      if (referenceTime) {
        setElapsedTime(getElapsedTime(referenceTime))
      }

      // Calculate total awake time from last sleep
      if (lastSleep?.ended_at) {
        setAwakeTime(getElapsedTime(lastSleep.ended_at))
      }
    }

    updateTimes()
    // Update more frequently (every second) when feeding is active
    const interval = setInterval(updateTimes, activeFeeding ? 1000 : 60000)
    return () => clearInterval(interval)
  }, [activeSleep, lastSleep, activeFeeding])

  if (!activeSleep && !lastSleep) return null

  return (
    <div className={`
      mb-8 p-4 rounded-lg
      ${activeSleep 
        ? 'bg-violet-900/20 border border-violet-800' 
        : 'bg-gray-900 border border-gray-800'
      }
    `}>
      <div className="flex items-center justify-between mb-2">
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
            : `Awake for ${awakeTime}`
          }
        </div>
      </div>

      {activeFeeding && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-pulse bg-pink-400" />
            <span className="font-medium text-gray-100">
              Feeding ({activeFeeding.side} side)
            </span>
          </div>
          <div className="text-sm text-pink-300 font-mono">
            {feedingTime}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ActionBar({ 
  babyId,
  activeSleep, 
  lastSleep,
  activeFeeding
}: ActionBarProps) {
  const [isPending, startTransition] = useTransition()
  
  const handleSleepClick = () => {
    startTransition(async () => {
      await toggleSleep(babyId)
    })
  }

  const handleFeedClick = () => {
    startTransition(async () => {
      await toggleFeeding(babyId)
    })
  }

  const handleDiaperClick = () => {
    startTransition(async () => {
      await logDiaper(babyId)
    })
  }

  return (
    <div>
      <StatusBar 
        activeSleep={activeSleep} 
        lastSleep={lastSleep}
        activeFeeding={activeFeeding}
      />
      
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
          <h3 className="font-medium text-pink-100">
            {activeFeeding ? 'End Feed' : 'Feed'}
          </h3>
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