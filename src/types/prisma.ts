import { Prisma } from '@prisma/client'

// Base converted type for all logs (handles ID conversions)
export type ConvertedLog<T> = Omit<T, 'id' | 'baby_id'> & {
  id: string
  baby_id: string
}

// Feed Types
export type FeedLogRaw = Prisma.breast_feed_logsGetPayload<Record<string, never>>
export type FeedLog = ConvertedLog<FeedLogRaw>

// Sleep Types
export type SleepLogRaw = Prisma.sleep_logsGetPayload<Record<string, never>>
export type SleepLog = ConvertedLog<SleepLogRaw>

// Diaper Types
export type DiaperLogRaw = Prisma.diaper_change_logsGetPayload<Record<string, never>>
export type DiaperLog = ConvertedLog<DiaperLogRaw>

// Baby Types
export type BabyRaw = Prisma.babiesGetPayload<Record<string, never>>
export type Baby = Omit<BabyRaw, 'id'> & { id: string }

export interface BabyWithLogs {
  id: string
  name: string
  breast_feed_logs: FeedLog[]
  sleep_logs: SleepLog[]
  diaper_change_logs: DiaperLog[]
}

// User Types
export type User = Prisma.usersGetPayload<Record<string, never>>
export type UserWithBabies = Prisma.usersGetPayload<{
  include: Prisma.usersInclude
}> 