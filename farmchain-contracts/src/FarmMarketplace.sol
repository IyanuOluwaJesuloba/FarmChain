// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title FarmMarketplace
 * @dev Decentralized marketplace for buying and selling farm products
 * Features:
 * - Create listings for crops
 * - Offer-based purchasing system
 * - Escrow protection for buyers and sellers
 * - Dispute resolution mechanism
 */
contract FarmMarketplace is ReentrancyGuard, Ownable, Pausable {
    // ============ State Variables ============
    IERC20 public farmToken;
    IERC721 public farmNFT;

    uint256 public platformFeePercentage = 25; // 2.5% (25/1000)
    uint256 public constant FEE_DENOMINATOR = 1000;
    uint256 public disputeResolutionTime = 7 days;

    uint256 private _listingIdCounter;
    uint256 private _offerIdCounter;

    // Listing states
    enum ListingStatus { ACTIVE, SOLD, CANCELLED }
    enum OfferStatus { PENDING, ACCEPTED, REJECTED, CANCELLED }
    enum DisputeStatus { NONE, RAISED, RESOLVED }

    // ============ Structures ============
    struct Listing {
        uint256 id;
        address seller;
        uint256 nftTokenId;
        uint256 priceInFARM;
        ListingStatus status;
        uint256 createdAt;
        string description;
    }

    struct Offer {
        uint256 id;
        uint256 listingId;
        address buyer;
        uint256 offerAmount;
        OfferStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }

    struct Escrow {
        uint256 listingId;
        address buyer;
        address seller;
        uint256 amount;
        bool buyerConfirmed;
        bool sellerConfirmed;
        DisputeStatus disputeStatus;
        uint256 disputeRaisedAt;
    }

    // ============ Mappings ============
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer) public offers;
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerOffers;
    mapping(uint256 => uint256[]) public listingOffers;
    mapping(address => uint256) public platformFeeBalance;

    // ============ Events ============
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed nftTokenId,
        uint256 price
    );
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    event OfferMade(
        uint256 indexed offerId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount
    );
    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed listingId,
        address indexed seller
    );
    event OfferRejected(uint256 indexed offerId, address indexed seller);
    event EscrowCreated(uint256 indexed listingId, address buyer, address seller);
    event BuyerConfirmed(uint256 indexed listingId, address indexed buyer);
    event SellerConfirmed(uint256 indexed listingId, address indexed seller);
    event DisputeRaised(uint256 indexed listingId, address indexed raiser);
    event DisputeResolved(uint256 indexed listingId, address indexed winner);
    event PlatformFeeWithdrawn(address indexed owner, uint256 amount);

    // ============ Modifiers ============
    modifier validListing(uint256 listingId) {
        require(listings[listingId].createdAt != 0, "Marketplace: listing does not exist");
        _;
    }

    modifier validOffer(uint256 offerId) {
        require(offers[offerId].createdAt != 0, "Marketplace: offer does not exist");
        _;
    }

    modifier listingActive(uint256 listingId) {
        require(
            listings[listingId].status == ListingStatus.ACTIVE,
            "Marketplace: listing is not active"
        );
        _;
    }

    // ============ Constructor ============
    constructor(address _farmToken, address _farmNFT) {
        require(_farmToken != address(0), "Marketplace: invalid token address");
        require(_farmNFT != address(0), "Marketplace: invalid NFT address");

        farmToken = IERC20(_farmToken);
        farmNFT = IERC721(_farmNFT);
    }

    // ============ Listing Functions ============
    /**
     * @dev Create a new listing
     * @param nftTokenId NFT token ID to list
     * @param priceInFARM Price in FARM tokens
     * @param description Product description
     */
    function createListing(
        uint256 nftTokenId,
        uint256 priceInFARM,
        string memory description
    ) public whenNotPaused returns (uint256) {
        require(farmNFT.ownerOf(nftTokenId) == msg.sender, "Marketplace: not NFT owner");
        require(priceInFARM > 0, "Marketplace: price must be greater than 0");
        require(bytes(description).length > 0, "Marketplace: description cannot be empty");

        uint256 listingId = _listingIdCounter++;

        listings[listingId] = Listing({
            id: listingId,
            seller: msg.sender,
            nftTokenId: nftTokenId,
            priceInFARM: priceInFARM,
            status: ListingStatus.ACTIVE,
            createdAt: block.timestamp,
            description: description
        });

        sellerListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, msg.sender, nftTokenId, priceInFARM);

        return listingId;
    }

    /**
     * @dev Cancel a listing
     * @param listingId Listing ID to cancel
     */
    function cancelListing(uint256 listingId) public validListing(listingId) nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: only seller can cancel");
        require(listing.status == ListingStatus.ACTIVE, "Marketplace: listing not active");

        listing.status = ListingStatus.CANCELLED;

        emit ListingCancelled(listingId, msg.sender);
    }

    // ============ Offer Functions ============
    /**
     * @dev Make an offer on a listing
     * @param listingId Listing ID
     * @param offerAmount Amount in FARM tokens
     * @param expiresIn Offer expiration time in seconds
     */
    function makeOffer(
        uint256 listingId,
        uint256 offerAmount,
        uint256 expiresIn
    ) public listingActive(listingId) whenNotPaused returns (uint256) {
        require(offerAmount > 0, "Marketplace: offer amount must be greater than 0");
        require(expiresIn > 0, "Marketplace: expiration time must be greater than 0");
        require(
            farmToken.balanceOf(msg.sender) >= offerAmount,
            "Marketplace: insufficient balance"
        );

        uint256 offerId = _offerIdCounter++;

        offers[offerId] = Offer({
            id: offerId,
            listingId: listingId,
            buyer: msg.sender,
            offerAmount: offerAmount,
            status: OfferStatus.PENDING,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + expiresIn
        });

        buyerOffers[msg.sender].push(offerId);
        listingOffers[listingId].push(offerId);

        emit OfferMade(offerId, listingId, msg.sender, offerAmount);

        return offerId;
    }

    /**
     * @dev Accept an offer
     * @param offerId Offer ID to accept
     */
    function acceptOffer(uint256 offerId) public validOffer(offerId) nonReentrant whenNotPaused {
        Offer storage offer = offers[offerId];
        Listing storage listing = listings[offer.listingId];

        require(listing.seller == msg.sender, "Marketplace: only seller can accept");
        require(offer.status == OfferStatus.PENDING, "Marketplace: offer not pending");
        require(block.timestamp <= offer.expiresAt, "Marketplace: offer has expired");
        require(
            farmToken.balanceOf(offer.buyer) >= offer.offerAmount,
            "Marketplace: buyer has insufficient balance"
        );

        offer.status = OfferStatus.ACCEPTED;
        listing.status = ListingStatus.SOLD;

        // Create escrow
        escrows[listing.id] = Escrow({
            listingId: listing.id,
            buyer: offer.buyer,
            seller: listing.seller,
            amount: offer.offerAmount,
            buyerConfirmed: false,
            sellerConfirmed: false,
            disputeStatus: DisputeStatus.NONE,
            disputeRaisedAt: 0
        });

        // Transfer tokens from buyer to escrow
        require(
            farmToken.transferFrom(offer.buyer, address(this), offer.offerAmount),
            "Marketplace: token transfer failed"
        );

        emit OfferAccepted(offerId, offer.listingId, msg.sender);
        emit EscrowCreated(listing.id, offer.buyer, listing.seller);
    }

    /**
     * @dev Reject an offer
     * @param offerId Offer ID to reject
     */
    function rejectOffer(uint256 offerId) public validOffer(offerId) {
        Offer storage offer = offers[offerId];
        Listing storage listing = listings[offer.listingId];

        require(listing.seller == msg.sender, "Marketplace: only seller can reject");
        require(offer.status == OfferStatus.PENDING, "Marketplace: offer not pending");

        offer.status = OfferStatus.REJECTED;

        emit OfferRejected(offerId, msg.sender);
    }

    // ============ Escrow & Settlement Functions ============
    /**
     * @dev Confirm receipt and completion by buyer
     * @param listingId Listing ID
     */
    function buyerConfirmReceipt(uint256 listingId) public validListing(listingId) nonReentrant {
        Escrow storage escrow = escrows[listingId];
        require(escrow.buyer == msg.sender, "Marketplace: only buyer can confirm");
        require(!escrow.buyerConfirmed, "Marketplace: buyer already confirmed");

        escrow.buyerConfirmed = true;

        emit BuyerConfirmed(listingId, msg.sender);

        _trySettleEscrow(listingId);
    }

    /**
     * @dev Confirm shipment by seller
     * @param listingId Listing ID
     */
    function sellerConfirmShipment(uint256 listingId) public validListing(listingId) nonReentrant {
        Escrow storage escrow = escrows[listingId];
        Listing storage listing = listings[listingId];

        require(escrow.seller == msg.sender, "Marketplace: only seller can confirm");
        require(!escrow.sellerConfirmed, "Marketplace: seller already confirmed");

        // Verify NFT ownership transfer
        require(farmNFT.ownerOf(listing.nftTokenId) == escrow.buyer, "Marketplace: NFT not transferred");

        escrow.sellerConfirmed = true;

        emit SellerConfirmed(listingId, msg.sender);

        _trySettleEscrow(listingId);
    }

    /**
     * @dev Raise a dispute if transaction fails
     * @param listingId Listing ID
     */
    function raiseDispute(uint256 listingId) public validListing(listingId) {
        Escrow storage escrow = escrows[listingId];
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Marketplace: only buyer or seller can raise dispute"
        );
        require(escrow.disputeStatus == DisputeStatus.NONE, "Marketplace: dispute already raised");

        escrow.disputeStatus = DisputeStatus.RAISED;
        escrow.disputeRaisedAt = block.timestamp;

        emit DisputeRaised(listingId, msg.sender);
    }

    /**
     * @dev Resolve dispute (owner/admin function)
     * @param listingId Listing ID
     * @param payToBuyer If true, refund buyer; if false, pay seller
     */
    function resolveDispute(uint256 listingId, bool payToBuyer) public onlyOwner {
        Escrow storage escrow = escrows[listingId];
        require(escrow.disputeStatus == DisputeStatus.RAISED, "Marketplace: no dispute to resolve");
        require(
            block.timestamp >= escrow.disputeRaisedAt + disputeResolutionTime,
            "Marketplace: resolution period not elapsed"
        );

        escrow.disputeStatus = DisputeStatus.RESOLVED;

        address winner = payToBuyer ? escrow.buyer : escrow.seller;
        uint256 platformFee = (escrow.amount * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 paymentAmount = escrow.amount - platformFee;

        platformFeeBalance[owner()] += platformFee;

        require(farmToken.transfer(winner, paymentAmount), "Marketplace: transfer failed");

        emit DisputeResolved(listingId, winner);
    }

    /**
     * @dev Internal function to settle escrow when both parties confirm
     */
    function _trySettleEscrow(uint256 listingId) internal {
        Escrow storage escrow = escrows[listingId];

        if (escrow.buyerConfirmed && escrow.sellerConfirmed) {
            // Calculate fees
            uint256 platformFee = (escrow.amount * platformFeePercentage) / FEE_DENOMINATOR;
            uint256 sellerPayment = escrow.amount - platformFee;

            platformFeeBalance[owner()] += platformFee;

            // Pay seller
            require(farmToken.transfer(escrow.seller, sellerPayment), "Marketplace: seller payment failed");

            // NFT should already be transferred by seller confirmation check
        }
    }

    // ============ Admin Functions ============
    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() public onlyOwner nonReentrant {
        uint256 amount = platformFeeBalance[msg.sender];
        require(amount > 0, "Marketplace: no fees to withdraw");

        platformFeeBalance[msg.sender] = 0;

        require(farmToken.transfer(msg.sender, amount), "Marketplace: fee withdrawal failed");

        emit PlatformFeeWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Set platform fee percentage
     * @param newFeePercentage New fee in basis points (25 = 2.5%)
     */
    function setPlatformFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 100, "Marketplace: fee cannot exceed 10%");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Pause/unpause marketplace
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // ============ View Functions ============
    function getListingsCount() public view returns (uint256) {
        return _listingIdCounter;
    }

    function getOffersCount() public view returns (uint256) {
        return _offerIdCounter;
    }

    function getSellerListingsCount(address seller) public view returns (uint256) {
        return sellerListings[seller].length;
    }

    function getBuyerOffersCount(address buyer) public view returns (uint256) {
        return buyerOffers[buyer].length;
    }

    function getListingOffers(uint256 listingId) public view returns (uint256[] memory) {
        return listingOffers[listingId];
    }
}
