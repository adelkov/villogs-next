'use client'
import { IconMilk } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'
import EditFeedingDialog from '../dialogs/EditFeedingDialog'
import DurationChip from '../DurationChip'

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

  const formattedStartTime = format(parseISO(startedAt), 'HH:mm')
  const formattedEndTime = endedAt ? format(parseISO(endedAt), 'HH:mm') : null

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
        <div className="bg-pink-400/10 border border-pink-400/30 rounded-lg p-2 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-pink-400/20 p-2 rounded-full">
                <IconMilk className="w-5 h-5 text-pink-300" />
              </div>
              <div>
                <div className="text-sm text-pink-300/80">
                  {formattedStartTime}
                  {formattedEndTime && ` - ${formattedEndTime}`}
                </div>
                <div className="text-pink-300">
                  Feeding ({side} side)
                </div>
              </div>
            </div>
            {endedAt && (
              <DurationChip 
                startedAt={startedAt} 
                endedAt={endedAt}
                variant="pink"
              />
            )}
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
          onDelete={onDelete}
          onCancel={() => setShowEditDialog(false)}
        />
      )}
    </>
  )
} 