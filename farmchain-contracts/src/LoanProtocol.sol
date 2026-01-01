// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LoanProtocol
 * @dev Decentralized lending protocol for farmers
 * Features:
 * - Create loans with collateral (NFT or tokens)
 * - Flexible repayment terms
 * - Interest calculation
 * - Default handling
 */
contract LoanProtocol is ReentrancyGuard, Ownable, Pausable {
    // ============ State Variables ============
    IERC20 public farmToken;
    IERC721 public farmNFT;

    uint256 public platformFeePercentage = 50; // 5% (50/1000)
    uint256 public constant FEE_DENOMINATOR = 1000;
    uint256 public constant MAX_APR = 36500; // 365% annual

    uint256 private _loanIdCounter;

    // Loan states
    enum LoanStatus {
        ACTIVE,
        REPAID,
        DEFAULTED,
        CANCELLED
    }

    enum CollateralType {
        ERC20,
        ERC721
    }

    // ============ Structures ============
    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 principalAmount;
        uint256 interestRateAPR; // Annual Percentage Rate (in basis points, e.g., 1000 = 10%)
        uint256 loanDurationDays;
        uint256 createdAt;
        uint256 dueDate;
        uint256 repaidAmount;
        LoanStatus status;
        CollateralType collateralType;
        address collateralAddress;
        uint256 collateralTokenId; // For NFTs
        uint256 collateralAmount; // For ERC20
    }

    struct LoanOffer {
        uint256 id;
        address lender;
        uint256 principalAmount;
        uint256 interestRateAPR;
        uint256 loanDurationDays;
        uint256 createdAt;
        uint256 expiresAt;
        bool active;
    }

    // ============ Mappings ============
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => LoanOffer) public loanOffers;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    mapping(address => uint256) public platformFeeBalance;

    // ============ Events ============
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint256 principal,
        uint256 interestRate
    );
    event LoanOfferCreated(
        uint256 indexed offerId,
        address indexed lender,
        uint256 principal,
        uint256 interestRate
    );
    event LoanRepaid(uint256 indexed loanId, uint256 amount, uint256 timestamp);
    event LoanDefaulted(uint256 indexed loanId, address indexed lender);
    event CollateralClaimed(uint256 indexed loanId, address indexed lender);
    event LoanCancelled(uint256 indexed loanId);

    // ============ Modifiers ============
    modifier validLoan(uint256 loanId) {
        require(loans[loanId].createdAt != 0, "LoanProtocol: loan does not exist");
        _;
    }

    modifier loanActive(uint256 loanId) {
        require(loans[loanId].status == LoanStatus.ACTIVE, "LoanProtocol: loan not active");
        _;
    }

    // ============ Constructor ============
    constructor(address _farmToken, address _farmNFT) {
        require(_farmToken != address(0), "LoanProtocol: invalid token address");
        require(_farmNFT != address(0), "LoanProtocol: invalid NFT address");

        farmToken = IERC20(_farmToken);
        farmNFT = IERC721(_farmNFT);
    }

    // ============ Loan Creation Functions ============
    /**
     * @dev Create a new loan with NFT collateral
     * @param lender Address of the lender
     * @param principal Loan amount in FARM tokens
     * @param interestRateAPR Annual interest rate in basis points
     * @param loanDurationDays Loan duration in days
     * @param nftTokenId NFT token ID as collateral
     */
    function createLoanWithNFTCollateral(
        address lender,
        uint256 principal,
        uint256 interestRateAPR,
        uint256 loanDurationDays,
        uint256 nftTokenId
    ) public whenNotPaused returns (uint256) {
        require(lender != address(0), "LoanProtocol: invalid lender address");
        require(principal > 0, "LoanProtocol: principal must be greater than 0");
        require(interestRateAPR <= MAX_APR, "LoanProtocol: interest rate too high");
        require(loanDurationDays > 0, "LoanProtocol: duration must be greater than 0");
        require(farmNFT.ownerOf(nftTokenId) == msg.sender, "LoanProtocol: not NFT owner");

        // Transfer NFT to contract as collateral
        farmNFT.transferFrom(msg.sender, address(this), nftTokenId);

        uint256 loanId = _createLoan(
            lender,
            principal,
            interestRateAPR,
            loanDurationDays,
            CollateralType.ERC721,
            address(farmNFT),
            nftTokenId,
            0
        );

        return loanId;
    }

    /**
     * @dev Create a new loan with ERC20 token collateral
     * @param lender Address of the lender
     * @param principal Loan amount in FARM tokens
     * @param interestRateAPR Annual interest rate in basis points
     * @param loanDurationDays Loan duration in days
     * @param collateralAmount Amount of ERC20 tokens as collateral
     * @param collateralToken Address of collateral token
     */
    function createLoanWithERC20Collateral(
        address lender,
        uint256 principal,
        uint256 interestRateAPR,
        uint256 loanDurationDays,
        uint256 collateralAmount,
        address collateralToken
    ) public whenNotPaused returns (uint256) {
        require(lender != address(0), "LoanProtocol: invalid lender address");
        require(principal > 0, "LoanProtocol: principal must be greater than 0");
        require(interestRateAPR <= MAX_APR, "LoanProtocol: interest rate too high");
        require(loanDurationDays > 0, "LoanProtocol: duration must be greater than 0");
        require(collateralAmount > 0, "LoanProtocol: collateral must be greater than 0");
        require(collateralToken != address(0), "LoanProtocol: invalid collateral token");

        // Transfer collateral to contract
        IERC20(collateralToken).transferFrom(msg.sender, address(this), collateralAmount);

        uint256 loanId = _createLoan(
            lender,
            principal,
            interestRateAPR,
            loanDurationDays,
            CollateralType.ERC20,
            collateralToken,
            0,
            collateralAmount
        );

        return loanId;
    }

    /**
     * @dev Internal function to create a loan
     */
    function _createLoan(
        address lender,
        uint256 principal,
        uint256 interestRateAPR,
        uint256 loanDurationDays,
        CollateralType collateralType,
        address collateralAddress,
        uint256 collateralTokenId,
        uint256 collateralAmount
    ) internal nonReentrant returns (uint256) {
        require(farmToken.balanceOf(lender) >= principal, "LoanProtocol: lender insufficient balance");

        uint256 loanId = _loanIdCounter++;

        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            lender: lender,
            principalAmount: principal,
            interestRateAPR: interestRateAPR,
            loanDurationDays: loanDurationDays,
            createdAt: block.timestamp,
            dueDate: block.timestamp + (loanDurationDays * 1 days),
            repaidAmount: 0,
            status: LoanStatus.ACTIVE,
            collateralType: collateralType,
            collateralAddress: collateralAddress,
            collateralTokenId: collateralTokenId,
            collateralAmount: collateralAmount
        });

        borrowerLoans[msg.sender].push(loanId);
        lenderLoans[lender].push(loanId);

        // Transfer loan amount from lender to borrower
        require(
            farmToken.transferFrom(lender, msg.sender, principal),
            "LoanProtocol: transfer from lender failed"
        );

        emit LoanCreated(loanId, msg.sender, lender, principal, interestRateAPR);

        return loanId;
    }

    // ============ Repayment Functions ============
    /**
     * @dev Repay a loan
     * @param loanId Loan ID to repay
     */
    function repayLoan(uint256 loanId) public loanActive(loanId) nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "LoanProtocol: only borrower can repay");

        uint256 amountDue = calculateAmountDue(loanId);
        require(farmToken.balanceOf(msg.sender) >= amountDue, "LoanProtocol: insufficient balance");

        // Calculate platform fee
        uint256 platformFee = (loan.principalAmount * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 lenderPayment = amountDue - platformFee;

        platformFeeBalance[owner()] += platformFee;

        // Transfer repayment
        require(
            farmToken.transferFrom(msg.sender, address(this), amountDue),
            "LoanProtocol: transfer failed"
        );

        // Pay lender
        require(farmToken.transfer(loan.lender, lenderPayment), "LoanProtocol: lender payment failed");

        // Release collateral
        _releaseCollateral(loanId);

        loan.repaidAmount = amountDue;
        loan.status = LoanStatus.REPAID;

        emit LoanRepaid(loanId, amountDue, block.timestamp);
    }

    /**
     * @dev Partial repayment of loan
     * @param loanId Loan ID
     * @param amount Amount to repay
     */
    function partialRepayment(uint256 loanId, uint256 amount) public loanActive(loanId) nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "LoanProtocol: only borrower can repay");
        require(amount > 0, "LoanProtocol: amount must be greater than 0");
        require(amount <= calculateAmountDue(loanId), "LoanProtocol: repayment exceeds amount due");

        // Calculate platform fee based on repayment
        uint256 platformFee = (amount * platformFeePercentage) / FEE_DENOMINATOR;
        uint256 lenderPayment = amount - platformFee;

        platformFeeBalance[owner()] += platformFee;

        // Transfer repayment
        require(
            farmToken.transferFrom(msg.sender, address(this), amount),
            "LoanProtocol: transfer failed"
        );

        // Pay lender
        require(farmToken.transfer(loan.lender, lenderPayment), "LoanProtocol: lender payment failed");

        loan.repaidAmount += amount;

        emit LoanRepaid(loanId, amount, block.timestamp);
    }

    // ============ Default & Collateral Functions ============
    /**
     * @dev Claim collateral if loan is defaulted
     * @param loanId Loan ID
     */
    function claimCollateral(uint256 loanId) public validLoan(loanId) nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.lender == msg.sender, "LoanProtocol: only lender can claim collateral");
        require(loan.status == LoanStatus.ACTIVE, "LoanProtocol: loan not active");
        require(block.timestamp > loan.dueDate, "LoanProtocol: loan not yet due");

        if (loan.collateralType == CollateralType.ERC721) {
            farmNFT.transferFrom(address(this), loan.lender, loan.collateralTokenId);
        } else {
            IERC20(loan.collateralAddress).transfer(loan.lender, loan.collateralAmount);
        }

        loan.status = LoanStatus.DEFAULTED;

        emit LoanDefaulted(loanId, loan.lender);
        emit CollateralClaimed(loanId, loan.lender);
    }

    /**
     * @dev Internal function to release collateral
     */
    function _releaseCollateral(uint256 loanId) internal {
        Loan storage loan = loans[loanId];

        if (loan.collateralType == CollateralType.ERC721) {
            farmNFT.transferFrom(address(this), loan.borrower, loan.collateralTokenId);
        } else {
            IERC20(loan.collateralAddress).transfer(loan.borrower, loan.collateralAmount);
        }

        emit CollateralClaimed(loanId, loan.borrower);
    }

    // ============ Calculation Functions ============
    /**
     * @dev Calculate total amount due including interest
     * @param loanId Loan ID
     */
    function calculateAmountDue(uint256 loanId) public view validLoan(loanId) returns (uint256) {
        Loan storage loan = loans[loanId];

        if (loan.status != LoanStatus.ACTIVE) {
            return 0;
        }

        // Calculate interest
        uint256 timeElapsedDays = (block.timestamp - loan.createdAt) / 1 days;
        uint256 daysToCharge = timeElapsedDays > loan.loanDurationDays
            ? loan.loanDurationDays
            : timeElapsedDays;

        uint256 interest = (loan.principalAmount * loan.interestRateAPR * daysToCharge) / (365 * FEE_DENOMINATOR);

        return loan.principalAmount + interest - loan.repaidAmount;
    }

    /**
     * @dev Calculate daily interest
     * @param loanId Loan ID
     */
    function calculateDailyInterest(uint256 loanId) public view validLoan(loanId) returns (uint256) {
        Loan storage loan = loans[loanId];
        return (loan.principalAmount * loan.interestRateAPR) / (365 * FEE_DENOMINATOR);
    }

    // ============ Admin Functions ============
    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() public onlyOwner nonReentrant {
        uint256 amount = platformFeeBalance[msg.sender];
        require(amount > 0, "LoanProtocol: no fees to withdraw");

        platformFeeBalance[msg.sender] = 0;

        require(farmToken.transfer(msg.sender, amount), "LoanProtocol: fee withdrawal failed");
    }

    /**
     * @dev Set platform fee percentage
     * @param newFeePercentage New fee in basis points (50 = 5%)
     */
    function setPlatformFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 200, "LoanProtocol: fee cannot exceed 20%");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Pause/unpause protocol
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // ============ View Functions ============
    function getLoansCount() public view returns (uint256) {
        return _loanIdCounter;
    }

    function getBorrowerLoansCount(address borrower) public view returns (uint256) {
        return borrowerLoans[borrower].length;
    }

    function getLenderLoansCount(address lender) public view returns (uint256) {
        return lenderLoans[lender].length;
    }
}
