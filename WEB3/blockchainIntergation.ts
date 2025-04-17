import { ethers } from 'ethers';
import { Contract } from 'ethers';

// Contract ABIs
import SPAYStablecoinABI from './abis/SPAYStablecoin.json';
import ETFTokenABI from './abis/ETFToken.json';
import PayrollProcessorABI from './abis/PayrollProcessor.json';
import CollateralManagerABI from './abis/CollateralManager.json';
import InvestmentManagerABI from './abis/InvestmentManager.json';
import SavingsManagerABI from './abis/SavingsManager.json';

// Import contract addresses from config
import { CONTRACT_ADDRESSES } from '../config/blockchain';

// Types
export interface ContractAddresses {
  SPAY_TOKEN_CONTRACT: string;
  ETF_TOKEN_CONTRACT: string;
  PAYROLL_PROCESSOR: string;
  COLLETRAL_MANAGER: string;
  INVESTMENT_MANAGER: string;
  SAVING_MANAGER_CONTRACT: string;
}

export interface BlockchainContracts {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  spayToken: Contract;
  etfToken: Contract;
  payrollProcessor: Contract;
  collateralManager: Contract;
  investmentManager: Contract;
  savingsManager: Contract;
}

// Initialize provider and contracts
export async function initializeBlockchain(): Promise<BlockchainContracts> {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []); // Request account access
    const signer = provider.getSigner();

    const spayToken = new Contract(
      CONTRACT_ADDRESSES.SPAY_TOKEN_CONTRACT,
      SPAYStablecoinABI,
      signer
    );

    const etfToken = new Contract(
      CONTRACT_ADDRESSES.ETF_TOKEN_CONTRACT,
      ETFTokenABI,
      signer
    );

    const payrollProcessor = new Contract(
      CONTRACT_ADDRESSES.PAYROLL_PROCESSOR,
      PayrollProcessorABI,
      signer
    );

    const collateralManager = new Contract(
      CONTRACT_ADDRESSES.COLLETRAL_MANAGER,
      CollateralManagerABI,
      signer
    );

    const investmentManager = new Contract(
      CONTRACT_ADDRESSES.INVESTMENT_MANAGER,
      InvestmentManagerABI,
      signer
    );

    const savingsManager = new Contract(
      CONTRACT_ADDRESSES.SAVING_MANAGER_CONTRACT,
      SavingsManagerABI,
      signer
    );

    return {
      provider,
      signer,
      spayToken,
      etfToken,
      payrollProcessor,
      collateralManager,
      investmentManager,
      savingsManager,
    };
  } catch (error) {
    throw new Error(`Failed to initialize blockchain: ${error}`);
  }
}

// Contract interaction functions

// SPAY Token Functions
export async function getBalances(address: string) {
  try {
    const contracts = await initializeBlockchain();
    const [spayBalance, etfBalance] = await Promise.all([
      contracts.spayToken.balanceOf(address),
      contracts.etfToken.balanceOf(address)
    ]);
    return {
      spayBalance: ethers.BigNumber.from(spayBalance),
      etfBalance: ethers.BigNumber.from(etfBalance)
    };
  } catch (error) {
    throw new Error(`Failed to get balances: ${error}`);
  }
}

export async function transferSPAY(to: string, amount: ethers.BigNumberish) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.spayToken.transfer(to, amount);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to transfer SPAY: ${error}`);
  }
}

export async function checkKYC(address: string): Promise<boolean> {
  try {
    const contracts = await initializeBlockchain();
    return await contracts.spayToken.isVerified(address);
  } catch (error) {
    throw new Error(`Failed to check KYC: ${error}`);
  }
}

export async function verifyUser(address: string) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.spayToken.verifyUser(address);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to verify user: ${error}`);
  }
}

// ETF Token Functions
export async function getETFPrice(): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const price = await contracts.etfToken.getETFPriceUSD();
    return ethers.BigNumber.from(price);
  } catch (error) {
    throw new Error(`Failed to get ETF price: ${error}`);
  }
}

export async function getETFYield(address: string): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const balance = await contracts.etfToken.balanceOf(address);
    const annualYieldBps = await contracts.etfToken.annualYieldBps();
    return balance.mul(annualYieldBps).div(ethers.BigNumber.from(365 * 10000));
  } catch (error) {
    throw new Error(`Failed to get ETF yield: ${error}`);
  }
}

export async function distributeYield(recipient: string) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.etfToken.distributeYield(recipient);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to distribute yield: ${error}`);
  }
}

// Payroll Functions
export async function setPayrollSchedule(
  employeeAddress: string,
  amount: ethers.BigNumberish,
  interval: number
) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.payrollProcessor.setPayrollSchedule(employeeAddress, amount, interval);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to set payroll schedule: ${error}`);
  }
}

export async function processPayroll(employeeAddress: string) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.payrollProcessor.disbursePayroll(employeeAddress);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to process payroll: ${error}`);
  }
}

export async function processBatchPayroll(employeeAddresses: string[]) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.payrollProcessor.disbursePayrollBatch(employeeAddresses);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to process batch payroll: ${error}`);
  }
}

// Investment Functions
export async function investInETF(amount: ethers.BigNumberish) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.investmentManager.invest(amount);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to invest in ETF: ${error}`);
  }
}

export async function withdrawInvestment(etfAmount: ethers.BigNumberish) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.investmentManager.withdraw(etfAmount);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to withdraw investment: ${error}`);
  }
}

export async function getUserInvestment(address: string): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const investment = await contracts.investmentManager.userInvestments(address);
    return ethers.BigNumber.from(investment);
  } catch (error) {
    throw new Error(`Failed to get user investment: ${error}`);
  }
}

// Savings Functions
export async function lockSavings(amount: ethers.BigNumberish) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.savingsManager.lockSavings(amount);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to lock savings: ${error}`);
  }
}

export async function withdrawSavings() {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.savingsManager.withdrawSavings();
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to withdraw savings: ${error}`);
  }
}

export async function getSavingsInfo(address: string) {
  try {
    const contracts = await initializeBlockchain();
    const savings = await contracts.savingsManager.userSavings(address);
    const remainingLockTime = await contracts.savingsManager.getRemainingLockTime(address);
    return {
      amount: ethers.BigNumber.from(savings.amount),
      unlockTime: ethers.BigNumber.from(savings.unlockTime),
      remainingLockTime: ethers.BigNumber.from(remainingLockTime)
    };
  } catch (error) {
    throw new Error(`Failed to get savings info: ${error}`);
  }
}

// Collateral Functions
export async function lockCollateral(amount: ethers.BigNumberish) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.collateralManager.lockCollateral(amount);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to lock collateral: ${error}`);
  }
}

export async function releaseCollateral(amount: ethers.BigNumberish, recipient: string) {
  try {
    const contracts = await initializeBlockchain();
    const tx = await contracts.collateralManager.releaseCollateral(amount, recipient);
    return await tx.wait();
  } catch (error) {
    throw new Error(`Failed to release collateral: ${error}`);
  }
}

export async function getCollateralRatio(): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const ratio = await contracts.collateralManager.getCollateralRatio();
    return ethers.BigNumber.from(ratio);
  } catch (error) {
    throw new Error(`Failed to get collateral ratio: ${error}`);
  }
}

export async function getTotalCollateralLocked(): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const collateral = await contracts.collateralManager.totalCollateralLocked();
    return ethers.BigNumber.from(collateral);
  } catch (error) {
    throw new Error(`Failed to get total collateral locked: ${error}`);
  }
}

export async function getMinCollateralRatio(): Promise<ethers.BigNumber> {
  try {
    const contracts = await initializeBlockchain();
    const ratio = await contracts.collateralManager.minCollateralRatioBps();
    return ethers.BigNumber.from(ratio);
  } catch (error) {
    throw new Error(`Failed to get minimum collateral ratio: ${error}`);
  }
}