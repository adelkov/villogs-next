'use client'
import { formatTime } from '@/utils/date'
import { IconEdit, IconMoon } from '@tabler/icons-react'
import { useState } from 'react'
import EditSleepDialog from '../dialogs/EditSleepDialog'
import DurationChip from '../DurationChip'
import { format, parseISO } from 'date-fns'

interface SleepLogProps {
  id: string
  startedAt: string
  endedAt: string | null
  onEdit: (id: string, startedAt: string, endedAt: string | null) => void
  onDelete: (id: string) => void
}

export default function SleepLog({ 
  id,
  startedAt, 
  endedAt,
  onEdit,
  onDelete 
}: SleepLogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Format dates consistently
  const formattedStartTime = format(parseISO(startedAt), 'HH:mm')
  const formattedEndTime = endedAt ? format(parseISO(endedAt), 'HH:mm') : null

  const handleSave = (id: string, newStartedAt: string, newEndedAt: string | null) => {
    onEdit(id, newStartedAt, newEndedAt)
    setShowEditDialog(false)
  }

  return (
    <>
      <button 
        onClick={() => setShowEditDialog(true)}
        className="w-full text-left"
      >
        <div className="bg-sky-900/20 border border-sky-800/50 rounded-lg p-2 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sky-900/40 p-2 rounded-full">
                <IconMoon className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <div className="text-sm text-sky-200/80">
                  {formattedStartTime}
                  {formattedEndTime && ` - ${formattedEndTime}`}
                </div>
                <div className="text-sky-200">
                  Sleep
                </div>
              </div>
            </div>
            {endedAt && (
              <DurationChip 
                startedAt={startedAt} 
                endedAt={endedAt}
                variant="sky"
              />
            )}
          </div>
        </div>
      </button>

      {showEditDialog && (
        <EditSleepDialog
          id={id}
          startedAt={startedAt}
          endedAt={endedAt}
          onSave={handleSave}
          onDelete={onDelete}
          onCancel={() => setShowEditDialog(false)}
        />
      )}
    </>
  )
} 