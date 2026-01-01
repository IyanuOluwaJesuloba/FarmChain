// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FarmToken.sol";
import "../src/FarmNFT.sol";
import "../src/FarmMarketplace.sol";
import "../src/LoanProtocol.sol";
import "../src/WeatherOracle.sol";
import "../src/FarmInsurance.sol";

/**
 * @title Deploy Script
 * @dev Deploys all FarmChain contracts
 * 
 * Usage:
 * forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
 */
contract DeployScript is Script {
    FarmToken public farmToken;
    FarmNFT public farmNFT;
    FarmMarketplace public farmMarketplace;
    LoanProtocol public loanProtocol;
    WeatherOracle public weatherOracle;
    FarmInsurance public farmInsurance;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy FarmToken
        console.log("Deploying FarmToken...");
        farmToken = new FarmToken();
        console.log("FarmToken deployed at:", address(farmToken));

        // Deploy FarmNFT
        console.log("Deploying FarmNFT...");
        farmNFT = new FarmNFT("https://api.farmchain.io/metadata/");
        console.log("FarmNFT deployed at:", address(farmNFT));

        // Deploy FarmMarketplace
        console.log("Deploying FarmMarketplace...");
        farmMarketplace = new FarmMarketplace(address(farmToken), address(farmNFT));
        console.log("FarmMarketplace deployed at:", address(farmMarketplace));

        // Deploy LoanProtocol
        console.log("Deploying LoanProtocol...");
        loanProtocol = new LoanProtocol(address(farmToken), address(farmNFT));
        console.log("LoanProtocol deployed at:", address(loanProtocol));

        // Deploy WeatherOracle
        console.log("Deploying WeatherOracle...");
        weatherOracle = new WeatherOracle();
        console.log("WeatherOracle deployed at:", address(weatherOracle));

        // Deploy FarmInsurance
        console.log("Deploying FarmInsurance...");
        farmInsurance = new FarmInsurance(address(farmToken), address(weatherOracle));
        console.log("FarmInsurance deployed at:", address(farmInsurance));

        // Log all addresses
        console.log("\n=== Deployment Summary ===");
        console.log("FarmToken:", address(farmToken));
        console.log("FarmNFT:", address(farmNFT));
        console.log("FarmMarketplace:", address(farmMarketplace));
        console.log("LoanProtocol:", address(loanProtocol));
        console.log("WeatherOracle:", address(weatherOracle));
        console.log("FarmInsurance:", address(farmInsurance));

        vm.stopBroadcast();
    }
}
