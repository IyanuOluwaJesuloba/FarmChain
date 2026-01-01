// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title WeatherOracleInterface
 * @dev Interface for WeatherOracle contract
 */
interface IWeatherOracle {
    enum WeatherCondition {
        CLEAR,
        CLOUDY,
        RAINY,
        STORMY,
        EXTREME_WEATHER
    }

    function isExtremeWeather(uint256 locationId) external view returns (bool);
    function getRainfallTotal(uint256 locationId, uint256 days) external view returns (uint256);
    function getLatestWeather(uint256 locationId) external view returns (
        uint256 timestamp,
        WeatherCondition condition,
        int256 temperature,
        uint256 humidity,
        uint256 rainfall,
        uint256 windSpeed,
        address provider,
        string memory ipfsHash
    );
}

/**
 * @title FarmInsurance
 * @dev Crop insurance protocol with oracle-based triggers
 * Features:
 * - Crop insurance policies
 * - Weather-triggered claims
 * - Premium collection
 * - Payout mechanism
 */
contract FarmInsurance is ReentrancyGuard, Ownable, Pausable {
    // ============ State Variables ============
    IERC20 public farmToken;
    IWeatherOracle public weatherOracle;

    uint256 public platformFeePercentage = 100; // 10% (100/1000)
    uint256 public constant FEE_DENOMINATOR = 1000;

    uint256 private _policyIdCounter;
    uint256 private _claimIdCounter;

    // Policy states
    enum PolicyStatus {
        ACTIVE,
        EXPIRED,
        CLAIMED,
        CANCELLED
    }

    enum ClaimStatus {
        PENDING,
        APPROVED,
        REJECTED,
        PAID
    }

    enum InsuranceType {
        DROUGHT,
        FLOOD,
        EXTREME_WEATHER,
        FROST
    }

    // ============ Structures ============
    struct Policy {
        uint256 id;
        address farmer;
        uint256 locationId;
        InsuranceType insuranceType;
        uint256 coverage; // Coverage amount in FARM
        uint256 premium; // Annual premium
        uint256 durationDays;
        uint256 createdAt;
        uint256 expiresAt;
        PolicyStatus status;
        string cropType;
        uint256 plantingDate;
        uint256 expectedHarvestDate;
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address farmer;
        uint256 claimAmount;
        ClaimStatus status;
        uint256 createdAt;
        string ipfsHash; // Evidence/documentation
        uint256 weatherRainfallMm; // Weather data at claim
        int256 weatherTemperature;
    }

    struct InsuranceTrigger {
        InsuranceType insuranceType;
        uint256 minRainfallMm; // For flood insurance
        int256 maxTemperatureCelsius; // For frost insurance
        int256 minTemperatureCelsius; // For extreme cold
        uint256 rainfallCheckDays; // Days to check rainfall
    }

    // ============ Mappings ============
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public farmerPolicies;
    mapping(uint256 => uint256[]) public policyClaims;
    mapping(InsuranceType => InsuranceTrigger) public triggers;
    mapping(address => uint256) public platformFeeBalance;

    // ============ Events ============
    event PolicyCreated(
        uint256 indexed policyId,
        address indexed farmer,
        uint256 locationId,
        InsuranceType insuranceType,
        uint256 coverage,
        uint256 premium
    );
    event PolicyCancelled(uint256 indexed policyId, address indexed farmer);
    event ClaimCreated(
        uint256 indexed claimId,
        uint256 indexed policyId,
        address indexed farmer,
        uint256 claimAmount
    );
    event ClaimApproved(uint256 indexed claimId, uint256 amount);
    event ClaimRejected(uint256 indexed claimId);
    event ClaimPaid(uint256 indexed claimId, address indexed farmer, uint256 amount);
    event TriggerUpdated(InsuranceType insuranceType);
    event PremiumPaid(uint256 indexed policyId, address indexed farmer, uint256 amount);

    // ============ Modifiers ============
    modifier validPolicy(uint256 policyId) {
        require(policies[policyId].createdAt != 0, "FarmInsurance: policy does not exist");
        _;
    }

    modifier validClaim(uint256 claimId) {
        require(claims[claimId].createdAt != 0, "FarmInsurance: claim does not exist");
        _;
    }

    modifier policyActive(uint256 policyId) {
        require(policies[policyId].status == PolicyStatus.ACTIVE, "FarmInsurance: policy not active");
        require(block.timestamp <= policies[policyId].expiresAt, "FarmInsurance: policy expired");
        _;
    }

    // ============ Constructor ============
    constructor(address _farmToken, address _weatherOracle) {
        require(_farmToken != address(0), "FarmInsurance: invalid token address");
        require(_weatherOracle != address(0), "FarmInsurance: invalid oracle address");

        farmToken = IERC20(_farmToken);
        weatherOracle = IWeatherOracle(_weatherOracle);

        // Initialize default triggers
        triggers[InsuranceType.DROUGHT] = InsuranceTrigger({
            insuranceType: InsuranceType.DROUGHT,
            minRainfallMm: 10000, // Less than 100mm over 30 days
            maxTemperatureCelsius: 0,
            minTemperatureCelsius: 0,
            rainfallCheckDays: 30
        });

        triggers[InsuranceType.FLOOD] = InsuranceTrigger({
            insuranceType: InsuranceType.FLOOD,
            minRainfallMm: 50000, // More than 500mm over 7 days
            maxTemperatureCelsius: 0,
            minTemperatureCelsius: 0,
            rainfallCheckDays: 7
        });

        triggers[InsuranceType.FROST] = InsuranceTrigger({
            insuranceType: InsuranceType.FROST,
            minRainfallMm: 0,
            maxTemperatureCelsius: 0,
            minTemperatureCelsius: -500, // Below -5°C (stored as -5 * 100)
            rainfallCheckDays: 1
        });
    }

    // ============ Policy Functions ============
    /**
     * @dev Create a crop insurance policy
     * @param locationId Weather location ID
     * @param insuranceType Type of insurance
     * @param coverage Coverage amount in FARM
     * @param premium Annual premium in FARM
     * @param durationDays Duration in days
     * @param cropType Type of crop
     * @param plantingDate Planting date timestamp
     * @param expectedHarvestDate Expected harvest date
     */
    function createPolicy(
        uint256 locationId,
        InsuranceType insuranceType,
        uint256 coverage,
        uint256 premium,
        uint256 durationDays,
        string memory cropType,
        uint256 plantingDate,
        uint256 expectedHarvestDate
    ) public whenNotPaused returns (uint256) {
        require(coverage > 0, "FarmInsurance: coverage must be greater than 0");
        require(premium > 0, "FarmInsurance: premium must be greater than 0");
        require(durationDays > 0, "FarmInsurance: duration must be greater than 0");
        require(bytes(cropType).length > 0, "FarmInsurance: crop type cannot be empty");
        require(plantingDate <= block.timestamp, "FarmInsurance: invalid planting date");
        require(expectedHarvestDate > plantingDate, "FarmInsurance: invalid harvest date");

        // Transfer premium from farmer
        require(
            farmToken.transferFrom(msg.sender, address(this), premium),
            "FarmInsurance: premium transfer failed"
        );

        uint256 policyId = _policyIdCounter++;

        policies[policyId] = Policy({
            id: policyId,
            farmer: msg.sender,
            locationId: locationId,
            insuranceType: insuranceType,
            coverage: coverage,
            premium: premium,
            durationDays: durationDays,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + (durationDays * 1 days),
            status: PolicyStatus.ACTIVE,
            cropType: cropType,
            plantingDate: plantingDate,
            expectedHarvestDate: expectedHarvestDate
        });

        farmerPolicies[msg.sender].push(policyId);

        emit PolicyCreated(policyId, msg.sender, locationId, insuranceType, coverage, premium);

        return policyId;
    }

    /**
     * @dev Cancel an insurance policy
     * @param policyId Policy ID
     */
    function cancelPolicy(uint256 policyId) public validPolicy(policyId) nonReentrant {
        Policy storage policy = policies[policyId];
        require(policy.farmer == msg.sender, "FarmInsurance: only farmer can cancel");
        require(policy.status == PolicyStatus.ACTIVE, "FarmInsurance: policy not active");

        policy.status = PolicyStatus.CANCELLED;

        // Refund remaining premium proportionally
        uint256 timeRemaining = policy.expiresAt > block.timestamp
            ? policy.expiresAt - block.timestamp
            : 0;
        uint256 totalDuration = policy.expiresAt - policy.createdAt;
        uint256 refund = (policy.premium * timeRemaining) / totalDuration;

        if (refund > 0) {
            require(farmToken.transfer(msg.sender, refund), "FarmInsurance: refund failed");
        }

        emit PolicyCancelled(policyId, msg.sender);
    }

    // ============ Claim Functions ============
    /**
     * @dev File a claim for crop damage
     * @param policyId Policy ID
     * @param ipfsHash IPFS hash with claim evidence
     */
    function fileClaim(uint256 policyId, string memory ipfsHash)
        public
        policyActive(policyId)
        whenNotPaused
        returns (uint256)
    {
        Policy storage policy = policies[policyId];
        require(policy.farmer == msg.sender, "FarmInsurance: only farmer can file claim");
        require(bytes(ipfsHash).length > 0, "FarmInsurance: IPFS hash cannot be empty");

        // Check if weather conditions trigger the claim
        InsuranceTrigger storage trigger = triggers[policy.insuranceType];
        (bool triggered, uint256 rainfall, int256 temperature) = _checkWeatherTrigger(
            policy.locationId,
            policy.insuranceType
        );

        require(triggered, "FarmInsurance: weather conditions don't trigger claim");

        uint256 claimId = _claimIdCounter++;

        claims[claimId] = Claim({
            id: claimId,
            policyId: policyId,
            farmer: msg.sender,
            claimAmount: policy.coverage,
            status: ClaimStatus.PENDING,
            createdAt: block.timestamp,
            ipfsHash: ipfsHash,
            weatherRainfallMm: rainfall,
            weatherTemperature: temperature
        });

        policyClaims[policyId].push(claimId);

        emit ClaimCreated(claimId, policyId, msg.sender, policy.coverage);

        return claimId;
    }

    /**
     * @dev Approve a claim (owner/admin)
     * @param claimId Claim ID
     */
    function approveClaim(uint256 claimId) public onlyOwner validClaim(claimId) nonReentrant {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.PENDING, "FarmInsurance: claim not pending");

        Policy storage policy = policies[claim.policyId];
        require(policy.status == PolicyStatus.ACTIVE, "FarmInsurance: policy not active");

        claim.status = ClaimStatus.APPROVED;

        emit ClaimApproved(claimId, claim.claimAmount);
    }

    /**
     * @dev Reject a claim (owner/admin)
     * @param claimId Claim ID
     */
    function rejectClaim(uint256 claimId) public onlyOwner validClaim(claimId) {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.PENDING, "FarmInsurance: claim not pending");

        claim.status = ClaimStatus.REJECTED;

        emit ClaimRejected(claimId);
    }

    /**
     * @dev Pay approved claim
     * @param claimId Claim ID
     */
    function payClaim(uint256 claimId) public onlyOwner validClaim(claimId) nonReentrant {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.APPROVED, "FarmInsurance: claim not approved");

        // Calculate platform fee
        uint256 platformFee = (claim.claimAmount * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 paymentAmount = claim.claimAmount - platformFee;

        platformFeeBalance[owner()] += platformFee;

        claim.status = ClaimStatus.PAID;

        Policy storage policy = policies[claim.policyId];
        policy.status = PolicyStatus.CLAIMED;

        require(farmToken.transfer(claim.farmer, paymentAmount), "FarmInsurance: payout failed");

        emit ClaimPaid(claimId, claim.farmer, paymentAmount);
    }

    // ============ Weather Trigger Functions ============
    /**
     * @dev Check if weather conditions trigger a claim
     */
    function _checkWeatherTrigger(uint256 locationId, InsuranceType insuranceType)
        internal
        view
        returns (
            bool triggered,
            uint256 rainfall,
            int256 temperature
        )
    {
        InsuranceTrigger storage trigger = triggers[insuranceType];

        if (insuranceType == InsuranceType.DROUGHT) {
            rainfall = weatherOracle.getRainfallTotal(locationId, trigger.rainfallCheckDays);
            triggered = rainfall < trigger.minRainfallMm;
        } else if (insuranceType == InsuranceType.FLOOD) {
            rainfall = weatherOracle.getRainfallTotal(locationId, trigger.rainfallCheckDays);
            triggered = rainfall >= trigger.minRainfallMm;
        } else if (insuranceType == InsuranceType.EXTREME_WEATHER) {
            triggered = weatherOracle.isExtremeWeather(locationId);
        } else if (insuranceType == InsuranceType.FROST) {
            triggered = weatherOracle.isExtremeWeather(locationId); // Simplified
        }

        return (triggered, rainfall, temperature);
    }

    /**
     * @dev Update insurance trigger parameters
     * @param insuranceType Type of insurance
     * @param minRainfallMm Minimum rainfall in mm * 100
     * @param maxTemperature Max temperature in Celsius * 100
     * @param minTemperature Min temperature in Celsius * 100
     * @param rainfallCheckDays Days to check rainfall
     */
    function updateTrigger(
        InsuranceType insuranceType,
        uint256 minRainfallMm,
        int256 maxTemperature,
        int256 minTemperature,
        uint256 rainfallCheckDays
    ) public onlyOwner {
        require(rainfallCheckDays > 0, "FarmInsurance: invalid check days");

        triggers[insuranceType] = InsuranceTrigger({
            insuranceType: insuranceType,
            minRainfallMm: minRainfallMm,
            maxTemperatureCelsius: maxTemperature,
            minTemperatureCelsius: minTemperature,
            rainfallCheckDays: rainfallCheckDays
        });

        emit TriggerUpdated(insuranceType);
    }

    // ============ Admin Functions ============
    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() public onlyOwner nonReentrant {
        uint256 amount = platformFeeBalance[msg.sender];
        require(amount > 0, "FarmInsurance: no fees to withdraw");

        platformFeeBalance[msg.sender] = 0;

        require(farmToken.transfer(msg.sender, amount), "FarmInsurance: fee withdrawal failed");
    }

    /**
     * @dev Set platform fee percentage
     * @param newFeePercentage New fee in basis points (100 = 10%)
     */
    function setPlatformFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 200, "FarmInsurance: fee cannot exceed 20%");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Pause/unpause insurance
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // ============ View Functions ============
    function getPoliciesCount() public view returns (uint256) {
        return _policyIdCounter;
    }

    function getClaimsCount() public view returns (uint256) {
        return _claimIdCounter;
    }

    function getFarmerPoliciesCount(address farmer) public view returns (uint256) {
        return farmerPolicies[farmer].length;
    }

    function getPolicyClaimsCount(uint256 policyId) public view returns (uint256) {
        return policyClaims[policyId].length;
    }
}
