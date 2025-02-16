'use client'
import { IconDroplet, IconClock, IconEdit, IconTrash } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'

interface DiaperLogProps {
  id: string
  type: string
  startedAt: string
  onEdit: () => void
  onDelete: () => void
}

export default function DiaperLog({ 
  type, 
  startedAt,
  onEdit,
  onDelete 
}: DiaperLogProps) {
  return (
    <div className="bg-gray-900 border border-green-900 rounded-lg p-4 flex items-center group">
      <div className="bg-green-900/40 p-3 rounded-full mr-4">
        <IconDroplet className="w-6 h-6 text-green-200" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-green-100">
          Diaper Change - {type}
        </h3>
        <p className="text-sm text-green-200">
          At {formatTime(startedAt)}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-1 hover:bg-gray-800 rounded-full transition-colors"
        >
          <IconEdit className="w-5 h-5 text-green-200" />
        </button>
        <button 
          onClick={onDelete}
          className="p-1 hover:bg-gray-800 rounded-full transition-colors"
        >
          <IconTrash className="w-5 h-5 text-green-200" />
        </button>
      </div>
      <IconClock className="w-5 h-5 text-green-200 ml-4" />
    </div>
  )
} 