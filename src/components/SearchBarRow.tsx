import React, { useState } from 'react';
import { Search, Plus, Clipboard, LogOut, Check, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface SearchBarRowProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenLaunchModal: () => void;
  onOpenAuthModal: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const SearchBarRow: React.FC<SearchBarRowProps> = ({
  searchQuery,
  onSearchChange,
  onOpenLaunchModal,
  onOpenAuthModal,
  currentUser,
  onLogout
}) => {
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handlePasteFromClipboard = async () => {
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
      // Fallback
      onSearchChange('CHOG');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="w-full bg-[#1F1E19]/95 border-b border-white/5 py-2 px-4 sm:px-6 lg:px-8 z-40">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        
        {/* LEFT: Search Bar with ⌘K and Paste Icon */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1 flex items-center">
            {/* Search Icon */}
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search for coins and users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#25241E] border border-white/10 text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB]/60 transition-colors font-mono"
            />

            {/* ⌘K Badge */}
            <span className="absolute right-3 text-[10px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5 pointer-events-none">
              ⌘K
            </span>
          </div>

          {/* Clipboard / Paste Button */}
          <button
            onClick={handlePasteFromClipboard}
            title="Paste contract or keyword from clipboard"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#25241E] border border-white/10 text-slate-400 hover:text-[#FAFAFA] hover:border-[#68CFEB]/40 transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* RIGHT: [+] Button & Mint/Aqua [Sign in] Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* [+] Quick Create Button */}
          <button
            onClick={onOpenLaunchModal}
            title="Launch a new coin"
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#25241E] border border-white/10 text-slate-300 hover:text-[#FAFAFA] hover:border-[#68CFEB]/40 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* [Sign in] Button / User Profile Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-[#1F4B5D]/30 border border-[#68CFEB]/30 hover:border-[#68CFEB] transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-lg object-cover border border-[#68CFEB]/40"
                />
                <div className="text-left font-mono text-[11px] hidden sm:block">
                  <div className="font-bold text-[#FAFAFA] flex items-center gap-1">
                    <span>@{currentUser.username}</span>
                    {currentUser.authProvider === 'google' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#68CFEB]" title="Linked with Google"></span>
                    )}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-panel p-3 bg-[#1F1E19]/95 border border-[#68CFEB]/30 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="pb-2 border-b border-white/10 mb-2">
                    <div className="font-bold text-xs text-[#FAFAFA]">@{currentUser.username}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[9px] font-mono text-[#68CFEB] mt-1 bg-[#1F4B5D]/40 p-1 rounded truncate">
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
              className="px-4 py-1.5 rounded-xl bg-[#68CFEB] hover:bg-[#58BFDB] text-[#141310] font-bold text-xs shadow-sm transition-all active:scale-95 font-mono"
            >
              Sign in
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
