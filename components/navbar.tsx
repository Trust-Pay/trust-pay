"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { GradientText } from "@/components/ui/gradient-text"
import { DollarSign, Menu, X, Moon, Sun, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"
import { useWeb3 } from "@/providers/web3-provider"
import { useSPAYToken } from "@/hooks/use-spay-token"
import { DEFAULT_CHAIN } from "@/config/blockchain"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet, formatAddress, viewOnExplorer } =
    useWeb3()
  const spayToken = useSPAYToken()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Employer", href: "/employer" },
    { name: "Employee", href: "/employee" },
    { name: "About", href: "/about" },
  ]

  return (
    <motion.nav
      className="sticky top-0 z-50 glass-card backdrop-blur-lg border-b border-white/20 dark:border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-blue-purple-gradient flex items-center justify-center"
            >
              <DollarSign className="h-6 w-6 text-white" />
            </motion.div>
            <div className="font-bold text-xl">
              <GradientText preset="blue-purple">StablePay ETF</GradientText>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              {!isConnected ? (
                <GradientButton
                  onClick={connectWallet}
                  gradientFrom="#6366F1"
                  gradientTo="#D946EF"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </GradientButton>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => viewOnExplorer()}>
                    {formatAddress(account)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-400">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{spayToken?.balance || "0"} SPAY</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Network Badge */}
      <div className="absolute top-0 right-0 m-3">
        <div className="flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-700 dark:text-blue-400">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{DEFAULT_CHAIN.name}</span>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {!isConnected ? (
                <GradientButton
                  onClick={connectWallet}
                  gradientFrom="#6366F1"
                  gradientTo="#D946EF"
                  className="mt-2"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </GradientButton>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="outline" size="sm" className="gap-1 justify-center" onClick={() => viewOnExplorer()}>
                    {formatAddress(account)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-400">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{spayToken?.balance || "0"} SPAY</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
