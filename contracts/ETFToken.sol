// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ETF Token
 * @dev ERC20 token representing the gold/BTC/ETH ETF
 */
contract ETFToken is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // ETF composition (50% gold, 25% BTC, 25% ETH)
    uint8 public constant GOLD_PERCENTAGE = 50;
    uint8 public constant BTC_PERCENTAGE = 25;
    uint8 public constant ETH_PERCENTAGE = 25;
    
    // Mock prices for hackathon demo
    uint256 public goldPriceUSD = 2500 * 1e18; // $2,500 per oz
    uint256 public btcPriceUSD = 80000 * 1e18; // $80,000 per BTC
    uint256 public ethPriceUSD = 3000 * 1e18;  // $3,000 per ETH
    
    // Annual yield percentage (2% APY)
    uint256 public annualYieldBps = 200; // 200 basis points = 2%
    
    // Events
    event PricesUpdated(uint256 goldPrice, uint256 btcPrice, uint256 ethPrice);
    event YieldDistributed(address indexed recipient, uint256 amount);
    
    constructor() ERC20("TrustPay ETF Token", "SPETF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mints ETF tokens
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        _mint(to, amount);
    }
    
    /**
     * @dev Burns ETF tokens
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external onlyRole(BURNER_ROLE) whenNotPaused {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Updates the mock prices for the ETF assets
     * @param _goldPriceUSD New gold price in USD (18 decimals)
     * @param _btcPriceUSD New BTC price in USD (18 decimals)
     * @param _ethPriceUSD New ETH price in USD (18 decimals)
     */
    function updatePrices(
        uint256 _goldPriceUSD,
        uint256 _btcPriceUSD,
        uint256 _ethPriceUSD
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        goldPriceUSD = _goldPriceUSD;
        btcPriceUSD = _btcPriceUSD;
        ethPriceUSD = _ethPriceUSD;
        
        emit PricesUpdated(_goldPriceUSD, _btcPriceUSD, _ethPriceUSD);
    }
    
    /**
     * @dev Calculates the ETF token price in USD
     * @return The price of 1 ETF token in USD (18 decimals)
     */
    function getETFPriceUSD() public view returns (uint256) {
        // Calculate weighted average of asset prices based on allocation
        uint256 goldComponent = (goldPriceUSD * GOLD_PERCENTAGE) / 100;
        uint256 btcComponent = (btcPriceUSD * BTC_PERCENTAGE) / 100;
        uint256 ethComponent = (ethPriceUSD * ETH_PERCENTAGE) / 100;
        
        return goldComponent + btcComponent + ethComponent;
    }
    
    /**
     * @dev Distributes yield to a token holder (for demo purposes)
     * @param recipient The address to receive yield
     */
    function distributeYield(address recipient) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(balanceOf(recipient) > 0, "ETF: recipient has no tokens");
        
        // Calculate yield: (balance * APY) / (365 days * 100)
        uint256 dailyYield = (balanceOf(recipient) * annualYieldBps) / (365 * 10000);
        
        // Mint yield tokens to recipient
        _mint(recipient, dailyYield);
        
        emit YieldDistributed(recipient, dailyYield);
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
