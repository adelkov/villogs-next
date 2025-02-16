import type { breast_feed_logs, sleep_logs, diaper_change_logs, diaper_change_logs_type } from '@prisma/client'

export type ActivityType = 'feed' | 'sleep' | 'diaper'

export interface TimelineActivity {
  id: string
  type: ActivityType
  started_at: string
  ended_at: string | null
  details: {
    side?: 'left' | 'right'
    diaperType?: diaper_change_logs_type
  }
}

type ConvertedLog<T> = Omit<T, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

export function createTimeline(
  feedLogs: ConvertedLog<breast_feed_logs>[],
  sleepLogs: ConvertedLog<sleep_logs>[],
  diaperLogs: ConvertedLog<diaper_change_logs>[]
): TimelineActivity[] {
  const timeline: TimelineActivity[] = [
    ...feedLogs.map(feed => ({
      id: feed.id,
      type: 'feed' as ActivityType,
      started_at: feed.started_at,
      ended_at: feed.ended_at,
      details: { side: feed.side }
    })),
    ...sleepLogs.map(sleep => ({
      id: sleep.id,
      type: 'sleep' as ActivityType,
      started_at: sleep.started_at,
      ended_at: sleep.ended_at,
      details: {}
    })),
    ...diaperLogs.map(diaper => ({
      id: diaper.id,
      type: 'diaper' as ActivityType,
      started_at: diaper.started_at,
      ended_at: null,
      details: { diaperType: diaper.type }
    }))
  ]

  // Sort by started_at in descending order (most recent first)
  return timeline.sort((a, b) => 
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  )
} 