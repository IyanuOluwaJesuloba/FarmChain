'use client'

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

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  isConnected: boolean
  connectWallet: () => void
  onLogoClick?: () => void
  userData?: UserData | null
}

export default function Navigation({ currentPage, setCurrentPage, isConnected, connectWallet, onLogoClick, userData }: NavigationProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'crops', label: 'Crops' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'finance', label: 'Finance' },
    { id: 'community', label: 'Community' }
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={onLogoClick}
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FarmChain Latina</span>
            </button>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-link ${
                    currentPage === item.id ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full pulse-slow"></div>
              {/* <span className="text-sm text-gray-600">Polygon Network</span> */}
            </div>
            <div className="flex items-center space-x-4">
              {/* {userData && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{userData.name}</span>
                  {userData.location && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {userData.location}
                    </span>
                  )}
                </div>
              )} */}
              <button
                onClick={connectWallet}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-primary hover:bg-secondary text-white'
                }`}
              >
                {isConnected ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentPage === item.id 
                  ? 'text-primary bg-primary bg-opacity-10' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}