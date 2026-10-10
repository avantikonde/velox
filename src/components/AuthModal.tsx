import React, { useState, useEffect } from 'react';
import { X, Mail, ArrowRight, Smartphone, ChevronRight, AlertCircle, Loader2, Wallet } from 'lucide-react';
import { User, WalletState } from '../types';
import { authService } from '../services/authService';
import { connectToWallet, isMetaMaskInstalled, isPhantomInstalled, AvailableWallet, getAvailableWallets } from '../services/walletService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, connectedWallet?: Partial<WalletState>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMoreWallets, setShowMoreWallets] = useState(false);
  const [allWallets, setAllWallets] = useState<AvailableWallet[]>([]);

  const hasMetaMask = isMetaMaskInstalled();
  const hasPhantom = isPhantomInstalled();

  useEffect(() => {
    if (isOpen) {
      setAllWallets(getAvailableWallets());
      setError(null);
      setIsLoading(false);
      setShowMoreWallets(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Social Auth (Google, Apple, GitHub)
  const handleSocialAuth = async (provider: 'google' | 'apple' | 'github') => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithSocial(provider);
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(user, {
          isConnected: true,
          address: user.monadWalletAddress,
          walletType: 'demo',
          connectorName: `${provider.toUpperCase()} Embedded Wallet`
        });
        onClose();
      }, 400);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || `${provider} authentication failed.`);
    }
  };

  // 2. Email Sign In
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithEmailOnly(emailInput);
      setIsLoading(false);
      onAuthSuccess(user, {
        isConnected: true,
        address: user.monadWalletAddress,
        walletType: 'demo',
        connectorName: 'Velox Cloud Wallet'
      });
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Email authentication failed.');
    }
  };

  // 3. Direct Wallet Connect & Account Binding
  const handleWalletConnect = async (walletId: 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await connectToWallet(walletId);
      const user = await authService.loginWithWalletAddress(result.address, result.connectorName);
      setIsLoading(false);
      onAuthSuccess(user, {
        isConnected: true,
        address: result.address,
        walletType: result.walletType,
        connectorName: result.connectorName
      });
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Wallet connection was declined.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-[420px] rounded-3xl bg-[#141416] border border-white/[0.08] p-6 sm:p-7 shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand App Badge */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#1E2522] border border-[#68CFEB]/30 p-2 flex items-center justify-center shadow-lg shadow-[#68CFEB]/15 mb-3">
            <img src="/logo.png" alt="Velox" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to start trading and launching tokens.</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* SOCIAL SIGN IN SECTION */}
        <div className="space-y-3">
          
          {/* Continue with Google */}
          <button
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#141416] font-bold text-sm flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Apple & GitHub Split Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialAuth('apple')}
              disabled={isLoading}
              className="py-3 px-4 rounded-xl bg-[#232326] hover:bg-[#2D2D31] text-white flex items-center justify-center border border-white/[0.06] transition-colors disabled:opacity-50"
              title="Continue with Apple"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.3-9.66-11.31-20.48-15.03-32.48-3.71-11.99-5.57-23.36-5.57-34.1 0-14.35 3.8-26.4 11.41-36.14 7.6-9.74 17.1-14.74 28.5-15.01 4.36 0 9.28 1.15 14.76 3.46 5.48 2.31 9.38 3.52 11.72 3.63 2.12 0 6.18-1.25 12.18-3.75 6-2.5 11.26-3.67 15.78-3.52 11.24.48 20.35 4.54 27.34 12.18-9.84 5.99-14.67 14.34-14.49 25.04.18 8.81 3.54 16.03 10.08 21.65 6.54 5.62 14.28 8.78 23.23 9.48-2.12 6.53-4.66 13.08-7.63 19.65zM119.22 33.15c0-7.23 2.65-14.15 7.95-20.76 5.3-6.61 11.9-10.74 19.8-12.39.26 1.74.39 3.39.39 4.96 0 7.39-2.73 14.43-8.2 21.11-5.46 6.69-12.11 10.66-19.94 11.92-.26-1.57-.39-3.17-.39-4.84z"/>
              </svg>
            </button>

            <button
              onClick={() => handleSocialAuth('github')}
              disabled={isLoading}
              className="py-3 px-4 rounded-xl bg-[#232326] hover:bg-[#2D2D31] text-white flex items-center justify-center border border-white/[0.06] transition-colors disabled:opacity-50"
              title="Continue with GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </button>
          </div>

          {/* Email input row */}
          <form onSubmit={handleEmailSubmit} className="relative mt-2">
            <div className="flex items-center rounded-xl bg-[#232326] border border-white/[0.08] px-3.5 py-1 focus-within:border-[#68CFEB]/60 transition-colors">
              <Mail className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full py-2 bg-transparent text-sm text-white placeholder-slate-500 font-mono focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white ml-2 flex-shrink-0 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>

        </div>

        {/* Velox App Info Banner (matching screenshot) */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#1C1C1F] border border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span>Already using the Velox app?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sign in above with the same method you use in the app and your app wallet comes with you — there's nothing to import. A different method or an external wallet signs you in to a different account.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-[1px] bg-white/[0.08]"></div>
          <span className="px-3 text-[11px] text-slate-500 font-mono">or connect a wallet</span>
          <div className="flex-1 h-[1px] bg-white/[0.08]"></div>
        </div>

        {/* WALLET SELECTION LIST (matching screenshot) */}
        <div className="space-y-2">
          
          {/* Brave Wallet / MetaMask */}
          <button
            onClick={() => handleWalletConnect('metamask')}
            disabled={isLoading}
            className="w-full p-3 rounded-xl bg-[#232326] hover:bg-[#2C2C30] border border-white/[0.06] flex items-center justify-between transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-base">
                🦊
              </div>
              <span className="text-xs font-bold text-white font-mono">
                {hasMetaMask ? 'MetaMask / Brave' : 'MetaMask'}
              </span>
            </div>
            {hasMetaMask ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DETECTED
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">Install ↗</span>
            )}
          </button>

          {/* Phantom Wallet */}
          <button
            onClick={() => handleWalletConnect('phantom')}
            disabled={isLoading}
            className="w-full p-3 rounded-xl bg-[#232326] hover:bg-[#2C2C30] border border-white/[0.06] flex items-center justify-between transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-base">
                👻
              </div>
              <span className="text-xs font-bold text-white font-mono">Phantom</span>
            </div>
            {hasPhantom ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DETECTED
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">Install ↗</span>
            )}
          </button>

          {/* More Wallets Drawer Toggle */}
          <button
            onClick={() => setShowMoreWallets(!showMoreWallets)}
            className="w-full p-3 rounded-xl bg-[#232326] hover:bg-[#2C2C30] border border-white/[0.06] flex items-center justify-between transition-colors text-xs text-slate-300 font-mono"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
              <span className="font-bold text-white">More wallets</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showMoreWallets ? 'rotate-90' : ''}`} />
          </button>

          {/* Expanded More Wallets */}
          {showMoreWallets && (
            <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
              <button
                onClick={() => handleWalletConnect('coinbase')}
                className="w-full p-2.5 rounded-xl bg-[#1C1C1F] hover:bg-[#27272B] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🛡️</span>
                  <span>Coinbase Wallet</span>
                </div>
                <span className="text-[10px] text-slate-500">Smart Wallet</span>
              </button>

              <button
                onClick={() => handleWalletConnect('injected')}
                className="w-full p-2.5 rounded-xl bg-[#1C1C1F] hover:bg-[#27272B] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">⚡</span>
                  <span>Injected EIP-1193</span>
                </div>
                <span className="text-[10px] text-slate-500">Rabby/Trust/OKX</span>
              </button>

              <button
                onClick={() => handleWalletConnect('demo')}
                className="w-full p-2.5 rounded-xl bg-[#1C1C1F] hover:bg-[#27272B] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🚀</span>
                  <span>Instant Demo Wallet</span>
                </div>
                <span className="text-[10px] text-[#68CFEB]">Instant Connect</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
