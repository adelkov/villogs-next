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
    <div className="bg-sky-900/20 border border-sky-800/50 rounded-lg p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-sky-900/40 p-2 rounded-full">
            <IconMoon className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <div className="text-sm text-sky-200/80">
              {formatTime(startedAt)}
              {endedAt && ` - ${formatTime(endedAt)}`}
            </div>
            <div className="text-sky-200">
              Sleep
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowEditDialog(true)} 
          className="p-1.5 hover:bg-sky-900/40 rounded"
        >
          <IconEdit className="w-5 h-5 text-sky-200" />
        </button>
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
    </div>
  )
} 