"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { GradientText } from "@/components/ui/gradient-text"
import { News } from "@/components/ui/news"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, floatAnimation } from "@/lib/animations"
import { ArrowRight, CheckCircle, DollarSign, Briefcase, LineChart, Shield, Clock, Globe } from "lucide-react"

export default function Home() {
  const [connected, setConnected] = useState(false)

  const connectWallet = () => {
    setConnected(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-emerald-500/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <motion.div variants={fadeIn("right")} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <motion.div
                    variants={fadeIn("up", 0.2)}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Revolutionizing Payroll</span>
                  </motion.div>

                  <motion.h1
                    variants={fadeIn("up", 0.3)}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    The Future of{" "}
                    <GradientText preset="blue-purple" className="font-extrabold">
                      Payroll
                    </GradientText>{" "}
                    is Here
                  </motion.h1>

                  <motion.p variants={fadeIn("up", 0.4)} className="text-lg text-muted-foreground max-w-xl">
                    TrustPay ETF is a blockchain-based payroll platform using a stablecoin backed by gold, BTC, and ETH
                    ETFs for secure, efficient, and innovative payroll processing.
                  </motion.p>
                </div>

                <motion.div variants={fadeIn("up", 0.5)} className="flex flex-wrap gap-4">
                  <GradientButton
                    size="xl"
                    gradientFrom="#6366F1"
                    gradientVia="#8B5CF6"
                    gradientTo="#D946EF"
                    onClick={connectWallet}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </GradientButton>

                  <Button size="xl" variant="outline">
                    Learn More
                  </Button>
                </motion.div>

                <motion.div variants={fadeIn("up", 0.6)} className="flex flex-wrap items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">500+</span> companies trust TrustPay ETF
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeIn("left")} className="flex-1 relative">
                <motion.div variants={floatAnimation} initial="hidden" animate="float" className="relative z-10">
                  <GlassCard className="p-6 max-w-md mx-auto">
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
                          <div className="font-bold">1,000 SPAY</div>
                          <div className="text-xs text-muted-foreground">≈ $1,000 USD</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">ETF Composition</div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-yellow-100/30 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">Gold</div>
                            <div className="font-bold">50%</div>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-100/30 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div className="text-xs text-orange-600 dark:text-orange-400">BTC</div>
                            <div className="font-bold">25%</div>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-100/30 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="text-xs text-blue-600 dark:text-blue-400">ETH</div>
                            <div className="font-bold">25%</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Recent Transactions</div>
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
                                <div className="text-xs text-muted-foreground">Apr 15, 2025</div>
                              </div>
                            </div>
                            <div className="font-medium text-blue-600 dark:text-blue-400">-100 SPAY</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl -z-10" />
                <motion.div
                  className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gold-gradient shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
                <motion.div
                  className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-bitcoin-gradient shadow-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            >
              <motion.div
                variants={fadeIn("up")}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Key Features</span>
              </motion.div>

              <motion.h2 variants={fadeIn("up", 0.1)} className="text-3xl md:text-4xl font-bold">
                Transforming Payroll with <GradientText preset="blue-purple">Blockchain Technology</GradientText>
              </motion.h2>

              <motion.p variants={fadeIn("up", 0.2)} className="text-muted-foreground">
                TrustPay ETF combines the stability of gold, the growth potential of BTC, and the utility of ETH to
                create a revolutionary payroll solution.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <DollarSign className="h-6 w-6" />,
                  title: "SPAY Stablecoin",
                  description: "USD-pegged stablecoin backed by a diversified ETF (50% gold, 25% BTC, 25% ETH).",
                  gradient: "from-blue-500 to-purple-600",
                  delay: 0,
                },
                {
                  icon: <Briefcase className="h-6 w-6" />,
                  title: "Automated Payroll",
                  description: "Smart contract-based payroll triggered by fixed schedules with low transaction fees.",
                  gradient: "from-purple-500 to-pink-600",
                  delay: 0.1,
                },
                {
                  icon: <LineChart className="h-6 w-6" />,
                  title: "Investment Options",
                  description:
                    "Employees can allocate a portion of SPAY to ETF tokens, gaining exposure to gold, BTC, and ETH.",
                  gradient: "from-pink-500 to-red-600",
                  delay: 0.2,
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Compliance & Security",
                  description: "Built-in KYC/AML verification and tax withholding for regulatory compliance.",
                  gradient: "from-red-500 to-orange-600",
                  delay: 0.3,
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Instant Settlements",
                  description: "No more waiting 3-5 days for payroll processing. Get paid instantly.",
                  gradient: "from-orange-500 to-yellow-600",
                  delay: 0.4,
                },
                {
                  icon: <Globe className="h-6 w-6" />,
                  title: "Global Accessibility",
                  description: "Access your funds from anywhere in the world with an internet connection.",
                  gradient: "from-yellow-500 to-green-600",
                  delay: 0.5,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", feature.delay)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <GlassCard className="h-full p-6">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ETF Composition Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute top-20 left-1/2 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <motion.div variants={fadeIn("right")} className="flex-1 space-y-8">
                <div className="space-y-4">
                  <motion.div
                    variants={fadeIn("up")}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium"
                  >
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>ETF Composition</span>
                  </motion.div>

                  <motion.h2 variants={fadeIn("up", 0.1)} className="text-3xl md:text-4xl font-bold">
                    The Perfect <GradientText preset="gold">Balance</GradientText> of Stability and Growth
                  </motion.h2>

                  <motion.p variants={fadeIn("up", 0.2)} className="text-muted-foreground">
                    Our ETF combines the stability of gold, the growth potential of Bitcoin, and the utility of Ethereum
                    to create a well-balanced portfolio.
                  </motion.p>
                </div>

                <motion.div variants={fadeIn("up", 0.3)} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-gradient flex items-center justify-center text-white font-bold">
                      50%
                    </div>
                    <div>
                      <h4 className="font-bold">Gold</h4>
                      <p className="text-sm text-muted-foreground">Provides stability and hedges against inflation</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bitcoin-gradient flex items-center justify-center text-white font-bold">
                      25%
                    </div>
                    <div>
                      <h4 className="font-bold">Bitcoin</h4>
                      <p className="text-sm text-muted-foreground">
                        Offers growth potential as a decentralized store of value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-ethereum-gradient flex items-center justify-center text-white font-bold">
                      25%
                    </div>
                    <div>
                      <h4 className="font-bold">Ethereum</h4>
                      <p className="text-sm text-muted-foreground">
                        Adds exposure to smart contract ecosystems and utility
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn("up", 0.4)}>
                  <GradientButton gradientFrom="#FFD700" gradientVia="#F7931A" gradientTo="#627EEA">
                    Learn More About Our ETF
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeIn("left")} className="flex-1">
                <div className="relative">
                  <motion.div
                    variants={floatAnimation}
                    initial="hidden"
                    animate="float"
                    className="etf-card max-w-md mx-auto"
                  >
                    <div className="relative z-10 space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">TrustPay ETF Token</h3>
                        <p className="text-sm text-muted-foreground">A diversified portfolio in a single token</p>
                      </div>

                      <div className="relative h-64 w-64 mx-auto">
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

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Current Price</div>
                          <div className="font-bold">$1.00</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Market Cap</div>
                          <div className="font-bold">$10M</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-bold text-green-500">2.0%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            >
              <motion.div
                variants={fadeIn("up")}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>How It Works</span>
              </motion.div>

              <motion.h2 variants={fadeIn("up", 0.1)} className="text-3xl md:text-4xl font-bold">
                Simple, <GradientText preset="blue-purple">Secure</GradientText>, and Efficient
              </motion.h2>

              <motion.p variants={fadeIn("up", 0.2)} className="text-muted-foreground">
                TrustPay ETF makes payroll processing easier for employers and provides investment opportunities for
                employees.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Employer Uploads Payroll",
                  description: "Employers upload employee addresses and payroll amounts to the platform.",
                  delay: 0,
                },
                {
                  step: "02",
                  title: "Smart Contract Processes Payroll",
                  description:
                    "Our smart contracts automatically process payroll, deduct taxes, and disburse SPAY tokens.",
                  delay: 0.1,
                },
                {
                  step: "03",
                  title: "Employees Receive & Invest",
                  description:
                    "Employees receive SPAY tokens instantly and can choose to invest a portion in ETF tokens.",
                  delay: 0.2,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", step.delay)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <GlassCard className="h-full p-6">
                    <div className="space-y-4">
                      <div className="text-5xl font-bold text-blue-500 opacity-30">{step.step}</div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <News/>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              variants={fadeIn()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:p-12"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform translate-y-1/2" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white space-y-4 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Payroll?</h2>
                  <p className="text-white/80">
                    Join hundreds of companies already using TrustPay ETF to streamline their payroll process and
                    empower their employees.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <GradientButton size="xl" className="bg-white text-blue-600 hover:bg-white/90">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </GradientButton>

                    <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                      Schedule a Demo
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    "Instant Payroll Processing",
                    "Lower Transaction Fees",
                    "Employee Investment Options",
                    "Regulatory Compliance",
                    "Transparent & Secure",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
