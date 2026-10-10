# 💜 Velox — Sub-Second Meme Launchpad on Monad

Built for **Monad Blitz Pune V3** (October 2026).

---

## 🎨 Theme & Visual Identity

### 1. Palette: "Aurora Blossom"
* **`#F9D4E0`** — Soft pastel blush (accents, badge highlights)
* **`#EB96FF`** — Radiant neon lilac / purple (brand glow, active states)
* **`#0B5777`** — Deep oceanic teal (secondary surfaces, ambient gradients)
* **`#193153`** — Dark midnight navy (glass cards, panel backdrops)
* **Tech Blueprint Grid Overlay** — Subtle precision grid pattern matching the Aurora Blossom design reference.

### 2. Apple / Siri Fluid Liquid Capsule Buttons
* Translucent glassmorphic pill capsule (`rounded-full`)
* Internal shimmering aurora fluid ribbon rotating smoothly across the spectrum
* Glass specular rim reflection (`inset 0 1px 1px rgba(255, 255, 255, 0.4)`)
* Dynamic interactive states: idle, hover aura diffusion, active click, and animated "Deploying..." / "Thinking..." modes.

---

## ⚡ Core Features Built

1. **King of the Hill Spotlight**:
   * Highlights the top bonding curve coin (`$PUNE`) with live metrics, crown badge, and instant trade CTA.
2. **Fair Launch Bonding Curve**:
   * Deploy any token in 1 click with 0 seed liquidity.
   * Linear bonding curve acts as the automated market maker from block 0.
   * Auto-graduation to DEX when 50 MON is reached (locks LP permanently, rug-proof).
3. **Sub-Second Trading Terminal**:
   * Real-time dynamic SVG bonding curve chart.
   * Buy / Sell tabs with preset quick-buy chips (`0.1`, `0.5`, `1.0`, `2.5 MON`).
   * Simulated Monad latency ticker confirming transactions in **~780ms**.
   * Confetti celebration on confirmed swap.
4. **Live Activity Ticker**:
   * Continuous multi-threaded transactions simulating high throughput on Monad.
5. **Solidity Smart Contracts**:
   * [`contracts/MonadPump.sol`](./contracts/MonadPump.sol) ready to deploy with Foundry or Hardhat to Monad Testnet.
6. **Anti-Sniper Shield (FairSlot Genesis)**:
   * Automatically activates for 60 seconds upon token launch.
   * Caps maximum buy at 0.5 MON to prevent frontrunning bots and guarantee fair, uniform community distribution.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```
