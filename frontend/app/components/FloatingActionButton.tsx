'use client'

import { useState } from 'react'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    { id: 'record-crop', label: 'Record Crop', icon: '🌱', color: 'bg-green-500' },
    { id: 'list-sale', label: 'List for Sale', icon: '💰', color: 'bg-blue-500' },
    { id: 'apply-loan', label: 'Apply Loan', icon: '🏦', color: 'bg-purple-500' },
    { id: 'check-weather', label: 'Weather', icon: '🌤️', color: 'bg-orange-500' }
  ]

  const handleQuickAction = (actionId: string) => {
    setIsOpen(false)
    
    switch (actionId) {
      case 'record-crop':
        alert('Opening crop recording form...')
        break
      case 'list-sale':
        alert('Opening marketplace listing form...')
        break
      case 'apply-loan':
        alert('Opening loan application...')
        break
      case 'check-weather':
        alert('Fetching latest weather data...')
        break
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 mb-2">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center space-x-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => handleQuickAction(action.id)}
                className={`${action.color} hover:opacity-80 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110`}
              >
                <span className="text-lg">{action.icon}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-primary hover:bg-secondary text-white p-4 rounded-full shadow-lg transition-all transform ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}