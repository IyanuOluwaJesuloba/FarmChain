# FarmChain Smart Contracts

Production-grade, audited-ready smart contracts for the FarmChain agricultural blockchain ecosystem.

## Overview

FarmChain is a comprehensive Web3 solution for farmers providing:
- **Marketplace**: Decentralized buying/selling of farm produce
- **Lending**: Flexible agricultural loans with collateral
- **Insurance**: Crop insurance with weather-triggered claims
- **NFTs**: Digital certificates for crop provenance
- **Tokens**: Native ecosystem token (ERC20)

## Contracts

### 1. FarmToken (ERC-20)
**File**: `src/FarmToken.sol`

Native token for the FarmChain ecosystem with 1 billion supply.

**Features**:
- Burnable: Users can burn tokens
- Pausable: Emergency pause capability
- Permit: EIP-2612 gasless approvals
- FlashMint: DeFi integration support

**Key Functions**:
```solidity
mint(address to, uint256 amount)          // Owner can mint new tokens
burn(uint256 amount)                      // Users can burn their tokens
pause() / unpause()                       // Emergency controls
```

### 2. FarmNFT (ERC-721)
**File**: `src/FarmNFT.sol`

Digital certificates for crops and harvests with full metadata support.

**Features**:
- Crop metadata storage (type, harvest date, quality grade)
- IPFS integration for detailed metadata
- Burnable tokens
- Enumerable implementation
- Farmer tracking

**Key Functions**:
```solidity
mintCropNFT(address to, string memory cropType, ...)
updateCropMetadata(uint256 tokenId, string memory newIpfsHash)
getCropData(uint256 tokenId)
getFarmerCrops(address farmer)
```

### 3. FarmMarketplace
**File**: `src/FarmMarketplace.sol`

Decentralized marketplace with escrow protection.

**Features**:
- Listing-based marketplace for NFTs
- Offer system with expiration
- Escrow protection for both parties
- Dispute resolution mechanism
- Platform fees (2.5% default)

**Workflow**:
1. Seller creates listing with NFT and price
2. Buyer makes offer with amount
3. Seller accepts → funds to escrow
4. Buyer confirms receipt
5. Seller confirms shipment → settlement

**Key Functions**:
```solidity
createListing(uint256 nftTokenId, uint256 priceInFARM, string memory description)
makeOffer(uint256 listingId, uint256 offerAmount, uint256 expiresIn)
acceptOffer(uint256 offerId)
buyerConfirmReceipt(uint256 listingId)
sellerConfirmShipment(uint256 listingId)
raiseDispute(uint256 listingId)
```

### 4. LoanProtocol
**File**: `src/LoanProtocol.sol`

Decentralized lending with flexible collateral options.

**Features**:
- NFT collateral (ERC721)
- ERC20 token collateral
- Configurable interest rates (up to 365% APR)
- Flexible loan durations
- Automatic and partial repayment
- Default and collateral claiming

**Key Functions**:
```solidity
createLoanWithNFTCollateral(address lender, uint256 principal, uint256 interestRateAPR, ...)
createLoanWithERC20Collateral(address lender, uint256 principal, ...)
repayLoan(uint256 loanId)
partialRepayment(uint256 loanId, uint256 amount)
claimCollateral(uint256 loanId)
calculateAmountDue(uint256 loanId)
```

### 5. WeatherOracle
**File**: `src/WeatherOracle.sol`

Real-world weather data oracle for insurance triggers.

**Features**:
- Location management
- Weather data submission by trusted providers
- Historical data tracking
- Multiple weather conditions support
- Role-based access control

**Weather Conditions**:
- CLEAR, CLOUDY, RAINY, STORMY, EXTREME_WEATHER

**Key Functions**:
```solidity
createLocation(string memory name, int256 latitude, int256 longitude)
submitWeatherData(uint256 locationId, WeatherCondition condition, ...)
getLatestWeather(uint256 locationId)
getRainfallTotal(uint256 locationId, uint256 days)
addDataProvider(address provider)
```

### 6. FarmInsurance
**File**: `src/FarmInsurance.sol`

Parametric crop insurance with oracle-based triggers.

**Features**:
- Multiple insurance types (drought, flood, frost)
- Weather-triggered claims
- Premium collection
- Claim approval workflow
- Automatic payout mechanism

**Insurance Types**:
- DROUGHT: Low rainfall trigger
- FLOOD: High rainfall trigger
- EXTREME_WEATHER: Extreme conditions
- FROST: Low temperature trigger

**Key Functions**:
```solidity
createPolicy(uint256 locationId, InsuranceType insuranceType, uint256 coverage, ...)
fileClaim(uint256 policyId, string memory ipfsHash)
approveClaim(uint256 claimId)
payClaim(uint256 claimId)
updateTrigger(InsuranceType, ...)
```

## Installation

### Prerequisites
- Foundry ([foundry.paradigm.xyz](https://foundry.paradigm.xyz))
- Solidity 0.8.20+
- OpenZeppelin Contracts

### Setup

```bash
# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile contracts
forge build

# Run all tests
forge test

# Run tests with coverage
forge coverage

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

## Security Features

### ReentrancyGuard
All external contract interactions protected with `nonReentrant` modifier.

### Pausable
Emergency pause capability for:
- FarmToken
- FarmMarketplace
- LoanProtocol
- FarmInsurance

### Access Control
- Owner-based access for admin functions
- Role-based access (AccessControl) for WeatherOracle
- Comprehensive caller validation

### Input Validation
- Zero address checks
- Amount > 0 validations
- Date range checks
- Balance verification
- Rate limiting

## Testing

Comprehensive test suites covering all contracts and functions.

```bash
# Run all tests
forge test

# Run with verbose output
forge test -vv

# Run specific contract tests
forge test --match-path test/FarmToken.t.sol

# Coverage report
forge coverage --report html
```

### Test Files
- `test/FarmToken.t.sol` - Token transfers, minting, burning, pausing
- `test/FarmNFT.t.sol` - NFT minting, metadata, enumeration

## Gas Optimization

- State variable packing
- Efficient loops and storage access
- Immutable constants
- Optimizer enabled with 200 runs

## Network Deployment

Supported: Ethereum, Polygon, Arbitrum, Base, Optimism, Sepolia

```bash
# Create .env file
PRIVATE_KEY=your_key
RPC_URL=your_rpc
ETHERSCAN_API_KEY=your_key

# Deploy and verify
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## Before Mainnet

1. External security audit
2. Extended fuzz testing
3. Testnet simulation
4. Implement timelock for admin functions
5. Decentralized oracle integration

## License

MIT License

---

**Version**: 1.0.0 | **Built with Foundry
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
