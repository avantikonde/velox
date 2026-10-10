import React, { useState } from 'react';
import { X, Sparkles, Shield, AlertCircle, Wand2 } from 'lucide-react';
import { Token } from '../types';
import confetti from 'canvas-confetti';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (newToken: Token, initialBuyMon: number) => void;
  userBalance: number;
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
  userBalance
}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_AVATARS[0].url);
  const [initialBuy, setInitialBuy] = useState('0.1');
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim()) {
      setError('Token name and symbol are required');
      return;
    }

    const buyAmount = parseFloat(initialBuy) || 0;
    if (buyAmount > 0.2) {
      setError('Anti-Sniper Shield: Initial genesis buy is capped at 0.2 MON to ensure fair launch.');
      return;
    }
    if (buyAmount > userBalance) {
      setError(`Insufficient MON balance (you have ${userBalance.toFixed(2)} MON)`);
      return;
    }

    setError('');
    setIsDeploying(true);

    // Simulate Monad parallel smart contract deployment
    setTimeout(() => {
      const newToken: Token = {
        id: `token-${Date.now()}`,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim() || 'A high-speed community coin launched on Monad Parallel L1.',
        imageUrl,
        creator: '0xYou...Me',
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
        maxShieldBuyMon: 0.2
      };

      setIsDeploying(false);
      onLaunch(newToken, buyAmount);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#836EF9', '#00F59B', '#A78BFA']
      });

      onClose();
    }, 1000);
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
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D111A] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#836EF9]/15 text-[#A78BFA]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Launch a Coin on Monad</h2>
              <p className="text-xs text-slate-400">Fair launch bonding curve • Zero seed capital needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick autofill */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={autofillMeme}
            className="inline-flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-white bg-[#836EF9]/10 px-3 py-1 rounded-lg border border-[#836EF9]/30 transition-colors"
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
                Coin Name <span className="text-[#836EF9]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Giga Monad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ticker Symbol <span className="text-[#836EF9]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. GIGA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={8}
                className="w-full px-3.5 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9] transition-colors uppercase font-mono font-bold"
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
              className="w-full px-3.5 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9] transition-colors resize-none font-sans"
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
                    imageUrl === avatar.url ? 'border-[#836EF9] scale-95 shadow-md' : 'border-white/10 opacity-70 hover:opacity-100'
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
              className="w-full px-3 py-1.5 rounded-lg bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-[#836EF9]"
            />
          </div>

          {/* Initial Buy Option */}
          <div className="p-3.5 rounded-xl bg-[#131926] border border-white/[0.06] space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Genesis Buy Amount (Optional)</span>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                  Snipe genesis
                </span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                Balance: {userBalance.toFixed(2)} MON
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
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#080B11] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#836EF9]"
                placeholder="0.0"
              />
              <span className="text-sm font-bold text-slate-300 font-mono px-2">MON</span>
            </div>
          </div>

          {/* Anti-Sniper Shield & Rug-proof Notices */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#F9D4E0] bg-[#193153]/85 p-2.5 rounded-xl border border-[#EB96FF]/40 shadow-[0_0_12px_rgba(235,150,255,0.15)]">
              <Shield className="w-4 h-4 text-[#EB96FF] flex-shrink-0 animate-pulse" />
              <span>Auto-enables 60-Second Anti-Sniper Shield on launch (Max 0.2 MON cap)</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Target 50 MON reached ➔ 100% liquidity automatically burned & locked on DEX.</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-2.5 px-4 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white text-xs font-bold font-mono transition-all active:scale-98 disabled:opacity-50 shadow-md shadow-[#836EF9]/20"
            >
              {isDeploying ? 'Deploying to Monad (Parallel Engine)...' : 'Launch Token in 1 Click 🚀'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
