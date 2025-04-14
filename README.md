# TrustPay ETF

A blockchain-based payroll platform using a stablecoin backed by gold, BTC, and ETH ETFs for secure, efficient, and innovative payroll processing.

## Features

- **Blockchain-Based Payroll**: Secure and transparent payroll processing using smart contracts
- **ETF-Backed Stablecoin**: SPAY token backed by a diversified portfolio:
  - 50% Gold
  - 25% BTC
  - 25% ETH
- **Employee Dashboard**: Manage payroll, investments, and savings
- **Investment Management**: Direct investment in ETF tokens
- **Savings Lock**: Lock savings for fixed periods
- **Real-time Analytics**: Track balances and investment performance
- **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- **Responsive Design**: Modern UI with dark mode support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Blockchain**: Ethereum, Web3.js
- **Smart Contracts**: Solidity
- **Animations**: Framer Motion

## Prerequisites

- Node.js 18.0.0 or higher
- MetaMask or compatible Web3 wallet

## Installation

1. Clone the repository:
```bash
git clone https://github.com/repo-name/trust-pay.git
cd trust-pay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contracts

The project includes the following smart contracts:

- `SPAYStablecoin.sol`: ERC20 stablecoin implementation
- `ETFToken.sol`: ETF token implementation
- `PayrollProcessor.sol`: Handles payroll operations
- `CollateralManager.sol`: Manages ETF backing
- `InvestmentManager.sol`: Handles investment operations
- `SavingsManager.sol`: Manages savings lock functionality

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── contracts/           # Smart contracts
├── hooks/              # Custom React hooks
├── providers/          # Context providers
├── public/             # Static assets
├── styles/             # Global styles
└── config/             # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](MIT_LICENSE.md) file for details.

## Support

For support, please open an issue in the GitHub repository or contact our support team.