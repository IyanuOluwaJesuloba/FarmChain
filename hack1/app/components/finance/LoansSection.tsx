'use client'

import { useState } from 'react'

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

interface LoansSectionProps {
  userData: UserData | null
}

export default function LoansSection({ userData }: LoansSectionProps) {
  const [loanAmount, setLoanAmount] = useState('')
  const [loanPurpose, setLoanPurpose] = useState('')
  const [repaymentTerm, setRepaymentTerm] = useState('6')
  const loanOptions = [
    { id: 1, name: 'Equipment Loan', rate: '8%', maxAmount: '$50,000', term: '12 months', description: 'For coffee processing equipment and farm machinery' },
    { id: 2, name: 'Seasonal Loan', rate: '6%', maxAmount: '$20,000', term: '6 months', description: 'For organic seeds, fertilizers, and harvest expenses' },
    { id: 3, name: 'Expansion Loan', rate: '10%', maxAmount: '$100,000', term: '24 months', description: 'For farm expansion and sustainable agriculture projects' }
  ]

  const activeLoan = {
    amount: 5000,
    purpose: `${userData?.crops?.split(',')[0] || 'Coffee'} Processing Equipment`,
    balance: 3500,
    nextPayment: '2025-09-15',
    monthlyPayment: 850
  }

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !repaymentTerm) return 0
    const principal = parseFloat(loanAmount)
    const months = parseInt(repaymentTerm)
    const interestRate = 0.08 / 12 // 8% annual rate
    
    const monthlyPayment = (principal * interestRate * Math.pow(1 + interestRate, months)) / 
                          (Math.pow(1 + interestRate, months) - 1)
    
    return Math.round(monthlyPayment)
  }

  const applyForLoan = () => {
    if (!loanAmount || !loanPurpose) {
      alert('Please fill in all required fields')
      return
    }
    alert('Loan application submitted to smart contract! You will receive approval within 24 hours.')
    setLoanAmount('')
    setLoanPurpose('')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Loan Application */}
      <div>
        <h3 className="text-xl font-bold mb-6">Apply for {userData?.crops?.split(',')[0] || 'Crop'} Loan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="50000"
              min="10000"
              max="500000"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum: ₦10,000 | Maximum: ₦500,000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <select
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              className="input-field"
            >
              <option value="">Select Purpose</option>
              <option value="seeds">Organic Seeds and Seedlings</option>
              <option value="fertilizer">Organic Fertilizer and Pest Control</option>
              <option value="equipment">{userData?.crops?.split(',')[0] || 'Coffee'} Processing Equipment</option>
              <option value="irrigation">Drip Irrigation System</option>
              <option value="storage">{userData?.crops?.split(',')[0] || 'Coffee'} Storage and Drying Facilities</option>
              <option value="expansion">Sustainable Farm Expansion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
            <select
              value={repaymentTerm}
              onChange={(e) => setRepaymentTerm(e.target.value)}
              className="input-field"
            >
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          {/* Loan Calculator */}
          {loanAmount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Loan Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-medium">₦{parseInt(loanAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-medium">8% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-medium text-blue-800">₦{calculateMonthlyPayment().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={applyForLoan}
            className="w-full btn-primary"
            disabled={!loanAmount || !loanPurpose}
          >
            Apply for Loan
          </button>
        </div>
      </div>
      
      {/* Loan Information & Active Loan */}
      <div className="space-y-6">
        {/* Active Loan */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-yellow-900 mb-4">Active Loan</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Original Amount:</span>
              <span className="font-bold">₦{activeLoan.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Balance:</span>
              <span className="font-bold text-yellow-800">₦{activeLoan.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Next Payment:</span>
              <span className="font-medium">{activeLoan.nextPayment}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Payment:</span>
              <span className="font-medium">₦{activeLoan.monthlyPayment.toLocaleString()}</span>
            </div>
          </div>
          <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors mt-4">
            Make Payment
          </button>
        </div>

        {/* Loan Terms */}
        <div>
          <h4 className="text-lg font-bold mb-4">Loan Terms</h4>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span className="font-bold text-primary">8% annually</span>
            </div>
            <div className="flex justify-between">
              <span>Maximum Amount:</span>
              <span className="font-bold">₦500,000</span>
            </div>
            <div className="flex justify-between">
              <span>Repayment Period:</span>
              <span className="font-bold">6-12 months</span>
            </div>
            <div className="flex justify-between">
              <span>Collateral:</span>
              <span className="font-bold">Future crop harvest</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Time:</span>
              <span className="font-bold">24 hours</span>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span className="text-sm font-medium text-green-800">Smart Contract Guaranteed</span>
            </div>
            <p className="text-xs text-green-700 mt-2">
              All loans are managed by transparent smart contracts with automatic repayment schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}