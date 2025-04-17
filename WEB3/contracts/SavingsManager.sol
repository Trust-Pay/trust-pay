// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Savings Manager
 * @dev Manages employee savings in SPAY tokens
 */
contract SavingsManager is AccessControl, Pausable {
    using SafeERC20 for IERC20;
    
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // SPAY token address
    address public spayToken;
    
    // Savings lock period (30 days in seconds)
    uint256 public lockPeriod = 30 days;
    
    // Savings data
    struct SavingsData {
        uint256 amount;
        uint256 unlockTime;
    }
    
    // Mapping of user address to savings data
    mapping(address => SavingsData) public userSavings;
    
    // Events
    event SavingsLocked(address indexed user, uint256 amount, uint256 unlockTime);
    event SavingsWithdrawn(address indexed user, uint256 amount);
    event LockPeriodUpdated(uint256 newPeriod);
    
    constructor(address _spayToken) {
        require(_spayToken != address(0), "Invalid SPAY address");
        
        spayToken = _spayToken;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Locks SPAY tokens for savings
     * @param amount The amount of SPAY to lock
     */
    function lockSavings(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer SPAY from user to this contract
        IERC20(spayToken).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user savings
        SavingsData storage savings = userSavings[msg.sender];
        savings.amount += amount;
        savings.unlockTime = block.timestamp + lockPeriod;
        
        emit SavingsLocked(msg.sender, amount, savings.unlockTime);
    }
    
    /**
     * @dev Withdraws locked SPAY tokens after lock period
     */
    function withdrawSavings() external whenNotPaused {
        SavingsData storage savings = userSavings[msg.sender];
        require(savings.amount > 0, "No savings to withdraw");
        require(block.timestamp >= savings.unlockTime, "Savings still locked");
        
        uint256 amount = savings.amount;
        
        // Reset user savings
        savings.amount = 0;
        savings.unlockTime = 0;
        
        // Transfer SPAY to user
        IERC20(spayToken).safeTransfer(msg.sender, amount);
        
        emit SavingsWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Gets the remaining lock time for a user's savings
     * @param user The user's address
     * @return The remaining lock time in seconds (0 if unlocked)
     */
    function getRemainingLockTime(address user) external view returns (uint256) {
        SavingsData storage savings = userSavings[user];
        
        if (savings.unlockTime <= block.timestamp) {
            return 0;
        }
        
        return savings.unlockTime - block.timestamp;
    }
    
    /**
     * @dev Updates the lock period
     * @param newPeriod The new lock period in seconds
     */
    function updateLockPeriod(uint256 newPeriod) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newPeriod > 0, "Lock period must be greater than 0");
        lockPeriod = newPeriod;
        
        emit LockPeriodUpdated(newPeriod);
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
