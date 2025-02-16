'use client'
import { IconMilk, IconClock, IconEdit, IconTrash } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'
import { useState } from 'react'
import EditFeedingDialog from '../dialogs/EditFeedingDialog'
import { format } from 'date-fns'

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
    <div className="bg-pink-400/10 border border-pink-400/30 rounded-lg p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-pink-400/20 p-2 rounded-full">
            <IconMilk className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <div className="text-sm text-pink-300/80">
              {format(new Date(startedAt), 'HH:mm')}
              {endedAt && ` - ${format(new Date(endedAt), 'HH:mm')}`}
            </div>
            <div className="text-pink-300">
              Feeding ({side} side)
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowEditDialog(true)} 
          className="p-1.5 hover:bg-pink-400/20 rounded"
        >
          <IconEdit className="w-5 h-5 text-pink-300" />
        </button>
      </div>

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
    </div>
  )
} 