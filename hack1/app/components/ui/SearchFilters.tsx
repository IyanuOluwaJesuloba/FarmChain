'use client'

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  selectedCrop: string
  setSelectedCrop: (crop: string) => void
  resultCount: number
}

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  selectedCrop,
  setSelectedCrop,
  resultCount
}: SearchFiltersProps) {
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ]

  const crops = ['Maize', 'Cassava', 'Rice', 'Yam', 'Millet', 'Sorghum', 'Cocoa', 'Oil Palm', 'Plantain']

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('all')
    setSelectedCrop('all')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Find Fresh Crops</h2>
        <div className="text-sm text-gray-600">
          {resultCount} crop{resultCount !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search crops or farmers..."
              className="input-field pl-10"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field"
          >
            <option value="all">All States</option>
            {nigerianStates.map((state) => (
              <option key={state} value={state.toLowerCase()}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="input-field"
          >
            <option value="all">All Crops</option>
            {crops.map((crop) => (
              <option key={crop} value={crop.toLowerCase()}>{crop}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end space-y-2">
          <button className="btn-primary h-12">
            Search
          </button>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedLocation !== 'all' || selectedCrop !== 'all') && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-xs">
              Search: {searchTerm}
            </span>
          )}
          {selectedLocation !== 'all' && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
              Location: {selectedLocation}
            </span>
          )}
          {selectedCrop !== 'all' && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
              Crop: {selectedCrop}
            </span>
          )}
        </div>
      )}
    </div>
  )
}