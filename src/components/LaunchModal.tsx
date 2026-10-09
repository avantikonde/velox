import React, { useState } from 'react';
import { X, Sparkles, Image, Shield, AlertCircle, Wand2 } from 'lucide-react';
import { AuroraButton } from './AuroraButton';
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
  { label: 'Aurora Prism', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80' },
  { label: 'Irani Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
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
    if (buyAmount > userBalance) {
      setError(`Insufficient MON balance (you have ${userBalance.toFixed(2)} MON)`);
      return;
    }

    setError('');
    setIsDeploying(true);

    // Simulate Monad parallel smart contract deployment (sub-second execution)
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
        repliesCount: 0
      };

      setIsDeploying(false);
      onLaunch(newToken, buyAmount);

      // Trigger celebrate confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EB96FF', '#F9D4E0', '#0B5777']
      });

      onClose();
    }, 1200);
  };

  const autofillMeme = () => {
    setName('Monad Chad');
    setSymbol('MCHAD');
    setDescription('Never waiting on 15s block times again. Pure 10,000 TPS parallel speed on Monad.');
    setImageUrl(PRESET_AVATARS[1].url);
    setInitialBuy('0.5');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel p-6 sm:p-8 bg-[#0c1524]/95 border border-[#EB96FF]/30 shadow-2xl shadow-[#EB96FF]/20 my-8">
        
        {/* Subtle Tech Grid inside modal */}
        <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none rounded-3xl"></div>

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EB96FF]/15 border border-[#EB96FF]/30 text-[#EB96FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Launch a Coin on Monad</h2>
              <p className="text-xs text-slate-400">Fair launch with bonding curve • 0 seed capital needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick autofill for fast demo */}
        <div className="relative z-10 mb-4 flex justify-end">
          <button
            type="button"
            onClick={autofillMeme}
            className="inline-flex items-center gap-1.5 text-xs text-[#EB96FF] hover:text-[#F9D4E0] bg-[#EB96FF]/10 px-3 py-1 rounded-full border border-[#EB96FF]/30 transition-colors"
          >
            <Wand2 className="w-3 h-3" />
            Autofill Demo Meme
          </button>
        </div>

        {error && (
          <div className="relative z-10 mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Launch Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Coin Name <span className="text-[#EB96FF]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pune Purple"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#193153]/40 border border-[#EB96FF]/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#EB96FF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ticker Symbol <span className="text-[#EB96FF]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PUNE"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={8}
                className="w-full px-4 py-2.5 rounded-xl bg-[#193153]/40 border border-[#EB96FF]/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#EB96FF] transition-colors uppercase font-mono"
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
              className="w-full px-4 py-2 rounded-xl bg-[#193153]/40 border border-[#EB96FF]/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#EB96FF] transition-colors resize-none"
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
                    imageUrl === avatar.url ? 'border-[#EB96FF] scale-95 shadow-md shadow-[#EB96FF]/40' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or paste custom Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#193153]/20 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-[#EB96FF]"
            />
          </div>

          {/* Initial Buy Option (Snipe) */}
          <div className="p-4 rounded-2xl bg-[#193153]/40 border border-[#0B5777]/50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>First Buy Amount (Optional)</span>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                  Snipe genesis price
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
                className="flex-1 px-4 py-2 rounded-xl bg-[#09101c] border border-[#EB96FF]/30 text-white font-mono text-sm focus:outline-none focus:border-[#EB96FF]"
                placeholder="0.0"
              />
              <span className="text-sm font-bold text-[#F9D4E0] font-mono px-2">MON</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tip: Buying the first tokens kickstarts the bonding curve and secures your creator position.
            </p>
          </div>

          {/* Rug-proof Notice */}
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Bonding curve hits 50 MON ➔ 100% liquidity automatically burned & locked on DEX.</span>
          </div>

          {/* Action Button: Apple/Siri Fluid Aurora Capsule Button */}
          <div className="pt-2">
            <AuroraButton
              type="submit"
              loading={isDeploying}
              loadingText="Deploying to Monad (Parallel Engine)..."
              size="lg"
              className="w-full"
            >
              Launch Token in 1 Click 🚀
            </AuroraButton>
          </div>
        </form>

      </div>
    </div>
  );
};
