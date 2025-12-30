// Type definitions for FarmChain Nigeria

export interface Location {
  state: string
  lga: string
  coordinates: [number, number]
}

export interface User {
  id: string
  walletAddress: string
  phoneNumber: string
  name: string
  email?: string
  location: Location
  farmSize: number
  crops: string[]
  verificationStatus: 'pending' | 'verified' | 'rejected'
  joinedAt: string
  updatedAt: string
}

export interface Crop {
  id: string
  farmerId: string
  blockchainTxHash: string
  cropType: string
  variety: string
  plantingDate: string
  expectedHarvest: string
  farmLocation: Location
  farmSize: number
  status: 'planned' | 'planted' | 'growing' | 'mature' | 'harvested' | 'sold'
  qualityGrade: 'premium' | 'grade-a' | 'grade-b' | 'grade-c'
  quantity?: number
  unit?: string
  createdAt: string
  updatedAt: string
}

export interface MarketplaceListing {
  id: string
  cropId: string
  farmerId: string
  farmerName: string
  cropType: string
  variety: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
  qualityGrade: 'premium' | 'grade-a' | 'grade-b' | 'grade-c'
  harvestDate: string
  availableDate: string
  location: Location
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'sale' | 'purchase' | 'loan_disbursement' | 'loan_payment' | 'savings_contribution' | 'savings_payout' | 'insurance_premium' | 'insurance_claim'
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'failed'
  description: string
  blockchainTxHash: string
  relatedEntityId: string
  createdAt: string
}

export interface RepaymentSchedule {
  dueDate: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
}

export interface Loan {
  id: string
  borrowerId: string
  amount: number
  interestRate: number
  termMonths: number
  purpose: 'seeds' | 'fertilizer' | 'equipment' | 'land' | 'other'
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted'
  approvalDate?: string
  disbursementDate?: string
  repaymentSchedule: RepaymentSchedule[]
  collateralCropId?: string
  smartContractAddress: string
  createdAt: string
  updatedAt: string
}

export interface SavingsGroup {
  id: string
  name: string
  description: string
  creatorId: string
  monthlyContribution: number
  maxMembers: number
  currentMembers: string[]
  nextPayoutDate: string
  payoutOrder: string[]
  location: string
  smartContractAddress: string
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
}

export interface Reply {
  id: string
  authorId: string
  authorName: string
  content: string
  likes: number
  createdAt: string
}

export interface Discussion {
  id: string
  authorId: string
  authorName: string
  authorLocation: string
  title: string
  content: string
  category: 'soil-management' | 'pest-control' | 'irrigation' | 'harvesting' | 'marketing' | 'general'
  tags: string[]
  likes: number
  replies: Reply[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  author: string
  authorType: 'expert' | 'farmer' | 'extension_officer'
  category: string
  tags: string[]
  views: number
  likes: number
  isVerified: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime: number
  createdAt: string
  updatedAt: string
}

export interface WeatherAlert {
  id: string
  type: 'rainfall' | 'drought' | 'temperature' | 'wind' | 'pest'
  severity: 'low' | 'medium' | 'high'
  message: string
  startDate: string
  endDate: string
  affectedStates: string[]
}

export interface WeatherForecast {
  date: string
  maxTemp: number
  minTemp: number
  rainfall: number
  condition: string
  icon: string
}

export interface WeatherData {
  location: string
  current: {
    temperature: number
    humidity: number
    rainfall: number
    windSpeed: number
    condition: string
    icon: string
  }
  forecast: WeatherForecast[]
  alerts: WeatherAlert[]
}
