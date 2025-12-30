'use client'

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

interface CropListingProps {
  crop: MarketplaceCrop
  onPurchase: () => void
  onMessage: () => void
  onViewDetails: () => void
}

export default function CropListing({ crop, onPurchase, onMessage, onViewDetails }: CropListingProps) {
  const getCropEmoji = (cropName: string) => {
    switch (cropName.toLowerCase()) {
      case 'maize': return '🌽'
      case 'cassava': return '🍠'
      case 'rice': return '🌾'
      case 'yam': return '🥔'
      case 'millet': return '🌾'
      case 'cocoa': return '🍫'
      default: return '🌱'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium':
        return 'bg-green-100 text-green-800'
      case 'Grade A':
        return 'bg-blue-100 text-blue-800'
      case 'Grade B':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
      <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">{getCropEmoji(crop.crop)}</span>
        </div>
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
          <span className="text-green-500">✅</span>
          <span>Verified</span>
        </div>
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${getQualityColor(crop.quality)}`}>
          {crop.quality}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{crop.crop}</h3>
          <span className="text-2xl font-bold text-primary">{crop.price}</span>
        </div>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Farmer:</span>
            <span className="font-medium">{crop.farmer}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span className="font-medium">{crop.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-medium">{crop.location}</span>
          </div>
          <div className="flex justify-between">
            <span>Harvest Date:</span>
            <span className="font-medium">{crop.harvestDate}</span>
          </div>
        </div>

        {/* Blockchain Supply Chain Tracker */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600 mb-2">Blockchain Verified Supply Chain</p>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs">Planted</span>
            <div className="h-0.5 w-4 bg-gray-300"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs">Growing</span>
            <div className="h-0.5 w-4 bg-gray-300"></div>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs">Harvested</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onPurchase}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors font-semibold text-sm"
          >
            Buy with Escrow
          </button>
          <button
            onClick={onMessage}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Message Farmer"
          >
            💬
          </button>
          <button
            onClick={onViewDetails}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="View Blockchain History"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  )
}