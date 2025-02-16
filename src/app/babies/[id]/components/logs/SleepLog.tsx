'use client'
import { useState } from 'react'
import { IconMoon, IconClock, IconEdit } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'
import EditSleepDialog from '../dialogs/EditSleepDialog'

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

  const handleSave = (id: string, newStartedAt: string, newEndedAt: string | null) => {
    onEdit(id, newStartedAt, newEndedAt)
    setShowEditDialog(false)
  }

  return (
    <>
      <div className="bg-violet-900/40 border border-violet-800 rounded-lg p-4 flex items-center group">
        <div className="bg-violet-900/40 p-3 rounded-full mr-4">
          <IconMoon className="w-6 h-6 text-violet-200" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-violet-100">Sleep Time</h3>
          <p className="text-sm text-violet-200">
            Started at {formatTime(startedAt)}
            {endedAt 
              ? ` - Ended at ${formatTime(endedAt)}` 
              : ' (Still sleeping)'
            }
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowEditDialog(true)}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <IconEdit className="w-5 h-5
             text-violet-200" />
          </button>
        </div>
        <IconClock className="w-5 h-5 text-violet-200 ml-4" />
      </div>

      {showEditDialog && (
        <EditSleepDialog
          id={id}
          startedAt={startedAt}
          endedAt={endedAt}
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