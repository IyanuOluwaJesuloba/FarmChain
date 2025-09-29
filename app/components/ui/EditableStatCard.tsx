'use client'

import { useState } from 'react'

interface EditableStatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  onSave: (newValue: number) => void
}

export default function EditableStatCard({ title, value, icon, color, onSave }: EditableStatCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString().replace(/[^0-9]/g, ''))

  const handleSave = () => {
    const numericValue = parseInt(editValue) || 0
    onSave(numericValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value.toString().replace(/[^0-9]/g, ''))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200'
      case 'green':
        return 'bg-green-50 border-green-200'
      case 'orange':
        return 'bg-orange-50 border-orange-200'
      case 'purple':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${getColorClasses(color)} hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 w-24"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 text-sm"
                title="Save"
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 group"
            >
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          {icon}
        </div>
      </div>
    </div>
  )
}
