// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/FarmToken.sol";
import "../src/FarmNFT.sol";
import "../src/FarmMarketplace.sol";

contract FarmMarketplaceTest is Test {
    FarmToken public farmToken;
    FarmNFT public farmNFT;
    FarmMarketplace public marketplace;

    address public owner;
    address public seller;
    address public buyer;
    address public other;

    uint256 public constant INITIAL_BALANCE = 10_000_000 * 10 ** 18;

    function setUp() public {
        owner = address(this);
        seller = address(0x1);
        buyer = address(0x2);
        other = address(0x3);

        // Deploy contracts
        farmToken = new FarmToken();
        farmNFT = new FarmNFT("ipfs://");
        marketplace = new FarmMarketplace(address(farmToken), address(farmNFT));

        // Distribute tokens
        farmToken.transfer(seller, INITIAL_BALANCE);
        farmToken.transfer(buyer, INITIAL_BALANCE);

        // Approve marketplace to spend tokens
        vm.prank(buyer);
        farmToken.approve(address(marketplace), type(uint256).max);

        vm.prank(seller);
        farmToken.approve(address(marketplace), type(uint256).max);
    }

    // ============ Listing Tests ============
    function test_CreateListing() public {
        // Mint NFT to seller
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        // Approve marketplace
        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        // Create listing
        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        assertEq(listingId, 0);

        FarmMarketplace.Listing memory listing = marketplace.listings(listingId);
        assertEq(listing.seller, seller);
        assertEq(listing.nftTokenId, tokenId);
        assertEq(listing.priceInFARM, 1000 * 10 ** 18);
        assertEq(uint(listing.status), uint(FarmMarketplace.ListingStatus.ACTIVE));
    }

    function test_CancelListing() public {
        // Create listing first
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        // Cancel listing
        vm.prank(seller);
        marketplace.cancelListing(listingId);

        FarmMarketplace.Listing memory listing = marketplace.listings(listingId);
        assertEq(uint(listing.status), uint(FarmMarketplace.ListingStatus.CANCELLED));
    }

    // ============ Offer Tests ============
    function test_MakeOffer() public {
        // Setup
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        // Make offer
        vm.prank(buyer);
        uint256 offerId = marketplace.makeOffer(
            listingId,
            1000 * 10 ** 18,
            7 days
        );

        assertEq(offerId, 0);

        FarmMarketplace.Offer memory offer = marketplace.offers(offerId);
        assertEq(offer.buyer, buyer);
        assertEq(offer.offerAmount, 1000 * 10 ** 18);
        assertEq(uint(offer.status), uint(FarmMarketplace.OfferStatus.PENDING));
    }

    function test_AcceptOffer() public {
        // Setup: create listing and make offer
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        vm.prank(buyer);
        uint256 offerId = marketplace.makeOffer(
            listingId,
            1000 * 10 ** 18,
            7 days
        );

        // Accept offer
        uint256 buyerBalanceBefore = farmToken.balanceOf(buyer);
        vm.prank(seller);
        marketplace.acceptOffer(offerId);
        uint256 buyerBalanceAfter = farmToken.balanceOf(buyer);

        assertEq(buyerBalanceBefore - buyerBalanceAfter, 1000 * 10 ** 18);

        FarmMarketplace.Offer memory offer = marketplace.offers(offerId);
        assertEq(uint(offer.status), uint(FarmMarketplace.OfferStatus.ACCEPTED));

        FarmMarketplace.Listing memory listing = marketplace.listings(listingId);
        assertEq(uint(listing.status), uint(FarmMarketplace.ListingStatus.SOLD));
    }

    // ============ Escrow Tests ============
    function test_BuyerConfirmAndSellerConfirm() public {
        // Setup
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        vm.prank(buyer);
        uint256 offerId = marketplace.makeOffer(
            listingId,
            1000 * 10 ** 18,
            7 days
        );

        vm.prank(seller);
        marketplace.acceptOffer(offerId);

        // Transfer NFT to buyer (simulating delivery)
        vm.prank(address(marketplace));
        farmNFT.approve(buyer, tokenId);
        vm.prank(address(marketplace));
        farmNFT.transferFrom(address(marketplace), buyer, tokenId);

        uint256 sellerBalanceBefore = farmToken.balanceOf(seller);

        // Buyer confirms
        vm.prank(buyer);
        marketplace.buyerConfirmReceipt(listingId);

        // Seller confirms
        vm.prank(seller);
        marketplace.sellerConfirmShipment(listingId);

        // Check seller received payment
        uint256 sellerBalanceAfter = farmToken.balanceOf(seller);
        assertGreater(sellerBalanceAfter, sellerBalanceBefore);
    }

    // ============ Fee Tests ============
    function test_PlatformFeeCollection() public {
        // Setup
        vm.prank(owner);
        uint256 tokenId = farmNFT.mintCropNFT(
            seller,
            "Maize",
            "Farm A",
            block.timestamp,
            100,
            "A",
            "QmHash"
        );

        vm.prank(seller);
        farmNFT.approve(address(marketplace), tokenId);

        vm.prank(seller);
        uint256 listingId = marketplace.createListing(
            tokenId,
            1000 * 10 ** 18,
            "Fresh maize"
        );

        vm.prank(buyer);
        uint256 offerId = marketplace.makeOffer(
            listingId,
            1000 * 10 ** 18,
            7 days
        );

        vm.prank(seller);
        marketplace.acceptOffer(offerId);

        // Transfer NFT to buyer
        vm.prank(address(marketplace));
        farmNFT.approve(buyer, tokenId);
        vm.prank(address(marketplace));
        farmNFT.transferFrom(address(marketplace), buyer, tokenId);

        vm.prank(buyer);
        marketplace.buyerConfirmReceipt(listingId);

        vm.prank(seller);
        marketplace.sellerConfirmShipment(listingId);

        // Check that fees were collected
        uint256 fees = marketplace.platformFeeBalance(owner);
        assertGreater(fees, 0);
    }
}
