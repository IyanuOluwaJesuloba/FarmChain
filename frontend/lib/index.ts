// User Types
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
  
  export interface Location {
    state: string
    lga: string
    coordinates: [number, number] // [longitude, latitude]
    address?: string
  }
  
  // Crop Types
  export interface Crop {
    id: string
    farmerId: string
    blockchainTxHash: string
    cropType: string
    variety: string
    plantingDate: string
    expectedHarvest: string
    actualHarvest?: string
    farmLocation: Location
    farmSize: number
    status: CropStatus
    qualityGrade?: QualityGrade
    quantity?: number
    unit?: string
    notes?: string
    images?: string[]
    createdAt: string
    updatedAt: string
  }
  
  export type CropStatus = 'planned' | 'planted' | 'growing' | 'mature' | 'harvested' | 'sold'
  export type QualityGrade = 'premium' | 'grade-a' | 'grade-b' | 'grade-c'
  
  // Marketplace Types
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
    qualityGrade: QualityGrade
    harvestDate: string
    availableDate: string
    location: Location
    description?: string
    images?: string[]
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  
  export interface PurchaseOrder {
    id: string
    listingId: string
    buyerId: string
    sellerId: string
    quantity: number
    totalAmount: number
    status: OrderStatus
    escrowTxHash?: string
    deliveryAddress?: string
    deliveryDate?: string
    createdAt: string
    updatedAt: string
  }
  
  export type OrderStatus = 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'completed' | 'disputed' | 'cancelled'
  
  // Financial Types
  export interface Transaction {
    id: string
    userId: string
    type: TransactionType
    amount: number
    currency: 'NGN' | 'USDC'
    status: TransactionStatus
    description: string
    blockchainTxHash?: string
    relatedEntityId?: string // Could be crop ID, loan ID, etc.
    createdAt: string
  }
  
  export type TransactionType = 
    | 'sale' 
    | 'purchase' 
    | 'loan_disbursement' 
    | 'loan_payment' 
    | 'savings_contribution' 
    | 'savings_payout' 
    | 'insurance_premium' 
    | 'insurance_claim'
  
  export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled'
  
  export interface Loan {
    id: string
    borrowerId: string
    amount: number
    interestRate: number
    termMonths: number
    purpose: LoanPurpose
    status: LoanStatus
    approvalDate?: string
    disbursementDate?: string
    repaymentSchedule: RepaymentSchedule[]
    collateralCropId?: string
    smartContractAddress?: string
    createdAt: string
    updatedAt: string
  }
  
  export type LoanPurpose = 'seeds' | 'fertilizer' | 'equipment' | 'labor' | 'processing' | 'storage' | 'other'
  export type LoanStatus = 'pending' | 'approved' | 'active' | 'completed' | 'defaulted' | 'rejected'
  
  export interface RepaymentSchedule {
    dueDate: string
    amount: number
    status: 'pending' | 'paid' | 'overdue'
    paidDate?: string
    paidAmount?: number
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
    status: 'active' | 'completed' | 'paused'
    createdAt: string
  }
  
  export interface Insurance {
    id: string
    farmerId: string
    cropId: string
    type: InsuranceType
    coverage: number
    premium: number
    startDate: string
    endDate: string
    status: InsuranceStatus
    claims?: InsuranceClaim[]
    smartContractAddress?: string
    createdAt: string
  }
  
  export type InsuranceType = 'drought' | 'flood' | 'pest' | 'disease' | 'comprehensive'
  export type InsuranceStatus = 'active' | 'expired' | 'claimed' | 'cancelled'
  
  export interface InsuranceClaim {
    id: string
    insuranceId: string
    claimAmount: number
    reason: string
    evidence?: string[]
    status: 'pending' | 'approved' | 'rejected' | 'paid'
    submittedAt: string
    processedAt?: string
  }
  
  // Community Types
  export interface Discussion {
    id: string
    authorId: string
    authorName: string
    authorLocation: string
    title: string
    content: string
    category: DiscussionCategory
    tags: string[]
    likes: number
    replies: Reply[]
    isVerified: boolean
    createdAt: string
    updatedAt: string
  }
  
  export type DiscussionCategory = 'general' | 'pest-control' | 'soil-management' | 'market-prices' | 'equipment' | 'weather'
  
  export interface Reply {
    id: string
    authorId: string
    authorName: string
    content: string
    likes: number
    createdAt: string
  }
  
  export interface KnowledgeArticle {
    id: string
    title: string
    content: string
    author: string
    authorType: 'farmer' | 'expert' | 'extension-worker'
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
  
  // Weather Types
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
    alerts?: WeatherAlert[]
  }
  
  export interface WeatherForecast {
    date: string
    maxTemp: number
    minTemp: number
    rainfall: number
    condition: string
    icon: string
  }
  
  export interface WeatherAlert {
    id: string
    type: 'drought' | 'flood' | 'storm' | 'temperature'
    severity: 'low' | 'medium' | 'high'
    message: string
    startDate: string
    endDate: string
    affectedStates: string[]
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    error?: string
  }
  
  export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
  
  // Form Types
  export interface CropForm {
    type: string
    variety: string
    plantingDate: string
    expectedHarvest: string
    farmSize: string
    location: string
    notes?: string
  }
  
  export interface LoanApplicationForm {
    amount: string
    purpose: LoanPurpose
    termMonths: string
    collateralCropId?: string
    businessPlan?: string
  }
  
  export interface RegistrationForm {
    name: string
    phoneNumber: string
    email?: string
    state: string
    lga: string
    farmSize: string
    primaryCrops: string[]
    hasLandDocuments: boolean
  }