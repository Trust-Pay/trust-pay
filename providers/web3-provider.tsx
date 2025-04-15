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
  viewOnExplorer: () => void
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  formatAddress: () => "",
  viewOnExplorer: () => {},
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Format address for display
  const formatAddress = useCallback((address: string | null): string => {
    if (!address) return ""
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
      
      // Set authentication cookie
      document.cookie = `auth-token=${accounts[0]}; path=/`

      // Check if we're on Pharos Devnet (chainId 50002)
      if (chainIdDecimal !== DEFAULT_CHAIN.id) {
        try {
          // Try to switch to Pharos Devnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${DEFAULT_CHAIN.id.toString(16)}` }], // 50002 in hex (0xC352)
          })
        } catch (switchError: any) {
          // If Pharos Devnet is not added to wallet, add it
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

      // Store the account address in its original format
      setAccount(accounts[0])
      setChainId(updatedChainIdDecimal)
      setIsConnected(true)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${formatAddress(accounts[0])}`,
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
          // User switched accounts
          setAccount(accounts[0])
          toast({
            title: "Account Changed",
            description: `Switched to ${formatAddress(accounts[0])}`,
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

  // View address on block explorer
  const viewOnExplorer = useCallback(() => {
    if (!account) return

    const explorerUrl = `${DEFAULT_CHAIN.blockExplorers.default.url}/address/${account}`
    window.open(explorerUrl, "_blank")
  }, [account])

  const value = {
    account,
    chainId,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    formatAddress,
    viewOnExplorer,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
