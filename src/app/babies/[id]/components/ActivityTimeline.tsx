'use client'
import { TimelineActivity } from '@/utils/timeline'
import FeedingLog from './logs/FeedingLog'
import SleepLog from './logs/SleepLog'
import DiaperLog from './logs/DiaperLog'

interface ActivityTimelineProps {
  activities: TimelineActivity[]
  onEditActivity: <T extends 'sleep' | 'feed' | 'diaper'>(
    id: string, 
    type: T, 
    updates: any
  ) => void
  onDeleteActivity: (id: string, type: 'sleep' | 'feed' | 'diaper') => void
  isProcessing: boolean
}

export default function ActivityTimeline({ 
  activities,
  onEditActivity,
  onDeleteActivity,
  isProcessing
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No activities recorded today
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {activities.map(activity => {
        switch (activity.type) {
          case 'feed':
            return (
              <FeedingLog
                key={activity.id}
                id={activity.id}
                side={activity.details.side!}
                startedAt={activity.started_at}
                endedAt={activity.ended_at}
                onEdit={() => onEditActivity(activity.id, 'feed', {})}
                onDelete={() => onDeleteActivity(activity.id, 'feed')}
              />
            )

          case 'sleep':
            return (
              <SleepLog
                key={activity.id}
                id={activity.id}
                startedAt={activity.started_at}
                endedAt={activity.ended_at}
                onEdit={(id, startedAt, endedAt) => 
                  onEditActivity(id, 'sleep', { startedAt, endedAt })
                }
                onDelete={(id) => onDeleteActivity(id, 'sleep')}
              />
            )

          case 'diaper':
            return (
              <DiaperLog
                key={activity.id}
                id={activity.id}
                type={activity.details.diaperType!}
                startedAt={activity.started_at}
                onEdit={() => onEditActivity(activity.id, 'diaper', {})}
                onDelete={() => onDeleteActivity(activity.id, 'diaper')}
              />
            )
        }
      })}
    </div>
  )
} 