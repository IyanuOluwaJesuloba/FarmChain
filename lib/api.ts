// Backend API Integration for FarmChain Latina

// UserData interface (matching Auth component)
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

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserRegistration extends UserData {
  walletAddress: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
  walletAddress?: string
}

export interface TransactionData {
  hash: string
  type: 'loan' | 'savings' | 'marketplace' | 'insurance'
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  userId: string
}

class ApiService {
  private baseUrl: string
  private authToken: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.loadAuthToken()
  }

  // Load auth token from localStorage
  private loadAuthToken(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('farmchain_auth_token')
    }
  }

  // Save auth token to localStorage
  private saveAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmchain_auth_token', token)
      this.authToken = token
    }
  }

  // Remove auth token
  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farmchain_auth_token')
      this.authToken = null
    }
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Add any additional headers from options
      if (options.headers) {
        Object.assign(headers, options.headers)
      }

      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // User Authentication APIs
  async registerUser(userData: UserRegistration): Promise<ApiResponse<{ user: UserData; token: string }>> {
    const response = await this.request<{ user: UserData; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    if (response.success && response.data?.token) {
      this.saveAuthToken(response.data.token)
    }

    return response
  }

  async loginUser(credentials: LoginCredentials): Promise<ApiResponse<{ user: UserData; token: string }>> {
    const response = await this.request<{ user: UserData; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    if (response.success && response.data?.token) {
      this.saveAuthToken(response.data.token)
    }

    return response
  }

  async logoutUser(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' })
    this.clearAuthToken()
  }

  async verifyToken(): Promise<ApiResponse<{ user: UserData }>> {
    return this.request<{ user: UserData }>('/auth/verify')
  }

  // User Profile APIs
  async updateUserProfile(userData: Partial<UserData>): Promise<ApiResponse<UserData>> {
    return this.request<UserData>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }

  async getUserProfile(): Promise<ApiResponse<UserData>> {
    return this.request<UserData>('/user/profile')
  }

  // Wallet APIs
  async linkWallet(walletAddress: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>('/user/wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress })
    })
  }

  async getWalletTransactions(walletAddress: string): Promise<ApiResponse<TransactionData[]>> {
    return this.request<TransactionData[]>(`/wallet/transactions/${walletAddress}`)
  }

  // Loan APIs
  async applyForLoan(loanData: {
    amount: number
    purpose: string
    term: number
    walletAddress: string
  }): Promise<ApiResponse<{ loanId: string; txHash: string }>> {
    return this.request<{ loanId: string; txHash: string }>('/loans/apply', {
      method: 'POST',
      body: JSON.stringify(loanData)
    })
  }

  async getUserLoans(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/loans/user')
  }

  // Savings APIs
  async joinSavingsGroup(groupId: string, walletAddress: string): Promise<ApiResponse<{ txHash: string }>> {
    return this.request<{ txHash: string }>('/savings/join', {
      method: 'POST',
      body: JSON.stringify({ groupId, walletAddress })
    })
  }

  async getSavingsGroups(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/savings/groups')
  }

  async createSavingsGroup(groupData: {
    name: string
    contribution: number
    walletAddress: string
  }): Promise<ApiResponse<{ groupId: string; txHash: string }>> {
    return this.request<{ groupId: string; txHash: string }>('/savings/create', {
      method: 'POST',
      body: JSON.stringify(groupData)
    })
  }

  // Marketplace APIs
  async listCrop(cropData: {
    name: string
    quantity: number
    price: number
    description: string
    walletAddress: string
  }): Promise<ApiResponse<{ listingId: string; txHash: string }>> {
    return this.request<{ listingId: string; txHash: string }>('/marketplace/list', {
      method: 'POST',
      body: JSON.stringify(cropData)
    })
  }

  async getMarketplaceListings(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/marketplace/listings')
  }

  // Transaction tracking
  async recordTransaction(txData: TransactionData): Promise<ApiResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>('/transactions/record', {
      method: 'POST',
      body: JSON.stringify(txData)
    })
  }

  async getTransactionStatus(txHash: string): Promise<ApiResponse<{ status: string; confirmations: number }>> {
    return this.request<{ status: string; confirmations: number }>(`/transactions/status/${txHash}`)
  }

  // Analytics APIs
  async getUserAnalytics(): Promise<ApiResponse<{
    totalEarnings: number
    totalTransactions: number
    activeLoans: number
    savingsBalance: number
  }>> {
    return this.request<{
      totalEarnings: number
      totalTransactions: number
      activeLoans: number
      savingsBalance: number
    }>('/analytics/user')
  }
}

// Global API service instance
export const apiService = new ApiService()

// Utility functions for API integration
export const handleApiError = (error: string): string => {
  switch (error) {
    case 'WALLET_NOT_CONNECTED':
      return 'Please connect your wallet first'
    case 'INSUFFICIENT_BALANCE':
      return 'Insufficient balance for this transaction'
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password'
    case 'USER_EXISTS':
      return 'User with this email already exists'
    case 'WALLET_ALREADY_LINKED':
      return 'This wallet is already linked to another account'
    default:
      return error || 'An unexpected error occurred'
  }
}

// API endpoints for reference
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify'
  },
  USER: {
    PROFILE: '/user/profile',
    WALLET: '/user/wallet'
  },
  LOANS: {
    APPLY: '/loans/apply',
    USER_LOANS: '/loans/user',
    REPAY: '/loans/repay'
  },
  SAVINGS: {
    GROUPS: '/savings/groups',
    JOIN: '/savings/join',
    CREATE: '/savings/create',
    CONTRIBUTE: '/savings/contribute'
  },
  MARKETPLACE: {
    LISTINGS: '/marketplace/listings',
    LIST: '/marketplace/list',
    PURCHASE: '/marketplace/purchase'
  },
  TRANSACTIONS: {
    RECORD: '/transactions/record',
    STATUS: '/transactions/status',
    HISTORY: '/transactions/history'
  },
  ANALYTICS: {
    USER: '/analytics/user',
    DASHBOARD: '/analytics/dashboard'
  }
}
