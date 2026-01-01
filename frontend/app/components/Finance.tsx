'use client'

import { useState } from 'react'
import WalletSection from './finance/WalletSection'
import LoansSection from './finance/LoansSection'
import SavingsSection from './finance/SavingsSection'
// import InsuranceSection from './finance/InsuranceSection'

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

interface FinanceProps {
  userData: UserData | null
}

export default function Finance({ userData }: FinanceProps) {
  const [activeService, setActiveService] = useState('wallet')

  const services = [
    { id: 'wallet', name: 'Wallet', icon: '💳' },
    { id: 'loans', name: 'Loans', icon: '🏦' },
    { id: 'savings', name: 'Savings Cooperatives', icon: '💰' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️' }
  ]

  const renderActiveService = () => {
    switch (activeService) {
      case 'wallet':
        return <WalletSection userData={userData} />
      case 'loans':
        return <LoansSection userData={userData} />
      case 'savings':
        return <SavingsSection userData={userData} />
      case 'insurance':
        return <div className="text-center py-8 text-gray-500">Insurance section coming soon...</div>
      default:
        return <WalletSection userData={userData} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Services</h1>
        <p className="text-gray-600 mt-2">
          {userData?.name ? `${userData.name}'s` : 'Your'} farm finances with blockchain-powered tools
        </p>
      </div>

      {/* Service Navigation */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeService === service.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{service.icon}</span>
                <span>{service.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderActiveService()}
        </div>
      </div>
    </div>
  )
}