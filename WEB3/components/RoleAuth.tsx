import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  registerAsEmployer,
  registerAsEmployee,
  checkEmployerRole,
  checkEmployeeRole
} from '../roleAuthentication';
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GradientText } from '@/components/ui/gradient-text';

interface RoleAuthProps {
  onRoleConfirmed: (role: 'employer' | 'employee' | null) => void;
}

export const RoleAuth: React.FC<RoleAuthProps> = ({ onRoleConfirmed }) => {
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [employerAddress, setEmployerAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  const checkMetaMaskConnection = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setIsConnected(true);
      await checkExistingRole(accounts[0]);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MetaMask');
      setIsConnected(false);
      setLoading(false);
    }
  };

  const checkExistingRole = async (address: string) => {
    try {
      const isEmployer = await checkEmployerRole(address);
      const isEmployee = await checkEmployeeRole(address);

      if (isEmployer) {
        onRoleConfirmed('employer');
      } else if (isEmployee) {
        onRoleConfirmed('employee');
      } else {
        onRoleConfirmed(null);
      }
    } catch (err) {
      setError('Failed to check roles');
    }
  };

  const handleEmployerRegistration = async () => {
    try {
      setLoading(true);
      await registerAsEmployer();
      onRoleConfirmed('employer');
    } catch (err) {
      setError('Failed to register as employer');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeRegistration = async () => {
    try {
      if (!ethers.utils.isAddress(employerAddress)) {
        throw new Error('Invalid employer address');
      }
      setLoading(true);
      await registerAsEmployee(employerAddress);
      onRoleConfirmed('employee');
    } catch (err) {
      setError('Failed to register as employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <GradientText className="text-3xl font-bold">Role Registration</GradientText>
        <p className="text-muted-foreground">
          Connected Account: {account || 'Not Connected'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Register as Employer</h3>
          <p className="text-sm text-muted-foreground">
            Register your account as an employer to manage employees and payroll.
          </p>
          <Button
            onClick={handleEmployerRegistration}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register as Employer'
            )}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Register as Employee</h3>
          <p className="text-sm text-muted-foreground">
            Register your account as an employee by providing your employer's address.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter Employer Address (0x...)"
              value={employerAddress}
              onChange={(e) => setEmployerAddress(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleEmployeeRegistration}
              className="w-full"
              disabled={!employerAddress || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register as Employee'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}