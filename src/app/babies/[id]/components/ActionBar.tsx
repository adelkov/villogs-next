'use client'
import { useState, useEffect, useTransition } from 'react'
import { 
  IconMilk, 
  IconMoon, 
  IconDroplet 
} from '@tabler/icons-react'
import { getElapsedTime, getElapsedTimeInMinSec } from '@/utils/date'
import { toggleSleep, logDiaper, toggleFeeding } from '../actions'
import BreastSideDialog from './BreastSideDialog'
import DiaperTypeDialog from './DiaperTypeDialog'
import type { FeedLog, SleepLog } from '@/types/prisma'


interface ActionBarProps {
  babyId: string
  babyName: string
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null
  activeFeeding: FeedLog | null
}

function StatusBar({ 
  activeSleep, 
  lastSleep,
  activeFeeding,
  babyName
}: { 
  activeSleep: SleepLog | null
  lastSleep: SleepLog | null
  activeFeeding: FeedLog | null
  babyName: string
}) {
  const [elapsedTime, setElapsedTime] = useState('')
  const [feedingTime, setFeedingTime] = useState('')
  const [awakeTime, setAwakeTime] = useState('')

  useEffect(() => {
    const updateTimes = () => {
      // Update feeding time if active
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

    updateTimes() // Initial update
    
    // Update every second for both feeding and sleep/awake times
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [activeSleep, lastSleep, activeFeeding])

  if (!activeSleep && !lastSleep) return null

  return (
    <div className={`
      mb-4 p-4 rounded-lg
      ${activeSleep 
        ? 'bg-sky-900/20 border border-sky-800' 
        : 'bg-gray-900 border border-gray-800'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`
            w-3 h-3 rounded-full animate-pulse
            ${activeSleep ? 'bg-sky-400' : 'bg-gray-400'}
          `} />
          <span className="font-medium text-lg text-gray-100">
            {activeSleep ? `${babyName} is sleeping` : `${babyName} is awake`}
          </span>
        </div>
        <div className="text-sm text-gray-300 font-mono">
          {activeSleep 
            ? `for ${elapsedTime}`
            : `for ${awakeTime}`
          }
        </div>
      </div>

      {activeFeeding && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
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
  babyName,
  activeSleep, 
  lastSleep,
  activeFeeding
}: ActionBarProps) {
  const [isPending, startTransition] = useTransition()
  const [showSideDialog, setShowSideDialog] = useState(false)
  const [showDiaperDialog, setShowDiaperDialog] = useState(false)
  
  const handleSleepClick = () => {
    startTransition(async () => {
      await toggleSleep(babyId)
    })
  }

  const handleFeedClick = () => {
    if (!activeFeeding) {
      setShowSideDialog(true)
    } else {
      startTransition(async () => {
        await toggleFeeding(babyId)
      })
    }
  }

  const handleSideSelect = (side: 'left' | 'right') => {
    setShowSideDialog(false)
    startTransition(async () => {
      await toggleFeeding(babyId, side)
    })
  }

  const handleDiaperClick = () => {
    setShowDiaperDialog(true)
  }

  const handleDiaperTypeSelect = (type: 'pee' | 'poop' | 'both' | 'empty') => {
    setShowDiaperDialog(false)
    startTransition(async () => {
      await logDiaper(babyId, type)
    })
  }

  // Render different button sets based on baby's state
  const renderActionButtons = () => {
    if (activeSleep) {
      return (
        <div className="grid grid-cols-1 gap-2 mb-4 w-full h-[104px]">
          <button 
            onClick={handleSleepClick}
            disabled={isPending}
            className="flex flex-col items-center justify-center w-full h-full 
              bg-gray-900 border-2 border-cyan-300/50
              rounded-xl p-3 hover:bg-gray-800/80
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-cyan-300/10 p-3 rounded-full">
              <IconMoon className="w-6 h-6 text-cyan-200" />
            </div>
            <h3 className="font-medium text-cyan-200 mt-2">End Sleep</h3>
          </button>
        </div>
      )
    }

    if (activeFeeding) {
      return (
        <div className="grid grid-cols-1 gap-2 mb-4 w-full h-[104px]">
          <button 
            onClick={handleFeedClick}
            disabled={isPending}
            className="flex flex-col items-center justify-center w-full h-full 
              bg-gray-900 border-2 border-rose-300/50
              rounded-xl p-3 hover:bg-gray-800/80
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-rose-300/10 p-3 rounded-full">
              <IconMilk className="w-6 h-6 text-rose-200" />
            </div>
            <h3 className="font-medium text-rose-200 mt-2">End Feed</h3>
          </button>
        </div>
      )
    }

    // When awake and not feeding, show all action buttons
    return (
      <div className="grid grid-cols-3 gap-2 mb-4 w-full h-[104px]">
        <button 
          onClick={handleSleepClick}
          disabled={isPending}
          className="flex flex-col items-center justify-center w-full h-full 
            bg-gray-900 border-2 border-cyan-300/50
            rounded-xl p-3 hover:bg-gray-800/80 transition-all"
        >
          <div className="bg-cyan-300/10 p-3 rounded-full">
            <IconMoon className="w-6 h-6 text-cyan-200" />
          </div>
          <h3 className="font-medium text-cyan-200 mt-2">Sleep</h3>
        </button>

        <button 
          onClick={handleFeedClick}
          disabled={isPending}
          className="flex flex-col items-center justify-center w-full h-full 
            bg-gray-900 border-2 border-rose-300/50
            rounded-xl p-3 hover:bg-gray-800/80 transition-all"
        >
          <div className="bg-rose-300/10 p-3 rounded-full">
            <IconMilk className="w-6 h-6 text-rose-200" />
          </div>
          <h3 className="font-medium text-rose-200 mt-2">Feed</h3>
        </button>

        <button 
          onClick={handleDiaperClick}
          disabled={isPending}
          className="flex flex-col items-center justify-center w-full h-full 
            bg-gray-900 border-2 border-amber-200/50
            rounded-xl p-3 hover:bg-gray-800/80 transition-all"
        >
          <div className="bg-amber-200/10 p-3 rounded-full">
            <IconDroplet className="w-6 h-6 text-amber-200" />
          </div>
          <h3 className="font-medium text-amber-200 mt-2">Diaper</h3>
        </button>
      </div>
    )
  }

  return (
    <div>
      <StatusBar 
        activeSleep={activeSleep} 
        lastSleep={lastSleep}
        activeFeeding={activeFeeding}
        babyName={babyName}
      />
      
      <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
        {renderActionButtons()}
      </div>

      {showSideDialog && (
        <BreastSideDialog
          onSelect={handleSideSelect}
          onCancel={() => setShowSideDialog(false)}
        />
      )}

      {showDiaperDialog && (
        <DiaperTypeDialog
          onSelect={handleDiaperTypeSelect}
          onCancel={() => setShowDiaperDialog(false)}
        />
      )}
    </div>
  )
} 