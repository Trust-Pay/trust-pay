"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { registerAsEmployer, registerAsEmployee, checkEmployerRole, checkEmployeeRole } from "@/WEB3/roleAuthentication"
import { CheckCircle, Briefcase, User, AlertCircle } from "lucide-react"

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RoleSelectionModal({ isOpen, onClose, onSuccess }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<"employer" | "employee" | null>(null)
  const [employerAddress, setEmployerAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"register" | "login">("register")
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateEmployerAddress = (address: string) => {
    // Basic Ethereum address validation
    if (!address) return "Employer address is required"
    if (!address.startsWith("0x")) return "Address must start with 0x"
    if (address.length !== 42) return "Address must be 42 characters long"
    return null
  }

  const handleEmployerAddressChange = (value: string) => {
    setEmployerAddress(value)
    setValidationError(value ? validateEmployerAddress(value) : null)
  }

  const handleRoleSelection = async () => {
    try {
      // Validate form before submission
      if (selectedRole === "employee") {
        const addressError = validateEmployerAddress(employerAddress)
        if (addressError) {
          setValidationError(addressError)
          return
        }
      }

      setIsProcessing(true)
      setError(null)

      if (mode === "register") {
        if (selectedRole === "employer") {
          await registerAsEmployer()
        } else if (selectedRole === "employee" && employerAddress) {
          await registerAsEmployee(employerAddress)
        } else {
          throw new Error("Please select a role and provide required information")
        }
      } else {
        // Handle login flow based on selected role
        if (selectedRole === "employer") {
          const isEmployer = await checkEmployerRole(await window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts : any) => accounts[0]))
          if (!isEmployer) {
            throw new Error("You are not registered as an employer")
          }
          window.location.href = "/employer"
        } else if (selectedRole === "employee") {
          const isEmployee = await checkEmployeeRole(await window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts : any) => accounts[0]))
          if (!isEmployee) {
            throw new Error("You are not registered as an employee")
          }
          window.location.href = "/employee"
        } else {
          throw new Error("Please select a role to login")
        }
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register role")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "register" ? "Register Your Role" : "Login to Your Account"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {mode === "register" ? "Choose your role to register and access the dashboard" : "Select your role to login to your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => {
                setMode(mode === "register" ? "login" : "register")
                setError(null)
                setValidationError(null)
              }}
            >
              {mode === "register" ? "Already registered? Login" : "Need to register? Sign up"}
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button
              variant={selectedRole === "employer" ? "default" : "outline"}
              className={`w-full justify-start gap-3 text-left p-6 ${
                selectedRole === "employer" ? "border-2 border-blue-500 bg-blue-50 text-blue-700" : "hover:border-blue-200"
              }`}
              onClick={() => {
                setSelectedRole("employer")
                setEmployerAddress("")
                setValidationError(null)
              }}
            >
              <Briefcase className={selectedRole === "employer" ? "text-blue-600" : "text-gray-500"} size={24} />
              <div className="flex flex-col items-start">
                <span className="font-medium text-lg">Employer</span>
                <span className="text-sm text-muted-foreground">Manage payroll and employees</span>
              </div>
              {selectedRole === "employer" && <CheckCircle className="ml-auto text-blue-600" size={20} />}
            </Button>

            <Button
              variant={selectedRole === "employee" ? "default" : "outline"}
              className={`w-full justify-start gap-3 text-left p-6 ${
                selectedRole === "employee" ? "border-2 border-blue-500 bg-blue-50 text-blue-700" : "hover:border-blue-200"
              }`}
              onClick={() => setSelectedRole("employee")}
            >
              <User className={selectedRole === "employee" ? "text-blue-600" : "text-gray-500"} size={24} />
              <div className="flex flex-col items-start">
                <span className="font-medium text-lg">Employee</span>
                <span className="text-sm text-muted-foreground">Receive payroll and manage investments</span>
              </div>
              {selectedRole === "employee" && <CheckCircle className="ml-auto text-blue-600" size={20} />}
            </Button>
          </div>

          {selectedRole === "employee" && (
            <div className="space-y-2">
              <label htmlFor="employerAddress" className="text-sm font-medium flex items-center gap-1">
                Employer's Wallet Address
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="employerAddress"
                placeholder="0x..."
                value={employerAddress}
                onChange={(e) => handleEmployerAddressChange(e.target.value)}
                className={`font-mono ${validationError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {validationError && (
                <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
                  <AlertCircle size={16} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={16} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handleRoleSelection}
            disabled={isProcessing || !selectedRole || (selectedRole === "employee" && (!employerAddress || !!validationError))}
            gradientFrom="#6366F1"
            gradientTo="#D946EF"
            className="px-6"
          >
            {isProcessing ? "Processing..." : mode === "register" ? "Register" : "Login"}
          </GradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}