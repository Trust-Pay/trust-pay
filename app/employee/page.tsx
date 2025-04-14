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
import { fadeIn, staggerContainer, floatAnimation } from "@/lib/animations"
import {
  DollarSign,
  LineChart,
  Clock,
  ArrowRight,
  ArrowDown,
  Wallet,
  Lock,
  Unlock,
  PiggyBank,
  Download,
} from "lucide-react"
import { useWeb3 } from "@/providers/web3-provider"
import { useSPAYToken } from "@/hooks/use-spay-token"
import { useETFToken } from "@/hooks/use-etf-token"
import { useInvestmentManager } from "@/hooks/use-investment-manager"
import { useSavingsManager } from "@/hooks/use-savings-manager"
import { NetworkInfo } from "@/components/network-info"

export default function EmployeeDashboard() {
  const { account, isConnected, connectWallet } = useWeb3()
  const spayToken = useSPAYToken()
  const etfToken = useETFToken()
  const { invest, withdraw, isInvesting } = useInvestmentManager()
  const { lockSavings, withdrawSavings, isProcessing } = useSavingsManager()

  const [investAmount, setInvestAmount] = useState("")
  const [saveAmount, setSaveAmount] = useState("")

  const handleInvest = async () => {
    if (!investAmount) return
    const success = await invest(investAmount)
    if (success) {
      setInvestAmount("")
    }
  }

  const handleSave = async () => {
    if (!saveAmount) return
    const success = await lockSavings(saveAmount)
    if (success) {
      setSaveAmount("")
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
                <h1 className="text-3xl font-bold">Employee Dashboard</h1>
                <p className="text-muted-foreground">Manage your payroll and investments</p>
              </div>

              <div className="flex items-center gap-3">
                {isConnected && account ? (
                  <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </Button>
                ) : (
                  <Button variant="outline" className="gap-2" onClick={connectWallet}>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeIn("up")} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "SPAY Balance",
                  value: spayToken?.balance || "0 SPAY",
                  description: "Available balance",
                  icon: <DollarSign className="h-5 w-5 text-blue-500" />,
                  change: "+1,000 SPAY on May 1",
                  changeColor: "text-green-500",
                },
                {
                  title: "ETF Investment",
                  value: etfToken?.balance || "0 ETF",
                  description: "Gold/BTC/ETH ETF",
                  icon: <LineChart className="h-5 w-5 text-purple-500" />,
                  change: "+2% growth",
                  changeColor: "text-green-500",
                },
                {
                  title: "Savings",
                  value: "200 SPAY",
                  description: "Locked for 30 days",
                  icon: <Lock className="h-5 w-5 text-pink-500" />,
                  change: "Unlocks on May 30",
                  changeColor: "text-muted-foreground",
                },
                {
                  title: "Next Payroll",
                  value: "May 15, 2025",
                  description: "In 10 days",
                  icon: <Clock className="h-5 w-5 text-emerald-500" />,
                  change: "Expected: 1,000 SPAY",
                  changeColor: "text-muted-foreground",
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
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="investments">Investments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={floatAnimation} initial="hidden" animate="float">
                      <GlassCard className="p-6 h-full" borderGradient>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-purple-gradient flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">TrustPay ETF</div>
                                <div className="text-xs text-muted-foreground">Backed by Gold, BTC, ETH</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{spayToken?.balance || "0"} SPAY</div>
                              <div className="text-xs text-muted-foreground">≈ ${spayToken?.balance || "0"} USD</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Recent Activity</div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <ArrowRight className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Received Payroll</div>
                                    <div className="text-xs text-muted-foreground">May 1, 2025</div>
                                  </div>
                                </div>
                                <div className="font-medium text-green-600 dark:text-green-400">+1,000 SPAY</div>
                              </div>
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <LineChart className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Invested in ETF</div>
                                    <div className="text-xs text-muted-foreground">May 1, 2025</div>
                                  </div>
                                </div>
                                <div className="font-medium text-blue-600 dark:text-blue-400">-100 SPAY</div>
                              </div>
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <Lock className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Locked Savings</div>
                                    <div className="text-xs text-muted-foreground">Apr 30, 2025</div>
                                  </div>
                                </div>
                                <div className="font-medium text-purple-600 dark:text-purple-400">-200 SPAY</div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <GradientButton className="w-full" gradientFrom="#6366F1" gradientTo="#D946EF">
                              View All Transactions
                            </GradientButton>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>

                    <Card>
                      <CardHeader>
                        <CardTitle>ETF Composition</CardTitle>
                        <CardDescription>Your investment in Gold, BTC, and ETH</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="relative h-48">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gold-gradient opacity-80" />
                          </div>
                          <div className="absolute top-1/4 right-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-bitcoin-gradient opacity-80" />
                          </div>
                          <div className="absolute bottom-0 left-1/4 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-ethereum-gradient opacity-80" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center">
                              <DollarSign className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg bg-yellow-100/30 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">Gold</div>
                            <div className="font-bold">50%</div>
                            <div className="text-xs text-muted-foreground">
                              {etfToken ? (Number.parseInt(etfToken.balance) * 0.5).toFixed(0) : "0"} ETF
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-100/30 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div className="text-xs text-orange-600 dark:text-orange-400">BTC</div>
                            <div className="font-bold">25%</div>
                            <div className="text-xs text-muted-foreground">
                              {etfToken ? (Number.parseInt(etfToken.balance) * 0.25).toFixed(0) : "0"} ETF
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-100/30 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="text-xs text-blue-600 dark:text-blue-400">ETH</div>
                            <div className="font-bold">25%</div>
                            <div className="text-xs text-muted-foreground">
                              {etfToken ? (Number.parseInt(etfToken.balance) * 0.25).toFixed(0) : "0"} ETF
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" className="w-full">
                            View Investment Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Invest in ETF</CardTitle>
                        <CardDescription>Invest SPAY in Gold/BTC/ETH ETF</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex flex-col items-center p-3 border rounded-lg">
                            <div className="text-yellow-500 mb-1">Gold</div>
                            <div className="font-bold">50%</div>
                          </div>
                          <div className="flex flex-col items-center p-3 border rounded-lg">
                            <div className="text-orange-500 mb-1">BTC</div>
                            <div className="font-bold">25%</div>
                          </div>
                          <div className="flex flex-col items-center p-3 border rounded-lg">
                            <div className="text-blue-500 mb-1">ETH</div>
                            <div className="font-bold">25%</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Amount to Invest</div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="SPAY amount"
                              type="number"
                              value={investAmount}
                              onChange={(e) => setInvestAmount(e.target.value)}
                            />
                            <Button variant="outline" onClick={() => setInvestAmount("100")}>
                              Max 10%
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available: {spayToken?.balance || "0"} SPAY | Recommended: Up to 10% (100 SPAY)
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <GradientButton
                          className="w-full gap-2"
                          gradientFrom="#6366F1"
                          gradientVia="#8B5CF6"
                          gradientTo="#D946EF"
                          onClick={handleInvest}
                          disabled={isInvesting || !investAmount}
                        >
                          <LineChart className="h-4 w-4" />
                          {isInvesting ? "Processing..." : "Invest in ETF"}
                        </GradientButton>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Savings</CardTitle>
                        <CardDescription>Lock SPAY for 30 days</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                              <div className="text-sm font-medium">30-Day Lock Period</div>
                            </div>
                            <div className="text-sm text-muted-foreground">2% APY</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Amount to Save</div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="SPAY amount"
                              type="number"
                              value={saveAmount}
                              onChange={(e) => setSaveAmount(e.target.value)}
                            />
                            <Button variant="outline" onClick={() => setSaveAmount("200")}>
                              Max 20%
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available: {spayToken?.balance || "0"} SPAY | Recommended: Up to 20% (200 SPAY)
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <GradientButton
                          className="w-full gap-2"
                          gradientFrom="#10B981"
                          gradientTo="#3B82F6"
                          onClick={handleSave}
                          disabled={isProcessing || !saveAmount}
                        >
                          <PiggyBank className="h-4 w-4" />
                          {isProcessing ? "Processing..." : "Lock Savings"}
                        </GradientButton>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="investments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Portfolio</CardTitle>
                      <CardDescription>Your ETF investment details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-yellow-500" />
                            </div>
                            <div>
                              <div className="font-bold">Gold</div>
                              <div className="text-xs text-yellow-700 dark:text-yellow-400">50% Allocation</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Amount:</span>
                              <span className="font-medium">50 ETF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Value:</span>
                              <span className="font-medium">$50.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Performance:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">+1.2%</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-orange-500" />
                            </div>
                            <div>
                              <div className="font-bold">Bitcoin</div>
                              <div className="text-xs text-orange-700 dark:text-orange-400">25% Allocation</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Amount:</span>
                              <span className="font-medium">25 ETF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Value:</span>
                              <span className="font-medium">$25.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Performance:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">+3.5%</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-blue-500" />
                            </div>
                            <div>
                              <div className="font-bold">Ethereum</div>
                              <div className="text-xs text-blue-700 dark:text-blue-400">25% Allocation</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Amount:</span>
                              <span className="font-medium">25 ETF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Value:</span>
                              <span className="font-medium">$25.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Performance:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">+2.8%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-lg border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-lg font-bold">Total Investment</h3>
                            <p className="text-sm text-muted-foreground">Your ETF portfolio summary</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">100 ETF</div>
                            <div className="text-sm text-muted-foreground">≈ $100.00 USD</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Initial Investment:</span>
                            <span className="font-medium">100 SPAY ($100.00)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Current Value:</span>
                            <span className="font-medium">$102.50</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Return:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">+$2.50 (+2.5%)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Annual Yield:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">2.0% APY</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-3">
                      <GradientButton className="gap-2 flex-1" gradientFrom="#6366F1" gradientTo="#D946EF">
                        <ArrowDown className="h-4 w-4" />
                        Invest More
                      </GradientButton>
                      <Button variant="outline" className="flex-1">
                        Withdraw Investment
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Savings Status</CardTitle>
                      <CardDescription>Your locked SPAY savings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 rounded-lg border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">30-Day Lock</h3>
                              <p className="text-sm text-muted-foreground">Unlocks on May 30, 2025</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">200 SPAY</div>
                            <div className="text-sm text-muted-foreground">≈ $200.00 USD</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Lock Date:</span>
                            <span className="font-medium">Apr 30, 2025</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Unlock Date:</span>
                            <span className="font-medium">May 30, 2025</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Interest Rate:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">2.0% APY</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Expected Interest:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">+0.33 SPAY</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                              Locked
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled>
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock (Available on May 30, 2025)
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your recent transactions</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                          <option>All Transactions</option>
                          <option>Payroll</option>
                          <option>Investments</option>
                          <option>Savings</option>
                        </select>
                      </div>
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
                            description: "Received Payroll",
                            amount: "+1,000 SPAY",
                            status: "Completed",
                            statusColor: "green",
                          },
                          {
                            date: "May 1, 2025",
                            txId: "0xdef...456",
                            description: "Invested in ETF",
                            amount: "-100 SPAY",
                            status: "Completed",
                            statusColor: "green",
                          },
                          {
                            date: "Apr 30, 2025",
                            txId: "0xghi...789",
                            description: "Locked Savings",
                            amount: "-200 SPAY",
                            status: "Locked",
                            statusColor: "yellow",
                          },
                          {
                            date: "Apr 15, 2025",
                            txId: "0xjkl...012",
                            description: "Received Payroll",
                            amount: "+1,000 SPAY",
                            status: "Completed",
                            statusColor: "green",
                          },
                          {
                            date: "Apr 1, 2025",
                            txId: "0xmno...345",
                            description: "Received Payroll",
                            amount: "+1,000 SPAY",
                            status: "Completed",
                            statusColor: "green",
                          },
                        ].map((tx, index) => (
                          <div key={index} className="grid grid-cols-12 items-center border-t p-3 text-sm">
                            <div className="col-span-2">{tx.date}</div>
                            <div className="col-span-3 font-mono text-muted-foreground">{tx.txId}</div>
                            <div className="col-span-3">{tx.description}</div>
                            <div className="col-span-2 font-medium">
                              {tx.amount.startsWith("+") ? (
                                <span className="text-green-600 dark:text-green-400">{tx.amount}</span>
                              ) : (
                                <span className="text-blue-600 dark:text-blue-400">{tx.amount}</span>
                              )}
                            </div>
                            <div className="col-span-2">
                              <div
                                className={`inline-flex items-center rounded-full bg-${tx.statusColor}-100 dark:bg-${tx.statusColor}-900/30 px-2 py-1 text-xs font-medium text-${tx.statusColor}-700 dark:text-${tx.statusColor}-400`}
                              >
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
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
