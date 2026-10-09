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
  { label: 'Gold Monad', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
  { label: 'Cyber Cat', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80' },
  { label: 'Jaipur Elephant', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80' },
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

      // Trigger celebrate confetti in Bitmela tones
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F2C23A', '#E23A2E', '#2677C9']
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl jaipur-ticket p-6 sm:p-8 border-2 border-[#17151E] shadow-2xl my-8">
        
        {/* Decorative Top Band */}
        <div className="mela-folk-band -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 h-2" aria-hidden="true"></div>

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#F4E7C7]/15 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#F2C23A] text-[#17151E] font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#F4E7C7] font-sans">Launch a Coin on Monad</h2>
              <p className="text-xs text-[#F4E7C7]/70 font-mono">Fair launch on-chain bonding curve • 0 seed capital needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#F4E7C7]/60 hover:text-[#F4E7C7] transition-colors font-mono text-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick autofill for demo */}
        <div className="relative z-10 mb-4 flex justify-end">
          <button
            type="button"
            onClick={autofillMeme}
            className="inline-flex items-center gap-1.5 text-xs text-[#17151E] bg-[#F2C23A] px-3 py-1 rounded font-mono font-bold hover:bg-[#FAF3E0] transition-colors shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Autofill Demo Coin
          </button>
        </div>

        {error && (
          <div className="relative z-10 mb-4 p-3 rounded bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Launch Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#F4E7C7] mb-1.5 font-sans uppercase tracking-wider">
                Coin Name <span className="text-[#E23A2E]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pune Purple"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] placeholder-[#17151E]/40 text-sm focus:outline-none focus:border-[#E23A2E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4E7C7] mb-1.5 font-sans uppercase tracking-wider">
                Ticker Symbol <span className="text-[#E23A2E]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. PUNE"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={8}
                className="w-full px-4 py-2.5 rounded bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] placeholder-[#17151E]/40 text-sm focus:outline-none focus:border-[#E23A2E] transition-colors uppercase font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F4E7C7] mb-1.5 font-sans uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What makes this coin unstoppable on Monad?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] placeholder-[#17151E]/40 text-sm focus:outline-none focus:border-[#E23A2E] transition-colors resize-none font-serif italic"
            />
          </div>

          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-bold text-[#F4E7C7] mb-1.5 font-sans uppercase tracking-wider">
              Choose Meme Avatar
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(avatar.url)}
                  className={`relative rounded overflow-hidden aspect-square border-2 transition-all ${
                    imageUrl === avatar.url ? 'border-[#F2C23A] scale-95 shadow-md' : 'border-[#F4E7C7]/20 opacity-70 hover:opacity-100'
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
              className="w-full px-3 py-1.5 rounded bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] placeholder-[#17151E]/40 text-xs font-mono focus:outline-none focus:border-[#E23A2E]"
            />
          </div>

          {/* Initial Buy Option */}
          <div className="p-4 rounded-xl bg-[#24212D] border border-[#F4E7C7]/15 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#F4E7C7] flex items-center gap-1.5">
                <span>Genesis Buy Amount (Optional)</span>
                <span className="text-[10px] text-[#17151E] bg-[#F2C23A] px-1.5 py-0.5 rounded font-mono font-bold">
                  Genesis snipe
                </span>
              </label>
              <span className="text-xs text-[#F4E7C7]/70 font-mono">
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
                className="flex-1 px-4 py-2 rounded bg-[#FAF3E0] border border-[#17151E]/30 text-[#17151E] font-mono text-sm focus:outline-none focus:border-[#E23A2E] font-bold"
                placeholder="0.0"
              />
              <span className="text-sm font-bold text-[#F2C23A] font-mono px-2">MON</span>
            </div>
            <p className="text-[11px] text-[#F4E7C7]/60 font-serif italic">
              Buying the first tokens kickstarts the bonding curve and secures your creator allocation.
            </p>
          </div>

          {/* Rug-proof Notice */}
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/15 p-3 rounded border border-emerald-500/30">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Target 50 MON reached ➔ 100% liquidity automatically burned & locked on Monad DEX.</span>
          </div>

          {/* Action Button: Bitmela Solid Monospace Red CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-3 px-6 rounded mela-btn-red text-xs transition-all active:scale-98 disabled:opacity-50"
            >
              {isDeploying ? 'DEPLOYING TO MONAD (PARALLEL ENGINE)...' : '+ LAUNCH TOKEN IN 1 CLICK 🚀'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
