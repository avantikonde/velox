# ⚡ VELOX
> **Zero-Snipe Fair Launches at Pure Velocity on Monad's Parallel Execution Engine.**

[![Built for Monad Blitz](https://img.shields.io/badge/Monad_Blitz_Pune_V3-💜_Hackathon-68CFEB.svg)](https://monad.xyz)
[![Network: Monad Testnet](https://img.shields.io/badge/Network-Monad_Testnet_(10143)-193153.svg)](https://testnet.monadexplorer.com)
[![Smart Contract: Verified](https://img.shields.io/badge/Contracts-Solidity_0.8.20-EB96FF.svg)](./contracts/MonadPump.sol)
[![License: MIT](https://img.shields.io/badge/License-MIT-F9D4E0.svg)](LICENSE)

---

## 📌 Project Summary

| Item | Details |
| :--- | :--- |
| **Project Name** | **VELOX** |
| **One-Line Pitch** | Zero-Snipe Fair Launches at Pure Velocity on Monad's Parallel Execution Engine. |
| **Public Live Demo** | [https://velox-monad.vercel.app](https://velox-monad.vercel.app) *(or local preview at `http://localhost:3000`)* |
| **Deployed Network** | **Monad Testnet** (Chain ID: `10143` / `0x279f`) |
| **Factory Contract Address** | [`0x71C8F780f2d93e50C83604f32e36506A33e38711`](https://testnet.monadexplorer.com/address/0x71C8F780f2d93e50C83604f32e36506A33e38711) |
| **RPC Endpoint** | `https://testnet-rpc.monad.xyz` |
| **Block Explorer** | [MonadScan / Monad Explorer](https://testnet.monadexplorer.com) |
| **Hackathon** | **Monad Blitz Pune V3** (October 2026) |

---

## 💡 The Problem with Existing Launchpads

First-generation bonding curve launchpads suffer from severe structural flaws:
1. **Predatory Sniper Bots**: Automated MEV bots frontrun real human buyers in block zero, buying 30–50% of the token supply for pennies and dumping immediately on retail.
2. **Brutal Slippage & Whale Price Spikes**: Large market buys cause extreme slippage and artificial volatility because transactions must execute as single, lump-sum orders.
3. **Slow Settlement & Prohibitive Fees**: On legacy EVM chains, executing high-frequency micro-trades costs dozens of dollars in gas and takes 15–30 seconds per block.

---

## 🚀 The Velox Solution: Two Core Innovations

### 1. 🛡️ Anti-Sniper Shield (FairSlot Genesis)
* **60-Second Genesis Protection**: Right after a token deploys, an on-chain shield activates for 60 seconds.
* **Wallet Purchase Cap**: Capped at **0.5 MON** per transaction to prevent bot supply hoarding.
* **Uniform Seed Pricing**: All genesis participants receive a guaranteed flat price, mathematically neutralizing sniper bot timing advantages.

### 2. ⚡ StreamSwap (High-Frequency Micro-DCA Mode)
* **Continuous Streaming Liquidity**: Instead of dumping a lump sum into the bonding curve, users can toggle **Stream Buy**.
* **Micro-Swaps across Blocks**: Orders are split into continuous micro-swaps (e.g. 10 chunks over 20 seconds) executing every **~800ms**.
* **Zero Slippage & Minimal Price Impact**: Made possible exclusively by Monad's **10,000 TPS** and sub-cent gas fees (`< 0.0001 MON`).

---

## 🏗️ Architecture & How It Works

```
[ 1. One-Click Launch ]  -->  [ 2. 60s Shielded Genesis ]  -->  [ 3. Continuous Stream Trading ]  -->  [ 4. DEX Graduation ]
Creator sets Name & Ticker    Anti-Sniper Shield active         Sub-second bonding curve AMM          50 MON target reached
Zero seed capital required    Max 0.5 MON cap per wallet        StreamSwap micro-swaps (800ms)         100% LP burned & locked
```

1. **Deploy Token with Zero Seed Capital**: Anyone can launch a meme coin in one click. A mathematical bonding curve serves as the automated market maker from block zero.
2. **Shielded Fair Entry**: Real community members get equal access before open-market volatility begins.
3. **Trading Terminal with Sub-Second Finality**: Live SVG bonding curve chart, instant Buy/Sell drawers, and real-time execution receipts.
4. **Permanent Rug-Proof Graduation**: When the curve collects **50 MON**, liquidity automatically locks and burns LP tokens into an AMM pool.

---

## 🎨 Design System: "Aurora Blossom"

* **Color Palette**:
  * `#F9D4E0` — Soft Pastel Blush (Accents, caps, and highlights)
  * `#EB96FF` — Vibrant Neon Lilac (Brand glow and active indicators)
  * `#0B5777` — Deep Ocean Teal (Secondary gradients and ambient lighting)
  * `#193153` — Dark Midnight Navy (Glassmorphic cards and containers)
* **Fluid Liquid Capsule Controls**: Custom glassmorphic pill buttons with internal shimmering aurora ribbons and top specular reflections.

---

## 🛠️ Tech Stack

* **Smart Contracts**: Solidity `0.8.20` (Foundry / Hardhat compatible)
* **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS
* **Database & Persistence**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
* **Web3 Integration**: EIP-1193 / EIP-6963 Multi-Wallet Provider (MetaMask, Phantom, Rabby, Coinbase Wallet) with instant demo fallback
* **Animations**: Canvas Confetti, CSS GPU Hardware Accelerated Aurora Gradients

---

## 💻 Local Setup & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm** or **pnpm** / **yarn**
* A Web3 wallet extension (MetaMask or Phantom) configured for Monad Testnet

### Step-by-Step Instructions

```bash
# 1. Clone the repository
git clone https://github.com/avantikonde/velox.git
cd velox

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local DB)
cp .env.example .env
# Ensure DATABASE_URL / VITE_DATABASE_URL are configured if using Neon DB

# 4. Start the local development server
npm run dev

# 5. Open your browser
# Navigate to: http://localhost:3000
```

### Production Build

```bash
# Typecheck and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 Smart Contract Deployment

The core contracts are located in [`contracts/MonadPump.sol`](./contracts/MonadPump.sol):

* **`BondingCurveToken.sol`**: Standard ERC-20 token minted directly to the factory curve.
* **`MonadPumpFactory.sol`**: Manages token creation, bonding curve swaps, Anti-Sniper Shield countdowns, and automated DEX graduation.

### Monad Testnet Network Details for MetaMask / Foundry:
* **Network Name**: Monad Testnet
* **RPC URL**: `https://testnet-rpc.monad.xyz`
* **Chain ID**: `10143` (`0x279f`)
* **Currency Symbol**: `MON`
* **Block Explorer**: `https://testnet.monadexplorer.com`

---

## 👥 Team & Submission

* **Project**: **VELOX**
* **Event**: **Monad Blitz Pune V3** (October 10, 2026)
* **Repository**: [https://github.com/avantikonde/velox](https://github.com/avantikonde/velox)
* **License**: MIT
