"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddEmployeeModal } from "@/components/modals/add-employee-modal"
import { fadeIn, staggerContainer } from "@/lib/animations"
import {
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  PlusCircle,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import { useWeb3 } from "@/providers/web3-provider"
import { usePayrollProcessor } from "@/hooks/use-payroll-processor"
import { NetworkInfo } from "@/components/network-info"

export default function EmployerDashboard() {
  const { isConnected, connectWallet } = useWeb3()
  const { processPayroll, setPayrollSchedule, isProcessing } = usePayrollProcessor()

  const [employees, setEmployees] = useState([
    { address: "0x1234...5678", name: "John Smith", amount: 1000, lastPaid: "May 1, 2025", status: "Active" },
    { address: "0x8765...4321", name: "Emma Johnson", amount: 1500, lastPaid: "May 1, 2025", status: "Active" },
    { address: "0xabcd...efgh", name: "Michael Brown", amount: 2000, lastPaid: "May 1, 2025", status: "Active" },
    { address: "0xijkl...mnop", name: "Sarah Davis", amount: 1200, lastPaid: "Apr 15, 2025", status: "Active" },
    { address: "0xqrst...uvwx", name: "David Wilson", amount: 1800, lastPaid: "Apr 15, 2025", status: "Active" },
  ])

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)

  const handlePayroll = async () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    const employeeAddresses = employees.map((emp) => emp.address)
    const success = await processPayroll(employeeAddresses)

    if (success) {
      // Update the last paid date for all employees
      const updatedEmployees = employees.map((emp) => ({
        ...emp,
        lastPaid: new Date().toLocaleDateString(),
      }))
      setEmployees(updatedEmployees)
    }
  }

  const handleAddEmployee = async (newEmployee: { name: string; address: string; amount: string; schedule: string }) => {
    if (!isConnected) {
      connectWallet()
      return
    }

    // Convert schedule to seconds
    let intervalSeconds = 1209600 // 2 weeks in seconds (bi-weekly)
    if (newEmployee.schedule === "Monthly") {
      intervalSeconds = 2592000 // 30 days in seconds
    } else if (newEmployee.schedule === "Weekly") {
      intervalSeconds = 604800 // 1 week in seconds
    }

    const success = await setPayrollSchedule(newEmployee.address, newEmployee.amount, intervalSeconds.toString())

    if (success) {
      // Add the new employee to the list
      setEmployees([
        ...employees,
        {
          name: newEmployee.name,
          address: newEmployee.address,
          amount: Number.parseInt(newEmployee.amount),
          lastPaid: "Not yet paid",
          status: "Active",
        },
      ])

      setIsAddEmployeeModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8">
            <motion.div
              variants={fadeIn("down")}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold">Employer Dashboard</h1>
                <p className="text-muted-foreground">Manage your payroll and employees</p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  May 2025
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <GradientButton
                  onClick={handlePayroll}
                  gradientFrom="#6366F1"
                  gradientTo="#D946EF"
                  className="gap-2"
                  disabled={isProcessing}
                >
                  <Briefcase className="h-4 w-4" />
                  {isProcessing ? "Processing..." : "Process Payroll"}
                </GradientButton>
              </div>
            </motion.div>

            <motion.div variants={fadeIn("up")} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Payroll",
                  value: "7,500 SPAY",
                  description: "Current pay period",
                  icon: <DollarSign className="h-5 w-5 text-blue-500" />,
                  change: "+5% from last period",
                  changeColor: "text-green-500",
                },
                {
                  title: "Employees",
                  value: employees.length.toString(),
                  description: "Active employees",
                  icon: <Users className="h-5 w-5 text-purple-500" />,
                  change: "No change",
                  changeColor: "text-muted-foreground",
                },
                {
                  title: "Next Payroll",
                  value: "May 15, 2025",
                  description: "In 10 days",
                  icon: <Calendar className="h-5 w-5 text-pink-500" />,
                  change: "Bi-weekly schedule",
                  changeColor: "text-muted-foreground",
                },
                {
                  title: "SPAY Balance",
                  value: "25,000 SPAY",
                  description: "Available for payroll",
                  icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
                  change: "+10,000 SPAY added",
                  changeColor: "text-green-500",
                },
              ].map((stat, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                      <p className={`text-xs ${stat.changeColor} mt-2`}>{stat.change}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>

            <motion.div variants={fadeIn("up", 0.05)}>
              <NetworkInfo />
            </motion.div>

            <motion.div variants={fadeIn("up", 0.1)}>
              <Tabs defaultValue="employees" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div>
                        <CardTitle>Employee Management</CardTitle>
                        <CardDescription>Manage your employee payroll information</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search employees..." className="pl-8 w-[200px]" />
                        </div>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                        <GradientButton className="gap-2" onClick={() => setIsAddEmployeeModalOpen(true)}>
                          <PlusCircle className="h-4 w-4" />
                          Add Employee
                        </GradientButton>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-3">Employee</div>
                          <div className="col-span-3">Wallet Address</div>
                          <div className="col-span-2">Amount (SPAY)</div>
                          <div className="col-span-2">Last Paid</div>
                          <div className="col-span-1">Status</div>
                          <div className="col-span-1"></div>
                        </div>

                        {employees.map((employee, index) => (
                          <div key={index} className="grid grid-cols-12 items-center border-t p-3 text-sm">
                            <div className="col-span-3 font-medium">{employee.name}</div>
                            <div className="col-span-3 font-mono text-muted-foreground">{employee.address}</div>
                            <div className="col-span-2">{employee.amount}</div>
                            <div className="col-span-2">{employee.lastPaid}</div>
                            <div className="col-span-1">
                              <div className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                                {employee.status}
                              </div>
                            </div>
                            <div className="col-span-1 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{employees.length}</span> of{" "}
                        <span className="font-medium">{employees.length}</span> employees
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <AddEmployeeModal
                    isOpen={isAddEmployeeModalOpen}
                    onClose={() => setIsAddEmployeeModalOpen(false)}
                    onSubmit={handleAddEmployee}
                    isProcessing={isProcessing}
                  />
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>View your recent payroll transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-2">Date</div>
                          <div className="col-span-3">Transaction ID</div>
                          <div className="col-span-3">Description</div>
                          <div className="col-span-2">Amount</div>
                          <div className="col-span-2">Status</div>
                        </div>

                        {[
                          {
                            date: "May 1, 2025",
                            txId: "0xabc...123",
                            description: "Payroll Disbursement",
                            amount: "7,500 SPAY",
                            status: "Completed",
                          },
                          {
                            date: "Apr 15, 2025",
                            txId: "0xdef...456",
                            description: "Payroll Disbursement",
                            amount: "7,500 SPAY",
                            status: "Completed",
                          },
                          {
                            date: "Apr 10, 2025",
                            txId: "0xghi...789",
                            description: "Add SPAY Balance",
                            amount: "+10,000 SPAY",
                            status: "Completed",
                          },
                          {
                            date: "Apr 1, 2025",
                            txId: "0xjkl...012",
                            description: "Payroll Disbursement",
                            amount: "7,500 SPAY",
                            status: "Completed",
                          },
                          {
                            date: "Mar 15, 2025",
                            txId: "0xmno...345",
                            description: "Payroll Disbursement",
                            amount: "7,500 SPAY",
                            status: "Completed",
                          },
                        ].map((tx, index) => (
                          <div key={index} className="grid grid-cols-12 items-center border-t p-3 text-sm">
                            <div className="col-span-2">{tx.date}</div>
                            <div className="col-span-3 font-mono text-muted-foreground">{tx.txId}</div>
                            <div className="col-span-3">{tx.description}</div>
                            <div className="col-span-2">{tx.amount}</div>
                            <div className="col-span-2">
                              <div className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                                {tx.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">5</span> of <span className="font-medium">20</span>{" "}
                        transactions
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payroll Settings</CardTitle>
                      <CardDescription>Configure your payroll settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Payment Schedule</label>
                        <select className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                          <option>Weekly</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tax Withholding Rate</label>
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="10" className="max-w-sm" />
                          <span>%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Currency</label>
                        <select className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          <option>TPAY (TrustPay)</option>
                          <option>USD (US Dollar)</option>
                        </select>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Settings</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>Update your company details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <Input placeholder="Enter company name" className="max-w-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Address</label>
                        <Input placeholder="Enter company address" className="max-w-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tax ID</label>
                        <Input placeholder="Enter tax ID" className="max-w-sm" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Update Information</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
