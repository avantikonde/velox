import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle, Loader2, Copy, Check, Compass } from 'lucide-react';
import { getAvailableWallets, connectToWallet, AvailableWallet, isSafariBrowser } from '../services/walletService';
import { WalletState } from '../types';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (newWallet: Partial<WalletState>) => void;
  activeChainSymbol?: string;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onWalletConnected,
  activeChainSymbol = 'MON'
}) => {
  const [wallets, setWallets] = useState<AvailableWallet[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const isSafari = isSafariBrowser();

  // Multi-phase polling to catch extensions that inject asynchronously
  useEffect(() => {
    if (!isOpen) return;

    setWallets(getAvailableWallets());
    setErrorMessage(null);
    setConnectingId(null);

    const intervals = [80, 250, 600, 1200];
    const timers = intervals.map((delay) =>
      setTimeout(() => {
        setWallets(getAvailableWallets());
      }, delay)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (wallet: AvailableWallet) => {
    setErrorMessage(null);
    setConnectingId(wallet.id);

    try {
      const result = await connectToWallet(wallet.id);
      onWalletConnected({
        isConnected: true,
        address: result.address,
        walletType: result.walletType,
        connectorName: result.connectorName
      });
      setConnectingId(null);
      onClose();
    } catch (err: any) {
      setConnectingId(null);
      setErrorMessage(err.message || 'Failed to connect. Please check your browser wallet.');
    }
  };

  const handleCopyUrl = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const getWalletIcon = (id: string) => {
    switch (id) {
      case 'metamask':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xl flex-shrink-0">
            🦊
          </div>
        );
      case 'phantom':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-xl flex-shrink-0">
            👻
          </div>
        );
      case 'coinbase':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-xl flex-shrink-0">
            🛡️
          </div>
        );
      case 'injected':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl flex-shrink-0">
            ⚡
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#68CFEB]/20 to-[#1F4B5D]/20 border border-[#68CFEB]/30 flex items-center justify-center text-xl flex-shrink-0">
            🚀
          </div>
        );
    }
  };

  const isSafariNotice = errorMessage && errorMessage.includes('SAFARI');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1F1E19] border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-[#68CFEB]/40 flex-shrink-0 shadow-md shadow-[#68CFEB]/20">
              <img src="/logo.png" alt="VELOX Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FAFAFA] font-mono">Connect Wallet</h2>
              <p className="text-[11px] text-slate-400">Select an installed wallet on your device</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safari Environmental Diagnosis Banner */}
        {isSafari && !errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#182329] border border-[#68CFEB]/20 flex items-start gap-2.5 text-xs text-slate-300">
            <Compass className="w-4 h-4 text-[#68CFEB] flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <span className="text-[#68CFEB] font-bold">Using Safari on macOS?</span> If your MetaMask is installed in <strong>Chrome</strong> or <strong>Brave</strong>, you can{' '}
              <button
                onClick={handleCopyUrl}
                className="text-white underline hover:text-[#68CFEB] font-semibold"
              >
                {copiedUrl ? 'copied link!' : 'copy the link'}
              </button>{' '}
              to open there, or connect below!
            </div>
          </div>
        )}

        {/* Safari Specific Error Diagnostic Card */}
        {isSafariNotice ? (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>MetaMask not detected in Safari</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed mb-3">
              Browser extensions installed in <strong>Google Chrome</strong> or <strong>Brave</strong> do not run in Safari. If you have MetaMask installed in Chrome, simply open Velox there:
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-mono font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-all active:scale-95"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? 'Copied to Clipboard!' : 'Copy Link for Chrome'}
              </button>

              <button
                onClick={() => handleConnect({ id: 'demo', name: 'Instant Demo Wallet', category: 'all', isInstalled: true, installUrl: '#', description: '' })}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-semibold transition-colors"
              >
                Use Demo Wallet
              </button>
            </div>

            <p className="mt-2 text-[10px] text-amber-300/70">
              Tip: If you have the MetaMask Safari app, open <strong>Safari Settings → Extensions</strong> and enable MetaMask.
            </p>
          </div>
        ) : errorMessage ? (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed whitespace-pre-line">
              {errorMessage}
            </div>
          </div>
        ) : null}

        {/* Wallets List */}
        <div className="space-y-2.5">
          {wallets.map((w) => {
            const isConnecting = connectingId === w.id;

            return (
              <div
                key={w.id}
                onClick={() => {
                  if (!isConnecting) {
                    handleConnect(w);
                  }
                }}
                className={`
                  p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer
                  ${w.isInstalled 
                    ? 'bg-[#25241E]/90 hover:bg-[#2A2922] border-white/[0.08] hover:border-[#68CFEB]/60 shadow-sm' 
                    : 'bg-[#1C1B17]/80 hover:bg-[#25241E] border-white/[0.06] hover:border-white/20'}
                `}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {getWalletIcon(w.id)}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#FAFAFA] font-mono">
                        {w.name}
                      </span>
                      {w.badge && (
                        <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300">
                          {w.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[190px]">
                      {w.description}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Action Button */}
                <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                  {isConnecting ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F4B5D]/60 text-[#68CFEB] text-[11px] font-bold border border-[#68CFEB]/30 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {w.isInstalled ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Detected
                        </span>
                      ) : (
                        <a
                          href={w.installUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open official download site"
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors"
                        >
                          <span>Install</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(w);
                        }}
                        className={`
                          px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95
                          ${w.isInstalled 
                            ? 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] text-[#1F1E19] hover:from-[#90DEF2] hover:to-[#2B6882]' 
                            : 'bg-white/10 hover:bg-white/20 text-[#FAFAFA] border border-white/10'}
                        `}
                      >
                        Connect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Shield Notice */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#68CFEB]" />
            Self-Custody Direct Injection
          </span>
          <span className="text-slate-500">Zero Private Key Custody</span>
        </div>

      </div>
    </div>
  );
};
