import { FeedLog } from './prisma'

export type FeedType = 'BOTTLE' | 'BREAST' | 'SOLID'

export interface FeedSummary {
  totalFeeds: number
  totalAmount: number
  averageAmount: number
  feedsByType: {
    [key in FeedType]: number
  }
}

export type { FeedLog } 