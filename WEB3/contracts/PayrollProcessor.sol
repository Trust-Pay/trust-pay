// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Payroll Processor
 * @dev Manages payroll disbursements in SPAY tokens
 */
contract PayrollProcessor is AccessControl, Pausable {
    using SafeERC20 for IERC20;
    
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // SPAY token address
    address public spayToken;
    
    // Tax withholding percentage (10% = 1000 / 10000)
    uint256 public taxRateBps = 1000;
    
    // Tax collection address
    address public taxCollector;
    
    // Fee percentage (0.5% = 50 / 10000)
    uint256 public feeRateBps = 50;
    
    // Fee collection address
    address public feeCollector;
    
    // Employee payroll data
    struct EmployeePayroll {
        uint256 amount;
        uint256 lastPaymentTimestamp;
        uint256 paymentInterval; // in seconds
    }
    
    // Mapping of employee address to payroll data
    mapping(address => EmployeePayroll) public employeePayrolls;
    
    // Events
    event PayrollDisbursed(address indexed employer, address indexed employee, uint256 amount, uint256 taxAmount, uint256 feeAmount);
    event PayrollScheduleSet(address indexed employer, address indexed employee, uint256 amount, uint256 interval);
    event TaxRateUpdated(uint256 newRateBps);
    event FeeRateUpdated(uint256 newRateBps);
    
    constructor(address _spayToken, address _taxCollector, address _feeCollector) {
        require(_spayToken != address(0), "Invalid SPAY address");
        require(_taxCollector != address(0), "Invalid tax collector address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        
        spayToken = _spayToken;
        taxCollector = _taxCollector;
        feeCollector = _feeCollector;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(EMPLOYER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Sets the payroll schedule for an employee
     * @param employee The employee's address
     * @param amount The payroll amount in SPAY
     * @param interval The payment interval in seconds (e.g., 1209600 for bi-weekly)
     */
    function setPayrollSchedule(
        address employee,
        uint256 amount,
        uint256 interval
    ) external onlyRole(EMPLOYER_ROLE) whenNotPaused {
        require(employee != address(0), "Invalid employee address");
        require(amount > 0, "Amount must be greater than 0");
        require(interval > 0, "Interval must be greater than 0");
        
        employeePayrolls[employee] = EmployeePayroll({
            amount: amount,
            lastPaymentTimestamp: block.timestamp,
            paymentInterval: interval
        });
        
        emit PayrollScheduleSet(msg.sender, employee, amount, interval);
    }
    
    /**
     * @dev Disburses payroll to a single employee
     * @param employee The employee's address
     */
    function disbursePayroll(address employee) external onlyRole(EMPLOYER_ROLE) whenNotPaused {
        require(employee != address(0), "Invalid employee address");
        
        EmployeePayroll storage payroll = employeePayrolls[employee];
        require(payroll.amount > 0, "No payroll scheduled");
        
        // Check if payment is due
        require(
            block.timestamp >= payroll.lastPaymentTimestamp + payroll.paymentInterval,
            "Payment not due yet"
        );
        
        // Calculate tax amount
        uint256 taxAmount = (payroll.amount * taxRateBps) / 10000;
        
        // Calculate fee amount
        uint256 feeAmount = (payroll.amount * feeRateBps) / 10000;
        
        // Calculate net amount
        uint256 netAmount = payroll.amount - taxAmount - feeAmount;
        
        // Update last payment timestamp
        payroll.lastPaymentTimestamp = block.timestamp;
        
        // Transfer SPAY tokens
        IERC20(spayToken).safeTransferFrom(msg.sender, employee, netAmount);
        IERC20(spayToken).safeTransferFrom(msg.sender, taxCollector, taxAmount);
        IERC20(spayToken).safeTransferFrom(msg.sender, feeCollector, feeAmount);
        
        emit PayrollDisbursed(msg.sender, employee, netAmount, taxAmount, feeAmount);
    }
    
    /**
     * @dev Disburses payroll to multiple employees
     * @param employees Array of employee addresses
     */
    function disbursePayrollBatch(address[] calldata employees) external onlyRole(EMPLOYER_ROLE) whenNotPaused {
        require(employees.length > 0, "Empty employees array");
        
        for (uint256 i = 0; i < employees.length; i++) {
            address employee = employees[i];
            EmployeePayroll storage payroll = employeePayrolls[employee];
            
            // Skip if no payroll scheduled or payment not due
            if (payroll.amount == 0 || block.timestamp < payroll.lastPaymentTimestamp + payroll.paymentInterval) {
                continue;
            }
            
            // Calculate tax amount
            uint256 taxAmount = (payroll.amount * taxRateBps) / 10000;
            
            // Calculate fee amount
            uint256 feeAmount = (payroll.amount * feeRateBps) / 10000;
            
            // Calculate net amount
            uint256 netAmount = payroll.amount - taxAmount - feeAmount;
            
            // Update last payment timestamp
            payroll.lastPaymentTimestamp = block.timestamp;
            
            // Transfer SPAY tokens
            IERC20(spayToken).safeTransferFrom(msg.sender, employee, netAmount);
            IERC20(spayToken).safeTransferFrom(msg.sender, taxCollector, taxAmount);
            IERC20(spayToken).safeTransferFrom(msg.sender, feeCollector, feeAmount);
            
            emit PayrollDisbursed(msg.sender, employee, netAmount, taxAmount, feeAmount);
        }
    }
    
    /**
     * @dev Updates the tax rate
     * @param newRateBps The new tax rate in basis points
     */
    function updateTaxRate(uint256 newRateBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRateBps <= 5000, "Tax rate cannot exceed 50%");
        taxRateBps = newRateBps;
        
        emit TaxRateUpdated(newRateBps);
    }
    
    /**
     * @dev Updates the fee rate
     * @param newRateBps The new fee rate in basis points
     */
    function updateFeeRate(uint256 newRateBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRateBps <= 500, "Fee rate cannot exceed 5%");
        feeRateBps = newRateBps;
        
        emit FeeRateUpdated(newRateBps);
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
