'use client'
import { useState } from 'react'
import { IconMoon, IconTrash } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'

interface EditSleepDialogProps {
  id: string
  startedAt: string
  endedAt: string | null
  onSave: (id: string, startedAt: string, endedAt: string | null) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

export default function EditSleepDialog({ 
  id,
  startedAt,
  endedAt,
  onSave,
  onDelete,
  onCancel 
}: EditSleepDialogProps) {
  const [newStartedAt, setNewStartedAt] = useState(format(parseISO(startedAt), "yyyy-MM-dd'T'HH:mm"))
  const [newEndedAt, setNewEndedAt] = useState(endedAt ? format(parseISO(endedAt), "yyyy-MM-dd'T'HH:mm") : '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    // Convert the local datetime to ISO string
    const formattedStartedAt = new Date(newStartedAt).toISOString()
    const formattedEndedAt = newEndedAt ? new Date(newEndedAt).toISOString() : null

    onSave(
      id,
      formattedStartedAt,
      formattedEndedAt
    )
  }

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Confirm Delete</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this sleep log? This action cannot be undone.
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
          <div className="bg-sky-900/40 p-2 rounded-full">
            <IconMoon className="w-5 h-5 text-sky-200" />
          </div>
          <h2 className="text-lg font-medium text-gray-100">Edit Sleep Time</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={newStartedAt}
              onChange={(e) => setNewStartedAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={newEndedAt}
              onChange={(e) => setNewEndedAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors"
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