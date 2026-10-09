import React, { useState } from 'react';
import { Search, Plus, Clipboard, Check, LogOut, Wallet, PlusCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-[#17151E] text-[#F4E7C7] border-b border-[#F4E7C7]/15 py-2.5 px-4 sm:px-6 shadow-md">
      <div className="flex items-center justify-between gap-3 max-w-[1440px] mx-auto">
        
        {/* LEFT: Search Bar with ⌘K + Paste Clipboard (Bitmela Editorial Mono Format) */}
        <div className="flex items-center gap-2 flex-1 max-w-md lg:max-w-xl">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#17151E]/60 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coins, tokens, tickers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-12 py-2 rounded-md bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] placeholder-[#17151E]/50 text-xs focus:outline-none focus:border-[#E23A2E] transition-colors font-mono font-medium shadow-inner"
            />
            <span className="absolute right-2.5 text-[10px] text-[#17151E]/60 font-mono bg-[#E8D9B4] px-1.5 py-0.5 rounded border border-[#17151E]/20 pointer-events-none">
              ⌘K
            </span>
          </div>

          <button
            onClick={handlePasteClipboard}
            title="Paste search from clipboard"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] hover:bg-[#F2C23A] transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* CENTER BANNER: Bitmela Festival of Money Style */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs font-mono">
          <span className="text-[#F4E7C7] font-bold">MONAD PARALLEL L1</span>
          <span className="text-[#F2C23A]">✦</span>
          <span className="text-[#F2C23A]">10,000 TPS SUB-SECOND</span>
          <span className="text-[#E23A2E]">✦</span>
          <span className="text-[#F4E7C7]/80">&lt; 0.0001 MON GAS</span>
        </div>

        {/* RIGHT: Actions (GET MON, [+] button, [Sign in] button, Wallet) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 font-mono">
          
          {/* GET MON Faucet Claim Button */}
          <button
            onClick={onClaimFaucet}
            title="Claim +10 MON Faucet Tokens"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F2C23A] hover:bg-[#FAF3E0] text-[#17151E] border border-[#17151E] font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#17151E]" />
            <span>+10 MON</span>
          </button>

          {/* [+] Quick Launch Button */}
          <button
            onClick={onOpenLaunchModal}
            title="Launch a new coin"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-[#E23A2E] text-[#F4E7C7] border border-[#17151E] hover:bg-[#F2C23A] hover:text-[#17151E] transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>

          {/* [Sign in] Button or Authenticated Profile Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-md bg-[#24212D] border border-[#F4E7C7]/20 hover:border-[#F2C23A] transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded object-cover border border-[#F2C23A]"
                />
                <div className="text-left font-mono text-[11px] hidden sm:block">
                  <div className="font-bold text-[#F4E7C7] flex items-center gap-1">
                    <span>@{currentUser.username}</span>
                    {currentUser.authProvider === 'google' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Linked with Google"></span>
                    )}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md bg-[#17151E] p-3 border-2 border-[#17151E] shadow-2xl z-50 animate-in fade-in duration-150 text-[#F4E7C7]">
                  <div className="pb-2 border-b border-[#F4E7C7]/15 mb-2">
                    <div className="font-bold text-xs text-[#F2C23A]">@{currentUser.username}</div>
                    <div className="text-[10px] text-[#F4E7C7]/70 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-[#F4E7C7] mt-1 bg-[#24212D] p-1 rounded truncate">
                      Wallet: {currentUser.monadWalletAddress.slice(0, 8)}...{currentUser.monadWalletAddress.slice(-6)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-rose-300 hover:bg-rose-500/20 transition-colors"
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
              className="px-3.5 py-1.5 rounded-md bg-[#E23A2E] hover:bg-[#F2C23A] hover:text-[#17151E] text-[#F4E7C7] font-bold text-xs shadow-sm transition-all active:scale-95 font-mono tracking-wider border border-[#17151E]"
            >
              SIGN IN
            </button>
          )}

          {/* Connect / Connected Wallet Pill (Jaipur Ticket Stub Style) */}
          <button
            onClick={onConnectWallet}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold
              transition-all duration-200 border
              ${wallet.isConnected 
                ? 'bg-[#24212D] hover:bg-[#2e2a3b] border-[#F2C23A] text-[#F4E7C7]' 
                : 'bg-[#FAF3E0] hover:bg-[#F2C23A] border-[#17151E] text-[#17151E] font-bold'}
            `}
          >
            <Wallet className="w-3.5 h-3.5 text-[#F2C23A]" />
            {wallet.isConnected ? (
              <span className="flex items-center gap-1.5 font-mono">
                <span className="text-[#F2C23A] font-bold">{wallet.monBalance.toFixed(1)} MON</span>
              </span>
            ) : (
              <span>CONNECT</span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
