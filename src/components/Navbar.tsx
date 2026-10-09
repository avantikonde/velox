import React from 'react';
import { AuroraButton } from './AuroraButton';
import { Sparkles, Wallet, Rocket, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onOpenLaunchModal: () => void;
  onOpenHowItWorks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnectWallet,
  onOpenLaunchModal,
  onOpenHowItWorks
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EB96FF]/15 bg-[#09101c]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Network Badge */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EB96FF] via-[#0B5777] to-[#193153] p-[2px] shadow-lg shadow-[#EB96FF]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#09101c] rounded-2xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[#EB96FF] group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-[#F9D4E0] to-[#EB96FF] bg-clip-text text-transparent">
                  Monad<span className="text-[#EB96FF]">Pump</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EB96FF]/15 text-[#EB96FF] border border-[#EB96FF]/30">
                  Blitz V3
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Monad Parallel L1</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-[11px] text-[#EB96FF]">10k TPS</span>
              </div>
            </div>
          </div>

          {/* Color Palette Indicators from User's Theme Image */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#193153]/40 border border-[#EB96FF]/10 text-xs text-slate-300">
            <span className="text-[11px] font-mono text-slate-400 mr-1">AURORA:</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F9D4E0] shadow-sm" title="#F9D4E0 (Blush)"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EB96FF] shadow-sm" title="#EB96FF (Lilac)"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B5777] shadow-sm" title="#0B5777 (Teal)"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#193153] shadow-sm" title="#193153 (Navy)"></span>
          </div>
        </div>

        {/* Center: Live Monad Speed Ticker */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full bg-[#193153]/30 border border-[#0B5777]/40 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-[#EB96FF]" />
            <span>Block Time:</span>
            <span className="text-emerald-400 font-semibold">824 ms</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Gas:</span>
            <span className="text-[#F9D4E0] font-semibold">&lt; 0.0001 MON</span>
          </div>
        </div>

        {/* Right: Actions & Liquid Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHowItWorks}
            className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            How it works
          </button>

          {/* Launch Coin Liquid Button (Image 2 Style) */}
          <AuroraButton
            onClick={onOpenLaunchModal}
            size="md"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Launch Token
          </AuroraButton>

          {/* Wallet Button */}
          <button
            onClick={onConnectWallet}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
              transition-all duration-200 border
              ${wallet.isConnected 
                ? 'bg-[#193153]/70 hover:bg-[#193153] border-[#EB96FF]/40 text-white' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'}
            `}
          >
            <Wallet className="w-3.5 h-3.5 text-[#EB96FF]" />
            {wallet.isConnected ? (
              <span className="flex items-center gap-2">
                <span className="font-mono text-[#F9D4E0]">{wallet.monBalance.toFixed(2)} MON</span>
                <span className="text-slate-400">({wallet.address.slice(0, 6)}...{wallet.address.slice(-4)})</span>
              </span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
