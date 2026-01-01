// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

/**
 * @title FarmToken
 * @dev FarmChain's native ERC20 token with advanced features
 * - Burnable: Users can burn their tokens
 * - Pausable: Owner can pause all transfers in emergencies
 * - Permit: Enables gasless approvals via EIP-2612
 * - FlashMint: Allows flash minting for DeFi integrations
 */
contract FarmToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    Ownable,
    ERC20Permit,
    ERC20FlashMint
{
    // Constants
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event TransfersPaused();
    event TransfersUnpaused();

    /**
     * @dev Initialize FarmToken with initial supply minted to owner
     */
    constructor() ERC20("FarmChain Token", "FARM") ERC20Permit("FarmChain Token") {
        _mint(msg.sender, INITIAL_SUPPLY);
        emit TokensMinted(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Pause all token transfers
     * Only owner can call this
     */
    function pause() public onlyOwner {
        _pause();
        emit TransfersPaused();
    }

    /**
     * @dev Unpause all token transfers
     * Only owner can call this
     */
    function unpause() public onlyOwner {
        _unpause();
        emit TransfersUnpaused();
    }

    /**
     * @dev Mint new tokens
     * Only owner can call this
     * @param to Recipient address
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "FarmToken: cannot mint to zero address");
        require(amount > 0, "FarmToken: mint amount must be greater than 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burn tokens from sender
     * Overrides ERC20Burnable to emit event
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public override {
        require(amount > 0, "FarmToken: burn amount must be greater than 0");
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from a specific address
     * Requires approval from the token holder
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) public override {
        require(from != address(0), "FarmToken: cannot burn from zero address");
        require(amount > 0, "FarmToken: burn amount must be greater than 0");
        super.burnFrom(from, amount);
        emit TokensBurned(from, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, amount);
    }

    function nonces(address owner) public view override(ERC20Permit) returns (uint256) {
        return super.nonces(owner);
    }
}
