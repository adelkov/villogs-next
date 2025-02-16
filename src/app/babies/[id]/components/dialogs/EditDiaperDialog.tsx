'use client'
import { useState } from 'react'
import { IconDroplet, IconTrash } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'

interface EditDiaperDialogProps {
  id: string
  startedAt: string
  type: string
  onSave: (id: string, startedAt: string, type: string) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

export default function EditDiaperDialog({ 
  id,
  startedAt,
  type: currentType,
  onSave,
  onDelete,
  onCancel 
}: EditDiaperDialogProps) {
  const [newStartedAt, setNewStartedAt] = useState(format(parseISO(startedAt), "yyyy-MM-dd'T'HH:mm"))
  const [newType, setNewType] = useState(currentType)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    const formattedStartedAt = new Date(newStartedAt).toISOString()
    onSave(id, formattedStartedAt, newType)
  }

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Confirm Delete</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this diaper change log? This action cannot be undone.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => onDelete(id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-300/20 p-2 rounded-full">
            <IconDroplet className="w-5 h-5 text-amber-200" />
          </div>
          <h2 className="text-lg font-medium text-gray-100">Edit Diaper Change</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <input
              type="datetime-local"
              id="time"
              value={newStartedAt}
              onChange={(e) => setNewStartedAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['pee', 'poop', 'both', 'empty'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNewType(type)}
                  className={`
                    p-2 rounded-lg border transition-colors
                    ${newType === type 
                      ? 'bg-amber-300/20 border-amber-300/50 text-amber-200' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-red-400 py-2 rounded-lg transition-colors"
        >
          <IconTrash className="w-4 h-4" />
          <span>Delete Log</span>
        </button>
      </div>
    </div>
  )
} 