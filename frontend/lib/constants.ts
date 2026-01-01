// Nigerian States
export const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ] as const
  
  // Major Nigerian Crops
  export const NIGERIAN_CROPS = [
    { 
      name: 'Maize', 
      varieties: ['White Maize', 'Yellow Maize', 'Sweet Corn'],
      season: 'Rainy',
      regions: ['North', 'Middle Belt'],
      emoji: '🌽'
    },
    { 
      name: 'Cassava', 
      varieties: ['TMS 30572', 'TMS 98/0505', 'TMS 30001', 'TME 419'],
      season: 'Year Round',
      regions: ['South', 'Middle Belt'],
      emoji: '🍠'
    },
    { 
      name: 'Rice', 
      varieties: ['FARO 44', 'FARO 52', 'NERICA 1', 'NERICA 2'],
      season: 'Rainy',
      regions: ['North', 'South'],
      emoji: '🌾'
    },
    { 
      name: 'Yam', 
      varieties: ['Water Yam', 'White Yam', 'Yellow Yam', 'Aerial Yam'],
      season: 'Early Rainy',
      regions: ['Middle Belt', 'South'],
      emoji: '🥔'
    },
    { 
      name: 'Millet', 
      varieties: ['Pearl Millet', 'Finger Millet'],
      season: 'Dry/Early Rainy',
      regions: ['North'],
      emoji: '🌾'
    },
    { 
      name: 'Sorghum', 
      varieties: ['Guinea Corn', 'Sweet Sorghum'],
      season: 'Rainy',
      regions: ['North', 'Middle Belt'],
      emoji: '🌾'
    },
    { 
      name: 'Cocoa', 
      varieties: ['Amelonado', 'Trinitario', 'Forastero'],
      season: 'Year Round',
      regions: ['South'],
      emoji: '🍫'
    },
    { 
      name: 'Oil Palm', 
      varieties: ['Tenera', 'Dura', 'Pisifera'],
      season: 'Year Round',
      regions: ['South'],
      emoji: '🌴'
    }
  ] as const
  
  // Blockchain Configuration
  export const BLOCKCHAIN_CONFIG = {
    POLYGON_MAINNET: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com/',
      blockExplorer: 'https://polygonscan.com'
    },
    POLYGON_TESTNET: {
      chainId: 80001,
      name: 'Polygon Mumbai',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
      blockExplorer: 'https://mumbai.polygonscan.com'
    }
  }
  
  // Smart Contract Addresses (Testnet)
  export const CONTRACT_ADDRESSES = {
    FARMER_REGISTRY: '0x742d35Cc6554C0532925a3b8C0d561C75226b5C9',
    CROP_TRACKER: '0x8ba1f109551bD432803012645Hac136c30C6A043',
    MARKETPLACE: '0x147a18c851d5B9C0532925a3b8C0d561C75226b5C9',
    PAYMENT_ESCROW: '0x456a18c851d5B9C0532925a3b8C0d561C75226b5C9'
  }
  
  // API Endpoints
  export const API_ENDPOINTS = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    WEATHER: '/weather',
    FARMERS: '/farmers',
    CROPS: '/crops',
    MARKETPLACE: '/marketplace',
    TRANSACTIONS: '/transactions',
    LOANS: '/loans',
    SAVINGS: '/savings',
    INSURANCE: '/insurance'
  }
  
  // Nigerian Agricultural Seasons
  export const FARMING_SEASONS = {
    NORTH: {
      DRY_SEASON: { start: 'November', end: 'March', crops: ['Millet', 'Sorghum', 'Wheat'] },
      RAINY_SEASON: { start: 'April', end: 'October', crops: ['Maize', 'Rice', 'Cotton'] }
    },
    MIDDLE_BELT: {
      EARLY_RAINY: { start: 'March', end: 'July', crops: ['Yam', 'Maize', 'Rice'] },
      LATE_RAINY: { start: 'August', end: 'November', crops: ['Cassava', 'Sweet Potato'] }
    },
    SOUTH: {
      FIRST_RAINY: { start: 'March', end: 'July', crops: ['Cassava', 'Plantain', 'Cocoa'] },
      SECOND_RAINY: { start: 'September', end: 'November', crops: ['Yam', 'Maize'] }
    }
  }
  
  // Quality Grades
  export const QUALITY_GRADES = [
    { value: 'premium', label: 'Premium', color: 'green' },
    { value: 'grade-a', label: 'Grade A', color: 'blue' },
    { value: 'grade-b', label: 'Grade B', color: 'yellow' },
    { value: 'grade-c', label: 'Grade C', color: 'orange' }
  ] as const
  
  // Transaction Types
  export const TRANSACTION_TYPES = {
    SALE: 'Sale',
    PURCHASE: 'Purchase',
    LOAN_DISBURSEMENT: 'Loan Disbursement',
    LOAN_PAYMENT: 'Loan Payment',
    SAVINGS_CONTRIBUTION: 'Savings Contribution',
    SAVINGS_PAYOUT: 'Savings Payout',
    INSURANCE_PREMIUM: 'Insurance Premium',
    INSURANCE_CLAIM: 'Insurance Claim'
  } as const
  
  // Languages supported
  export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' }
  ] as const
  
  // USSD Configuration
  export const USSD_CONFIG = {
    SHORT_CODE: '*347*123#',
    MENU_STRUCTURE: {
      MAIN: {
        '1': 'Register Farm',
        '2': 'Record Crop',
        '3': 'Check Market',
        '4': 'View Wallet',
        '5': 'Weather Info',
        '6': 'Get Help'
      }
    }
  }
  
  // Default farmer profile
  export const DEFAULT_FARMER_PROFILE = {
    name: '',
    phoneNumber: '',
    location: {
      state: '',
      lga: '',
      coordinates: [0, 0]
    },
    farmSize: 0,
    crops: [],
    verificationStatus: 'pending',
    walletAddress: '',
    joinedAt: new Date().toISOString()
  }