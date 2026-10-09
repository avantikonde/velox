import React, { useState } from 'react';
import { AuroraButton } from './AuroraButton';
import { Sparkles, Wallet, Search, ChevronDown, ExternalLink, Code2, PlusCircle, X } from 'lucide-react';
import { WalletState, ViewMode } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onOpenLaunchModal: () => void;
  onOpenHowItWorks: () => void;
  onClaimFaucet: () => void;
  onOpenContractsModal?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onSelectNavTab?: (tab: 'home' | 'terminal' | 'callouts' | 'leaderboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnectWallet,
  onOpenLaunchModal,
  onOpenHowItWorks,
  onClaimFaucet,
  onOpenContractsModal,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  onSelectNavTab
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070c16]/90 backdrop-blur-2xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: Official Monad Logo + MONADPUMP Text (Matching Monad's App Format) */}
        <div 
          onClick={() => onSelectNavTab?.('home')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          {/* Authentic Monad Isometric Tilted Loop Logo Mark */}
          <div className="relative flex items-center justify-center w-8 h-8 group-hover:scale-105 transition-transform">
            <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="8"
                y="8"
                width="20"
                height="20"
                rx="6"
                transform="rotate(45 18 18)"
                stroke="url(#monadBrandGradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="monadBrandGradient" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EB96FF" />
                  <stop offset="0.5" stopColor="#A855F7" />
                  <stop offset="1" stopColor="#0B5777" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex items-center tracking-wider">
            <span className="font-extrabold text-base tracking-[0.14em] text-white">
              MONAD<span className="text-[#EB96FF]">PUMP</span>
            </span>
          </div>
        </div>

        {/* CENTER: Navigation Links (Matching Monad Official App Layout) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-bold tracking-[0.12em] uppercase">
          
          <button
            onClick={() => {
              onToggleViewMode('grid');
              onSelectNavTab?.('home');
            }}
            className={`transition-colors py-1 hover:text-white ${
              viewMode === 'grid' ? 'text-white border-b-2 border-[#EB96FF]' : 'text-slate-400'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => {
              onToggleViewMode('terminal');
              onSelectNavTab?.('terminal');
            }}
            className={`transition-colors py-1 hover:text-white flex items-center gap-1 ${
              viewMode === 'terminal' ? 'text-white border-b-2 border-[#EB96FF]' : 'text-slate-400'
            }`}
          >
            <span>TERMINAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => onSelectNavTab?.('callouts')}
            className="text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1"
          >
            <span>HOT CALLOUTS</span>
          </button>

          <button
            onClick={() => onSelectNavTab?.('leaderboard')}
            className="text-slate-400 hover:text-white transition-colors py-1"
          >
            LEADERBOARD
          </button>

          <button
            onClick={onOpenContractsModal}
            className="text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1"
          >
            <span>CONTRACTS</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1"
          >
            <span>DOCS</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </button>

        </nav>

        {/* RIGHT: Search Trigger, GET MON Button, Launch Coin Button & Wallet */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Minimalist Search / ⌘K Trigger (Matching Monad App) */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#193153]/60 border border-[#EB96FF]/40 rounded-full px-3 py-1 animate-in fade-in duration-200">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search token or symbol..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-36 sm:w-48 font-mono"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                  ⌘K
                </span>
              </button>
            )}
          </div>

          {/* "GET MON" Faucet Button (Exact Format as Attached Monad App Image) */}
          <button
            onClick={onClaimFaucet}
            title="Claim +10 MON Faucet Testnet Tokens"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6e54ff] to-[#836EF9] hover:from-[#7c63ff] hover:to-[#917eff] text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-[#6e54ff]/25 transition-all active:scale-95 flex items-center gap-1.5 font-mono"
          >
            <span>GET MON</span>
            <span className="hidden xl:inline text-[10px] opacity-80">(+10)</span>
          </button>

          {/* Signature Liquid Aurora Capsule Button: LAUNCH COIN (Image 4 Style, Kept at Top Bar) */}
          <AuroraButton
            onClick={onOpenLaunchModal}
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Launch Coin
          </AuroraButton>

          {/* Connect / Connected Wallet Capsule */}
          <button
            onClick={onConnectWallet}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
              transition-all duration-200 border
              ${wallet.isConnected 
                ? 'bg-[#193153]/70 hover:bg-[#193153] border-[#EB96FF]/40 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'}
            `}
          >
            <Wallet className="w-3.5 h-3.5 text-[#EB96FF]" />
            {wallet.isConnected ? (
              <span className="flex items-center gap-1.5 font-mono">
                <span className="text-[#F9D4E0] font-bold">{wallet.monBalance.toFixed(1)} MON</span>
                <span className="text-slate-400 hidden md:inline">({wallet.address.slice(0, 4)}...{wallet.address.slice(-3)})</span>
              </span>
            ) : (
              <span>Connect</span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
