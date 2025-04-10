"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"
import { DEFAULT_CHAIN, convertAddressFormat } from "@/config/blockchain"

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

type Web3ContextType = {
  account: string | null
  chainId: number | null
  isConnecting: boolean
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  formatAddress: (address: string | null) => string
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  formatAddress: () => "",
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Format address for display (handles XDC format)
  const formatAddress = useCallback((address: string | null): string => {
    if (!address) return ""

    // If it's an XDC address, use the XDC format for display
    if (address.startsWith("xdc")) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    // Otherwise use the standard 0x format
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }, [])

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another compatible wallet to use this application.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
      const chainIdDecimal = Number.parseInt(chainIdHex, 16)

      // Check if we're on XDC Testnet (chainId 51)
      if (chainIdDecimal !== DEFAULT_CHAIN.id) {
        try {
          // Try to switch to XDC Testnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${DEFAULT_CHAIN.id.toString(16)}` }], // 51 in hex
          })
        } catch (switchError: any) {
          // If XDC Testnet is not added to wallet, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${DEFAULT_CHAIN.id.toString(16)}`,
                  chainName: DEFAULT_CHAIN.name,
                  nativeCurrency: DEFAULT_CHAIN.nativeCurrency,
                  rpcUrls: DEFAULT_CHAIN.rpcUrls.default.http,
                  blockExplorerUrls: [DEFAULT_CHAIN.blockExplorers.default.url],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }

      // Get updated chain ID after potential network switch
      const updatedChainIdHex = await window.ethereum.request({ method: "eth_chainId" })
      const updatedChainIdDecimal = Number.parseInt(updatedChainIdHex, 16)

      // Store the account address - convert to XDC format for consistency
      const xdcAddress = accounts[0].startsWith("0x") ? convertAddressFormat(accounts[0]) : accounts[0]

      setAccount(xdcAddress)
      setChainId(updatedChainIdDecimal)
      setIsConnected(true)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${formatAddress(xdcAddress)}`,
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }, [formatAddress])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setIsConnected(false)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet()
        } else if (accounts[0] !== account) {
          // User switched accounts - convert to XDC format
          const xdcAddress = accounts[0].startsWith("0x") ? convertAddressFormat(accounts[0]) : accounts[0]

          setAccount(xdcAddress)
          toast({
            title: "Account Changed",
            description: `Switched to ${formatAddress(xdcAddress)}`,
          })
        }
      }

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = Number.parseInt(chainIdHex, 16)
        setChainId(newChainId)

        // Check if we're on XDC Testnet
        if (newChainId !== DEFAULT_CHAIN.id) {
          toast({
            title: "Network Changed",
            description: `Please switch to ${DEFAULT_CHAIN.name} to use this application.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Network Changed",
            description: `Connected to ${DEFAULT_CHAIN.name}`,
          })
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account, disconnectWallet, formatAddress])

  const value = {
    account,
    chainId,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    formatAddress,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
