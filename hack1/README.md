# FarmChain Nigeria 🌾

A blockchain-powered agricultural platform empowering Nigerian farmers with transparent crop management, direct market access, and financial inclusion.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/farmchain-nigeria.git
cd farmchain-nigeria

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
farmchain-nigeria/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API Routes
│   │   ├── farmers/route.ts      # Farmer management endpoints
│   │   ├── crops/route.ts        # Crop tracking endpoints
│   │   ├── marketplace/route.ts  # Marketplace endpoints
│   │   └── finance/route.ts      # Financial services endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React Components
│   ├── community/                # Community features
│   ├── finance/                  # Financial services
│   ├── ui/                       # Reusable UI components
│   ├── Navigation.tsx            # Main navigation
│   ├── LandingPage.tsx          # Landing page
│   ├── Dashboard.tsx            # Farmer dashboard
│   ├── CropsManagement.tsx      # Crop tracking
│   ├── Marketplace.tsx          # Crop marketplace
│   ├── Finance.tsx              # Financial services
│   └── Community.tsx            # Community platform
├── lib/                         # Utility functions
│   ├── constants.ts             # App constants
│   ├── mockData.ts             # Demo data
│   ├── blockchain.ts           # Blockchain utilities
│   └── utils.ts                # Helper functions
├── types/                       # TypeScript definitions
│   └── index.ts                # Type definitions
├── public/                      # Static assets
├── smart-contracts/             # Solidity contracts
│   ├── FarmerRegistry.sol
│   ├── CropTracker.sol
│   ├── Marketplace.sol
│   └── PaymentEscrow.sol
└── docs/                        # Documentation
    ├── API.md                   # API documentation
    ├── BLOCKCHAIN.md            # Blockchain integration guide
    └── DEPLOYMENT.md            # Deployment instructions
```

## 🌟 Key Features

### 🔐 Blockchain Integration
- **Farmer Identity**: Verified digital identity on Polygon blockchain
- **Crop Tracking**: Immutable crop lifecycle recording
- **Smart Contracts**: Automated escrow, loans, and insurance
- **Supply Chain**: End-to-end transparency from farm to market

### 🌾 Crop Management
- Digital crop documentation
- Growth progress tracking
- Quality grade recording
- Harvest optimization

### 🛒 Direct Marketplace
- Farmer-to-buyer direct sales
- Smart contract escrow system
- Quality verification
- Price discovery

### 💰 Financial Services
- **Micro-loans**: Smart contract-based lending
- **Esusu Groups**: Traditional savings groups on blockchain
- **Insurance**: Weather-indexed crop insurance
- **Digital Wallet**: Secure payment processing

### 👥 Community Platform
- Farmer knowledge sharing
- Expert agricultural advice
- Success story showcases
- Peer-to-peer learning

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Modern icons

### Blockchain
- **Polygon**: Low-cost, fast transactions
- **Ethers.js**: Ethereum library
- **Solidity**: Smart contract development
- **IPFS**: Decentralized file storage

### Backend
- **Next.js API Routes**: Serverless functions
- **MongoDB**: Database (production)
- **Prisma**: Database ORM
- **Africa's Talking**: SMS and USSD integration

## 🌍 Nigerian Market Focus

### Target Crops
- **Staples**: Cassava, Yam, Maize, Rice
- **Cash Crops**: Cocoa, Oil Palm, Cotton
- **Regional Specialties**: Millet, Sorghum (North), Plantain (South)

### Geographic Coverage
- **Northern States**: Kaduna, Kano, Katsina, Sokoto
- **Middle Belt**: Benue, Plateau, Niger, Kwara
- **Southern States**: Ogun, Oyo, Enugu, Cross River

### Local Adaptations
- Multi-language support (English, Hausa, Yoruba, Igbo)
- USSD integration for feature phones
- Nigerian Naira integration
- Local farming calendar integration

## 📱 USSD Integration

Access FarmChain via feature phones using USSD code: **\*347\*123#**

```
Main Menu:
1. Register Farm
2. Record Crop
3. Check Market Prices