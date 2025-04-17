// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Investment Manager
 * @dev Manages employee investments in ETF tokens
 */
contract InvestmentManager is AccessControl, Pausable {
    using SafeERC20 for IERC20;
    
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Contract addresses
    address public spayToken;
    address public etfToken;
    address public collateralManager;
    
    // Investment percentage (10% = 1000 / 10000)
    uint256 public investmentPercentageBps = 1000;
    
    // User investments
    mapping(address => uint256) public userInvestments;
    
    // Events
    event InvestmentMade(address indexed user, uint256 spayAmount, uint256 etfAmount);
    event InvestmentWithdrawn(address indexed user, uint256 etfAmount, uint256 spayAmount);
    event InvestmentPercentageUpdated(uint256 newPercentageBps);
    
    constructor(address _spayToken, address _etfToken, address _collateralManager) {
        require(_spayToken != address(0), "Invalid SPAY address");
        require(_etfToken != address(0), "Invalid ETF address");
        require(_collateralManager != address(0), "Invalid collateral manager address");
        
        spayToken = _spayToken;
        etfToken = _etfToken;
        collateralManager = _collateralManager;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Makes an investment in ETF tokens
     * @param spayAmount The amount of SPAY to invest
     */
    function invest(uint256 spayAmount) external whenNotPaused {
        require(spayAmount > 0, "Amount must be greater than 0");
        
        // Calculate ETF amount based on prices
        uint256 etfPrice = getETFPriceUSD();
        uint256 etfAmount = (spayAmount * 1e18) / etfPrice;
        
        // Transfer SPAY from user to this contract
        IERC20(spayToken).safeTransferFrom(msg.sender, address(this), spayAmount);
        
        // Mint ETF tokens to user
        // In a real implementation, we would call the ETF token contract to mint
        // For hackathon purposes, we're assuming the contract has the MINTER_ROLE
        (bool success, ) = etfToken.call(
            abi.encodeWithSignature("mint(address,uint256)", msg.sender, etfAmount)
        );
        require(success, "Failed to mint ETF tokens");
        
        // Update user investment
        userInvestments[msg.sender] += etfAmount;
        
        // Lock SPAY as collateral
        IERC20(spayToken).approve(collateralManager, spayAmount);
        (bool lockSuccess, ) = collateralManager.call(
            abi.encodeWithSignature("lockCollateral(uint256)", spayAmount)
        );
        require(lockSuccess, "Failed to lock collateral");
        
        emit InvestmentMade(msg.sender, spayAmount, etfAmount);
    }
    
    /**
     * @dev Withdraws an investment from ETF tokens
     * @param etfAmount The amount of ETF tokens to withdraw
     */
    function withdraw(uint256 etfAmount) external whenNotPaused {
        require(etfAmount > 0, "Amount must be greater than 0");
        require(userInvestments[msg.sender] >= etfAmount, "Insufficient investment");
        
        // Calculate SPAY amount based on prices
        uint256 etfPrice = getETFPriceUSD();
        uint256 spayAmount = (etfAmount * etfPrice) / 1e18;
        
        // Burn ETF tokens from user
        // In a real implementation, we would call the ETF token contract to burn
        // For hackathon purposes, we're assuming the contract has the BURNER_ROLE
        (bool success, ) = etfToken.call(
            abi.encodeWithSignature("burn(uint256)", etfAmount)
        );
        require(success, "Failed to burn ETF tokens");
        
        // Update user investment
        userInvestments[msg.sender] -= etfAmount;
        
        // Release SPAY from collateral
        (bool releaseSuccess, ) = collateralManager.call(
            abi.encodeWithSignature("releaseCollateral(uint256,address)", spayAmount, address(this))
        );
        require(releaseSuccess, "Failed to release collateral");
        
        // Transfer SPAY to user
        IERC20(spayToken).safeTransfer(msg.sender, spayAmount);
        
        emit InvestmentWithdrawn(msg.sender, etfAmount, spayAmount);
    }
    
    /**
     * @dev Gets the ETF price in USD from the ETF token contract
     * @return The ETF price in USD (18 decimals)
     */
    function getETFPriceUSD() public view returns (uint256) {
        // Call the ETF token contract to get the price
        (bool success, bytes memory data) = etfToken.staticcall(
            abi.encodeWithSignature("getETFPriceUSD()")
        );
        
        require(success, "Failed to get ETF price");
        return abi.decode(data, (uint256));
    }
    
    /**
     * @dev Updates the investment percentage
     * @param newPercentageBps The new investment percentage in basis points
     */
    function updateInvestmentPercentage(uint256 newPercentageBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newPercentageBps <= 5000, "Percentage cannot exceed 50%");
        investmentPercentageBps = newPercentageBps;
        
        emit InvestmentPercentageUpdated(newPercentageBps);
    }
    
    /**
     * @dev Pauses the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
