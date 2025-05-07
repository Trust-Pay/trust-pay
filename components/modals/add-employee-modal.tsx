"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { GradientButton } from "@/components/ui/gradient-button"
import { PlusCircle } from "lucide-react"
import { handleEmployeeRegistration } from "@/app/actions/employee-registration"
import { useToast } from "@/components/ui/use-toast"

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employee: {
    name: string
    address: string
    amount: string
    schedule: string
  }) => void
  isProcessing: boolean
}

export function AddEmployeeModal({ isOpen, onClose, onSubmit, isProcessing }: AddEmployeeModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    amount: "",
    schedule: "Bi-weekly",
  })

  const handleSubmit = async () => {
    console.log("address for here:", formData.address)
    if (!formData.name || !formData.address || !formData.amount) return
    
    try {
      const result = await handleEmployeeRegistration(
        formData.address, 
        formData
      )
      console.log("Registration result:", result)

      if (result.success) {
        onSubmit(formData)
        setFormData({
          name: "",
          address: "",
          amount: "",
          schedule: "Bi-weekly",
        })
        toast({
          title: "Success",
          description: "Employee registered successfully",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to register employee",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register employee",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Enter employee details to add them to your payroll</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Employee Name</label>
            <Input
              placeholder="Enter employee name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Wallet Address</label>
            <Input
              placeholder="0x..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payroll Amount (SPAY)</label>
            <Input
              type="number"
              placeholder="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Schedule</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            >
              <option>Bi-weekly</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <GradientButton
            className="gap-2"
            onClick={handleSubmit}
            disabled={isProcessing || !formData.name || !formData.address || !formData.amount}
          >
            <PlusCircle className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Add Employee"}
          </GradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}