import React, { useState } from 'react';
import { Search, Plus, Clipboard, Check, LogOut, Wallet, Sparkles, PlusCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-[#070c16]/95 border-b border-white/5 py-2.5 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 max-w-[1440px] mx-auto">
        
        {/* LEFT: Search Bar with ⌘K + Paste Clipboard Icon (Image 3 Format) */}
        <div className="flex items-center gap-2 flex-1 max-w-md lg:max-w-xl">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for coins and users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#121927]/90 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#EB96FF]/60 transition-colors font-mono"
            />
            <span className="absolute right-3 text-[10px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5 pointer-events-none">
              ⌘K
            </span>
          </div>

          <button
            onClick={handlePasteClipboard}
            title="Paste search or contract"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#121927]/90 border border-white/10 text-slate-400 hover:text-white hover:border-[#EB96FF]/40 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* CENTER BANNER: Top Announcement (pump.fun Banner format in Image 3) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-slate-300">Monad Parallel L1</span>
          <span>•</span>
          <span className="text-emerald-400">10,000 TPS Instant Finality</span>
          <span>•</span>
          <span className="text-[#EB96FF]">&lt; 0.0001 MON Gas</span>
        </div>

        {/* RIGHT: Actions (GET MON, [+] button, [Sign in] button, Wallet) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* GET MON Faucet Claim Button */}
          <button
            onClick={onClaimFaucet}
            title="Claim +10 MON Faucet Tokens"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B5777]/30 hover:bg-[#0B5777]/50 text-[#F9D4E0] border border-[#0B5777]/60 font-mono text-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#EB96FF]" />
            <span>+10 MON</span>
          </button>

          {/* [+] Quick Create Button */}
          <button
            onClick={onOpenLaunchModal}
            title="Launch a new coin"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#121927]/90 border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* [Sign in] Button or Authenticated Profile Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-[#193153]/50 border border-[#EB96FF]/30 hover:border-[#EB96FF] transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-lg object-cover border border-[#EB96FF]/40"
                />
                <div className="text-left font-mono text-[11px] hidden sm:block">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>@{currentUser.username}</span>
                    {currentUser.authProvider === 'google' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Linked with Google"></span>
                    )}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-panel p-3 bg-[#0a1220]/95 border border-[#EB96FF]/30 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="pb-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-xs text-white">@{currentUser.username}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-[#F9D4E0] mt-1 bg-[#193153]/50 p-1 rounded truncate">
                      Wallet: {currentUser.monadWalletAddress.slice(0, 8)}...{currentUser.monadWalletAddress.slice(-6)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/15 transition-colors"
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
              title="Sign in with Google or Email"
              className="px-4 py-1.5 rounded-xl bg-[#71f4a5] hover:bg-[#5de091] text-[#070c16] font-bold text-xs shadow-sm transition-all active:scale-95 font-mono"
            >
              Sign in
            </button>
          )}

          {/* Connect / Connected Wallet Pill */}
          <button
            onClick={onConnectWallet}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
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
