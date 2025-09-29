'use client'

import { useState } from 'react'
import SearchFilters from './ui/SearchFilters'
import CropListing from './ui/CropListing'

interface MarketplaceCrop {
  id: number
  farmer: string
  crop: string
  quantity: string
  price: string
  quality: string
  harvestDate: string
  location: string
}

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

interface MarketplaceProps {
  userData: UserData | null
}

export default function Marketplace({ userData }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCrop, setSelectedCrop] = useState('all')

  const mockCrops: MarketplaceCrop[] = [
    { id: 1, farmer: "Carlos Mendoza", crop: "Coffee", quantity: "50 bags", price: "$2,250", quality: "Grade A", harvestDate: "2025-12-15", location: "Antioquia" },
    { id: 2, farmer: "María González", crop: "Cacao", quantity: "100 kg", price: "$800", quality: "Premium", harvestDate: "2025-11-20", location: "Veracruz" },
    { id: 3, farmer: "Ana Rodriguez", crop: "Quinoa", quantity: "30 bags", price: "$1,200", quality: "Grade A", harvestDate: "2025-09-20", location: "Buenos Aires" },
    { id: 4, farmer: "Luis Herrera", crop: "Avocado", quantity: "200 kg", price: "$600", quality: "Premium", harvestDate: "2025-11-05", location: "Michoacán" },
    { id: 5, farmer: "Carmen Silva", crop: "Vanilla", quantity: "25 kg", price: "$1,500", quality: "Grade A", harvestDate: "2025-12-25", location: "Veracruz" },
    { id: 6, farmer: "Diego Morales", crop: "Plantain", quantity: "10 boxes", price: "$180", quality: "Premium", harvestDate: "2025-09-30", location: "Costa Rica" }
  ]

  const filteredCrops = mockCrops.filter(crop => {
    return (
      (selectedLocation === 'all' || crop.location.toLowerCase().includes(selectedLocation)) &&
      (selectedCrop === 'all' || crop.crop.toLowerCase().includes(selectedCrop)) &&
      (searchTerm === '' || crop.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
       crop.farmer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const handlePurchase = (crop: MarketplaceCrop) => {
    alert(`Initiating smart contract purchase for ${crop.quantity} of ${crop.crop}. Escrow activated!`)
  }

  const handleMessage = (crop: MarketplaceCrop) => {
    alert(`Opening chat with ${crop.farmer}`)
  }

  const handleViewDetails = (crop: MarketplaceCrop) => {
    alert(`Viewing blockchain history for ${crop.crop} batch`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-2">
          {userData?.name ? `${userData.name}, find` : 'Find'} the best deals in {userData?.location || 'Latin America'}
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        resultCount={filteredCrops.length}
      />

      {/* Featured Listings Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">🔥 Featured Listings</h2>
        <p className="text-green-100">Premium quality crops from top-rated farmers</p>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropListing
              key={crop.id}
              crop={crop}
              onPurchase={() => handlePurchase(crop)}
              onMessage={() => handleMessage(crop)}
              onViewDetails={() => handleViewDetails(crop)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600">Try adjusting your search filters or check back later for new listings</p>
        </div>
      )}

      {/* Load More Button */}
      {filteredCrops.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Crops
          </button>
        </div>
      )}
    </div>
  )
}