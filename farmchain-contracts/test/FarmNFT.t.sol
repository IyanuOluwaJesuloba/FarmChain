// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FarmNFT.sol";

contract FarmNFTTest is Test {
    FarmNFT public farmNFT;
    address public owner;
    address public farmer1;
    address public farmer2;

    function setUp() public {
        owner = address(this);
        farmer1 = address(0x1);
        farmer2 = address(0x2);

        farmNFT = new FarmNFT("ipfs://");
    }

    // ============ Minting Tests ============
    function test_MintCropNFT() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Farm Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        assertEq(tokenId, 0);
        assertEq(farmNFT.ownerOf(tokenId), farmer1);
        assertEq(farmNFT.balanceOf(farmer1), 1);
    }

    function test_CropDataStored() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Wheat",
            "Location",
            block.timestamp,
            50,
            "B",
            "QmHash123"
        );

        FarmNFT.CropData memory data = farmNFT.getCropData(tokenId);

        assertEq(data.cropType, "Wheat");
        assertEq(data.quantity, 50);
        assertEq(data.qualityGrade, "B");
        assertEq(data.farmerAddress, farmer1);
    }

    function test_MultipleMints() public {
        farmNFT.mintCropNFT(farmer1, "Maize", "Loc1", block.timestamp, 100, "A", "Hash1");
        farmNFT.mintCropNFT(farmer1, "Wheat", "Loc2", block.timestamp, 200, "B", "Hash2");
        farmNFT.mintCropNFT(farmer2, "Rice", "Loc3", block.timestamp, 150, "A", "Hash3");

        assertEq(farmNFT.balanceOf(farmer1), 2);
        assertEq(farmNFT.balanceOf(farmer2), 1);
    }

    // ============ Validation Tests ============
    function test_RevertMintToZeroAddress() public {
        vm.expectRevert("FarmNFT: cannot mint to zero address");
        farmNFT.mintCropNFT(
            address(0),
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );
    }

    function test_RevertMintZeroQuantity() public {
        vm.expectRevert("FarmNFT: quantity must be greater than 0");
        farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            0,
            "A",
            "QmHash123"
        );
    }

    function test_RevertMintFutureHarvestDate() public {
        vm.expectRevert("FarmNFT: harvest date cannot be in future");
        farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp + 1 days,
            100,
            "A",
            "QmHash123"
        );
    }

    function test_RevertMintEmptyCropType() public {
        vm.expectRevert("FarmNFT: crop type cannot be empty");
        farmNFT.mintCropNFT(
            farmer1,
            "",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );
    }

    // ============ Metadata Update Tests ============
    function test_UpdateCropMetadata() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        vm.prank(farmer1);
        farmNFT.updateCropMetadata(tokenId, "QmNewHash456");

        FarmNFT.CropData memory data = farmNFT.getCropData(tokenId);
        assertEq(data.ipfsHash, "QmNewHash456");
    }

    function test_RevertUpdateByNonOwner() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        vm.prank(farmer2);
        vm.expectRevert("FarmNFT: only owner can update");
        farmNFT.updateCropMetadata(tokenId, "QmNewHash456");
    }

    // ============ Burning Tests ============
    function test_BurnCrop() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        vm.prank(farmer1);
        farmNFT.burnCrop(tokenId);

        assertEq(farmNFT.balanceOf(farmer1), 0);
    }

    function test_RevertBurnNonExistent() public {
        vm.prank(farmer1);
        vm.expectRevert("FarmNFT: token does not exist");
        farmNFT.burnCrop(999);
    }

    // ============ Enumeration Tests ============
    function test_GetFarmerCrops() public {
        farmNFT.mintCropNFT(farmer1, "Maize", "Loc1", block.timestamp, 100, "A", "Hash1");
        farmNFT.mintCropNFT(farmer1, "Wheat", "Loc2", block.timestamp, 200, "B", "Hash2");
        farmNFT.mintCropNFT(farmer2, "Rice", "Loc3", block.timestamp, 150, "A", "Hash3");

        uint256[] memory farmer1Crops = farmNFT.getFarmerCrops(farmer1);
        assertEq(farmer1Crops.length, 2);
        assertEq(farmer1Crops[0], 0);
        assertEq(farmer1Crops[1], 1);

        uint256[] memory farmer2Crops = farmNFT.getFarmerCrops(farmer2);
        assertEq(farmer2Crops.length, 1);
        assertEq(farmer2Crops[0], 2);
    }

    // ============ URI Tests ============
    function test_TokenURI() public {
        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        string memory uri = farmNFT.tokenURI(tokenId);
        assertEq(uri, "ipfs://QmHash123");
    }

    function test_UpdateBaseURI() public {
        vm.prank(owner);
        farmNFT.setBaseURI("https://api.example.com/");

        uint256 tokenId = farmNFT.mintCropNFT(
            farmer1,
            "Maize",
            "Location",
            block.timestamp,
            100,
            "A",
            "QmHash123"
        );

        string memory uri = farmNFT.tokenURI(tokenId);
        assertEq(uri, "https://api.example.com/QmHash123");
    }
}
