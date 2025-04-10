"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import { toast } from "@/components/ui/use-toast"
import { DEFAULT_CHAIN, CONTRACT_ADDRESSES, convertAddressFormat } from "@/config/blockchain"

// Contract ABIs
import SPAYStablecoinABI from "@/abis/SPAYStablecoin.json"
import ETFTokenABI from "@/abis/ETFToken.json"
import CollateralManagerABI from "@/abis/CollateralManager.json"
import PayrollProcessorABI from "@/abis/PayrollProcessor.json"
import InvestmentManagerABI from "@/abis/InvestmentManager.json"
import SavingsManagerABI from "@/abis/SavingsManager.json"

type Web3ContextType = {
  account: string | null
  chainId: number | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  isConnecting: boolean
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  contracts: {
    spayToken: ethers.Contract | null
    etfToken: ethers.Contract | null
    collateralManager: ethers.Contract | null
    payrollProcessor: ethers.Contract | null
    investmentManager: ethers.Contract | null
    savingsManager: ethers.Contract | null
  }
  balances: {
    spay: string
    etf: string
  }
  refreshBalances: () => Promise<void>
  formatAddress: (address: string | null) => string
  viewOnExplorer: (address?: string) => void
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  provider: null,
  signer: null,
  isConnecting: false,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  contracts: {
    spayToken: null,
    etfToken: null,
    collateralManager: null,
    payrollProcessor: null,
    investmentManager: null,
    savingsManager: null,
  },
  balances: {
    spay: "0",
    etf: "0",
  },
  refreshBalances: async () => {},
  formatAddress: () => "",
  viewOnExplorer: () => {},
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const [contracts, setContracts] = useState({
    spayToken: null as ethers.Contract | null,
    etfToken: null as ethers.Contract | null,
    collateralManager: null as ethers.Contract | null,
    payrollProcessor: null as ethers.Contract | null,
    investmentManager: null as ethers.Contract | null,
    savingsManager: null as ethers.Contract | null,
  })

  const [balances, setBalances] = useState({
    spay: "0",
    etf: "0",
  })

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

  // View address on XDC explorer
  const viewOnExplorer = useCallback(
    (address?: string) => {
      const addressToView = address || account
      if (!addressToView) return

      // Convert to 0x format if needed for explorer URL
      const formattedAddress = addressToView.startsWith("xdc") ? addressToView.replace("xdc", "0x") : addressToView

      window.open(`${DEFAULT_CHAIN.blockExplorers.default.url}/address/${formattedAddress}`, "_blank")
    },
    [account],
  )

  // Initialize contracts
  const initContracts = useCallback(async (signer: ethers.Signer) => {
    try {
      // Convert XDC addresses to 0x format for ethers.js
      const spayAddress = CONTRACT_ADDRESSES.SPAYStablecoin.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.SPAYStablecoin)
        : CONTRACT_ADDRESSES.SPAYStablecoin

      const etfAddress = CONTRACT_ADDRESSES.ETFToken.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.ETFToken)
        : CONTRACT_ADDRESSES.ETFToken

      const collateralAddress = CONTRACT_ADDRESSES.CollateralManager.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.CollateralManager)
        : CONTRACT_ADDRESSES.CollateralManager

      const payrollAddress = CONTRACT_ADDRESSES.PayrollProcessor.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.PayrollProcessor)
        : CONTRACT_ADDRESSES.PayrollProcessor

      const investmentAddress = CONTRACT_ADDRESSES.InvestmentManager.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.InvestmentManager)
        : CONTRACT_ADDRESSES.InvestmentManager

      const savingsAddress = CONTRACT_ADDRESSES.SavingsManager.startsWith("xdc")
        ? convertAddressFormat(CONTRACT_ADDRESSES.SavingsManager)
        : CONTRACT_ADDRESSES.SavingsManager

      const spayToken = new ethers.Contract(spayAddress, SPAYStablecoinABI, signer)
      const etfToken = new ethers.Contract(etfAddress, ETFTokenABI, signer)
      const collateralManager = new ethers.Contract(collateralAddress, CollateralManagerABI, signer)
      const payrollProcessor = new ethers.Contract(payrollAddress, PayrollProcessorABI, signer)
      const investmentManager = new ethers.Contract(investmentAddress, InvestmentManagerABI, signer)
      const savingsManager = new ethers.Contract(savingsAddress, SavingsManagerABI, signer)

      setContracts({
        spayToken,
        etfToken,
        collateralManager,
        payrollProcessor,
        investmentManager,
        savingsManager,
      })
    } catch (error) {
      console.error("Failed to initialize contracts:", error)
      toast({
        title: "Contract Initialization Failed",
        description: "There was an error initializing the smart contracts.",
        variant: "destructive",
      })
    }
  }, [])

  // Fetch balances
  const refreshBalances = useCallback(async () => {
    if (!account || !contracts.spayToken || !contracts.etfToken) return

    try {
      // Convert XDC address to 0x format for contract calls
      const ethAddress = account.startsWith("xdc") ? convertAddressFormat(account) : account

      const spayBalance = await contracts.spayToken.balanceOf(ethAddress)
      const etfBalance = await contracts.etfToken.balanceOf(ethAddress)

      setBalances({
        spay: ethers.utils.formatUnits(spayBalance, 18),
        etf: ethers.utils.formatUnits(etfBalance, 18),
      })
    } catch (error) {
      console.error("Failed to fetch balances:", error)
    }
  }, [account, contracts.spayToken, contracts.etfToken])

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

      // Create provider and signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      const web3Signer = web3Provider.getSigner()
      const address = await web3Signer.getAddress()

      // Convert to XDC format for display
      const xdcAddress = convertAddressFormat(address)

      setAccount(xdcAddress)
      setChainId(chainIdDecimal)
      setProvider(web3Provider)
      setSigner(web3Signer)
      setIsConnected(true)

      // Initialize contracts with signer
      await initContracts(web3Signer)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${formatAddress(xdcAddress)}`,
      })

      // Fetch initial balances
      setTimeout(refreshBalances, 500)
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
  }, [initContracts, refreshBalances, formatAddress])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    setContracts({
      spayToken: null,
      etfToken: null,
      collateralManager: null,
      payrollProcessor: null,
      investmentManager: null,
      savingsManager: null,
    })
    setBalances({
      spay: "0",
      etf: "0",
    })

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
          const xdcAddress = convertAddressFormat(accounts[0])
          setAccount(xdcAddress)
          toast({
            title: "Account Changed",
            description: `Switched to ${formatAddress(xdcAddress)}`,
          })
          refreshBalances()
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
          refreshBalances()
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account, disconnectWallet, refreshBalances, formatAddress])

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    contracts,
    balances,
    refreshBalances,
    formatAddress,
    viewOnExplorer,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
