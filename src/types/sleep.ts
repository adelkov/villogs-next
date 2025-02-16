import { SleepLog } from './prisma'

export interface SleepSummary {
  totalSleep: number
  averageSleepDuration: number
  longestStretch: number
  numberOfNaps: number
}

export type { SleepLog } 