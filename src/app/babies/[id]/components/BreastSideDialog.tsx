'use client'
import { IconMilk } from '@tabler/icons-react'

interface BreastSideDialogProps {
  onSelect: (side: 'left' | 'right') => void
  onCancel: () => void
}

export default function BreastSideDialog({ onSelect, onCancel }: BreastSideDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Select Feeding Side</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onSelect('left')}
            className="bg-gray-800 hover:bg-gray-700 border border-pink-900 rounded-lg p-4 flex flex-col items-center transition-colors"
          >
            <div className="bg-pink-900/40 p-3 rounded-full mb-2">
              <IconMilk className="w-6 h-6 text-pink-200" />
            </div>
            <span className="text-pink-100 font-medium">Left Side</span>
          </button>

          <button
            onClick={() => onSelect('right')}
            className="bg-gray-800 hover:bg-gray-700 border border-pink-900 rounded-lg p-4 flex flex-col items-center transition-colors"
          >
            <div className="bg-pink-900/40 p-3 rounded-full mb-2">
              <IconMilk className="w-6 h-6 text-pink-200" />
            </div>
            <span className="text-pink-100 font-medium">Right Side</span>
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
} 