import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { getAvailableWallets, connectToWallet, AvailableWallet } from '../services/walletService';
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

  useEffect(() => {
    if (isOpen) {
      setWallets(getAvailableWallets());
      setErrorMessage(null);
      setConnectingId(null);
    }
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

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Wallets List */}
        <div className="space-y-2.5">
          {wallets.map((w) => {
            const isConnecting = connectingId === w.id;

            return (
              <div
                key={w.id}
                className={`
                  p-3 rounded-xl border transition-all flex items-center justify-between gap-3
                  ${w.isInstalled 
                    ? 'bg-[#25241E]/80 hover:bg-[#25241E] border-white/[0.08] hover:border-[#68CFEB]/50 cursor-pointer shadow-sm' 
                    : 'bg-[#181714]/60 border-white/[0.04] opacity-85'}
                `}
                onClick={() => {
                  if (w.isInstalled && !isConnecting) {
                    handleConnect(w);
                  }
                }}
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
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[200px]">
                      {w.description}
                    </p>
                  </div>
                </div>

                {/* Right: Status or Action Button */}
                <div className="flex items-center gap-2 flex-shrink-0 font-mono">
                  {isConnecting ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F4B5D]/60 text-[#68CFEB] text-[11px] font-bold border border-[#68CFEB]/30 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : w.isInstalled ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Detected</span>
                    </div>
                  ) : (
                    <a
                      href={w.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-semibold border border-white/10 transition-colors"
                    >
                      <span>Install</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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

