export const DEFAULT_CHAIN = {
  id: 5151,
  name: "Pharos Devnet",
  network: "Pharos Devnet",
  nativeCurrency: {
    name: "Pharos",
    symbol: "pharos",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.dplabs-internal.com"],
    },
    public: {
      http: ["https://devnet.dplabs-internal.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pharos Explorer",
      url: "https://pharosscan.xyz",
    },
  },
  testnet: true,
}

// Pharos addresses start with "phr" instead of "0x"
export const CONTRACT_ADDRESSES = {
  SPAYStablecoin: "phr1234567890123456789012345678901234567890", // Replace with actual deployed address
  ETFToken: "phr2345678901234567890123456789012345678901", // Replace with actual deployed address
  CollateralManager: "phr3456789012345678901234567890123456789012", // Replace with actual deployed address
  PayrollProcessor: "phr4567890123456789012345678901234567890123", // Replace with actual deployed address
  InvestmentManager: "phr5678901234567890123456789012345678901234", // Replace with actual deployed address
  SavingsManager: "phr6789012345678901234567890123456789012345", // Replace with actual deployed address
}

// Helper function to convert between Pharos and 0x address formats
export const convertAddressFormat = (address: string): string => {
  if (address.startsWith("phr")) {
    return "0x" + address.slice(3)
  } else if (address.startsWith("0x")) {
    return "phr" + address.slice(2)
  }
  return address
}