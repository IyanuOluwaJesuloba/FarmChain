// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title FarmNFT
 * @dev ERC721 NFT for digital certificates of crops/harvests
 * Features:
 * - Burnable: Tokens can be burned
 * - Enumerable: Can list all tokens
 * - Metadata: URI-based metadata for crop information
 */
contract FarmNFT is ERC721, ERC721Burnable, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to crop data
    mapping(uint256 => CropData) public cropData;

    // Mapping from farmer address to their crop tokens
    mapping(address => uint256[]) public farmerCrops;

    // Mapping to track if a token exists
    mapping(uint256 => bool) public tokenExists;

    // Base URI for token metadata
    string private _baseTokenURI;

    /**
     * @dev Crop metadata structure
     */
    struct CropData {
        string cropType; // e.g., "Maize", "Wheat"
        string harvestLocation; // GPS or text location
        uint256 harvestDate; // Unix timestamp
        uint256 quantity; // In kilograms
        string qualityGrade; // e.g., "A", "B", "C"
        address farmerAddress; // Original farmer
        uint256 issuedDate; // When NFT was minted
        string ipfsHash; // IPFS hash for detailed metadata
    }

    // Events
    event CropNFTMinted(
        uint256 indexed tokenId,
        address indexed farmer,
        string cropType,
        uint256 quantity
    );
    event CropNFTBurned(uint256 indexed tokenId, address indexed owner);
    event CropDataUpdated(uint256 indexed tokenId, string newIpfsHash);
    event BaseURIUpdated(string newBaseURI);

    /**
     * @dev Initialize FarmNFT
     * @param baseURI Base URI for metadata
     */
    constructor(string memory baseURI) ERC721("FarmChain Crop NFT", "FCROP") {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mint a new crop NFT
     * Only owner can call this (in production, should be a verified oracle/backend)
     * @param to Address to mint to
     * @param cropType Type of crop
     * @param harvestLocation Location where crop was harvested
     * @param harvestDate Harvest date timestamp
     * @param quantity Amount in kilograms
     * @param qualityGrade Quality grade of the crop
     * @param ipfsHash IPFS hash for detailed metadata
     */
    function mintCropNFT(
        address to,
        string memory cropType,
        string memory harvestLocation,
        uint256 harvestDate,
        uint256 quantity,
        string memory qualityGrade,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "FarmNFT: cannot mint to zero address");
        require(quantity > 0, "FarmNFT: quantity must be greater than 0");
        require(harvestDate <= block.timestamp, "FarmNFT: harvest date cannot be in future");
        require(bytes(cropType).length > 0, "FarmNFT: crop type cannot be empty");
        require(bytes(ipfsHash).length > 0, "FarmNFT: IPFS hash cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Store crop data
        cropData[tokenId] = CropData({
            cropType: cropType,
            harvestLocation: harvestLocation,
            harvestDate: harvestDate,
            quantity: quantity,
            qualityGrade: qualityGrade,
            farmerAddress: to,
            issuedDate: block.timestamp,
            ipfsHash: ipfsHash
        });

        tokenExists[tokenId] = true;
        farmerCrops[to].push(tokenId);

        _safeMint(to, tokenId);

        emit CropNFTMinted(tokenId, to, cropType, quantity);

        return tokenId;
    }

    /**
     * @dev Update IPFS hash for crop metadata
     * Only token owner can call this
     * @param tokenId Token ID
     * @param newIpfsHash New IPFS hash
     */
    function updateCropMetadata(uint256 tokenId, string memory newIpfsHash) public {
        require(tokenExists[tokenId], "FarmNFT: token does not exist");
        require(ownerOf(tokenId) == msg.sender, "FarmNFT: only owner can update");
        require(bytes(newIpfsHash).length > 0, "FarmNFT: IPFS hash cannot be empty");

        cropData[tokenId].ipfsHash = newIpfsHash;
        emit CropDataUpdated(tokenId, newIpfsHash);
    }

    /**
     * @dev Get crop data for a token
     * @param tokenId Token ID
     */
    function getCropData(uint256 tokenId) public view returns (CropData memory) {
        require(tokenExists[tokenId], "FarmNFT: token does not exist");
        return cropData[tokenId];
    }

    /**
     * @dev Get all crop tokens for a farmer
     * @param farmer Farmer address
     */
    function getFarmerCrops(address farmer) public view returns (uint256[] memory) {
        return farmerCrops[farmer];
    }

    /**
     * @dev Set base URI for metadata
     * Only owner can call this
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        require(bytes(newBaseURI).length > 0, "FarmNFT: base URI cannot be empty");
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Override tokenURI to return IPFS-based URI
     * @param tokenId Token ID
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(tokenExists[tokenId], "FarmNFT: token does not exist");
        return string(
            abi.encodePacked(_baseTokenURI, "/", cropData[tokenId].ipfsHash)
        );
    }

    /**
     * @dev Burn a crop NFT
     * Only owner can call this
     * @param tokenId Token ID to burn
     */
    function burnCrop(uint256 tokenId) public {
        require(tokenExists[tokenId], "FarmNFT: token does not exist");
        require(ownerOf(tokenId) == msg.sender, "FarmNFT: only owner can burn");

        tokenExists[tokenId] = false;
        _burn(tokenId);

        emit CropNFTBurned(tokenId, msg.sender);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
