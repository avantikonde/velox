import React from 'react';
import { Token } from '../types';
import { TrendingUp, TrendingDown, Users, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  onSelect: (token: Token) => void;
  onQuickBuyAmount?: (token: Token, monAmount: number) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({ 
  token, 
  onSelect,
  onQuickBuyAmount
}) => {
  const isPositive = token.priceChange24h >= 0;

  return (
    <div
      onClick={() => onSelect(token)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0D111A] border border-white/[0.08] hover:border-[#836EF9]/40 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer overflow-hidden"
    >
      <div>
        {/* Token Header: Image, Name, Badge */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#836EF9]/40 transition-colors shadow-md">
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
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#A78BFA] transition-colors truncate">
                {token.name}
              </h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#836EF9]/10 text-[#A78BFA] border border-[#836EF9]/20 flex-shrink-0">
                ${token.symbol}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <span className="truncate">by @{token.creator}</span>
              <span>•</span>
              <span className="text-slate-500">{token.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <div className="text-xs font-bold text-slate-200">
                MCap: <span className="text-white">{token.marketCapMon} MON</span>
              </div>
              <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}{token.priceChange24h}%
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
          {token.description}
        </p>

        {/* Anti-Sniper Shield (FairSlot Genesis) Badge */}
        {token.shieldActive && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#193153]/90 border border-[#EB96FF]/40 text-[#F9D4E0] shadow-[0_0_10px_rgba(235,150,255,0.2)]">
              <ShieldCheck className="w-3 h-3 text-[#EB96FF] flex-shrink-0 animate-pulse" />
              <span>Anti-Sniper Shield (Max {token.maxShieldBuyMon || 0.5} MON)</span>
              {token.shieldRemainingSeconds !== undefined && token.shieldRemainingSeconds > 0 && (
                <span className="text-[#EB96FF] font-bold">({token.shieldRemainingSeconds}s)</span>
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
            <span className="font-bold text-emerald-400">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#080B11] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#836EF9] to-[#00F59B] transition-all duration-300"
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
            className="px-3 py-1.5 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white text-xs font-bold inline-flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            <span>Trade</span>
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
