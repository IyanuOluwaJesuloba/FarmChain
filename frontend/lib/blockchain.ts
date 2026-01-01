// Blockchain utility functions for FarmChain Nigeria
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, BLOCKCHAIN_CONFIG } from './constants'

// Extend Window interface for MetaMask
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (event: string, callback: (...args: unknown[]) => void) => void
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

// Smart Contract ABIs (simplified for demo)
export const FARMER_REGISTRY_ABI = [
  "function registerFarmer(string memory name, string memory location, string[] memory crops) external",
  "function verifyFarmer(address farmer) external",
  "function getFarmerData(address farmer) external view returns (string memory, string memory, string[] memory, bool)",
  "function updateFarmerProfile(string memory name, string memory location, string[] memory crops) external"
]

export const CROP_TRACKER_ABI = [
  "function recordPlanting(string memory cropType, string memory variety, uint256 plantingDate, uint256 farmSize) external returns (uint256)",
  "function updateCropStatus(uint256 cropId, uint8 status, string memory notes) external",
  "function recordHarvest(uint256 cropId, uint256 quantity, uint8 qualityGrade) external",
  "function getCropHistory(uint256 cropId) external view returns (string memory, string memory, uint256, uint256, uint8, uint256, uint8)"
]

export const MARKETPLACE_ABI = [
  "function listCrop(uint256 cropId, uint256 quantity, uint256 pricePerUnit, string memory description) external",
  "function makePurchase(uint256 listingId, uint256 quantity) external payable",
  "function confirmDelivery(uint256 orderId) external",
  "function releaseFunds(uint256 orderId) external",
  "function getListingDetails(uint256 listingId) external view returns (address, uint256, uint256, uint256, bool)"
]

export const PAYMENT_ESCROW_ABI = [
  "function createEscrow(address buyer, address seller, uint256 amount, uint256 orderId) external",
  "function releaseToSeller(uint256 escrowId) external",
  "function refundToBuyer(uint256 escrowId) external",
  "function getEscrowStatus(uint256 escrowId) external view returns (uint8, uint256, address, address)"
]

// Blockchain connection utilities
export class BlockchainService {
  private provider: ethers.JsonRpcProvider
  private signer?: ethers.Signer
  
  constructor(isTestnet = true) {
    const config = isTestnet ? BLOCKCHAIN_CONFIG.POLYGON_TESTNET : BLOCKCHAIN_CONFIG.POLYGON_MAINNET
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)
  }

  async connectWallet(): Promise<{ address: string; signer: ethers.Signer }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask to continue.')
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }
      
      // Switch to Polygon network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }], // Polygon Mainnet
        })
      } catch (switchError: unknown) {
        // If chain doesn't exist, add it
        const err = switchError as { code?: number }
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }]
          })
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      this.signer = signer
      return { address, signer }
    } catch (error: unknown) {
      console.error('Wallet connection error:', error)
      const err = error as { code?: number; message?: string }
      if (err.code === 4001) {
        throw new Error('User rejected the connection request')
      }
      if (err.code === -32002) {
        throw new Error('MetaMask is already processing a request. Please check MetaMask.')
      }
      throw new Error(`Failed to connect wallet: ${err.message || 'Unknown error'}`)
    }
  }

  // Farmer Registry Contract Functions
  async registerFarmer(name: string, location: string, crops: string[]): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.FARMER_REGISTRY,
      FARMER_REGISTRY_ABI,
      this.signer
    )

    try {
      const tx = await contract.registerFarmer(name, location, crops)
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('Register farmer error:', error)
      throw new Error('Failed to register farmer on blockchain')
    }
  }

  async getFarmerData(address: string) {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.FARMER_REGISTRY,
      FARMER_REGISTRY_ABI,
      this.provider
    )

    try {
      const data = await contract.getFarmerData(address)
      return {
        name: data[0],
        location: data[1],
        crops: data[2],
        isVerified: data[3]
      }
    } catch (error: unknown) {
      console.error('Fetch farmer data error:', error)
      throw new Error('Failed to fetch farmer data')
    }
  }

  // Crop Tracker Contract Functions
  async recordPlanting(
    cropType: string, 
    variety: string, 
    plantingDate: Date, 
    farmSize: number
  ): Promise<{ txHash: string; cropId: number }> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.CROP_TRACKER,
      CROP_TRACKER_ABI,
      this.signer
    )

    try {
      const timestamp = Math.floor(plantingDate.getTime() / 1000)
      const farmSizeWei = ethers.parseUnits(farmSize.toString(), 2) // 2 decimals for hectares
      
      const tx = await contract.recordPlanting(cropType, variety, timestamp, farmSizeWei)
      const receipt = await tx.wait()
      
      // Extract crop ID from event logs
      const cropId = receipt.events?.[0]?.args?.[0] || 0
      
      return {
        txHash: tx.hash,
        cropId: cropId.toNumber()
      }
    } catch (error: unknown) {
      console.error('Record planting error:', error)
      throw new Error('Failed to record crop planting')
    }
  }

  async updateCropStatus(cropId: number, status: number, notes: string): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.CROP_TRACKER,
      CROP_TRACKER_ABI,
      this.signer
    )

    try {
      const tx = await contract.updateCropStatus(cropId, status, notes)
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('Update crop status error:', error)
      throw new Error('Failed to update crop status')
    }
  }

  // Marketplace Contract Functions
  async listCrop(
    cropId: number, 
    quantity: number, 
    pricePerUnit: number, 
    description: string
  ): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MARKETPLACE,
      MARKETPLACE_ABI,
      this.signer
    )

    try {
      const priceWei = ethers.parseEther(pricePerUnit.toString())
      
      const tx = await contract.listCrop(cropId, quantity, priceWei, description)
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('List crop error:', error)
      throw new Error(`Failed to list crop: ${handleBlockchainError(error)}`)
    }
  }

  async makePurchase(listingId: number, quantity: number, totalAmount: number): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MARKETPLACE,
      MARKETPLACE_ABI,
      this.signer
    )

    try {
      const amountWei = ethers.parseEther(totalAmount.toString())
      const tx = await contract.makePurchase(listingId, quantity, { value: amountWei })
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('Make purchase error:', error)
      throw new Error('Failed to make purchase')
    }
  }

  // Escrow Contract Functions
  async createEscrow(
    buyer: string, 
    seller: string, 
    amount: number, 
    orderId: number
  ): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.PAYMENT_ESCROW,
      PAYMENT_ESCROW_ABI,
      this.signer
    )

    try {
      const amountWei = ethers.parseEther(amount.toString())
      const tx = await contract.createEscrow(buyer, seller, amountWei, orderId)
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('Create escrow error:', error)
      throw new Error('Failed to create escrow')
    }
  }

  async releaseEscrow(escrowId: number): Promise<string> {
    if (!this.signer) throw new Error('Wallet not connected')
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.PAYMENT_ESCROW,
      PAYMENT_ESCROW_ABI,
      this.signer
    )

    try {
      const tx = await contract.releaseToSeller(escrowId)
      await tx.wait()
      return tx.hash
    } catch (error: unknown) {
      console.error('Release escrow error:', error)
      throw new Error('Failed to release escrow')
    }
  }

  // Utility Functions
  async getTransactionReceipt(txHash: string) {
    try {
      return await this.provider.getTransactionReceipt(txHash)
    } catch (error: unknown) {
      console.error('Get transaction receipt error:', error)
      throw new Error('Failed to get transaction receipt')
    }
  }

  async getBlockchainStatus(): Promise<{ blockNumber: number; gasPrice: string }> {
    try {
      const blockNumber = await this.provider.getBlockNumber()
      const feeData = await this.provider.getFeeData()
      
      return {
        blockNumber,
        gasPrice: ethers.formatUnits(feeData.gasPrice || BigInt(0), 'gwei')
      }
    } catch (error: unknown) {
      console.error('Get blockchain status error:', error)
      throw new Error('Failed to get blockchain status')
    }
  }

  // Format utilities
  static formatEther(value: bigint): string {
    try {
      return ethers.formatEther(value)
    } catch (error: unknown) {
      console.error('Error formatting ether value:', error)
      return '0.0'
    }
  }

  static parseEther(value: string): bigint {
    return ethers.parseEther(value)
  }

  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address)
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService(process.env.NODE_ENV !== 'production')

// Utility functions for status mapping
export const cropStatusToBlockchain = (status: string): number => {
  const statusMap: { [key: string]: number } = {
    'planned': 0,
    'planted': 1,
    'growing': 2,
    'mature': 3,
    'harvested': 4,
    'sold': 5
  }
  return statusMap[status] || 1
}

export const blockchainToCropStatus = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    0: 'planned',
    1: 'planted',
    2: 'growing',
    3: 'mature',
    4: 'harvested',
    5: 'sold'
  }
  return statusMap[status] || 'unknown'
}

export const qualityGradeToBlockchain = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    'premium': 0,
    'grade-a': 1,
    'grade-b': 2,
    'grade-c': 3
  }
  return gradeMap[grade] || 1
}

// Smart contract event listeners
export const setupEventListeners = (blockchainService: BlockchainService) => {
  // Listen for farmer registration events
  const farmerRegistry = new ethers.Contract(
    CONTRACT_ADDRESSES.FARMER_REGISTRY,
    FARMER_REGISTRY_ABI,
    blockchainService['provider']
  )

  farmerRegistry.on('FarmerRegistered', (farmer, name, timestamp) => {
    console.log('New farmer registered:', { farmer, name, timestamp })
    // Handle farmer registration event
  })

  // Listen for crop recording events
  const cropTracker = new ethers.Contract(
    CONTRACT_ADDRESSES.CROP_TRACKER,
    CROP_TRACKER_ABI,
    blockchainService['provider']
  )

  cropTracker.on('CropRecorded', (cropId, farmer, cropType, timestamp) => {
    console.log('New crop recorded:', { cropId, farmer, cropType, timestamp })
    // Handle crop recording event
  })

  // Listen for marketplace events
  const marketplace = new ethers.Contract(
    CONTRACT_ADDRESSES.MARKETPLACE,
    MARKETPLACE_ABI,
    blockchainService['provider']
  )

  marketplace.on('CropListed', (listingId, farmer, cropId, price) => {
    console.log('Crop listed:', { listingId, farmer, cropId, price })
    // Handle crop listing event
  })

  marketplace.on('PurchaseMade', (orderId, buyer, seller, amount) => {
    console.log('Purchase made:', { orderId, buyer, seller, amount })
    // Handle purchase event
  })
}

// Error handling utilities
export const handleBlockchainError = (error: unknown): string => {
  const err = error as { code?: number; message?: string }
  if (err.code === 4001) {
    return 'Transaction rejected by user'
  }
  if (err.code === -32603) {
    return 'Transaction failed. Please check your balance and try again.'
  }
  if (err.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  if (err.message?.includes('user rejected')) {
    return 'Transaction rejected by user'
  }
  return 'Blockchain transaction failed. Please try again.'
}

// Gas estimation utilities
export const estimateGas = async (
  contract: ethers.Contract, 
  method: string, 
  params: unknown[]
): Promise<bigint> => {
  try {
    return await contract[method].estimateGas(...params)
  } catch (error: unknown) {
    console.error('Gas estimation error:', error)
    // Return default gas limit if estimation fails
    return BigInt('200000')
  }
}

// Transaction monitoring
export const waitForTransaction = async (
  provider: ethers.Provider,
  txHash: string,
  confirmations = 1,
  timeout = 300000 // 5 minutes default timeout
): Promise<ethers.TransactionReceipt> => {
  try {
    // Validate transaction hash format
    if (!txHash || !ethers.isHexString(txHash, 32)) {
      throw new Error('Invalid transaction hash format')
    }
    
    const receipt = await provider.waitForTransaction(txHash, confirmations, timeout)
    if (!receipt) {
      throw new Error('Transaction not found or timed out')
    }
    
    // Check if transaction was successful
    if (receipt.status === 0) {
      throw new Error('Transaction was reverted')
    }
    
    return receipt
  } catch (error: unknown) {
    console.error('Transaction wait error:', error)
    const err = error as { code?: string; message?: string }
    if (err.code === 'TIMEOUT') {
      throw new Error('Transaction confirmation timed out. It may still be pending.')
    }
    throw new Error(`Transaction failed: ${err.message || 'Unknown error'}`)
  }
}