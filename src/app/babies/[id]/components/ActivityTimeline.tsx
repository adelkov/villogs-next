'use client'
import { TimelineActivity } from '@/utils/timeline'
import { diaper_change_logs_type } from '@prisma/client'
import DiaperLog from './logs/DiaperLog'
import FeedingLog from './logs/FeedingLog'
import SleepLog from './logs/SleepLog'
import { ActivityType, ActivityUpdateData } from './types'

interface ActivityTimelineProps {
  activities: TimelineActivity[]
  onEditActivity: <T extends ActivityType>(
    id: string,
    type: T,
    updates: ActivityUpdateData<T>
  ) => void
  onDeleteActivity: (id: string, type: ActivityType) => void
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
                onEdit={(id, startedAt, endedAt, side) => 
                  onEditActivity(id, 'feed', { startedAt, endedAt, side })
                }
                onDelete={(id) => onDeleteActivity(id, 'feed')}
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
                onEdit={(id, startedAt, type) => 
                  onEditActivity(id, 'diaper', { startedAt, diaperType: type as diaper_change_logs_type })
                }
                onDelete={(id) => onDeleteActivity(id, 'diaper')}
              />
            )
        }
      })}
    </div>
  )
} 