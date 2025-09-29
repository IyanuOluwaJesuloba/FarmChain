'use client'

import { useState } from 'react'

interface AddCropModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NewCrop {
  type: string
  variety: string
  plantingDate: string
  expectedHarvest: string
  farmSize: string
  location: string
}

export default function AddCropModal({ isOpen, onClose }: AddCropModalProps) {
  const [newCrop, setNewCrop] = useState<NewCrop>({
    type: '',
    variety: '',
    plantingDate: '',
    expectedHarvest: '',
    farmSize: '',
    location: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const cropOptions = [
    { value: 'maize', label: 'Maize', varieties: ['White Maize', 'Yellow Maize', 'Hybrid'] },
    { value: 'cassava', label: 'Cassava', varieties: ['TMS 30572', 'TMS 98/0505', 'TMS 30001'] },
    { value: 'yam', label: 'Yam', varieties: ['Water Yam', 'White Yam', 'Yellow Yam'] },
    { value: 'rice', label: 'Rice', varieties: ['FARO 44', 'FARO 52', 'NERICA 1'] },
    { value: 'millet', label: 'Millet', varieties: ['Pearl Millet', 'Finger Millet'] },
    { value: 'sorghum', label: 'Sorghum', varieties: ['Guinea Corn', 'Sweet Sorghum'] },
    { value: 'cocoa', label: 'Cocoa', varieties: ['Amelonado', 'Trinitario'] }
  ]

  const getCurrentVarieties = () => {
    const selectedCrop = cropOptions.find(crop => crop.value === newCrop.type)
    return selectedCrop ? selectedCrop.varieties : []
  }

  const addCrop = async () => {
    if (!newCrop.type || !newCrop.plantingDate || !newCrop.farmSize) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Crop recorded on blockchain! Transaction hash: 0x8f2a9b4c...')
      setNewCrop({
        type: '',
        variety: '',
        plantingDate: '',
        expectedHarvest: '',
        farmSize: '',
        location: ''
      })
      onClose()
    } catch (error) {
      alert('Failed to record crop. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Record New Crop</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">Add your crop to the blockchain for transparency</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Type <span className="text-red-500">*</span>
            </label>
            <select
              value={newCrop.type}
              onChange={(e) => setNewCrop({...newCrop, type: e.target.value, variety: ''})}
              className="input-field"
              required
            >
              <option value="">Select Crop</option>
              {cropOptions.map((crop) => (
                <option key={crop.value} value={crop.value}>{crop.label}</option>
              ))}
            </select>
          </div>

          {newCrop.type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variety</label>
              <select
                value={newCrop.variety}
                onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                className="input-field"
              >
                <option value="">Select Variety</option>
                {getCurrentVarieties().map((variety) => (
                  <option key={variety} value={variety}>{variety}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planting Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newCrop.plantingDate}
              onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Harvest Date</label>
            <input
              type="date"
              value={newCrop.expectedHarvest}
              onChange={(e) => setNewCrop({...newCrop, expectedHarvest: e.target.value})}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Size (Hectares) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={newCrop.farmSize}
              onChange={(e) => setNewCrop({...newCrop, farmSize: e.target.value})}
              placeholder="2.5"
              step="0.1"
              min="0.1"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
            <input
              type="text"
              value={newCrop.location}
              onChange={(e) => setNewCrop({...newCrop, location: e.target.value})}
              placeholder="e.g., Kaduna North LGA"
              className="input-field"
            />
          </div>

          {/* Blockchain Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              <span className="text-sm font-medium text-blue-800">Blockchain Recording</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              This crop will be permanently recorded on Polygon blockchain for transparency and traceability.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={addCrop}
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Recording...</span>
                </div>
              ) : (
                'Record on Blockchain'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}