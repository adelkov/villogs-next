'use client'
import { IconMoon } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'
import EditSleepDialog from '../dialogs/EditSleepDialog'
import DurationChip from '../DurationChip'

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
        <div className="bg-gradient-to-br from-cyan-300/95 to-cyan-100/90 backdrop-blur-sm rounded-xl p-2 sm:p-4 hover:from-cyan-300/100 hover:to-cyan-100/95 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-950/10 p-2 rounded-full">
                <IconMoon className="w-5 h-5 text-gray-950" />
              </div>
              <div>
                <div className="text-sm text-gray-950/80">
                  {formattedStartTime}
                  {formattedEndTime && ` - ${formattedEndTime}`}
                </div>
                <div className="text-gray-950 font-medium">
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