'use client'

interface Crop {
  id: number
  name: string
  planted: string
  harvest: string
  status: string
  progress: number
}

interface CropCardProps {
  crop: Crop
}

export default function CropCard({ crop }: CropCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Growing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Mature':
        return 'bg-green-100 text-green-800'
      case 'Sold':
        return 'bg-blue-100 text-blue-800'
      case 'Planned':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCropEmoji = (cropName: string) => {
    if (cropName.includes('Maize')) return '🌽'
    if (cropName.includes('Cassava')) return '🍠'
    if (cropName.includes('Rice')) return '🌾'
    if (cropName.includes('Yam')) return '🥔'
    if (cropName.includes('Millet')) return '🌾'
    if (cropName.includes('Sorghum')) return '🌾'
    if (cropName.includes('Cocoa')) return '🍫'
    return '🌱'
  }

  const handleUpdateStatus = () => {
    alert(`Recording crop status update on blockchain for ${crop.name}`)
  }

  const handleViewDetails = () => {
    alert(`Viewing detailed blockchain history for ${crop.name}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getCropEmoji(crop.name)}</span>
          <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
          {crop.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Planted:</span>
          <span className="font-medium">{crop.planted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expected Harvest:</span>
          <span className="font-medium">{crop.harvest}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {crop.status !== 'Planned' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Growth Progress</span>
            <span>{crop.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-500"
              style={{ width: `${crop.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Blockchain Verification */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Recorded on Polygon blockchain</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleUpdateStatus}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm hover:bg-secondary transition-colors"
        >
          Update Status
        </button>
        <button
          onClick={handleViewDetails}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  )
}