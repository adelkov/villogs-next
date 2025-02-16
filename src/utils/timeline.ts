export type ActivityType = 'feed' | 'sleep' | 'diaper'

export interface TimelineActivity {
  id: string
  type: ActivityType
  started_at: string
  ended_at: string | null
  details: {
    side?: 'left' | 'right'
    diaperType?: string
  }
}

export function createTimeline(
  feeds: any[],
  sleeps: any[],
  diapers: any[]
): TimelineActivity[] {
  const timeline: TimelineActivity[] = [
    ...feeds.map(feed => ({
      id: feed.id,
      type: 'feed' as ActivityType,
      started_at: feed.started_at,
      ended_at: feed.ended_at,
      details: { side: feed.side }
    })),
    ...sleeps.map(sleep => ({
      id: sleep.id,
      type: 'sleep' as ActivityType,
      started_at: sleep.started_at,
      ended_at: sleep.ended_at,
      details: {}
    })),
    ...diapers.map(diaper => ({
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