import React from 'react';
import { Token } from '../types';
import { Crown, ArrowUpRight, Flame, ShieldCheck, Zap } from 'lucide-react';

interface KingOfTheHillProps {
  token: Token;
  onSelectToken: (token: Token) => void;
  onQuickBuy: (token: Token) => void;
  currencySymbol?: string;
}

export const KingOfTheHill: React.FC<KingOfTheHillProps> = ({
  token,
  onSelectToken,
  onQuickBuy,
  currencySymbol
}) => {
  const currSymbol = currencySymbol || token.chainSymbol || 'MON';
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
      {/* Clean Modern Hero Card */}
      <div className="relative rounded-2xl bg-[#1F1E19] border border-white/[0.08] hover:border-[#68CFEB]/40 transition-all p-5 sm:p-6 shadow-lg shadow-black/40">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left: Token Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
            
            {/* Token Avatar with Crown Badge */}
            <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => onSelectToken(token)}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#68CFEB] shadow-md group-hover:scale-105 transition-all">
                <img
                  src={token.imageUrl}
                  alt={token.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2.5 -right-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 shadow-md font-bold">
                <Crown className="w-4 h-4 fill-amber-950 text-amber-950" />
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  King of the Hill
                </span>
                
                <span className="text-xs text-slate-400 font-mono">
                  by <span className="text-slate-200 font-medium">@{token.creator}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Rug-proof
                </span>

                {token.shieldActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#1F4B5D]/90 border border-[#68CFEB]/50 text-[#FAFAFA] shadow-[0_0_12px_rgba(104,207,235,0.25)]">
                    <ShieldCheck className="w-3 h-3 text-[#68CFEB] animate-pulse" />
                    <span>Anti-Sniper Shield (Max {token.maxShieldBuyMon || 0.5} {currSymbol})</span>
                    {token.shieldRemainingSeconds !== undefined && token.shieldRemainingSeconds > 0 && (
                      <span className="text-[#68CFEB] font-bold">({token.shieldRemainingSeconds}s)</span>
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2.5 cursor-pointer" onClick={() => onSelectToken(token)}>
                <h2 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] hover:text-[#68CFEB] transition-colors">
                  {token.name}
                </h2>
                <span className="font-mono text-sm font-bold text-[#68CFEB] bg-[#1F4B5D]/30 px-2 py-0.5 rounded-lg border border-[#68CFEB]/30">
                  ${token.symbol}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                {token.description}
              </p>
            </div>

          </div>

          {/* Right: Metrics & Trade CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-4 w-full lg:w-72 flex-shrink-0">
            
            {/* Bonding Curve Progress */}
            <div className="w-full space-y-1.5 bg-[#25241E] p-3 rounded-xl border border-white/[0.06]">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Bonding Curve</span>
                <span className="font-bold text-[#68CFEB]">{token.bondingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#141310] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] transition-all duration-500"
                  style={{ width: `${token.bondingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{token.monRaised} {currSymbol} raised</span>
                <span>Target: {token.monTarget} {currSymbol}</span>
              </div>
            </div>

            {/* Market Cap & Trade Action */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
              <div className="text-left lg:text-right font-mono">
                <div className="text-[11px] text-slate-400 flex items-center lg:justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block flex-shrink-0" title="Live Tracking"></span>
                  {token.usdPrice ? (
                    <span className="font-bold text-[#68CFEB]">
                      ${token.usdPrice >= 1 ? token.usdPrice.toFixed(2) : token.usdPrice >= 0.01 ? token.usdPrice.toFixed(4) : token.usdPrice.toFixed(8)}
                    </span>
                  ) : (
                    <span>{token.priceMon} {currSymbol}</span>
                  )}
                </div>
                <div className="text-base font-bold text-[#FAFAFA]">
                  {token.usdMarketCap ? (
                    `$${(token.usdMarketCap / 1e6).toFixed(1)}M`
                  ) : (
                    <>{token.marketCapMon} <span className="text-xs font-normal text-slate-400">{currSymbol}</span></>
                  )}
                </div>
              </div>

              <button
                onClick={() => onQuickBuy(token)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] text-xs font-extrabold transition-all shadow-md shadow-[#68CFEB]/20 active:scale-95 flex-shrink-0"
              >
                <span>Trade ${token.symbol}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
