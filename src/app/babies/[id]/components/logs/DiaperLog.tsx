'use client'
import { IconDroplet } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useState } from 'react'
import EditDiaperDialog from '../dialogs/EditDiaperDialog'

interface DiaperLogProps {
  id: string
  type: 'pee' | 'poop' | 'both' | 'empty'
  startedAt: string
  onEdit: (id: string, startedAt: string, type: string) => void
  onDelete: (id: string) => void
}

export default function DiaperLog({ id, type, startedAt, onEdit, onDelete }: DiaperLogProps) {
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
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-2 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400/20 p-2 rounded-full">
                <IconDroplet className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="text-sm text-amber-200/80">
                  {format(new Date(startedAt), 'HH:mm')}
                </div>
                <div className="text-amber-200">
                  Diaper ({type})
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {showEditDialog && (
        <EditDiaperDialog
          id={id}
          startedAt={startedAt}
          type={type}
          onSave={handleSave}
          onDelete={onDelete}
          onCancel={() => setShowEditDialog(false)}
        />
      )}
    </>
  )
} 