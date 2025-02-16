'use client'
import { IconMilk, IconClock, IconEdit } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'
import { useState } from 'react'
import EditFeedingDialog from '../dialogs/EditFeedingDialog'

interface FeedingLogProps {
  id: string
  side: 'left' | 'right'
  startedAt: string
  endedAt: string | null
  onEdit: (id: string, startedAt: string, endedAt: string | null, side: 'left' | 'right') => void
  onDelete: (id: string) => void
}

export default function FeedingLog({ 
  id,
  side, 
  startedAt, 
  endedAt,
  onEdit,
  onDelete 
}: FeedingLogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleSave = (id: string, newStartedAt: string, newEndedAt: string | null, newSide: 'left' | 'right') => {
    onEdit(id, newStartedAt, newEndedAt, newSide)
    setShowEditDialog(false)
  }

  return (
    <>
      <button 
        onClick={() => setShowEditDialog(true)}
        className="w-full text-left"
      >
        <div className="bg-pink-400/20 border border-pink-400/50 rounded-lg p-4 flex items-center">
          <div className="bg-pink-400/20 p-3 rounded-full mr-4">
            <IconMilk className="w-6 h-6 text-pink-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-pink-300">
              Feeding - {side} side
            </h3>
            <p className="text-sm text-pink-300/80">
              Started at {formatTime(startedAt)}
              {endedAt 
                ? ` - Ended at ${formatTime(endedAt)}` 
                : ' (Ongoing)'
              }
            </p>
          </div>
          <div className="flex items-center">
            <div className="p-1 bg-pink-400/20 rounded-full">
              <IconEdit className="w-5 h-5 text-pink-300" />
            </div>
            <IconClock className="w-5 h-5 text-pink-300 ml-4" />
          </div>
        </div>
      </button>

      {showEditDialog && (
        <EditFeedingDialog
          id={id}
          startedAt={startedAt}
          endedAt={endedAt}
          side={side}
          onSave={handleSave}
          onDelete={(id) => {
            onDelete(id)
            setShowEditDialog(false)
          }}
          onCancel={() => setShowEditDialog(false)}
        />
      )}
    </>
  )
} 