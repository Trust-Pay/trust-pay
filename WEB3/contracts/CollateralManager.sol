// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Collateral Manager
 * @dev Manages ETF token collateral for SPAY stablecoin
 */
contract CollateralManager is AccessControl, Pausable {
    using SafeERC20 for IERC20;
    
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Collateralization ratio (110% = 11000 / 10000)
    uint256 public collateralRatioBps = 11000;
    
    // Minimum collateralization ratio before rebalancing (105% = 10500 / 10000)
    uint256 public minCollateralRatioBps = 10500;
    
    // Contract addresses
    address public spayToken;
    address public etfToken;
    
    // Total collateral locked
    uint256 public totalCollateralLocked;
    
    // Events
    event CollateralLocked(uint256 amount);
    event CollateralReleased(uint256 amount);
    event CollateralRatioUpdated(uint256 newRatioBps);
    
    constructor(address _spayToken, address _etfToken) {
        require(_spayToken != address(0), "Invalid SPAY address");
        require(_etfToken != address(0), "Invalid ETF address");
        
        spayToken = _spayToken;
        etfToken = _etfToken;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Locks ETF tokens as collateral for SPAY
     * @param amount The amount of ETF tokens to lock
     */
    function lockCollateral(uint256 amount) external onlyRole(MANAGER_ROLE) whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer ETF tokens from sender to this contract
        IERC20(etfToken).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update total collateral
        totalCollateralLocked += amount;
        
        emit CollateralLocked(amount);
    }
    
    /**
     * @dev Releases ETF tokens from collateral
     * @param amount The amount of ETF tokens to release
     * @param recipient The address to receive the released tokens
     */
    function releaseCollateral(uint256 amount, address recipient) external onlyRole(MANAGER_ROLE) whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalCollateralLocked, "Insufficient collateral");
        require(recipient != address(0), "Invalid recipient");
        
        // Check if releasing would maintain minimum collateral ratio
        uint256 spaySupply = IERC20(spayToken).totalSupply();
        uint256 etfPrice = getETFPriceUSD();
        uint256 remainingCollateralValue = ((totalCollateralLocked - amount) * etfPrice) / 1e18;
        
        // If SPAY supply is 0, we can release all collateral
        if (spaySupply > 0) {
            uint256 currentRatio = (remainingCollateralValue * 10000) / spaySupply;
            require(currentRatio >= minCollateralRatioBps, "Below minimum collateral ratio");
        }
        
        // Update total collateral
        totalCollateralLocked -= amount;
        
        // Transfer ETF tokens to recipient
        IERC20(etfToken).safeTransfer(recipient, amount);
        
        emit CollateralReleased(amount);
    }
    
    /**
     * @dev Gets the current collateral ratio
     * @return The current collateral ratio in basis points
     */
    function getCollateralRatio() public view returns (uint256) {
        uint256 spaySupply = IERC20(spayToken).totalSupply();
        
        // If no SPAY tokens exist, return max value
        if (spaySupply == 0) {
            return type(uint256).max;
        }
        
        uint256 etfPrice = getETFPriceUSD();
        uint256 collateralValue = (totalCollateralLocked * etfPrice) / 1e18;
        
        return (collateralValue * 10000) / spaySupply;
    }
    
    /**
     * @dev Gets the ETF price in USD from the ETF token contract
     * @return The ETF price in USD (18 decimals)
     */
    function getETFPriceUSD() public view returns (uint256) {
        // Call the ETF token contract to get the price
        // For hackathon purposes, we're assuming the ETFToken has a getETFPriceUSD function
        (bool success, bytes memory data) = etfToken.staticcall(
            abi.encodeWithSignature("getETFPriceUSD()")
        );
        
        require(success, "Failed to get ETF price");
        return abi.decode(data, (uint256));
    }
    
    /**
     * @dev Updates the collateralization ratio
     * @param newRatioBps The new collateralization ratio in basis points
     */
    function updateCollateralRatio(uint256 newRatioBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRatioBps >= 10000, "Ratio must be at least 100%");
        collateralRatioBps = newRatioBps;
        
        emit CollateralRatioUpdated(newRatioBps);
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
