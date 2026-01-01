import { User, Crop, MarketplaceListing, Transaction, Loan, SavingsGroup, Discussion, KnowledgeArticle } from '@/types'

// Mock Users/Farmers
export const mockFarmers: User[] = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6554C0532925a3b8C0d561C75226b5C9',
    phoneNumber: '+57312456789',
    name: 'Carlos Mendoza',
    location: {
      state: 'Antioquia',
      lga: 'Medellín',
      coordinates: [-75.5636, 6.2442]
    },
    farmSize: 5.5,
    crops: ['Coffee', 'Avocado', 'Plantain'],
    verificationStatus: 'verified',
    joinedAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-08-28T14:30:00Z'
  },
  {
    id: '2',
    walletAddress: '0x8ba1f109551bD432803012645Hac136c30C6A043',
    phoneNumber: '+52155987654',
    name: 'María González',
    email: 'maria@email.com',
    location: {
      state: 'Veracruz',
      lga: 'Xalapa',
      coordinates: [-96.9147, 19.5438]
    },
    farmSize: 3.2,
    crops: ['Cacao', 'Vanilla', 'Citrus'],
    verificationStatus: 'verified',
    joinedAt: '2025-02-20T08:15:00Z',
    updatedAt: '2025-08-29T11:20:00Z'
  },
  {
    id: '3',
    walletAddress: '0x147a18c851d5B9C0532925a3b8C0d561C75226b5C9',
    phoneNumber: '+5491123456789',
    name: 'Ana Rodriguez',
    location: {
      state: 'Buenos Aires',
      lga: 'La Plata',
      coordinates: [-57.9544, -34.9214]
    },
    farmSize: 2.8,
    crops: ['Soybeans', 'Corn', 'Quinoa'],
    verificationStatus: 'pending',
    joinedAt: '2025-08-01T16:45:00Z',
    updatedAt: '2025-08-28T09:10:00Z'
  }
]

// Mock Crops
export const mockCrops: Crop[] = [
  {
    id: 'crop_1',
    farmerId: '1',
    blockchainTxHash: '0x8f2a9b4c851d5B9C0532925a3b8C0d561C75226b5C9',
    cropType: 'Coffee',
    variety: 'Arabica Typica',
    plantingDate: '2025-06-15',
    expectedHarvest: '2025-12-15',
    farmLocation: {
      state: 'Antioquia',
      lga: 'Medellín',
      coordinates: [-75.5636, 6.2442]
    },
    farmSize: 2.5,
    status: 'growing',
    qualityGrade: 'grade-a',
    createdAt: '2025-06-15T06:00:00Z',
    updatedAt: '2025-08-28T14:30:00Z'
  },
  {
    id: 'crop_2',
    farmerId: '2',
    blockchainTxHash: '0x9c3b8a5d962e6C1643036756Bdf247d41D7E8F4A',
    cropType: 'Cacao',
    variety: 'Trinitario',
    plantingDate: '2025-03-20',
    expectedHarvest: '2025-11-20',
    farmLocation: {
      state: 'Veracruz',
      lga: 'Xalapa',
      coordinates: [-96.9147, 19.5438]
    },
    farmSize: 1.8,
    status: 'mature',
    qualityGrade: 'premium',
    quantity: 500,
    unit: 'kg',
    createdAt: '2025-03-20T07:30:00Z',
    updatedAt: '2025-08-25T16:15:00Z'
  }
]

// Mock Marketplace Listings
export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'listing_1',
    cropId: 'crop_1',
    farmerId: '1',
    farmerName: 'Carlos Mendoza',
    cropType: 'Coffee',
    variety: 'Arabica Typica',
    quantity: 50,
    unit: 'bags',
    pricePerUnit: 45,
    totalPrice: 2250,
    qualityGrade: 'grade-a',
    harvestDate: '2025-12-15',
    availableDate: '2025-12-16',
    location: {
      state: 'Antioquia',
      lga: 'Medellín',
      coordinates: [-75.5636, 6.2442]
    },
    isActive: true,
    createdAt: '2025-08-28T10:00:00Z',
    updatedAt: '2025-08-28T10:00:00Z'
  },
  {
    id: 'listing_2',
    cropId: 'crop_2',
    farmerId: '2',
    farmerName: 'María González',
    cropType: 'Cacao',
    variety: 'Trinitario',
    quantity: 100,
    unit: 'kg',
    pricePerUnit: 8,
    totalPrice: 800,
    qualityGrade: 'premium',
    harvestDate: '2025-11-20',
    availableDate: '2025-11-21',
    location: {
      state: 'Veracruz',
      lga: 'Xalapa',
      coordinates: [-96.9147, 19.5438]
    },
    isActive: true,
    createdAt: '2025-08-25T14:20:00Z',
    updatedAt: '2025-08-25T14:20:00Z'
  }
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    userId: '1',
    type: 'sale',
    amount: 2250,
    currency: 'USD',
    status: 'confirmed',
    description: 'Coffee Sale - Bogotá Buyer',
    blockchainTxHash: '0x7d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
    relatedEntityId: 'listing_1',
    createdAt: '2025-08-28T12:30:00Z'
  },
  {
    id: 'tx_2',
    userId: '1',
    type: 'loan_disbursement',
    amount: 5000,
    currency: 'USD',
    status: 'confirmed',
    description: 'Crop Loan Disbursement',
    blockchainTxHash: '0x8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    relatedEntityId: 'loan_1',
    createdAt: '2025-08-20T09:15:00Z'
  }
]

// Mock Loans
export const mockLoans: Loan[] = [
  {
    id: 'loan_1',
    borrowerId: '1',
    amount: 5000,
    interestRate: 8,
    termMonths: 6,
    purpose: 'seeds',
    status: 'active',
    approvalDate: '2025-08-19T16:00:00Z',
    disbursementDate: '2025-08-20T09:15:00Z',
    repaymentSchedule: [
      { dueDate: '2025-09-20', amount: 850, status: 'pending' },
      { dueDate: '2025-10-20', amount: 850, status: 'pending' },
      { dueDate: '2025-11-20', amount: 850, status: 'pending' },
      { dueDate: '2025-12-20', amount: 850, status: 'pending' },
      { dueDate: '2026-01-20', amount: 850, status: 'pending' },
      { dueDate: '2026-02-20', amount: 850, status: 'pending' }
    ],
    collateralCropId: 'crop_1',
    smartContractAddress: '0x9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    createdAt: '2025-08-18T14:20:00Z',
    updatedAt: '2025-08-20T09:15:00Z'
  }
]

// Mock Savings Groups
export const mockSavingsGroups: SavingsGroup[] = [
  {
    id: 'group_1',
    name: 'Antioquia Coffee Farmers',
    description: 'Monthly contributions for coffee farming equipment and processing',
    creatorId: '1',
    monthlyContribution: 200,
    maxMembers: 30,
    currentMembers: ['1', '4', '5', '6', '7'],
    nextPayoutDate: '2025-09-15',
    payoutOrder: ['1', '4', '5', '6', '7'],
    location: 'Antioquia, Colombia',
    smartContractAddress: '0xa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
    status: 'active',
    createdAt: '2025-06-01T10:00:00Z'
  },
  {
    id: 'group_2',
    name: 'Veracruz Cacao Cooperative',
    description: 'Collective savings for cacao processing equipment',
    creatorId: '2',
    monthlyContribution: 150,
    maxMembers: 20,
    currentMembers: ['2', '8', '9', '10'],
    nextPayoutDate: '2025-10-01',
    payoutOrder: ['2', '8', '9', '10'],
    location: 'Veracruz, Mexico',
    smartContractAddress: '0xb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    status: 'active',
    createdAt: '2025-07-15T14:30:00Z'
  }
]

// Mock Discussions
export const mockDiscussions: Discussion[] = [
  {
    id: 'disc_1',
    authorId: '2',
    authorName: 'María González',
    authorLocation: 'Veracruz, Mexico',
    title: 'Best cacao varieties for humid tropical climate?',
    content: 'I\'m planning to expand my cacao farm but my region has high humidity. Which varieties perform best in humid tropical conditions? Looking for advice from experienced farmers.',
    category: 'soil-management',
    tags: ['cacao', 'climate', 'varieties'],
    likes: 15,
    replies: [
      {
        id: 'reply_1',
        authorId: '1',
        authorName: 'Carlos Mendoza',
        content: 'Trinitario works well in humid climates. I\'ve had good results with proper shade management.',
        likes: 8,
        createdAt: '2025-08-29T11:30:00Z'
      }
    ],
    isVerified: false,
    createdAt: '2025-08-29T09:15:00Z',
    updatedAt: '2025-08-29T11:30:00Z'
  },
  {
    id: 'disc_2',
    authorId: '1',
    authorName: 'Carlos Mendoza',
    authorLocation: 'Antioquia, Colombia',
    title: 'Coffee pest control during wet season',
    content: 'Sharing my experience with organic pest control methods that saved my last harvest from coffee berry borer attack. Here\'s what worked for me...',
    category: 'pest-control',
    tags: ['coffee', 'pest-control', 'organic'],
    likes: 23,
    replies: [],
    isVerified: true,
    createdAt: '2025-08-28T15:45:00Z',
    updatedAt: '2025-08-28T15:45:00Z'
  }
]

// Mock Knowledge Articles
export const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'article_1',
    title: 'Optimal Coffee Planting Times in Colombian Highlands',
    content: 'Complete guide to coffee planting schedules in Colombian coffee regions...',
    author: 'Dr. Roberto Café Expert',
    authorType: 'expert',
    category: 'Seasonal Guide',
    tags: ['coffee', 'colombia', 'timing'],
    views: 1234,
    likes: 89,
    isVerified: true,
    difficulty: 'beginner',
    estimatedReadTime: 5,
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-08-15T10:00:00Z'
  },
  {
    id: 'article_2',
    title: 'Cacao Processing: From Bean to Chocolate',
    content: 'Step-by-step guide to processing cacao beans for maximum profit in Latin American markets...',
    author: 'Dra. Elena Cacao Processing Expert',
    authorType: 'expert',
    category: 'Post-Harvest',
    tags: ['cacao', 'processing', 'chocolate'],
    views: 856,
    likes: 67,
    isVerified: true,
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    createdAt: '2025-08-10T14:20:00Z',
    updatedAt: '2025-08-10T14:20:00Z'
  }
]

// Mock Weather Data
export const mockWeatherData = {
  location: 'Medellín, Colombia',
  current: {
    temperature: 24,
    humidity: 78,
    rainfall: 0,
    windSpeed: 8,
    condition: 'Partly Cloudy',
    icon: '⛅'
  },
  forecast: [
    {
      date: '2025-08-31',
      maxTemp: 26,
      minTemp: 18,
      rainfall: 12,
      condition: 'Light Rain',
      icon: '🌦️'
    },
    {
      date: '2025-09-01',
      maxTemp: 28,
      minTemp: 20,
      rainfall: 0,
      condition: 'Sunny',
      icon: '☀️'
    },
    {
      date: '2025-09-02',
      maxTemp: 25,
      minTemp: 17,
      rainfall: 25,
      condition: 'Heavy Rain',
      icon: '🌧️'
    }
  ],
  alerts: [
    {
      id: 'alert_1',
      type: 'rainfall' as const,
      severity: 'medium' as const,
      message: 'Heavy rainfall expected in the next 48 hours. Ideal for coffee plants but protect drying beans.',
      startDate: '2025-09-02T00:00:00Z',
      endDate: '2025-09-03T23:59:59Z',
      affectedStates: ['Antioquia', 'Caldas', 'Risaralda']
    }
  ]
}

// API Response Helpers
export const createApiResponse = <T>(data: T, success = true, message?: string) => ({
  success,
  data,
  message
})

export const createPaginatedResponse = <T>(
  data: T[], 
  page = 1, 
  limit = 10, 
  total?: number
) => ({
  success: true,
  data: data.slice((page - 1) * limit, page * limit),
  pagination: {
    page,
    limit,
    total: total || data.length,
    pages: Math.ceil((total || data.length) / limit)
  }
})

// Helper functions for mock data
export const getFarmerById = (id: string): User | undefined => {
  return mockFarmers.find(farmer => farmer.id === id)
}

export const getCropsByFarmerId = (farmerId: string): Crop[] => {
  return mockCrops.filter(crop => crop.farmerId === farmerId)
}

export const getMarketplaceListings = (filters?: {
  location?: string
  cropType?: string
  search?: string
}): MarketplaceListing[] => {
  let listings = mockMarketplaceListings

  if (filters) {
    if (filters.location && filters.location !== 'all') {
      listings = listings.filter(listing => 
        listing.location.state.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
    if (filters.cropType && filters.cropType !== 'all') {
      listings = listings.filter(listing => 
        listing.cropType.toLowerCase().includes(filters.cropType!.toLowerCase())
      )
    }
    if (filters.search) {
      listings = listings.filter(listing => 
        listing.cropType.toLowerCase().includes(filters.search!.toLowerCase()) ||
        listing.farmerName.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }
  }

  return listings
}