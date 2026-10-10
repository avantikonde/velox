import React, { useState } from 'react';
import { Search, Plus, Clipboard, Check, LogOut, Wallet, PlusCircle, ChevronDown, Globe } from 'lucide-react';
import { User, WalletState } from '../types';
import { ChainConfig, SUPPORTED_CHAINS } from '../data/chains';

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
  activeChain: ChainConfig;
  onSelectChain: (chain: ChainConfig) => void;
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
  onConnectWallet,
  activeChain,
  onSelectChain
}) => {
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChainMenu, setShowChainMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

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
      onSearchChange('PEPE');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1F1E19]/90 backdrop-blur-md border-b border-white/[0.08] py-2.5 px-4 sm:px-6">
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
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#25241E] border border-white/[0.08] text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB] transition-all font-mono"
            />
            <span className="absolute right-2.5 text-[10px] text-slate-500 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05] pointer-events-none">
              ⌘K
            </span>
          </div>

          <button
            onClick={handlePasteClipboard}
            title="Paste search query"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#25241E] border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#68CFEB]/40 transition-all flex-shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Live Network Telemetry */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeChain.iconColor }}></span>
            {activeChain.name}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">{activeChain.tps}</span>
          <span className="text-slate-600">•</span>
          <span className="text-[#68CFEB] font-medium">{activeChain.gasCost} Gas</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 font-mono">
          
          {/* Multi-Chain Network Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChainMenu(!showChainMenu)}
              title="Select Active Blockchain"
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-[#25241E] border border-white/[0.08] hover:border-[#68CFEB]/40 transition-all text-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeChain.iconColor }}></span>
              <span className="font-bold text-[#FAFAFA] hidden md:inline">{activeChain.name}</span>
              <span className="font-bold text-[#68CFEB] md:hidden">{activeChain.symbol}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showChainMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#1F1E19] p-2 border border-white/10 shadow-2xl z-50 animate-in fade-in duration-150">
                <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-white/[0.06] mb-1">
                  Select Blockchain
                </div>
                {SUPPORTED_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => {
                      onSelectChain(chain);
                      setShowChainMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                      activeChain.id === chain.id
                        ? 'bg-[#1F4B5D]/40 text-[#68CFEB] font-bold border border-[#68CFEB]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chain.iconColor }}></span>
                      <span className="font-medium">{chain.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {chain.symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Faucet Claim Button */}
          <button
            onClick={onClaimFaucet}
            title={`Claim +${activeChain.faucetAmount} ${activeChain.symbol} Faucet`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F4B5D]/40 hover:bg-[#1F4B5D]/60 text-[#68CFEB] border border-[#68CFEB]/30 text-xs font-semibold transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#68CFEB]" />
            <span>+{activeChain.faucetAmount} {activeChain.symbol}</span>
          </button>

          {/* Quick Create Launch Button */}
          <button
            onClick={onOpenLaunchModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] text-xs font-extrabold transition-all shadow-md shadow-[#68CFEB]/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Launch Coin</span>
          </button>

          {/* Sign In / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-[#25241E] border border-white/[0.08] hover:border-[#68CFEB]/50 transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-lg object-cover border border-[#68CFEB]/40"
                />
                <div className="text-left font-mono text-[11px] hidden sm:block">
                  <div className="font-bold text-[#FAFAFA] flex items-center gap-1">
                    <span>@{currentUser.username}</span>
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#1F1E19] p-3 border border-white/10 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="pb-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-xs text-[#FAFAFA]">@{currentUser.username}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-[#68CFEB] mt-1 bg-white/[0.05] p-1 rounded truncate">
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

          {/* Wallet Status with Real Connected Extension Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (wallet.isConnected) {
                  setShowWalletMenu(!showWalletMenu);
                } else {
                  onConnectWallet();
                }
              }}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
                transition-all border active:scale-95
                ${wallet.isConnected 
                  ? 'bg-[#25241E] hover:bg-[#2C2B24] border-emerald-500/30 text-[#FAFAFA]' 
                  : 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] font-extrabold border-transparent shadow-md shadow-[#68CFEB]/20'}
              `}
            >
              <Wallet className={`w-3.5 h-3.5 ${wallet.isConnected ? 'text-[#68CFEB]' : 'text-[#1F1E19]'}`} />
              {wallet.isConnected ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold">
                    {wallet.monBalance.toFixed(1)} {activeChain.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    ({wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-3)}` : 'Connected'})
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>

            {/* Connected Wallet Dropdown Menu */}
            {wallet.isConnected && showWalletMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#1F1E19] p-3 border border-white/10 shadow-2xl z-50 animate-in fade-in duration-150 font-mono">
                <div className="pb-2.5 border-b border-white/10 mb-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#FAFAFA]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {wallet.connectorName || (wallet.walletType ? wallet.walletType.toUpperCase() : 'Device Wallet')}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {activeChain.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#141310] p-2 rounded-lg border border-white/5 mt-1.5">
                    <span className="text-[11px] text-slate-300 truncate max-w-[170px]">
                      {wallet.address}
                    </span>
                    <button
                      onClick={() => {
                        if (wallet.address && navigator.clipboard) {
                          navigator.clipboard.writeText(wallet.address);
                          setAddressCopied(true);
                          setTimeout(() => setAddressCopied(false), 1500);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy Address"
                    >
                      {addressCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowWalletMenu(false);
                      onConnectWallet(); // opens wallet selection modal
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <span>Switch Wallet / Extension</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                  </button>

                  <button
                    onClick={() => {
                      setShowWalletMenu(false);
                      onConnectWallet(); // toggle / reconnect
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
