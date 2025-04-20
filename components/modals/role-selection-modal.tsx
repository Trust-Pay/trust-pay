"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { registerAsEmployer, registerAsEmployee } from "@/WEB3/roleAuthentication"

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

  const handleRoleSelection = async () => {
    try {
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
          window.location.href = "/employer"
        } else if (selectedRole === "employee") {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "register" ? "Register Your Role" : "Login to Your Account"}</DialogTitle>
          <DialogDescription>
            {mode === "register" ? "Choose your role to register and access the dashboard" : "Select your role to login to your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
            >
              {mode === "register" ? "Already registered? Login" : "Need to register? Sign up"}
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              variant={selectedRole === "employer" ? "default" : "outline"}
              className="w-full justify-start gap-2 text-left"
              onClick={() => {
                setSelectedRole("employer")
                setEmployerAddress("")
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Employer</span>
                <span className="text-sm text-muted-foreground">Manage payroll and employees</span>
              </div>
            </Button>

            <Button
              variant={selectedRole === "employee" ? "default" : "outline"}
              className="w-full justify-start gap-2 text-left"
              onClick={() => setSelectedRole("employee")}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Employee</span>
                <span className="text-sm text-muted-foreground">Receive payroll and manage investments</span>
              </div>
            </Button>
          </div>

          {selectedRole === "employee" && (
            <div className="space-y-2">
              <label htmlFor="employerAddress" className="text-sm font-medium">
                Employer&apos;s Wallet Address
              </label>
              <Input
                id="employerAddress"
                placeholder="0x..."
                value={employerAddress}
                onChange={(e) => setEmployerAddress(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <GradientButton
            onClick={handleRoleSelection}
            disabled={isProcessing || !selectedRole || (selectedRole === "employee" && !employerAddress)}
            gradientFrom="#6366F1"
            gradientTo="#D946EF"
          >
            {isProcessing ? "Processing..." : "Continue"}
          </GradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}