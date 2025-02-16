'use client'
import { IconMilk, IconClock, IconEdit, IconTrash } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'
import { useState } from 'react'

interface FeedingLogProps {
  id: string
  side: 'left' | 'right'
  startedAt: string
  endedAt: string | null
  onEdit: () => void
  onDelete: () => void
}

export default function FeedingLog({ 
  side, 
  startedAt, 
  endedAt,
  onEdit,
  onDelete 
}: FeedingLogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <button 
        onClick={() => setShowEditDialog(true)}
        className="w-full text-left"
      >
        <div className="bg-pink-900/40 border border-pink-900 rounded-lg p-4 flex items-center">
          <div className="bg-pink-900/40 p-3 rounded-full mr-4">
            <IconMilk className="w-6 h-6 text-pink-200" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-pink-100">
              Breastfeeding - {side} side
            </h3>
            <p className="text-sm text-pink-200">
              Started at {formatTime(startedAt)}
              {endedAt 
                ? ` - Ended at ${formatTime(endedAt)}` 
                : ' (Ongoing)'
              }
            </p>
          </div>
          <div className="flex items-center">
            <div className="p-1 bg-pink-900/40 rounded-full">
              <IconEdit className="w-5 h-5 text-pink-200" />
            </div>
            <IconClock className="w-5 h-5 text-pink-200 ml-4" />
          </div>
        </div>
      </button>

      {/* ... EditDialog component ... */}
    </>
  )
} 