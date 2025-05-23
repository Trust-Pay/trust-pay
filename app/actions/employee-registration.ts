'use client';
import { ethers } from 'ethers';

import { registerAsEmployee } from '@/WEB3/roleAuthentication';

export interface EmployeeRegistrationData {
  name: string;
  address: string;
  amount: string;
  schedule: string;
}

export async function handleEmployeeRegistration(
  employerAddress: string,
  employeeData: EmployeeRegistrationData
): Promise<{ success: boolean; error?: string }> {
  try {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('Web3 Provider initialized:', provider);

    await provider.send('eth_requestAccounts', []); // Request account access
    console.log('Wallet connection approved');

    // Ensure we're connected to the correct network
    const network = await provider.getNetwork();
    console.log('Network:', network);
    if (!network.chainId) {
      throw new Error('Network not properly configured. Please check your wallet connection.');
    }
    console.log('Connected to network with chainId:', network.chainId);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('Signer address:', address);


    console.log('Employer address:', employerAddress);
    console.log('Employee data:', employeeData);
    // Validate employee wallet address format

    // Register employee on the blockchain with the employer's address
    try {
      const tx = await registerAsEmployee(address);
      console.log('Transaction sent:', tx);
      return { success: true };
    } catch (txError: any) {
      // Handle specific transaction errors
      if (txError.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return {
          success: false,
          error: 'Transaction cannot be processed. Please verify your wallet has sufficient funds and you meet all requirements.'
        };
      }
      throw txError; // Re-throw other errors to be caught by the outer catch block
    }
  } catch (error: any) {
    console.error('Employee registration error:', error);
    return {
      success: false,
      error: `Failed to register as employee: ${error.message || 'Transaction failed'}`,
    };
  }
}