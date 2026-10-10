import React, { useState } from 'react';
import { X, Sparkles, Shield, AlertCircle, Wand2, Wallet, ExternalLink, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { Token, WalletState, User } from '../types';
import { ChainConfig } from '../data/chains';
import { dispatchWeb3Transaction } from '../services/web3TransactionService';
import confetti from 'canvas-confetti';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (newToken: Token, initialBuyMon: number) => void;
  userBalance: number;
  currencySymbol?: string;
  chainName?: string;
  wallet?: WalletState;
  onOpenConnectWallet?: () => void;
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
  chainConfig?: ChainConfig;
}

const PRESET_AVATARS = [
  { label: 'Purple Nebula', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
  { label: 'Cyber Cat', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80' },
  { label: 'Prism Core', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80' },
  { label: 'Monad Chad', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
];

export const LaunchModal: React.FC<LaunchModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
  userBalance,
  currencySymbol = 'MON',
  chainName = 'Monad',
  wallet,
  onOpenConnectWallet,
  currentUser,
  onOpenAuthModal,
  chainConfig
}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_AVATARS[0].url);
  const [initialBuy, setInitialBuy] = useState('0.1');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Sign-in Check
    if (!currentUser) {
      setError('You must sign in before launching a token so collaborators can verify your account and ownership.');
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    // 2. Wallet Connection Check
    if (!wallet?.isConnected) {
      setError('Please connect your device wallet (MetaMask, Phantom, etc.) before launching.');
      if (onOpenConnectWallet) onOpenConnectWallet();
      return;
    }

    if (!name.trim() || !symbol.trim()) {
      setError('Token name and symbol are required');
      return;
    }

    const buyAmount = parseFloat(initialBuy) || 0;
    if (buyAmount > 0.5) {
      setError(`Anti-Sniper Shield: Initial genesis buy is capped at 0.5 ${currencySymbol} to ensure fair launch.`);
      return;
    }
    if (buyAmount > userBalance) {
      setError(`Insufficient ${currencySymbol} balance (you have ${userBalance.toFixed(2)} ${currencySymbol})`);
      return;
    }

    setError('');
    setIsDeploying(true);
    setDeployStep('Confirming transaction in your wallet extension...');

    try {
      // 3. Dispatch real Web3 Transaction to user's connected wallet extension!
      const currentChain: ChainConfig = chainConfig || {
        id: 'monad',
        name: chainName || 'Monad Testnet',
        symbol: currencySymbol,
        badge: 'Parallel L1',
        iconColor: '#68CFEB',
        tps: '10,000 TPS',
        finality: '~800ms',
        gasCost: '< 0.0001 MON',
        rpcUrl: 'https://testnet-rpc.monad.xyz',
        faucetAmount: 10.0,
        explorerName: 'MonadScan'
      };

      const txResult = await dispatchWeb3Transaction({
        fromAddress: wallet.address,
        amount: buyAmount,
        tokenName: name.trim(),
        tokenSymbol: symbol.trim().toUpperCase(),
        txType: 'LAUNCH_TOKEN',
        chainConfig: currentChain
      });

      if (!txResult.success) {
        setIsDeploying(false);
        setDeployStep('');
        setError(txResult.error || 'Transaction confirmation was declined in your wallet.');
        return;
      }

      setDeployStep('Broadcasting contract to Monad Parallel L1 engine...');

      const creatorUsername = currentUser.username || 'creator';

      const newToken: Token = {
        id: `token-${Date.now()}`,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim() || `A high-speed community coin launched on ${chainName} Parallel L1 by @${creatorUsername}.`,
        imageUrl,
        creator: creatorUsername,
        createdAt: 'Just now',
        marketCapMon: buyAmount > 0 ? 5.0 + buyAmount * 2 : 5.0,
        priceMon: 0.0001,
        bondingProgress: buyAmount > 0 ? Math.min(100, Math.round((buyAmount / 50) * 100)) : 2,
        monRaised: buyAmount,
        monTarget: 50.0,
        holdersCount: buyAmount > 0 ? 2 : 1,
        volume24h: buyAmount,
        priceChange24h: 0,
        isGraduated: false,
        repliesCount: 0,
        shieldActive: true,
        shieldRemainingSeconds: 60,
        maxShieldBuyMon: 0.5,
        chain: currentChain.id,
        chainSymbol: currentChain.symbol,
        contractAddress: txResult.txHash ? `0x${txResult.txHash.replace('0x', '').slice(0, 40)}` : '0xFA1R892A0B577719BCA019',
        usdPrice: 0.0001,
        usdMarketCap: buyAmount > 0 ? 50000 + buyAmount * 20000 : 50000,
        sparkline7d: [0.000095, 0.000098, 0.0001]
      };

      setIsDeploying(false);
      setDeployStep('');
      onLaunch(newToken, buyAmount);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#68CFEB', '#1F4B5D', '#90DEF2']
      });

      onClose();
    } catch (err: any) {
      setIsDeploying(false);
      setDeployStep('');
      setError(err?.message || 'Transaction failed during launch.');
    }
  };

  const autofillMeme = () => {
    setName('Monad Chad');
    setSymbol('MCHAD');
    setDescription('Never waiting on 15s block times again. Pure 10,000 TPS parallel speed on Monad.');
    setImageUrl(PRESET_AVATARS[1].url);
    setInitialBuy('0.5');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#1F1E19] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#68CFEB]/40 flex-shrink-0 shadow-md shadow-[#68CFEB]/20">
              <img src="/logo.png" alt="VELOX Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FAFAFA] font-mono">Launch a Coin on {chainName}</h2>
              <p className="text-[11px] text-slate-400">Fair launch bonding curve • Zero seed capital needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Account Authentication Card */}
        {currentUser ? (
          <div className="mb-3 p-3 rounded-xl bg-[#232326] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-7 h-7 rounded-lg object-cover border border-[#68CFEB]/40 flex-shrink-0"
              />
              <div>
                <div className="text-[10px] text-slate-400">Creator Account</div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <span>@{currentUser.username}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[140px] hidden sm:inline">
              {currentUser.email}
            </span>
          </div>
        ) : (
          <div className="mb-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-amber-300 font-bold text-xs">Sign In Required</div>
                <div className="text-[10px] text-slate-300">Sign in to verify token ownership for all collaborators</div>
              </div>
            </div>

            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs font-bold transition-all shadow-sm active:scale-95 flex-shrink-0"
              >
                Sign In ➔
              </button>
            )}
          </div>
        )}

        {/* Deployer Wallet Section */}
        {wallet?.isConnected ? (
          <div className="mb-4 p-3 rounded-xl bg-[#25241E] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <div className="text-[10px] text-slate-400">
                  Deployer: <span className="text-slate-200 font-bold">{wallet.connectorName || 'Connected Wallet'}</span>
                </div>
                <div className="text-[#FAFAFA] font-bold text-xs">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-emerald-400 font-bold text-xs">
                {userBalance.toFixed(2)} {currencySymbol}
              </span>
              {onOpenConnectWallet && (
                <button
                  type="button"
                  onClick={onOpenConnectWallet}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#68CFEB] border border-white/10 transition-colors"
                >
                  Switch
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3.5 rounded-xl bg-[#1F4B5D]/40 border border-[#68CFEB]/40 flex items-center justify-between font-mono text-xs shadow-md shadow-[#68CFEB]/10">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-[#68CFEB] flex-shrink-0" />
              <div>
                <div className="text-[#FAFAFA] font-bold text-xs">Wallet Not Connected</div>
                <div className="text-[10px] text-slate-300">Connect MetaMask or Phantom to deploy on-chain</div>
              </div>
            </div>

            {onOpenConnectWallet && (
              <button
                type="button"
                onClick={onOpenConnectWallet}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] text-[#1F1E19] text-xs font-extrabold shadow-sm active:scale-95 transition-all"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}

        {/* Quick autofill */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={autofillMeme}
            className="inline-flex items-center gap-1.5 text-xs text-[#68CFEB] hover:text-white bg-[#1F4B5D]/30 px-3 py-1 rounded-lg border border-[#68CFEB]/30 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Autofill Demo Coin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Launch Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Coin Name <span className="text-[#68CFEB]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Giga Monad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#25241E] border border-white/10 text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ticker Symbol <span className="text-[#68CFEB]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. GIGA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={8}
                className="w-full px-3.5 py-2 rounded-xl bg-[#25241E] border border-white/10 text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB] transition-colors uppercase font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What makes this coin unstoppable on Monad?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#25241E] border border-white/10 text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB] transition-colors resize-none font-sans"
            />
          </div>

          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Meme Avatar
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(avatar.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    imageUrl === avatar.url ? 'border-[#68CFEB] scale-95 shadow-md shadow-[#68CFEB]/20' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or paste custom image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#25241E] border border-white/10 text-[#FAFAFA] placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-[#68CFEB]"
            />
          </div>

          {/* Initial Buy Option */}
          <div className="p-3.5 rounded-xl bg-[#25241E] border border-white/[0.06] space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Genesis Buy Amount (Optional)</span>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                  Snipe genesis
                </span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                Balance: {userBalance.toFixed(2)} {currencySymbol}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.05"
                min="0"
                max={userBalance}
                value={initialBuy}
                onChange={(e) => setInitialBuy(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#141310] border border-white/10 text-[#FAFAFA] font-mono text-sm focus:outline-none focus:border-[#68CFEB]"
                placeholder="0.0"
              />
              <span className="text-sm font-bold text-slate-300 font-mono px-2">{currencySymbol}</span>
            </div>
          </div>

          {/* Anti-Sniper Shield & Rug-proof Notices */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#FAFAFA] bg-[#1F4B5D]/90 p-2.5 rounded-xl border border-[#68CFEB]/50 shadow-[0_0_12px_rgba(104,207,235,0.2)]">
              <Shield className="w-4 h-4 text-[#68CFEB] flex-shrink-0 animate-pulse" />
              <span>Auto-enables 60-Second Anti-Sniper Shield on launch (Max 0.5 {currencySymbol} cap)</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Target 50 {currencySymbol} reached ➔ 100% liquidity automatically burned & locked on DEX.</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              type={currentUser && wallet?.isConnected ? "submit" : "button"}
              onClick={() => {
                if (!currentUser && onOpenAuthModal) {
                  onOpenAuthModal();
                } else if (!wallet?.isConnected && onOpenConnectWallet) {
                  onOpenConnectWallet();
                }
              }}
              disabled={isDeploying}
              className={`
                w-full py-3 px-4 rounded-xl text-xs font-extrabold font-mono transition-all active:scale-98 disabled:opacity-50 shadow-md
                ${!currentUser
                  ? 'bg-white hover:bg-slate-100 text-black shadow-lg shadow-white/10'
                  : !wallet?.isConnected
                    ? 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] shadow-[#68CFEB]/20'
                    : 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] shadow-[#68CFEB]/20'}
              `}
            >
              {isDeploying ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1F1E19]" />
                  <span>{deployStep || `Confirming in ${wallet?.connectorName || 'Wallet Extension'}...`}</span>
                </div>
              ) : !currentUser ? (
                <span>Sign In to Launch Token ➔</span>
              ) : !wallet?.isConnected ? (
                <span>Connect Device Wallet to Confirm 🦊👻</span>
              ) : (
                <span>Launch Token on {chainName} (Confirm in Wallet) 🚀</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
