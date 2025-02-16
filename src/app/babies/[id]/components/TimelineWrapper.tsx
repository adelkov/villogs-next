'use client'
import { useState } from 'react'
import { TimelineActivity } from '@/utils/timeline'
import ActivityTimeline from './ActivityTimeline'
import { deleteLog, editLog } from '../actions'
import { useRouter } from 'next/navigation'
import type { diaper_change_logs_type, breast_feed_logs_side } from '@prisma/client'
import { ActivityType, ActivityUpdate } from './types'

interface Props {
  activities: TimelineActivity[]
}

// Define the edit data types to match ActivityTimeline's expectations
type EditData = {
  feed: {
    startedAt: string
    endedAt: string | null
    side: breast_feed_logs_side
  }
  sleep: {
    startedAt: string
    endedAt: string | null
  }
  diaper: {
    startedAt: string
    type: diaper_change_logs_type
  }
}


export default function TimelineWrapper({ activities }: Props) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleEditActivity = async (
    id: string,
    type: ActivityType,
    updates: Omit<Extract<ActivityUpdate, { type: typeof type }>, 'id' | 'type'>
  ) => {
    if (isProcessing) return
    
    try {
      setIsProcessing(true)
      await editLog(id, type, updates)
      router.refresh()
    } catch (error) {
      console.error('Failed to edit activity:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteActivity = async (id: string, type: keyof EditData) => {
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
    />
  )
} 