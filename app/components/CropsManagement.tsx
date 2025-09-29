'use client'

import { useState } from 'react'
import CropCard from './ui/CropCard'
import AddCropModal from './ui/AddCropModal'

interface UserData {
  name: string
  email: string
  location: string
  farmSize: string
  crops: string
  totalCrops: number
  activeSales: number
  totalEarnings: number
  pendingPayments: number
}

interface Crop {
  id: number
  name: string
  planted: string
  harvest: string
  status: string
  progress: number
}

interface CropsManagementProps {
  userData: UserData | null
}

export default function CropsManagement({ userData }: CropsManagementProps) {
  const [activeTab, setActiveTab] = useState('current')
  const [showAddCrop, setShowAddCrop] = useState(false)

  // Generate crops based on user's selected crops
  const getUserCrops = () => {
    if (!userData?.crops) return ['Coffee', 'Avocado', 'Cacao']
    return userData.crops.split(',').map(crop => crop.trim())
  }

  const generateCurrentCrops = (): Crop[] => {
    const userCrops = getUserCrops()
    return userCrops.slice(0, 3).map((crop, index) => ({
      id: index + 1,
      name: `${crop} (Premium)`,
      planted: `2025-0${6 + index}-15`,
      harvest: `2025-${11 + index}-15`,
      status: index === 2 ? "Mature" : "Growing",
      progress: [65, 45, 95][index]
    }))
  }

  const currentCrops: Crop[] = generateCurrentCrops()

  const harvestedCrops: Crop[] = [
    { id: 4, name: "Plantain (Dominico)", planted: "2025-02-10", harvest: "2025-05-15", status: "Sold", progress: 100 },
    { id: 5, name: "Quinoa (Real)", planted: "2025-01-20", harvest: "2025-04-30", status: "Sold", progress: 100 }
  ]

  const plannedCrops: Crop[] = [
    { id: 6, name: "Vanilla (Planifolia)", planted: "2025-10-01", harvest: "2026-01-15", status: "Planned", progress: 0 },
    { id: 7, name: "Citrus (Valencia)", planted: "2025-10-15", harvest: "2026-01-30", status: "Planned", progress: 0 }
  ]

  const getCropsForTab = () => {
    switch (activeTab) {
      case 'current':
        return currentCrops
      case 'harvested':
        return harvestedCrops
      case 'planning':
        return plannedCrops
      default:
        return currentCrops
    }
  }

  const tabs = [
    { id: 'current', label: 'Current Crops', count: currentCrops.length },
    { id: 'harvested', label: 'Harvested', count: harvestedCrops.length },
    { id: 'planning', label: 'Planning', count: plannedCrops.length }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
          <p className="text-gray-600 mt-2">Track your crops from planting to harvest on the blockchain</p>
        </div>
        <button
          onClick={() => setShowAddCrop(true)}
          className="btn-primary"
        >
          + Add New Crop
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Crops Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCropsForTab().map((crop) => (
          <CropCard key={crop.id} crop={crop} />
        ))}
      </div>

      {/* Empty State */}
      {getCropsForTab().length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No crops in this category</h3>
          <p className="text-gray-600 mb-6">Start by adding your first crop to track on the blockchain</p>
          <button
            onClick={() => setShowAddCrop(true)}
            className="btn-primary"
          >
            Add Your First Crop
          </button>
        </div>
      )}

      {/* Add Crop Modal */}
      <AddCropModal 
        isOpen={showAddCrop} 
        onClose={() => setShowAddCrop(false)} 
      />
    </div>
  )
}