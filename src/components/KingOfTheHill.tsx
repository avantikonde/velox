import React from 'react';
import { Token } from '../types';
import { Crown, ArrowUpRight, Flame, ShieldCheck } from 'lucide-react';

interface KingOfTheHillProps {
  token: Token;
  onSelectToken: (token: Token) => void;
  onQuickBuy: (token: Token) => void;
}

export const KingOfTheHill: React.FC<KingOfTheHillProps> = ({
  token,
  onSelectToken,
  onQuickBuy
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Jaipur Ticket Stub Container */}
      <div className="relative jaipur-ticket rounded-2xl overflow-hidden border-2 border-[#17151E] shadow-2xl">
        
        {/* Top Decorative Folk Tricolor Edge */}
        <div className="mela-folk-band w-full" aria-hidden="true"></div>

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left: Token Info & Stamped Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0">
            
            {/* Token Avatar with Stamped Border */}
            <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => onSelectToken(token)}>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-[#F2C23A] shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src={token.imageUrl}
                  alt={token.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-md bg-[#F2C23A] text-[#17151E] border border-[#17151E] shadow-md font-bold">
                <Crown className="w-4 h-4 fill-[#17151E] text-[#17151E]" />
              </div>
            </div>

            {/* Title & Editorial Description */}
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Authentic Rotated Stamp */}
                <span className="mela-stamp transform -rotate-2">
                  <Flame className="w-3.5 h-3.5 inline mr-1 text-[#E23A2E]" />
                  KING OF THE HILL
                </span>
                
                <span className="text-xs text-[#F4E7C7]/70 font-mono">
                  Created by <span className="text-[#F2C23A] font-bold">@{token.creator}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RUG-PROOF
                </span>
              </div>

              <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => onSelectToken(token)}>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-[#F4E7C7] hover:text-[#F2C23A] transition-colors">
                  {token.name}
                </h2>
                <span className="font-mono text-base font-bold text-[#17151E] bg-[#F2C23A] px-2.5 py-0.5 rounded border border-[#17151E]">
                  ${token.symbol}
                </span>
              </div>

              {/* Editorial Serif Description */}
              <p className="text-sm text-[#F4E7C7]/80 font-serif italic line-clamp-2 leading-relaxed">
                "{token.description}"
              </p>
            </div>

          </div>

          {/* Vertical Perforated Stitch Divider for Desktop */}
          <div className="hidden lg:block w-[1px] self-stretch border-r border-dashed border-[#F4E7C7]/20 mx-2"></div>

          {/* Right: Bonding Metrics & Trade CTA Stub */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-5 w-full lg:w-72 flex-shrink-0">
            
            {/* Bonding Curve Progress */}
            <div className="w-full space-y-1.5 bg-[#24212D] p-3.5 rounded-xl border border-[#F4E7C7]/15">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F4E7C7]/70 font-medium">BONDING CURVE</span>
                <span className="font-bold text-[#F2C23A]">{token.bondingProgress}%</span>
              </div>
              <div className="w-full h-3 bg-[#17151E] rounded overflow-hidden p-0.5 border border-[#F4E7C7]/15">
                <div
                  className="h-full rounded bg-gradient-to-r from-[#F2C23A] to-[#E23A2E] transition-all duration-500"
                  style={{ width: `${token.bondingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-[#F4E7C7]/60 font-mono">
                <span>{token.monRaised} MON raised</span>
                <span>Target: {token.monTarget} MON</span>
              </div>
            </div>

            {/* Market Cap & Trade Action */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
              <div className="text-left lg:text-right">
                <div className="text-[11px] font-mono text-[#F4E7C7]/60">MARKET CAP</div>
                <div className="text-lg font-bold font-mono text-[#F2C23A]">
                  {token.marketCapMon} <span className="text-xs text-[#F4E7C7]">MON</span>
                </div>
              </div>

              {/* Bitmela Solid Action Button */}
              <button
                onClick={() => onQuickBuy(token)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md mela-btn-gold text-xs active:scale-95 transition-all flex-shrink-0"
              >
                <span>TRADE ${token.symbol}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
