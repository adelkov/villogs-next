import type { breast_feed_logs_side, diaper_change_logs_type } from '@prisma/client'

export type ActivityType = 'sleep' | 'feed' | 'diaper'

type BaseActivity = {
  id: string
  startedAt: string
}

export type ActivityUpdate = 
  | ({ type: 'feed' } & BaseActivity & {
      endedAt: string | null
      side: breast_feed_logs_side
    })
  | ({ type: 'sleep' } & BaseActivity & {
      endedAt: string | null
    })
  | ({ type: 'diaper' } & BaseActivity & {
      diaperType: diaper_change_logs_type
    })

export type ActivityUpdateData<T extends ActivityType> = 
  Omit<Extract<ActivityUpdate, { type: T }>, 'id' | 'type'> 