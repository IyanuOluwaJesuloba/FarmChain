'use client'

import { useState } from 'react'
import Navigation from './components/Navigation'
import LandingPage from './components/LandingPage'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import CropsManagement from './components/CropsManagement'
import Marketplace from './components/Marketplace'
import Finance from './components/Finance'
import Community from './components/Community'

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

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isConnected, setIsConnected] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const handleLogin = (userInfo?: UserData) => {
    setIsConnected(true)
    if (userInfo) {
      setUserData(userInfo)
    }
    setCurrentPage('dashboard')
  }

  const handleBackToLanding = () => {
    setCurrentPage('landing')
  }

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      setIsConnected(true)
      alert('Wallet connected successfully! Welcome to FarmChain Latina 🚀')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet. Please try again.')
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />
      case 'auth':
        return <Auth onLogin={handleLogin} onBack={handleBackToLanding} />
      case 'dashboard':
        return <Dashboard userData={userData} />
      case 'crops':
        return <CropsManagement userData={userData} />
      case 'marketplace':
        return <Marketplace userData={userData} />
      case 'finance':
        return <Finance userData={userData} />
      case 'community':
        return <Community userData={userData} />
      default:
        return <Dashboard userData={userData} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'landing' && currentPage !== 'auth' && (
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isConnected={isConnected}
          connectWallet={connectWallet}
          onLogoClick={handleBackToLanding}
          userData={userData}
        />
      )}
      
      {renderCurrentPage()}
    </div>
  )
}