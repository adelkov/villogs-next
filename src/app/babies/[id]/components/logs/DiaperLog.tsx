'use client'
import { IconDroplet, IconClock, IconEdit } from '@tabler/icons-react'
import { formatTime } from '@/utils/date'
import { useState } from 'react'
import EditDiaperDialog from '../dialogs/EditDiaperDialog'

interface DiaperLogProps {
  id: string
  type: string
  startedAt: string
  onEdit: (id: string, startedAt: string, type: string) => void
  onDelete: (id: string) => void
}

export default function DiaperLog({ 
  id,
  type, 
  startedAt,
  onEdit,
  onDelete 
}: DiaperLogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleSave = (id: string, newStartedAt: string, newType: string) => {
    onEdit(id, newStartedAt, newType)
    setShowEditDialog(false)
  }

  return (
    <>
      <button 
        onClick={() => setShowEditDialog(true)}
        className="w-full text-left"
      >
        <div className="bg-amber-300/20 border border-amber-300/50 rounded-lg p-4 flex items-center">
          <div className="bg-amber-300/20 p-3 rounded-full mr-4">
            <IconDroplet className="w-6 h-6 text-amber-200" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-amber-200">
              Diaper - {type}
            </h3>
            <p className="text-sm text-amber-200/80">
              At {formatTime(startedAt)}
            </p>
          </div>
          <div className="flex items-center">
            <div className="p-1 bg-amber-300/20 rounded-full">
              <IconEdit className="w-5 h-5 text-amber-200" />
            </div>
            <IconClock className="w-5 h-5 text-amber-200 ml-4" />
          </div>
        </div>
      </button>

      {showEditDialog && (
        <EditDiaperDialog
          id={id}
          startedAt={startedAt}
          type={type}
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