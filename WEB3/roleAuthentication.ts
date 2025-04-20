import { ethers } from 'ethers';
import { Contract } from 'ethers';
import RoleManagerABI from './abis/RoleManager.json';
import { CONTRACT_ADDRESSES } from '../config/blockchain';
import { initializeBlockchain } from './blockchainIntergation';

// Types
export interface RoleManagerContract extends Contract {
  registerAsEmployer(): Promise<ethers.ContractTransaction>;
  registerAsEmployee(employer: string): Promise<ethers.ContractTransaction>;
  isEmployer(account: string): Promise<boolean>;
  isEmployee(account: string): Promise<boolean>;
  getEmployerOf(employee: string): Promise<string>;
}

// Role Manager Functions
export async function initializeRoleManager(): Promise<RoleManagerContract> {
  const contracts = await initializeBlockchain();
  return new Contract(
    CONTRACT_ADDRESSES.ROLE_MANAGER_CONTRACT,
    RoleManagerABI,
    contracts.signer
  ) as RoleManagerContract;
}

export async function registerAsEmployer(): Promise<void> {
  try {
    const roleManager = await initializeRoleManager();
    const tx = await roleManager.registerAsEmployer();
    await tx.wait();
  } catch (error) {
    throw new Error(`Failed to register as employer: ${error}`);
  }
}

export async function registerAsEmployee(employerAddress: string): Promise<void> {
  try {
    const roleManager = await initializeRoleManager();
    const tx = await roleManager.registerAsEmployee(employerAddress);
    await tx.wait();
  } catch (error) {
    throw new Error(`Failed to register as employee: ${error}`);
  }
}

export async function checkEmployerRole(address: string): Promise<boolean> {
  try {
    const roleManager = await initializeRoleManager();
    return await roleManager.isEmployer(address);
  } catch (error) {
    throw new Error(`Failed to check employer role: ${error}`);
  }
}

export async function checkEmployeeRole(address: string): Promise<boolean> {
  try {
    const roleManager = await initializeRoleManager();
    return await roleManager.isEmployee(address);
  } catch (error) {
    throw new Error(`Failed to check employee role: ${error}`);
  }
}

export async function getEmployerAddress(employeeAddress: string): Promise<string> {
  try {
    const roleManager = await initializeRoleManager();
    return await roleManager.getEmployerOf(employeeAddress);
  } catch (error) {
    throw new Error(`Failed to get employer address: ${error}`);
  }
}