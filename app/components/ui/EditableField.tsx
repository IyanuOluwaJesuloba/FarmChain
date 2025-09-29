'use client'

import { useState } from 'react'

interface EditableFieldProps {
  value: string | number
  onSave: (newValue: string | number) => void
  type?: 'text' | 'number'
  placeholder?: string
  className?: string
  displayClassName?: string
}

export default function EditableField({ 
  value, 
  onSave, 
  type = 'text', 
  placeholder, 
  className = '',
  displayClassName = ''
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())

  const handleSave = () => {
    const newValue = type === 'number' ? parseFloat(editValue) || 0 : editValue
    onSave(newValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value.toString())
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={`px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${className}`}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-800"
          title="Save"
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-800"
          title="Cancel"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded transition-colors ${displayClassName}`}
      title="Click to edit"
    >
      {value}
    </span>
  )
}
