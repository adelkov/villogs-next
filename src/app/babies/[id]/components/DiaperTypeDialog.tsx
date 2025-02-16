'use client'
import { IconDroplet, IconPoo, IconDropletFilled, IconX } from '@tabler/icons-react'

type DiaperType = 'pee' | 'poop' | 'both' | 'empty'

interface DiaperTypeDialogProps {
  onSelect: (type: DiaperType) => void
  onCancel: () => void
}

interface DiaperOption {
  type: DiaperType
  label: string
  icon: typeof IconDroplet
  color: string
}

const options: DiaperOption[] = [
  {
    type: 'pee',
    label: 'Pee',
    icon: IconDroplet,
    color: 'yellow'
  },
  {
    type: 'poop',
    label: 'Poop',
    icon: IconPoo,
    color: 'amber'
  },
  {
    type: 'both',
    label: 'Both',
    icon: IconDropletFilled,
    color: 'orange'
  },
  {
    type: 'empty',
    label: 'Empty',
    icon: IconX,
    color: 'gray'
  }
]

export default function DiaperTypeDialog({ onSelect, onCancel }: DiaperTypeDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Select Diaper Content</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map(option => (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className={`
                bg-gray-800 hover:bg-gray-700 
                border border-green-900 rounded-lg p-4 
                flex flex-col items-center transition-colors
              `}
            >
              <div className="bg-green-900/40 p-3 rounded-full mb-2">
                <option.icon className="w-6 h-6 text-green-200" />
              </div>
              <span className="text-green-100 font-medium">{option.label}</span>
            </button>
          ))}
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