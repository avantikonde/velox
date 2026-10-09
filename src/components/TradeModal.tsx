import React, { useState } from 'react';
import { X, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Token, WalletState } from '../types';
import confetti from 'canvas-confetti';

interface TradeModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onExecuteTrade: (tokenId: string, type: 'BUY' | 'SELL', monAmount: number, tokenAmount: number) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  token,
  isOpen,
  onClose,
  wallet,
  onExecuteTrade
}) => {
  const [tab, setTab] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('0.5');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTxSuccess, setLastTxSuccess] = useState<string | null>(null);

  if (!isOpen || !token) return null;

  const userTokenBalance = wallet.tokens[token.id] || 0;
  const isBuy = tab === 'BUY';

  // Linear bonding curve preview math
  const numAmount = parseFloat(amount) || 0;
  const estimatedTokens = isBuy 
    ? Math.round(numAmount / token.priceMon)
    : Math.round(numAmount * token.priceMon * 0.98 * 1000) / 1000;

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    if (isBuy && numAmount > wallet.monBalance) {
      alert(`Insufficient MON balance (${wallet.monBalance.toFixed(2)} MON available)`);
      return;
    }
    if (!isBuy && numAmount > userTokenBalance) {
      alert(`Insufficient $${token.symbol} balance (${userTokenBalance.toLocaleString()} available)`);
      return;
    }

    setIsExecuting(true);
    setLastTxSuccess(null);

    // Simulate Monad Sub-second execution (800ms)
    const startTime = performance.now();
    setTimeout(() => {
      const latency = Math.round(performance.now() - startTime);
      setIsExecuting(false);
      
      const monSpent = isBuy ? numAmount : (numAmount * token.priceMon);
      const tokensTraded = isBuy ? estimatedTokens : numAmount;

      onExecuteTrade(token.id, tab, monSpent, tokensTraded);
      setLastTxSuccess(`⚡ Confirmed in ${latency}ms on Monad block #${Math.floor(Math.random() * 80000 + 100000)}`);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#836EF9', '#00F59B', '#FBBF24']
      });
    }, 800);
  };

  const presetAmounts = isBuy ? ['0.1', '0.5', '1.0', '2.5'] : ['25%', '50%', '75%', '100%'];

  const handlePreset = (val: string) => {
    if (isBuy) {
      setAmount(val);
    } else {
      const pct = parseInt(val) / 100;
      setAmount((userTokenBalance * pct).toFixed(0));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D111A] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl overflow-hidden border border-white/10 shadow-md flex-shrink-0">
              <img src={token.imageUrl} alt={token.name} className="w-12 h-12 object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{token.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#836EF9]/15 text-[#A78BFA] font-bold">
                  ${token.symbol}
                </span>
                {token.isGraduated && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Graduated
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>Price: <span className="text-white font-semibold">{token.priceMon} MON</span></span>
                <span>•</span>
                <span>MCap: <span className="text-slate-300">{token.marketCapMon} MON</span></span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bonding Curve Progress Bar */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#131926] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#836EF9]" />
              Bonding Curve Progress
            </span>
            <span className="font-bold text-emerald-400">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#080B11] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#836EF9] to-[#00F59B] transition-all duration-300"
              style={{ width: `${token.bondingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{token.monRaised.toFixed(1)} MON in Curve</span>
            <span>Target: {token.monTarget} MON</span>
          </div>
        </div>

        {/* Price Trajectory Chart Preview */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#080B11] border border-white/[0.06] overflow-hidden">
          <div className="flex justify-between items-center mb-1 font-mono text-xs">
            <span className="text-slate-500">Bonding Curve Trajectory</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{token.priceChange24h}%
            </span>
          </div>

          <div className="h-20 w-full relative">
            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradientSimple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#836EF9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#836EF9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,85 Q 120,75 220,50 T 380,30 T 500,15 L 500,100 L 0,100 Z"
                fill="url(#chartGradientSimple)"
              />
              <path
                d="M 0,85 Q 120,75 220,50 T 380,30 T 500,15"
                fill="none"
                stroke="#836EF9"
                strokeWidth="2"
              />
              <circle cx="500" cy="15" r="3" fill="#00F59B" className="animate-ping" />
              <circle cx="500" cy="15" r="2.5" fill="#836EF9" />
            </svg>
          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="mb-4 flex rounded-xl p-1 bg-[#131926] border border-white/[0.06] font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab('BUY')}
            className={`flex-1 py-2 font-bold rounded-lg transition-all ${
              isBuy ? 'bg-[#00F59B] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy ${token.symbol}
          </button>
          <button
            type="button"
            onClick={() => setTab('SELL')}
            className={`flex-1 py-2 font-bold rounded-lg transition-all ${
              !isBuy ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sell ${token.symbol}
          </button>
        </div>

        {/* Trade Form */}
        <form onSubmit={handleTrade} className="space-y-4 font-mono">
          <div className="p-3.5 rounded-xl bg-[#131926] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">
                {isBuy ? 'You Pay' : `You Sell ($${token.symbol})`}
              </span>
              <span className="text-slate-400">
                Balance: {isBuy ? `${wallet.monBalance.toFixed(2)} MON` : `${userTokenBalance.toLocaleString()} ${token.symbol}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#080B11] border border-white/10 text-white font-mono text-base font-bold focus:outline-none focus:border-[#836EF9]"
                placeholder="0.0"
              />
              <span className="font-bold text-sm text-slate-300 px-2">
                {isBuy ? 'MON' : token.symbol}
              </span>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 pt-1">
              {presetAmounts.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className="flex-1 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {preset} {isBuy ? 'MON' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Output */}
          <div className="flex justify-between items-center px-2 text-xs font-mono text-slate-400">
            <span>You Receive (Est.):</span>
            <span className="text-white font-bold">
              {isBuy ? `~${estimatedTokens.toLocaleString()} ${token.symbol}` : `~${estimatedTokens} MON`}
            </span>
          </div>

          {/* Success Notification Bar */}
          {lastTxSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{lastTxSuccess}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isExecuting}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all active:scale-98 disabled:opacity-50 shadow-md ${
                isBuy 
                  ? 'bg-[#00F59B] hover:bg-[#20f7a6] text-slate-950' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isExecuting 
                ? 'Executing at 10,000 TPS...' 
                : isBuy ? `Quick Buy ${token.symbol}` : `Sell ${token.symbol}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
