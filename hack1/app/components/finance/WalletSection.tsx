'use client'

import { useState } from 'react'

interface Transaction {
  id: number
  type: string
  description: string
  amount: string
  date: string
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

interface WalletSectionProps {
  userData: UserData | null
}

export default function WalletSection({ userData }: WalletSectionProps) {
  const [walletData] = useState({
    balance: 67000,
    pendingPayments: userData?.pendingPayments || 15000,
    totalEarnings: userData?.totalEarnings || 245000,
    transactions: [
      { id: 1, type: "Received", description: `${userData?.crops?.split(',')[0] || 'Coffee'} Sale - ${userData?.location || 'Medellín'} Cooperative`, amount: "+$2,250", date: "Aug 28" },
      { id: 2, type: "Sent", description: "Organic Fertilizer Purchase", amount: "-$850", date: "Aug 25" },
      { id: 3, type: "Received", description: "Microfinance Loan", amount: "+$5,000", date: "Aug 20" },
      { id: 4, type: "Sent", description: "Crop Insurance Premium", amount: "-$500", date: "Aug 18" },
      { id: 5, type: "Received", description: `${userData?.crops?.split(',')[1] || 'Avocado'} Export - ${userData?.location || 'Mexico City'}`, amount: "+$1,800", date: "Aug 15" }
    ]
  })

  const [showSendMoney, setShowSendMoney] = useState(false)
  const [sendAmount, setSendAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')

  const handleSendMoney = () => {
    if (!sendAmount || !recipientAddress) {
      alert('Please fill in all fields')
      return
    }
    alert(`Sending $${sendAmount} to ${recipientAddress} via smart contract...`)
    setShowSendMoney(false)
    setSendAmount('')
    setRecipientAddress('')
  }

  const handleWithdraw = () => {
    alert('Initiating withdrawal to your bank account...')
  }

  return (
    <div>
      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
          <p className="text-3xl font-bold">${walletData.balance.toLocaleString()}</p>
          <p className="text-green-100 text-sm mt-1">Available to spend</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
          <p className="text-3xl font-bold">${walletData.pendingPayments.toLocaleString()}</p>
          <p className="text-blue-100 text-sm mt-1">In escrow</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold">${walletData.totalEarnings.toLocaleString()}</p>
          <p className="text-purple-100 text-sm mt-1">All time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setShowSendMoney(true)}
          className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition-colors font-semibold"
        >
          💸 Send Money
        </button>
        <button
          onClick={handleWithdraw}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          🏦 Withdraw to Bank
        </button>
        <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors font-semibold">
          📊 View Analytics
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <button className="text-primary hover:underline text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {walletData.transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === 'Received' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-lg">
                    {tx.type === 'Received' ? '⬇️' : '⬆️'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-gray-600">{tx.date}</p>
                </div>
              </div>
              <span className={`font-bold text-lg ${
                tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Send Money Modal */}
      {showSendMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Send Money</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="10000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x742d35Cc6554C0532925a3b8..."
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowSendMoney(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMoney}
                className="flex-1 btn-primary"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}