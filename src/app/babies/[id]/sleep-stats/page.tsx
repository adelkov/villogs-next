import { IconMoon } from '@tabler/icons-react'
import { prisma } from '@/lib/prisma'
import SleepCalendar from './components/SleepCalendar'
import { startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns'
import { calculateDailySleep } from '@/utils/sleep'

async function getMonthlySleepLogs(babyId: string) {
  const today = new Date()
  const monthStart = startOfMonth(today)

  const logs = await prisma.sleep_logs.findMany({
    where: {
      baby_id: BigInt(babyId),
      OR: [
        { started_at: { gte: monthStart.toISOString() } },
        { ended_at: { gte: monthStart.toISOString() } }
      ]
    },
    orderBy: { started_at: 'desc' }
  })

  return logs.map(log => ({
    ...log,
    id: log.id.toString(),
    baby_id: log.baby_id.toString()
  }))
}

interface DailySleepData {
  date: Date
  hours: number
  minutes: number
  totalSeconds: number
}

export default async function SleepStatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sleepLogs = await getMonthlySleepLogs(id)
  const currentDate = new Date()
  
  // Calculate sleep data for each day of the month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const dailySleepData: DailySleepData[] = daysInMonth.map(date => {
    const sleepData = calculateDailySleep(sleepLogs, date)
    return {
      date,
      ...sleepData.formatted,
      totalSeconds: sleepData.totalSeconds
    }
  })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-300/10 p-2 rounded-full">
          <IconMoon className="w-6 h-6 text-cyan-200" />
        </div>
        <h1 className="text-xl font-semibold text-gray-100">
          Sleep Statistics
        </h1>
      </div>

      <SleepCalendar 
        dailySleepData={dailySleepData}
        currentDate={currentDate}
      />
    </div>
  )
} 