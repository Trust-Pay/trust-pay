// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SPAY Stablecoin
 * @dev ERC20 token pegged to USD and backed by ETF tokens
 */
contract SPAYStablecoin is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // KYC verification mapping
    mapping(address => bool) public isVerified;
    
    // Events
    event Verified(address indexed user);
    event Unverified(address indexed user);
    
    constructor() ERC20("TrustPay", "SPAY") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        // Auto-verify admin for demo purposes
        isVerified[msg.sender] = true;
        emit Verified(msg.sender);
    }
    
    /**
     * @dev Mints SPAY tokens to a verified address
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(isVerified[to], "SPAY: recipient not verified");
        _mint(to, amount);
    }
    
    /**
     * @dev Burns SPAY tokens from a verified address
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external whenNotPaused {
        require(isVerified[msg.sender], "SPAY: sender not verified");
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Overrides ERC20 transfer to enforce KYC verification
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(isVerified[msg.sender], "SPAY: sender not verified");
        require(isVerified[to], "SPAY: recipient not verified");
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Overrides ERC20 transferFrom to enforce KYC verification
     */
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(isVerified[from], "SPAY: sender not verified");
        require(isVerified[to], "SPAY: recipient not verified");
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Verifies a user for KYC/AML compliance
     * @param user The address to verify
     */
    function verifyUser(address user) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isVerified[user] = true;
        emit Verified(user);
    }
    
    /**
     * @dev Unverifies a user for KYC/AML compliance
     * @param user The address to unverify
     */
    function unverifyUser(address user) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isVerified[user] = false;
        emit Unverified(user);
    }
    
    /**
     * @dev Pauses all token transfers
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses all token transfers
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
