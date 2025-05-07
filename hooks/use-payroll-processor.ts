"use client"

import { useState } from "react"
import { useWeb3 } from "@/providers/web3-provider"
import { toast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import RoleManagerABI from "@/WEB3/abis/RoleManager.json"
import PayrollProcessorABI from "@/WEB3/abis/PayrollProcessor.json"
import { CONTRACT_ADDRESSES } from "@/config/blockchain"
const  ROLE_MANAGER_CONTRACT = CONTRACT_ADDRESSES.ROLE_MANAGER_CONTRACT
const PAYROLL_PROCESSOR = CONTRACT_ADDRESSES.PAYROLL_PROCESSOR

export function usePayrollProcessor() {
  const { isConnected } = useWeb3()
  const [isProcessing, setIsProcessing] = useState(false)

  const processPayroll = async (employees: string[]) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // For demo purposes, we'll just show a success toast
      // In a real implementation, this would call the contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payroll Processed",
        description: `Successfully processed payroll for ${employees.length} employees.`,
      })

      return true
    } catch (error) {
      console.error("Processing payroll failed:", error)
      toast({
        title: "Payroll Failed",
        description: "There was an error processing the payroll.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const setPayrollSchedule = async (employee: string, amount: string, interval: string) => {
    if (!isConnected || !window.ethereum) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()

      // First register the employee role
      const roleManager = new ethers.Contract(ROLE_MANAGER_CONTRACT, RoleManagerABI, signer)
      const registerTx = await roleManager.registerAsEmployee(await signer.getAddress())
      await registerTx.wait()

      // Then set up their payroll schedule
      const payrollProcessor = new ethers.Contract(PAYROLL_PROCESSOR, PayrollProcessorABI, signer)
      const scheduleTx = await payrollProcessor.setEmployeePayroll(employee, ethers.utils.parseEther(amount), interval)
      await scheduleTx.wait()

      toast({
        title: "Employee Added",
        description: "Successfully registered employee and set up payroll schedule.",
      })

      return true
    } catch (error) {
      console.error("Setting payroll schedule failed:", error)
      toast({
        title: "Schedule Failed",
        description: "There was an error setting the payroll schedule.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processPayroll,
    setPayrollSchedule,
    isProcessing,
  }
}
