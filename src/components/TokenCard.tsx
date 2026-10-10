import React from 'react';
import { Token } from '../types';
import { TrendingUp, TrendingDown, Users, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  onSelect: (token: Token) => void;
  onQuickBuyAmount?: (token: Token, monAmount: number) => void;
  currencySymbol?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  onSelect,
  onQuickBuyAmount,
  currencySymbol
}) => {
  const isPositive = token.priceChange24h >= 0;
  const currSymbol = currencySymbol || token.chainSymbol || 'MON';

  return (
    <div
      onClick={() => onSelect(token)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#1F1E19] border border-white/[0.08] hover:border-[#68CFEB]/40 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer overflow-hidden"
    >
      <div>
        {/* Token Header: Image, Name, Badge */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#68CFEB]/40 transition-colors shadow-md">
            <img
              src={token.imageUrl}
              alt={token.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {token.isGraduated && (
              <div className="absolute bottom-0 inset-x-0 bg-emerald-500/90 text-center py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-slate-950">
                Graduated
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h3 className="font-bold text-sm sm:text-base text-[#FAFAFA] group-hover:text-[#68CFEB] transition-colors truncate">
                {token.name}
              </h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#1F4B5D]/30 text-[#68CFEB] border border-[#68CFEB]/30 flex-shrink-0">
                ${token.symbol}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <span className="truncate">by @{token.creator}</span>
              <span>•</span>
              <span className="text-slate-500">{token.createdAt}</span>
            </div>

            <div className="flex items-center justify-between gap-2 font-mono">
              <div className="text-xs font-bold text-[#FAFAFA]">
                {token.usdPrice ? (
                  <span>
                    ${token.usdPrice >= 0.01 ? token.usdPrice.toFixed(4) : token.usdPrice.toExponential(2)}
                  </span>
                ) : (
                  <span>{token.priceMon} {currSymbol}</span>
                )}
              </div>
              <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}{token.priceChange24h}%
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
              <span>MCap: <span className="text-slate-200 font-semibold">{token.usdMarketCap ? `$${(token.usdMarketCap / 1e6).toFixed(1)}M` : `${token.marketCapMon} ${currSymbol}`}</span></span>
              {token.chain && (
                <span className="text-[9px] uppercase px-1 rounded bg-white/5 text-slate-400 font-mono">
                  {token.chain}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
          {token.description}
        </p>

        {/* Mini 7-day sparkline preview */}
        {token.sparkline7d && token.sparkline7d.length > 5 && (
          <div className="h-9 w-full mb-3 relative overflow-hidden rounded-lg bg-[#141310]/50 p-1 border border-white/[0.04]">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-full">
              {(() => {
                const spk = token.sparkline7d.slice(-20);
                const min = Math.min(...spk);
                const max = Math.max(...spk);
                const rng = max - min || 1;
                const pts = spk.map((v, i) => `${(i / (spk.length - 1)) * 200},${35 - ((v - min) / rng) * 30}`).join(' ');
                return (
                  <>
                    <polyline
                      points={pts}
                      fill="none"
                      stroke={isPositive ? '#68CFEB' : '#f87171'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        )}

        {/* Anti-Sniper Shield (FairSlot Genesis) Badge */}
        {token.shieldActive && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#1F4B5D]/90 border border-[#68CFEB]/50 text-[#FAFAFA] shadow-[0_0_10px_rgba(104,207,235,0.2)]">
              <ShieldCheck className="w-3 h-3 text-[#68CFEB] flex-shrink-0 animate-pulse" />
              <span>Anti-Sniper Shield (Max {token.maxShieldBuyMon || 0.5} {currSymbol})</span>
              {token.shieldRemainingSeconds !== undefined && token.shieldRemainingSeconds > 0 && (
                <span className="text-[#68CFEB] font-bold">({token.shieldRemainingSeconds}s)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Bonding Curve Section & Bottom Actions */}
      <div className="space-y-3 pt-3 border-t border-white/[0.06] font-mono">
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400">Bonding Curve</span>
            <span className="font-bold text-[#68CFEB]">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#141310] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] transition-all duration-300"
              style={{ width: `${token.bondingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer with Holders & Interactive Trade Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{token.holdersCount} holders</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(token);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] text-xs font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            <span>Trade</span>
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
