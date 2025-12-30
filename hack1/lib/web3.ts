// Web3 Integration for FarmChain Latina
import { ethers, BrowserProvider, Signer, formatEther, parseEther } from 'ethers'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// Types for Web3 integration
export interface WalletConnection {
  address: string
  provider: BrowserProvider
  signer: Signer
  chainId: number
}

export interface SmartContractAddresses {
  farmToken: string
  loanContract: string
  savingsContract: string
  marketplaceContract: string
  insuranceContract: string
}

// Smart contract addresses (replace with your deployed contracts)
export const CONTRACT_ADDRESSES: SmartContractAddresses = {
  farmToken: '0x1234567890123456789012345678901234567890',
  loanContract: '0x2345678901234567890123456789012345678901',
  savingsContract: '0x3456789012345678901234567890123456789012',
  marketplaceContract: '0x4567890123456789012345678901234567890123',
  insuranceContract: '0x5678901234567890123456789012345678901234'
}

// Supported networks
export const SUPPORTED_NETWORKS = {
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com/',
    currency: 'MATIC'
  },
  mumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    currency: 'MATIC'
  },
  bsc: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    currency: 'BNB'
  }
}

class Web3Service {
  private provider: BrowserProvider | null = null
  private signer: Signer | null = null
  private userAddress: string | null = null

  // Connect to MetaMask or other Web3 wallet
  async connectWallet(): Promise<WalletConnection> {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet')
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      this.provider = new BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      this.userAddress = await this.signer.getAddress()
      
      // Get network info
      const network = await this.provider.getNetwork()
      
      console.log('Wallet connected:', {
        address: this.userAddress,
        chainId: Number(network.chainId),
        network: network.name
      })

      return {
        address: this.userAddress,
        provider: this.provider,
        signer: this.signer,
        chainId: Number(network.chainId)
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.provider = null
    this.signer = null
    this.userAddress = null
  }

  // Get current wallet connection status
  async getWalletStatus(): Promise<WalletConnection | null> {
    try {
      if (!window.ethereum || !this.provider) {
        return null
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
      if (accounts.length === 0) {
        return null
      }

      const network = await this.provider.getNetwork()
      return {
        address: accounts[0],
        provider: this.provider,
        signer: this.signer!,
        chainId: Number(network.chainId)
      }
    } catch (error) {
      console.error('Error getting wallet status:', error)
      return null
    }
  }

  // Switch to supported network
  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (!window.ethereum) throw new Error('Wallet not available')
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
    } catch (error: any) {
      // Network not added to wallet
      if (error.code === 4902) {
        const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId)
        if (network) {
          await this.addNetwork(network)
        }
      }
      throw error
    }
  }

  // Add network to wallet
  private async addNetwork(network: any): Promise<void> {
    if (!window.ethereum) throw new Error('Wallet not available')
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.name,
        rpcUrls: [network.rpcUrl],
        nativeCurrency: {
          name: network.currency,
          symbol: network.currency,
          decimals: 18
        }
      }]
    })
  }

  // Get contract instance
  getContract(address: string, abi: any): ethers.Contract {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }
    return new ethers.Contract(address, abi, this.signer)
  }

  // Get user's token balance
  async getTokenBalance(tokenAddress: string): Promise<string> {
    if (!this.provider || !this.userAddress) {
      throw new Error('Wallet not connected')
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    )

    const balance = await tokenContract.balanceOf(this.userAddress)
    return formatEther(balance)
  }

  // Send transaction
  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    const tx = await this.signer.sendTransaction({
      to,
      value: parseEther(value),
      data: data || '0x'
    })

    return tx.hash
  }
}

// Global Web3 service instance
export const web3Service = new Web3Service()

// Utility functions
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatBalance = (balance: string, decimals: number = 4): string => {
  const num = parseFloat(balance)
  return num.toFixed(decimals)
}

// Contract ABIs (add your actual contract ABIs here)
export const CONTRACT_ABIS = {
  farmToken: [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)'
  ],
  loanContract: [
    'function applyForLoan(uint256 amount, string purpose) returns (uint256)',
    'function repayLoan(uint256 loanId) payable',
    'function getLoanDetails(uint256 loanId) view returns (tuple)'
  ],
  savingsContract: [
    'function joinGroup(uint256 groupId) payable',
    'function makeContribution(uint256 groupId) payable',
    'function createGroup(string name, uint256 contribution) returns (uint256)'
  ]
}
