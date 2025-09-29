'use client'

import { useState, useEffect } from 'react'
import StatCard from './ui/StatCard'
import EditableStatCard from './ui/EditableStatCard'
import WeatherWidget from './ui/WeatherWidget'
import QuickActions from './ui/QuickActions'
import ActivityFeed from './ui/ActivityFeed'
import EditableField from './ui/EditableField'

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

interface DashboardProps {
  userData: UserData | null
}

export default function Dashboard({ userData }: DashboardProps) {
  // Debug: Log user data to console
  console.log('Dashboard received userData:', userData)
  
  // Local state for editable user data
  const [editableUserData, setEditableUserData] = useState<UserData | null>(userData)
  
  // Update local state when userData prop changes
  useEffect(() => {
    setEditableUserData(userData)
  }, [userData])
  
  // Use editable user data or fallback to defaults
  const stats = {
    totalCrops: editableUserData?.totalCrops || 12,
    activeSales: editableUserData?.activeSales || 5,
    totalEarnings: editableUserData?.totalEarnings || 245000,
    pendingPayments: editableUserData?.pendingPayments || 3
  }

  // Handle field updates
  const updateUserField = (field: keyof UserData, value: string | number) => {
    if (!editableUserData) return
    
    setEditableUserData({
      ...editableUserData,
      [field]: value
    })
    
    // In a real app, you would also save to backend here
    console.log(`Updated ${field} to:`, value)
  }

  const [transactions] = useState([
    { id: 1, type: "Sale", crop: "Coffee", amount: "$2,250", status: "Completed", date: "2025-08-28" },
    { id: 2, type: "Loan", amount: "$5,000", status: "Active", date: "2025-08-25" },
    { id: 3, type: "Insurance", crop: "Cacao", amount: "$800", status: "Active", date: "2025-08-20" }
  ])

  // Get user's primary crops for display
  const getUserCrops = () => {
    if (!editableUserData?.crops) return ['Coffee', 'Avocado', 'Cacao']
    return editableUserData.crops.split(',').map(crop => crop.trim())
  }

  // Get location-based greeting
  const getLocationGreeting = () => {
    if (!userData?.location) return 'Latin America'
    const locationMap: { [key: string]: string } = {
      'colombia': 'Colombia',
      'mexico': 'Mexico', 
      'argentina': 'Argentina',
      'brazil': 'Brazil',
      'peru': 'Peru',
      'chile': 'Chile',
      'ecuador': 'Ecuador',
      'costa-rica': 'Costa Rica',
      'guatemala': 'Guatemala'
    }
    return locationMap[userData.location] || userData.location
  }

  const statsData = [
    {
      title: "Total Crops",
      value: stats.totalCrops,
      icon: (
        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      color: "primary"
    },
    {
      title: "Active Sales",
      value: stats.activeSales,
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
        </svg>
      ),
      color: "green"
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
        </svg>
      ),
      color: "orange"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {editableUserData?.name || 'Farmer'}! 🌾
        </h1>
        <p className="text-gray-600">
          Here's what's happening on your{' '}
          {editableUserData?.farmSize && (
            <>
              <EditableField
                value={editableUserData.farmSize}
                onSave={(value) => updateUserField('farmSize', value)}
                type="number"
                placeholder="5.5"
                displayClassName="font-medium text-gray-900"
              />
              {' '}hectare
            </>
          )}{' '}
          farm in {getLocationGreeting()} today
        </p>
        {editableUserData?.crops && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Your crops:</span>
            <EditableField
              value={editableUserData.crops}
              onSave={(value) => updateUserField('crops', value)}
              placeholder="Coffee, Avocado, Cacao"
              displayClassName="text-sm font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full"
            />
            <span className="text-xs text-gray-400 ml-2">Click to edit</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EditableStatCard
          title="Total Crops"
          value={stats.totalCrops}
          icon={
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"/>
            </svg>
          }
          color="green"
          onSave={(value) => updateUserField('totalCrops', value)}
        />
        
        <EditableStatCard
          title="Active Sales"
          value={stats.activeSales}
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          }
          color="blue"
          onSave={(value) => updateUserField('activeSales', value)}
        />
        
        <EditableStatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
            </svg>
          }
          color="green"
          onSave={(value) => updateUserField('totalEarnings', value)}
        />
        
        <EditableStatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
            </svg>
          }
          color="orange"
          onSave={(value) => updateUserField('pendingPayments', value)}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed transactions={transactions} />
        </div>
        
        <div className="space-y-6">
          <WeatherWidget />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}