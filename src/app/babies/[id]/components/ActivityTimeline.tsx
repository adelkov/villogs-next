'use client'
import { TimelineActivity } from '@/utils/timeline'
import FeedingLog from './logs/FeedingLog'
import SleepLog from './logs/SleepLog'
import DiaperLog from './logs/DiaperLog'

interface ActivityTimelineProps {
  activities: TimelineActivity[]
  onEditActivity: (id: string, type: string) => void
  onDeleteActivity: (id: string, type: string) => void
}

export default function ActivityTimeline({ 
  activities,
  onEditActivity,
  onDeleteActivity
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No activities recorded today
      </div>
    )
  }

  return (
    <div className="grid gap-6">
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
                onEdit={() => onEditActivity(activity.id, 'feed')}
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
                onEdit={() => onEditActivity(activity.id, 'sleep')}
                onDelete={() => onDeleteActivity(activity.id, 'sleep')}
              />
            )

          case 'diaper':
            return (
              <DiaperLog
                key={activity.id}
                id={activity.id}
                type={activity.details.diaperType!}
                startedAt={activity.started_at}
                onEdit={() => onEditActivity(activity.id, 'diaper')}
                onDelete={() => onDeleteActivity(activity.id, 'diaper')}
              />
            )
        }
      })}
    </div>
  )
} 