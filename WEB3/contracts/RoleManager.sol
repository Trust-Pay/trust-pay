// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RoleManager
 * @dev Manages role-based access control for employers and employees with enhanced security and gas optimization.
 * @notice This contract uses OpenZeppelin's AccessControl and Pausable for robust role management and emergency pauses.
 */
contract RoleManager is AccessControl, Pausable, ReentrancyGuard {
    // Role identifiers
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE");
    bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Mapping of employees to their employers
    mapping(address => address) public employeeToEmployer;

    // Events
    event EmployerRegistered(address indexed employer);
    event EmployeeRegistered(address indexed employee, address indexed employer);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    event RoleRenounced(bytes32 indexed role, address indexed account);

    /**
     * @dev Constructor sets up initial roles for the deployer.
     * @notice Grants DEFAULT_ADMIN_ROLE, ADMIN_ROLE, and PAUSER_ROLE to the deployer.
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /**
     * @dev Register as an employer.
     * @notice Only callable when not paused and by an account without EMPLOYER or EMPLOYEE roles.
     */
    function registerAsEmployer() external whenNotPaused nonReentrant {
        require(!hasRole(EMPLOYER_ROLE, msg.sender), "RoleManager: Already an employer");
        require(!hasRole(EMPLOYEE_ROLE, msg.sender), "RoleManager: Already an employee");

        _grantRole(EMPLOYER_ROLE, msg.sender);
        emit EmployerRegistered(msg.sender);
    }

    /**
     * @dev Register as an employee under a specific employer.
     * @param employer The address of the employer.
     * @notice Only callable when not paused and by an account without EMPLOYER or EMPLOYEE roles.
     */
    function registerAsEmployee(address employer) external whenNotPaused nonReentrant {
        require(employer != address(0), "RoleManager: Invalid employer address");
        require(hasRole(EMPLOYER_ROLE, employer), "RoleManager: Not a valid employer");
        require(!hasRole(EMPLOYEE_ROLE, msg.sender), "RoleManager: Already an employee");
        require(!hasRole(EMPLOYER_ROLE, msg.sender), "RoleManager: Already an employer");

        _grantRole(EMPLOYEE_ROLE, msg.sender);
        employeeToEmployer[msg.sender] = employer;
        emit EmployeeRegistered(msg.sender, employer);
    }

    /**
     * @dev Check if an address has the employer role.
     * @param account The address to check.
     * @return bool True if the account has the EMPLOYER_ROLE.
     */
    function isEmployer(address account) external view returns (bool) {
        return hasRole(EMPLOYER_ROLE, account);
    }

    /**
     * @dev Check if an address has the employee role.
     * @param account The address to check.
     * @return bool True if the account has the EMPLOYEE_ROLE.
     */
    function isEmployee(address account) external view returns (bool) {
        return hasRole(EMPLOYEE_ROLE, account);
    }

    /**
     * @dev Get the employer of an employee.
     * @param employee The address of the employee.
     * @return address The employer's address.
     * @notice Reverts if the provided address is not an employee.
     */
    function getEmployerOf(address employee) external view returns (address) {
        require(hasRole(EMPLOYEE_ROLE, employee), "RoleManager: Not an employee");
        return employeeToEmployer[employee];
    }

    /**
     * @dev Revoke a role from an account.
     * @param role The role to revoke.
     * @param account The account to revoke the role from.
     * @notice Only callable by an admin. Cleans up employeeToEmployer mapping if EMPLOYEE_ROLE is revoked.
     */
    function revokeRole(bytes32 role, address account) public override onlyRole(ADMIN_ROLE) {
        require(account != address(0), "RoleManager: Invalid account address");
        require(hasRole(role, account), "RoleManager: Account does not have role");

        super.revokeRole(role, account);
        if (role == EMPLOYEE_ROLE) {
            delete employeeToEmployer[account];
        }
        emit RoleRevoked(role, account);
    }

    /**
     * @dev Allow an account to renounce their own role.
     * @param role The role to renounce.
     * @notice Only callable by the account holding the role.
     */
    function renounceRole(bytes32 role, address account) public override nonReentrant {
        require(account == msg.sender, "RoleManager: Can only renounce own role");
        require(hasRole(role, account), "RoleManager: Account does not have role");

        super.renounceRole(role, account);
        if (role == EMPLOYEE_ROLE) {
            delete employeeToEmployer[account];
        }
        emit RoleRenounced(role, account);
    }

    /**
     * @dev Pause the contract.
     * @notice Only callable by an account with PAUSER_ROLE.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract.
     * @notice Only callable by an account with PAUSER_ROLE.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant a role to an account, preventing assignment to the zero address.
     * @param role The role to grant.
     * @param account The account to grant the role to.
     * @return bool True if the role was granted successfully.
     * @notice Overrides AccessControl's _grantRole to add zero-address validation.
     */
    function _grantRole(bytes32 role, address account) internal override returns (bool) {
        require(account != address(0), "RoleManager: Cannot grant role to zero address");
        return super._grantRole(role, account);
    }
}