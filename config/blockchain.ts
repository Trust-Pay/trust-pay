export const DEFAULT_CHAIN = {
  id: 50002,
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
  SPAY_TOKEN_CONTRACT: "0x60c977735cfBF44Cf5B33bD02a8B637765E7AbbB",
  ETF_TOKEN_CONTRACT: "0x6157DCF5f7E0546706e7153AbEb2Fe48122bEec5",
  SAVING_MANAGER_CONTRACT: "0x7d8940bAf8A432E09a30ce762abb3dD9Ab75eF3d",
  PAYROLL_PROCESSOR: "0x0878f2D8fBC9a2E08E0d1076763376920AC91145",
  COLLETRAL_MANAGER: "0x5aE2B46aeF46Ef33d8d91Da8519C9B9C898086DC",
  INVESTMENT_MANAGER: "0x9bDA20E14700EbfD1B9A0900c3d54538F867bD59"
}

