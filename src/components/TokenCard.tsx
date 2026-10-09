import React from 'react';
import { Token } from '../types';
import { TrendingUp, TrendingDown, Users, ArrowUpRight } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  onSelect: (token: Token) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, onSelect }) => {
  const isPositive = token.priceChange24h >= 0;

  return (
    <div
      onClick={() => onSelect(token)}
      className="group relative flex flex-col justify-between rounded-xl jaipur-ticket p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden border-2 border-[#17151E]"
    >
      {/* Top Banner Folk Band Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2C23A] via-[#E23A2E] to-[#2677C9]"></div>

      <div>
        {/* Token Header: Image, Name, Badge */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-[#F2C23A] group-hover:border-[#E23A2E] transition-colors shadow-md">
            <img
              src={token.imageUrl}
              alt={token.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {token.isGraduated && (
              <div className="absolute bottom-0 inset-x-0 bg-[#E23A2E] text-center py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-[#F4E7C7]">
                GRADUATED
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h3 className="font-extrabold text-base text-[#F4E7C7] group-hover:text-[#F2C23A] transition-colors truncate font-sans">
                {token.name}
              </h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FAF3E0] text-[#17151E] border border-[#17151E] flex-shrink-0">
                ${token.symbol}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#F4E7C7]/60 font-mono mb-2">
              <span className="truncate">by @{token.creator}</span>
              <span>•</span>
              <span>{token.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <div className="text-xs font-bold text-[#F2C23A]">
                MCap: <span>{token.marketCapMon} MON</span>
              </div>
              <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-[#E23A2E]'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}{token.priceChange24h}%
              </div>
            </div>
          </div>
        </div>

        {/* Description snippet in Newsreader Serif */}
        <p className="text-xs text-[#F4E7C7]/80 font-serif italic line-clamp-2 mb-4 leading-relaxed">
          "{token.description}"
        </p>
      </div>

      {/* Bonding Curve Section & Bottom Actions */}
      <div className="space-y-3 pt-3 border-t border-dashed border-[#F4E7C7]/20 font-mono">
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-[#F4E7C7]/60 font-medium">Bonding Curve</span>
            <span className="font-bold text-[#F2C23A]">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#24212D] rounded overflow-hidden p-0.5 border border-[#F4E7C7]/15">
            <div
              className="h-full rounded bg-gradient-to-r from-[#F2C23A] to-[#E23A2E] transition-all duration-300"
              style={{ width: `${token.bondingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer with Holders & Quick Trade */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#F4E7C7]/60">
            <Users className="w-3.5 h-3.5 text-[#F2C23A]" />
            <span>{token.holdersCount} holders</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(token);
            }}
            className="px-3 py-1.5 rounded mela-btn-red text-[11px] inline-flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>TRADE</span>
            <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
