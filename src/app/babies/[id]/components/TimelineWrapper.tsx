'use client'
import { TimelineActivity } from '@/utils/timeline'
import ActivityTimeline from './ActivityTimeline'

interface TimelineWrapperProps {
  activities: TimelineActivity[]
}

export default function TimelineWrapper({ activities }: TimelineWrapperProps) {
  const handleEditActivity = async (id: string, type: string) => {
    // TODO: Implement edit functionality
    console.log('Editing activity:', { id, type })
  }

  const handleDeleteActivity = async (id: string, type: string) => {
    // TODO: Implement delete functionality
    console.log('Deleting activity:', { id, type })
  }

  return (
    <ActivityTimeline 
      activities={activities}
      onEditActivity={handleEditActivity}
      onDeleteActivity={handleDeleteActivity}
    />
  )
} 