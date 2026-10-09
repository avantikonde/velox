import React from 'react';
import { Token } from '../types';
import { TrendingUp, TrendingDown, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuroraButton } from './AuroraButton';

interface TokenCardProps {
  token: Token;
  onSelect: (token: Token) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, onSelect }) => {
  const isPositive = token.priceChange24h >= 0;

  return (
    <div
      onClick={() => onSelect(token)}
      className="group relative flex flex-col justify-between rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EB96FF]/10 cursor-pointer overflow-hidden"
    >
      {/* Top Banner Gradient Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EB96FF]/30 to-transparent group-hover:via-[#EB96FF] transition-all"></div>

      <div>
        {/* Token Header: Image, Name, Badge */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[#EB96FF]/30 group-hover:border-[#EB96FF] transition-colors shadow-md">
            <img
              src={token.imageUrl}
              alt={token.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {token.isGraduated && (
              <div className="absolute bottom-0 inset-x-0 bg-emerald-500/90 text-center py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                Graduated
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h3 className="font-bold text-base text-white group-hover:text-[#EB96FF] transition-colors truncate">
                {token.name}
              </h3>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#193153]/80 text-[#F9D4E0] border border-[#EB96FF]/20 flex-shrink-0">
                ${token.symbol}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="truncate">by {token.creator}</span>
              <span>•</span>
              <span className="text-slate-500">{token.createdAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs font-mono font-bold text-white">
                MCap: <span className="text-[#F9D4E0]">{token.marketCapMon} MON</span>
              </div>
              <div className={`flex items-center text-xs font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}{token.priceChange24h}%
              </div>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {token.description}
        </p>
      </div>

      {/* Bonding Curve Section & Bottom Actions */}
      <div className="space-y-3 pt-3 border-t border-white/5">
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Bonding Curve</span>
            <span className="font-mono font-bold text-[#F9D4E0]">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#09101c] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0B5777] via-[#EB96FF] to-[#F9D4E0] transition-all duration-300"
              style={{ width: `${token.bondingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer with Holders & Quick Trade */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">{token.holdersCount} holders</span>
          </div>

          <AuroraButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(token);
            }}
          >
            Trade
          </AuroraButton>
        </div>

      </div>
    </div>
  );
};
