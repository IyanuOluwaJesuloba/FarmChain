'use client'

import { useState } from 'react'

interface SavingsGroup {
  id: number
  name: string
  members: number
  maxMembers: number
  monthlyContribution: number
  nextPayout: string
  description: string
  location: string
  joined: boolean
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

interface SavingsSectionProps {
  userData: UserData | null
}

export default function SavingsSection({ userData }: SavingsSectionProps) {
  const [savingsGroups] = useState<SavingsGroup[]>([
    {
      id: 1,
      name: `${userData?.location || 'Antioquia'} ${userData?.crops?.split(',')[0] || 'Coffee'} Cooperative`,
      members: 25,
      maxMembers: 30,
      monthlyContribution: 1000,
      nextPayout: "Sept 15",
      description: `Monthly contributions for ${userData?.crops?.split(',')[0]?.toLowerCase() || 'coffee'} processing equipment and organic certification`,
      location: userData?.location || "Antioquia, Colombia",
      joined: true
    },
    {
      id: 2,
      name: "Veracruz Vanilla Growers",
      members: 18,
      maxMembers: 20,
      monthlyContribution: 1500,
      nextPayout: "Oct 1",
      description: "Savings group for vanilla farmers focusing on premium export markets",
      location: "Veracruz, Mexico",
      joined: false
    },
    {
      id: 3,
      name: "Cusco Quinoa Farmers Alliance",
      members: 40,
      maxMembers: 50,
      monthlyContribution: 800,
      nextPayout: "Sept 30",
      description: "Large savings group for quinoa farmers with bulk purchasing power",
      location: "Cusco, Peru",
      joined: false
    },
    {
      id: 4,
      name: "Women Farmers Alliance",
      members: 35,
      maxMembers: 40,
      monthlyContribution: 5000,
      nextPayout: "Sept 20",
      description: "Supporting women in agriculture across Nigeria",
      location: "Multi-State",
      joined: false
    }
  ])

  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupContribution, setNewGroupContribution] = useState('')

  const joinGroup = (groupId: number) => {
    alert(`Joining savings group via smart contract! Your first contribution of ₦${savingsGroups.find(g => g.id === groupId)?.monthlyContribution.toLocaleString()} will be deducted automatically.`)
  }

  const makeContribution = () => {
    alert('Monthly contribution of ₦10,000 processed via smart contract!')
  }

  const createGroup = () => {
    if (!newGroupName || !newGroupContribution) {
      alert('Please fill in all fields')
      return
    }
    alert(`Creating new Esusu group "${newGroupName}" on blockchain!`)
    setShowCreateGroup(false)
    setNewGroupName('')
    setNewGroupContribution('')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Join Esusu Savings Groups</h3>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
        >
          + Create Group
        </button>
      </div>

      {/* Your Active Groups */}
      <div className="mb-8">
        <h4 className="font-bold mb-4">Your Active Groups</h4>
        {savingsGroups.filter(group => group.joined).map((group) => (
          <div key={group.id} className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h5 className="font-bold text-green-900">{group.name}</h5>
                <p className="text-sm text-green-700">{group.location}</p>
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Active Member
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-green-700">Monthly Contribution:</span>
                <div className="font-bold text-green-900">₦{group.monthlyContribution.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-green-700">Next Payout:</span>
                <div className="font-bold text-green-900">{group.nextPayout}</div>
              </div>
            </div>
            
            <button
              onClick={makeContribution}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Make This Month's Contribution
            </button>
          </div>
        ))}
      </div>

      {/* Available Groups */}
      <div>
        <h4 className="font-bold mb-4">Available Groups to Join</h4>
        <div className="grid md:grid-cols-2 gap-6">
          {savingsGroups.filter(group => !group.joined).map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-bold text-lg">{group.name}</h5>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {group.members}/{group.maxMembers} members
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{group.description}</p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{group.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Contribution:</span>
                  <span className="font-medium">₦{group.monthlyContribution.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Payout:</span>
                  <span className="font-medium">{group.nextPayout}</span>
                </div>
              </div>

              {/* Member Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Group Capacity</span>
                  <span>{group.members}/{group.maxMembers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => joinGroup(group.id)}
                disabled={group.members >= group.maxMembers}
                className={`w-full py-2 rounded-lg transition-colors ${
                  group.members >= group.maxMembers
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-8">
            <h3 className="text-xl font-bold mb-2">What are Savings Cooperatives?</h3>
            <p className="text-green-100">
              Savings cooperatives are community-based financial groups where farmers contribute regularly to a common fund. 
              Members take turns receiving the total contributions, providing access to larger sums for farm investments and equipment.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Create Esusu Group</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={`e.g., ${userData?.location || 'Your Location'} ${userData?.crops?.split(',')[0] || 'Crop'} Farmers`}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution (₦)</label>
                <input
                  type="number"
                  value={newGroupContribution}
                  onChange={(e) => setNewGroupContribution(e.target.value)}
                  placeholder="10000"
                  className="input-field"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700">
                  Creating a group requires a smart contract deployment fee of ₦2,000. 
                  You'll become the group administrator.
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="flex-1 btn-primary"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}