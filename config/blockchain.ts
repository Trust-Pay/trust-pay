export const DEFAULT_CHAIN = {
  id: 51,
  name: "XDC Apothem Testnet",
  network: "apothem",
  nativeCurrency: {
    name: "XDC",
    symbol: "XDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.apothem.network"],
    },
    public: {
      http: ["https://rpc.apothem.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "XDC Network Explorer",
      url: "https://explorer.apothem.network",
    },
  },
  testnet: true,
}

// XDC addresses start with "xdc" instead of "0x"
export const CONTRACT_ADDRESSES = {
  SPAYStablecoin: "xdc1234567890123456789012345678901234567890", // Replace with actual deployed address
  ETFToken: "xdc2345678901234567890123456789012345678901", // Replace with actual deployed address
  CollateralManager: "xdc3456789012345678901234567890123456789012", // Replace with actual deployed address
  PayrollProcessor: "xdc4567890123456789012345678901234567890123", // Replace with actual deployed address
  InvestmentManager: "xdc5678901234567890123456789012345678901234", // Replace with actual deployed address
  SavingsManager: "xdc6789012345678901234567890123456789012345", // Replace with actual deployed address
}

// Helper function to convert between XDC and 0x address formats
export const convertAddressFormat = (address: string): string => {
  if (address.startsWith("xdc")) {
    return "0x" + address.slice(3)
  } else if (address.startsWith("0x")) {
    return "xdc" + address.slice(2)
  }
  return address
}
