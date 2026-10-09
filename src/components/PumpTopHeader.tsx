import React, { useState } from 'react';
import { Search, Plus, Clipboard, Check, LogOut, Wallet, PlusCircle, Sparkles } from 'lucide-react';
import { User, WalletState } from '../types';

interface PumpTopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenLaunchModal: () => void;
  onOpenAuthModal: () => void;
  onClaimFaucet: () => void;
  currentUser: User | null;
  onLogout: () => void;
  wallet: WalletState;
  onConnectWallet: () => void;
}

export const PumpTopHeader: React.FC<PumpTopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenLaunchModal,
  onOpenAuthModal,
  onClaimFaucet,
  currentUser,
  onLogout,
  wallet,
  onConnectWallet
}) => {
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onSearchChange(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    } catch {
      onSearchChange('CHOG');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B11]/90 backdrop-blur-md border-b border-white/[0.08] py-2.5 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 max-w-[1440px] mx-auto">
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md lg:max-w-lg">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coin name, ticker, address..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#0D111A] border border-white/[0.08] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9] transition-all font-mono"
            />
            <span className="absolute right-2.5 text-[10px] text-slate-500 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05] pointer-events-none">
              ⌘K
            </span>
          </div>

          <button
            onClick={handlePasteClipboard}
            title="Paste search query"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0D111A] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all flex-shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Live Network Telemetry */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Monad Parallel L1
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">10,000 TPS</span>
          <span className="text-slate-600">•</span>
          <span className="text-[#836EF9] font-medium">&lt; 0.0001 MON Gas</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 font-mono">
          
          {/* Faucet Claim Button */}
          <button
            onClick={onClaimFaucet}
            title="Claim +10 MON Faucet"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#836EF9]/10 hover:bg-[#836EF9]/20 text-[#A78BFA] border border-[#836EF9]/30 text-xs font-semibold transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#836EF9]" />
            <span>+10 MON</span>
          </button>

          {/* Quick Create Launch Button */}
          <button
            onClick={onOpenLaunchModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white text-xs font-bold transition-all shadow-md shadow-[#836EF9]/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Launch Coin</span>
          </button>

          {/* Sign In / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-[#0D111A] border border-white/[0.08] hover:border-[#836EF9]/50 transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-lg object-cover border border-[#836EF9]/40"
                />
                <div className="text-left font-mono text-[11px] hidden sm:block">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>@{currentUser.username}</span>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0D111A] p-3 border border-white/10 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="pb-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-xs text-white">@{currentUser.username}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-purple-300 mt-1 bg-white/[0.05] p-1 rounded truncate">
                      {currentUser.monadWalletAddress.slice(0, 8)}...{currentUser.monadWalletAddress.slice(-6)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 text-xs font-semibold transition-all active:scale-95"
            >
              Sign in
            </button>
          )}

          {/* Wallet Status */}
          <button
            onClick={onConnectWallet}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
              transition-all border
              ${wallet.isConnected 
                ? 'bg-[#0D111A] hover:bg-[#131926] border-emerald-500/30 text-white' 
                : 'bg-white/[0.06] hover:bg-white/10 border-white/10 text-slate-300'}
            `}
          >
            <Wallet className="w-3.5 h-3.5 text-[#836EF9]" />
            {wallet.isConnected ? (
              <span className="font-mono text-emerald-400 font-bold">
                {wallet.monBalance.toFixed(1)} MON
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
