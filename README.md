# PropChain — Fractional Real Estate Investment Platform

> Invest in Dubai's most prestigious real estate from AED 500. Blockchain-powered fractional ownership with VARA compliance.

PropChain tokenises Dubai properties as ERC-20 tokens on-chain, allowing investors to buy fractional shares, earn proportional rental yield, and redeem after a 12-month lock-up. The platform is designed to comply with the UAE's Virtual Assets Regulatory Authority (VARA) requirements.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Smart Contracts](#smart-contracts)
- [Rust CLI Tooling](#rust-cli-tooling)
- [API Routes](#api-routes)
- [License](#license)

---

## Features

- **Fractional property investment** — purchase tokens representing a share of a specific Dubai property
- **KYC allowlist** — only VARA-approved addresses can hold or transfer tokens, enforced directly on-chain
- **Rental yield distribution** — rental income is deposited by property managers and distributed proportionally to all token holders using a debt-per-share pattern
- **12-month lock-up** — each investment records a `lockedUntil` timestamp; redemptions are blocked until the period expires
- **Multi-wallet support** — detects MetaMask, Rabby, Coinbase Wallet, Brave Wallet, Trust Wallet, OKX Wallet, and Phantom
- **Firebase authentication** — email/password and social sign-in via Google
- **Traditional JWT auth** — Express-based signup/login with bcrypt + JWT for API access
- **Real-time chat** — Socket.IO powered messaging between users
- **Price oracle** — Rust service that fetches live property valuations and pushes on-chain price updates to `PropertyRegistry`
- **Yield calculator CLI** — computes annual yield %, token price in AED, funded/unfunded token counts, and projected N-year ROI
- **Holder snapshot** — scans on-chain `Transfer` events and exports a JSON file of current token holders and balances

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router v7, TanStack Query v5, Zustand v5 |
| Styling | Tailwind CSS v3, Framer Motion v11, Lucide React |
| Auth | Firebase v12 (Auth + Storage), Express JWT + bcrypt |
| Backend | Node.js, Express v5, Socket.IO v4 |
| Database | MongoDB (Mongoose v9) |
| Smart Contracts | Solidity ^0.8.24 (Hardhat or Foundry for compilation) |
| Off-chain tooling | Rust (Tokio, clap, ethers-rs v2, reqwest, rust_decimal) |

---

## Project Structure

```
propchain-real-estate/
├── index.html                    # Vite entry point
├── package.json                  # npm scripts and all JS dependencies
├── postcss.config.js
├── .env / .env.example           # Environment variable templates
│
├── src/                          # React frontend
│   ├── App.jsx                   # Router, QueryClient provider, Firebase AuthProvider
│   ├── pages/                    # Route-level pages (Home, Properties, Dashboard, etc.)
│   ├── components/
│   │   ├── layouts/              # Layout wrappers
│   │   ├── sections/             # Marketing sections (Hero, Features, Stats, CTA, etc.)
│   │   └── ui/                   # Reusable UI atoms (Button, Badge, PropertyCard, etc.)
│   ├── lib/
│   │   ├── firebase.js           # Firebase Auth + Storage init
│   │   ├── api/client.js         # Axios API client
│   │   ├── data/properties.js    # Static property data
│   │   └── hooks/                # Custom hooks (wallet detection, scroll, count-up)
│   └── store/authStore.js        # Zustand auth state
│
├── server/                       # Express backend
│   ├── app.js                    # Server entry: Express + Socket.IO (port 5214)
│   ├── config/                   # DB, JWT, constants
│   ├── controllers/              # auth, product, seller, chat
│   ├── middleware/auth.js        # JWT auth middleware
│   ├── models/                   # Mongoose models: User, Product, Chat
│   └── routers/                  # Express routers: auth, product, seller, chat
│
├── contracts/                    # Solidity smart contracts (standalone)
│   ├── interfaces/IPropertyToken.sol
│   ├── PropertyToken.sol         # ERC-20 token + KYC allowlist + yield distribution
│   ├── InvestmentVault.sol       # Central vault: investments, lock-up, redemptions
│   └── PropertyRegistry.sol     # On-chain registry + oracle price feed
│
├── rust/                         # Rust CLI tooling (standalone)
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs               # CLI entry point (clap subcommands)
│       ├── oracle.rs             # Price oracle (fetch → compute → submit on-chain)
│       ├── snapshot.rs           # Token holder snapshot via Transfer events
│       └── yield_calc.rs         # Yield / ROI calculator
│
└── public/assets/                # Property images (Dubai: Marina, Downtown, Palm, etc.)
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **Rust** and **Cargo** (for the CLI tooling only)
- A **Firebase** project with Authentication and Storage enabled
- A **MongoDB** database (optional — the DB connection is currently stubbed out)

### Installation

```bash
git clone https://github.com/your-org/propchain-real-estate.git
cd propchain-real-estate
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID |
| `VITE_API_URL` | Base URL for the Express API (e.g. `http://localhost:5214`) |
| `PORT` | Express server port (default: `5214`) |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `MONGODB_URI` | MongoDB connection string |

### Running the App

**Development** — starts the Express server and Vite dev server concurrently:

```bash
npm run dev
```

- Frontend (Vite): `http://localhost:5173`
- Backend (Express): `http://localhost:5214`

**Production build:**

```bash
npm run build
```

**Linting:**

```bash
npm run lint
```

---

## Smart Contracts

The three Solidity contracts in `contracts/` are **standalone** and are not yet wired into the web application. They are intended for future on-chain deployment via Hardhat or Foundry.

| Contract | Purpose |
|---|---|
| `PropertyToken.sol` | One deployed per property. ERC-20-compatible token with a KYC allowlist, funding round management, and Synthetix-style proportional yield distribution. |
| `InvestmentVault.sol` | Single global vault. Routes investor funds to the correct `PropertyToken`, enforces a 12-month lock-up, and forwards rental income from property managers. |
| `PropertyRegistry.sol` | Single global registry. Maps property IDs to token contract addresses, stores IPFS metadata hashes, and accepts price updates from the Rust oracle. |

### Contract Architecture

```
Investor ──invest()──► InvestmentVault ──invest()──► PropertyToken (mints tokens)
Manager  ──depositRental()──► InvestmentVault ──depositYield()──► PropertyToken
Investor ──redeem()──► InvestmentVault ──burns tokens, returns funds
Oracle   ──updatePrice()──► PropertyRegistry
```

> **Note:** The contracts are intentionally self-contained with no OpenZeppelin imports for review purposes. A production deployment should use `@openzeppelin/contracts` for battle-tested ERC-20, Ownable, and ReentrancyGuard implementations.

---

## Rust CLI Tooling

The `rust/` directory contains a standalone Rust binary (`propchain-tools`) with three subcommands.

### Setup

```bash
cd rust
```

Set the required environment variables (or add them to `rust/.env`):

| Variable | Description |
|---|---|
| `RPC_URL` | EVM node RPC endpoint (e.g. Alchemy, Infura, or local Anvil) |
| `DEPLOYER_PRIVATE_KEY` | Private key used to sign oracle transactions |
| `REGISTRY_CONTRACT_ADDRESS` | Deployed `PropertyRegistry` contract address |
| `VALUATION_API_URL` | Off-chain REST API that provides property valuations |

### Commands

**Price oracle** — fetch valuations and push on-chain prices:

```bash
# Run once
cargo run -- oracle --once

# Run on a loop (default: every 3600 seconds)
cargo run -- oracle --interval 3600
```

**Yield calculator** — compute yield metrics for a property:

```bash
cargo run -- yield \
  --value 2800000 \
  --rental 19133 \
  --tokens 5600 \
  --funded 40 \
  --years 5
```

**Holder snapshot** — export a JSON snapshot of all token holders:

```bash
cargo run -- snapshot \
  --contract 0xYourPropertyTokenAddress \
  --rpc https://your-rpc-url \
  --output snapshot.json \
  --top 10
```

---

## API Routes

The Express server exposes the following REST endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET/POST` | `/api/products` | Property product listings |
| `GET/POST` | `/api/seller` | Seller / property manager endpoints |
| `GET/POST` | `/api/chat` | Chat messages |

Real-time chat is also available via Socket.IO on the same port. Emit `sendMessage` to broadcast a message to all connected clients.

---

## License

MIT © PropChain
