'use client'
import { useState } from 'react'
import { TimelineActivity } from '@/utils/timeline'
import ActivityTimeline from './ActivityTimeline'
import { deleteLog, editLog } from '../actions'
import { useRouter } from 'next/navigation'

interface TimelineWrapperProps {
  activities: TimelineActivity[]
}

type EditData = {
  sleep: {
    startedAt: string
    endedAt: string | null
  }
  feed: {
    startedAt: string
    endedAt: string | null
    side: 'left' | 'right'
  }
  diaper: {
    startedAt: string
    type: string
  }
}

export default function TimelineWrapper({ activities }: TimelineWrapperProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleEditActivity = async <T extends keyof EditData>(
    id: string, 
    type: T, 
    updates: Partial<EditData[T]>
  ) => {
    if (isProcessing) return
    
    try {
      setIsProcessing(true)
      await editLog(id, type, updates)
      router.refresh()
    } catch (error) {
      console.error('Failed to edit activity:', error)
      // TODO: Add error toast notification
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteActivity = async (id: string, type: 'sleep' | 'feed' | 'diaper') => {
    if (isProcessing) return
    
    try {
      setIsProcessing(true)
      await deleteLog(id, type)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete activity:', error)
      // TODO: Add error toast notification
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ActivityTimeline 
      activities={activities}
      onEditActivity={handleEditActivity}
      onDeleteActivity={handleDeleteActivity}
      isProcessing={isProcessing}
    />
  )
} 