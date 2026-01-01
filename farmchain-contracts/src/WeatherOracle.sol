// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title WeatherOracle
 * @dev Oracle for real-world weather data
 * Features:
 * - Store weather data for locations
 * - Track historical weather data
 * - Support for multiple data providers
 * - Query weather conditions
 */
contract WeatherOracle is Ownable, AccessControl {
    // ============ Roles ============
    bytes32 public constant DATA_PROVIDER_ROLE = keccak256("DATA_PROVIDER_ROLE");

    // ============ State Variables ============
    uint256 public updateFrequency = 1 hours; // Minimum time between updates

    // Weather condition types
    enum WeatherCondition {
        CLEAR,
        CLOUDY,
        RAINY,
        STORMY,
        EXTREME_WEATHER
    }

    // ============ Structures ============
    struct WeatherData {
        uint256 timestamp;
        WeatherCondition condition;
        int256 temperature; // In Celsius * 100 (e.g., 25.5°C = 2550)
        uint256 humidity; // Percentage (0-100)
        uint256 rainfall; // In millimeters * 100
        uint256 windSpeed; // In km/h * 100
        address provider;
        string ipfsHash; // Additional data on IPFS
    }

    struct LocationData {
        string name;
        int256 latitude; // * 1e6
        int256 longitude; // * 1e6
        bool active;
    }

    // ============ Mappings ============
    // Location ID => Location Data
    mapping(uint256 => LocationData) public locations;
    uint256 public locationCount;

    // Location ID => Weather Data array
    mapping(uint256 => WeatherData[]) public weatherHistory;

    // Location ID => Latest weather data
    mapping(uint256 => WeatherData) public latestWeather;

    // Location ID => Last update timestamp
    mapping(uint256 => uint256) public lastUpdateTime;

    // Data provider => trusted flag
    mapping(address => bool) public trustedProviders;

    // ============ Events ============
    event LocationCreated(uint256 indexed locationId, string name, int256 lat, int256 lon);
    event LocationUpdated(uint256 indexed locationId, string name, bool active);
    event WeatherDataSubmitted(
        uint256 indexed locationId,
        WeatherCondition condition,
        int256 temperature,
        uint256 timestamp
    );
    event DataProviderAdded(address indexed provider);
    event DataProviderRemoved(address indexed provider);
    event UpdateFrequencyChanged(uint256 newFrequency);

    // ============ Modifiers ============
    modifier validLocation(uint256 locationId) {
        require(locationId < locationCount, "WeatherOracle: location does not exist");
        require(locations[locationId].active, "WeatherOracle: location is inactive");
        _;
    }

    modifier onlyDataProvider() {
        require(
            hasRole(DATA_PROVIDER_ROLE, msg.sender),
            "WeatherOracle: only data providers can submit"
        );
        _;
    }

    // ============ Constructor ============
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DATA_PROVIDER_ROLE, msg.sender);
    }

    // ============ Location Management ============
    /**
     * @dev Create a new location for weather monitoring
     * @param name Location name
     * @param latitude Latitude * 1e6
     * @param longitude Longitude * 1e6
     */
    function createLocation(
        string memory name,
        int256 latitude,
        int256 longitude
    ) public onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "WeatherOracle: name cannot be empty");
        require(latitude >= -90000000 && latitude <= 90000000, "WeatherOracle: invalid latitude");
        require(longitude >= -180000000 && longitude <= 180000000, "WeatherOracle: invalid longitude");

        uint256 locationId = locationCount++;

        locations[locationId] = LocationData({
            name: name,
            latitude: latitude,
            longitude: longitude,
            active: true
        });

        emit LocationCreated(locationId, name, latitude, longitude);

        return locationId;
    }

    /**
     * @dev Update location status
     * @param locationId Location ID
     * @param active New active status
     */
    function updateLocationStatus(uint256 locationId, bool active) public onlyOwner validLocation(locationId) {
        locations[locationId].active = active;
        emit LocationUpdated(locationId, locations[locationId].name, active);
    }

    // ============ Weather Data Submission ============
    /**
     * @dev Submit weather data for a location
     * @param locationId Location ID
     * @param condition Weather condition
     * @param temperature Temperature in Celsius * 100
     * @param humidity Humidity percentage (0-100)
     * @param rainfall Rainfall in mm * 100
     * @param windSpeed Wind speed in km/h * 100
     * @param ipfsHash IPFS hash for additional data
     */
    function submitWeatherData(
        uint256 locationId,
        WeatherCondition condition,
        int256 temperature,
        uint256 humidity,
        uint256 rainfall,
        uint256 windSpeed,
        string memory ipfsHash
    ) public onlyDataProvider validLocation(locationId) {
        require(
            block.timestamp >= lastUpdateTime[locationId] + updateFrequency,
            "WeatherOracle: update frequency not met"
        );
        require(temperature >= -5000 && temperature <= 6000, "WeatherOracle: invalid temperature");
        require(humidity <= 100, "WeatherOracle: humidity exceeds 100%");

        WeatherData memory data = WeatherData({
            timestamp: block.timestamp,
            condition: condition,
            temperature: temperature,
            humidity: humidity,
            rainfall: rainfall,
            windSpeed: windSpeed,
            provider: msg.sender,
            ipfsHash: ipfsHash
        });

        weatherHistory[locationId].push(data);
        latestWeather[locationId] = data;
        lastUpdateTime[locationId] = block.timestamp;

        emit WeatherDataSubmitted(locationId, condition, temperature, block.timestamp);
    }

    // ============ Data Provider Management ============
    /**
     * @dev Add a trusted data provider
     * @param provider Provider address
     */
    function addDataProvider(address provider) public onlyOwner {
        require(provider != address(0), "WeatherOracle: invalid provider address");
        require(!hasRole(DATA_PROVIDER_ROLE, provider), "WeatherOracle: already a provider");

        _grantRole(DATA_PROVIDER_ROLE, provider);
        trustedProviders[provider] = true;

        emit DataProviderAdded(provider);
    }

    /**
     * @dev Remove a data provider
     * @param provider Provider address
     */
    function removeDataProvider(address provider) public onlyOwner {
        require(hasRole(DATA_PROVIDER_ROLE, provider), "WeatherOracle: not a provider");

        _revokeRole(DATA_PROVIDER_ROLE, provider);
        trustedProviders[provider] = false;

        emit DataProviderRemoved(provider);
    }

    // ============ Query Functions ============
    /**
     * @dev Get latest weather data for a location
     * @param locationId Location ID
     */
    function getLatestWeather(uint256 locationId)
        public
        view
        validLocation(locationId)
        returns (WeatherData memory)
    {
        require(lastUpdateTime[locationId] > 0, "WeatherOracle: no weather data available");
        return latestWeather[locationId];
    }

    /**
     * @dev Get weather data history for a location
     * @param locationId Location ID
     */
    function getWeatherHistory(uint256 locationId)
        public
        view
        validLocation(locationId)
        returns (WeatherData[] memory)
    {
        return weatherHistory[locationId];
    }

    /**
     * @dev Get specific weather data from history
     * @param locationId Location ID
     * @param index Index in weather history
     */
    function getWeatherDataAt(uint256 locationId, uint256 index)
        public
        view
        validLocation(locationId)
        returns (WeatherData memory)
    {
        require(index < weatherHistory[locationId].length, "WeatherOracle: invalid index");
        return weatherHistory[locationId][index];
    }

    /**
     * @dev Get location details
     * @param locationId Location ID
     */
    function getLocation(uint256 locationId)
        public
        view
        returns (LocationData memory)
    {
        require(locationId < locationCount, "WeatherOracle: location does not exist");
        return locations[locationId];
    }

    /**
     * @dev Get weather history count for a location
     * @param locationId Location ID
     */
    function getWeatherHistoryLength(uint256 locationId) public view returns (uint256) {
        return weatherHistory[locationId].length;
    }

    /**
     * @dev Check if condition is extreme (for insurance triggers)
     * @param locationId Location ID
     */
    function isExtremeWeather(uint256 locationId)
        public
        view
        validLocation(locationId)
        returns (bool)
    {
        WeatherData memory latest = latestWeather[locationId];
        return latest.condition == WeatherCondition.EXTREME_WEATHER;
    }

    /**
     * @dev Get rainfall data for a period
     * @param locationId Location ID
     * @param days Number of days to check
     */
    function getRainfallTotal(uint256 locationId, uint256 days)
        public
        view
        validLocation(locationId)
        returns (uint256)
    {
        WeatherData[] storage history = weatherHistory[locationId];
        uint256 cutoffTime = block.timestamp - (days * 1 days);
        uint256 totalRainfall = 0;

        for (uint256 i = history.length; i > 0; i--) {
            if (history[i - 1].timestamp < cutoffTime) {
                break;
            }
            totalRainfall += history[i - 1].rainfall;
        }

        return totalRainfall;
    }

    // ============ Admin Functions ============
    /**
     * @dev Set update frequency
     * @param newFrequency New frequency in seconds
     */
    function setUpdateFrequency(uint256 newFrequency) public onlyOwner {
        require(newFrequency > 0, "WeatherOracle: frequency must be greater than 0");
        updateFrequency = newFrequency;
        emit UpdateFrequencyChanged(newFrequency);
    }
}
