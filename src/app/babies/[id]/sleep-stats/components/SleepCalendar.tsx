'use client'
import { useState } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth,
  isToday,
  subMonths,
  addMonths,
  isSameDay,
  getDay
} from 'date-fns'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface DailySleepData {
  date: Date
  hours: number
  minutes: number
  totalSeconds: number
}

interface Props {
  dailySleepData: DailySleepData[]
  currentDate: Date
}

const DAYS_OF_WEEK = [
  { key: 'sun', label: 'S' },
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' }
] as const

function formatDuration(hours: number, minutes: number) {
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

export default function SleepCalendar({ dailySleepData, currentDate }: Props) {
  const [currentDateState, setCurrentDate] = useState(currentDate)
  
  const monthStart = startOfMonth(currentDateState)
  const monthEnd = endOfMonth(currentDateState)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Calculate empty cells needed at start of month
  const startDay = getDay(monthStart)
  const emptyDays = Array(startDay).fill(null)

  const previousMonth = () => setCurrentDate(subMonths(currentDateState, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDateState, 1))

  // Calculate statistics
  const totalSleep = dailySleepData.reduce((acc, day) => acc + day.totalSeconds, 0)
  const totalHours = Math.floor(totalSleep / 3600)
  const totalMinutes = Math.floor((totalSleep % 3600) / 60)
  
  const daysWithSleep = dailySleepData.filter(day => day.totalSeconds > 0)
  const averageSeconds = daysWithSleep.length > 0 
    ? totalSleep / daysWithSleep.length 
    : 0
  const avgHours = Math.floor(averageSeconds / 3600)
  const avgMinutes = Math.floor((averageSeconds % 3600) / 60)

  // Find best and worst days
  const bestDay = [...dailySleepData]
    .sort((a, b) => b.totalSeconds - a.totalSeconds)[0]
  const worstDay = [...daysWithSleep]
    .sort((a, b) => a.totalSeconds - b.totalSeconds)[0]

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-1">
        <button 
          onClick={previousMonth}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <IconChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <h2 className="text-sm font-medium text-gray-100">
          {format(currentDateState, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <IconChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {DAYS_OF_WEEK.map(({ key, label }) => (
            <div key={key} className="text-center text-[10px] text-gray-500 mb-1 font-medium">
              {label}
            </div>
          ))}

          {/* Empty cells */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map(date => {
            const sleepData = dailySleepData.find(data => 
              isSameDay(new Date(data.date), date)
            )
            const { hours = 0, minutes = 0 } = sleepData || {}
            
            const intensity = Math.min((hours + minutes / 60) / 12, 1)
            const hasData = hours + minutes > 0
            
            return (
              <div
                key={date.toISOString()}
                className={`
                  aspect-square relative
                  ${isToday(date) ? 'ring-1 ring-cyan-500/50' : ''}
                  ${!isSameMonth(date, currentDateState) ? 'opacity-50' : ''}
                  rounded-md overflow-hidden
                `}
              >
                {/* Background with intensity */}
                {hasData && (
                  <div 
                    className="absolute inset-0 bg-cyan-400 transition-opacity"
                    style={{ opacity: intensity * 0.15 }}
                  />
                )}
                
                {/* Content */}
                <div className="relative h-full flex flex-col p-1">
                  <div className="text-[10px] text-gray-400 font-medium">
                    {format(date, 'd')}
                  </div>
                  {hasData && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div 
                          className="text-[9px] font-bold text-cyan-200 font-mono"
                        >
                          {hours}:{minutes.toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 