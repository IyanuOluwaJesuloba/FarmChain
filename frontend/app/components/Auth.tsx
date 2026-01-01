'use client'

import { useState, useEffect } from 'react'
import { web3Service } from '../../lib/web3'
import { apiService } from '../../lib/api'

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
  walletAddress?: string
}

interface AuthProps {
  onLogin: (userData?: UserData) => void
  onBack: () => void
}

export default function Auth({ onLogin, onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    farmSize: '',
    location: '',
    crops: '',
    totalCrops: '',
    activeSales: '',
    totalEarnings: '',
    pendingPayments: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true)
      const connection = await web3Service.connectWallet()
      setWalletConnected(true)
      setWalletAddress(connection.address)
      console.log('Wallet connected:', connection.address)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet. Please install MetaMask and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const status = await web3Service.getWalletStatus()
        if (status) {
          setWalletConnected(true)
          setWalletAddress(status.address)
        }
      } catch (error) {
        console.error('Error checking wallet status:', error)
      }
    }
    checkWalletConnection()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLogin && !walletConnected) {
      alert('Please connect your wallet before signing up')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Pass user data for signup, or mock data for login
      const userData: UserData = isLogin 
        ? {
            name: 'Carlos Mendoza',
            email: formData.email || 'carlos@example.com',
            location: 'colombia',
            farmSize: '5.5',
            crops: 'Coffee, Avocado, Plantain',
            totalCrops: 12,
            activeSales: 5,
            totalEarnings: 245000,
            pendingPayments: 3,
            walletAddress: walletAddress
          }
        : {
            name: formData.name,
            email: formData.email,
            location: formData.location,
            farmSize: formData.farmSize,
            crops: formData.crops,
            totalCrops: parseInt(formData.totalCrops) || 0,
            activeSales: parseInt(formData.activeSales) || 0,
            totalEarnings: parseInt(formData.totalEarnings) || 0,
            pendingPayments: parseInt(formData.pendingPayments) || 0,
            walletAddress: walletAddress
          }
      
      console.log('Sending userData to parent:', userData)
      onLogin(userData)
    } catch (error) {
      console.error('Authentication error:', error)
      alert('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      name: '',
      farmSize: '',
      location: '',
      crops: '',
      totalCrops: '',
      activeSales: '',
      totalEarnings: '',
      pendingPayments: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-4 text-orange-600 hover:text-orange-700 flex items-center mx-auto"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join FarmChain Latina'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to access your farming dashboard' 
              : 'Connect with farmers across Latin America'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select your country</option>
                    <option value="colombia">Colombia</option>
                    <option value="mexico">Mexico</option>
                    <option value="argentina">Argentina</option>
                    <option value="brazil">Brazil</option>
                    <option value="peru">Peru</option>
                    <option value="chile">Chile</option>
                    <option value="ecuador">Ecuador</option>
                    <option value="costa-rica">Costa Rica</option>
                    <option value="guatemala">Guatemala</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Size (hectares)
                  </label>
                  <input
                    type="number"
                    id="farmSize"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 5.5"
                    step="0.1"
                    min="0.1"
                  />
                </div>

                <div>
                  <label htmlFor="crops" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Crops
                  </label>
                  <input
                    type="text"
                    id="crops"
                    name="crops"
                    value={formData.crops}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Coffee, Avocado, Cacao"
                  />
                </div>

                {/* Farm Statistics Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="totalCrops" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Crop Varieties
                      </label>
                      <input
                        type="number"
                        id="totalCrops"
                        name="totalCrops"
                        value={formData.totalCrops}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="12"
                        min="1"
                      />
                    </div>

                    <div>
                      <label htmlFor="activeSales" className="block text-sm font-medium text-gray-700 mb-2">
                        Active Sales
                      </label>
                      <input
                        type="number"
                        id="activeSales"
                        name="activeSales"
                        value={formData.activeSales}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="5"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="totalEarnings" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Earnings (USD)
                      </label>
                      <input
                        type="number"
                        id="totalEarnings"
                        name="totalEarnings"
                        value={formData.totalEarnings}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="245000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="pendingPayments" className="block text-sm font-medium text-gray-700 mb-2">
                        Pending Payments
                      </label>
                      <input
                        type="number"
                        id="pendingPayments"
                        name="pendingPayments"
                        value={formData.pendingPayments}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="3"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isLogin && !walletConnected && (
              <button
                type="button"
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {isLoading ? 'Connecting...' : '🔗 Connect Wallet'}
              </button>
            )}

            {!isLogin && walletConnected && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm text-green-800">
                    Wallet Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLogin && !walletConnected)}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span>Google</span>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span>MetaMask</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Trusted by farmers across Latin America</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 Secure Blockchain</span>
            <span>🌱 Crop Tracking</span>
            <span>💰 Fair Pricing</span>
          </div>
        </div>
      </div>
    </div>
  )
}
