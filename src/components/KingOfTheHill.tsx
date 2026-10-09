import React from 'react';
import { Token } from '../types';
import { Crown, TrendingUp, Users, ArrowUpRight, Flame, ShieldCheck } from 'lucide-react';
import { AuroraButton } from './AuroraButton';

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
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      {/* Aurora Ambient Underglow */}
      <div className="aurora-ambient-glow top-0 left-1/3 w-[500px] h-[200px] bg-gradient-to-r from-[#EB96FF]/30 to-[#0B5777]/30"></div>

      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#EB96FF] via-[#0B5777] to-[#F9D4E0] shadow-2xl shadow-[#EB96FF]/15">
        <div className="relative rounded-[22px] bg-[#0c1524]/95 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden">
          
          {/* Subtle Grid Pattern Overlay (Image 1 Tech Blueprint style) */}
          <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Token Info & Crown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Token Avatar with Crown */}
              <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => onSelectToken(token)}>
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#EB96FF]/60 shadow-lg shadow-[#EB96FF]/30 transition-transform group-hover:scale-105">
                  <img
                    src={token.imageUrl}
                    alt={token.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-[#09101c] shadow-lg font-bold">
                  <Crown className="w-4 h-4 fill-amber-900 text-amber-900" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-[#EB96FF]/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    King of the Hill
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Created by <span className="text-[#F9D4E0]">{token.creator}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Rug-proof
                  </span>
                </div>

                <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => onSelectToken(token)}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white hover:text-[#EB96FF] transition-colors">
                    {token.name}
                  </h2>
                  <span className="font-mono text-lg font-bold text-[#EB96FF] bg-[#EB96FF]/10 px-2.5 py-0.5 rounded-lg border border-[#EB96FF]/25">
                    ${token.symbol}
                  </span>
                </div>

                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {token.description}
                </p>
              </div>

            </div>

            {/* Right: Metrics & Trade CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-5 w-full lg:w-auto">
              
              {/* Bonding Curve Progress */}
              <div className="w-full sm:w-64 space-y-1.5 bg-[#193153]/40 p-3.5 rounded-2xl border border-[#EB96FF]/15">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Bonding Curve Progress</span>
                  <span className="font-mono font-bold text-[#F9D4E0]">{token.bondingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-[#09101c] rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0B5777] via-[#EB96FF] to-[#F9D4E0] transition-all duration-500 shadow-sm shadow-[#EB96FF]"
                    style={{ width: `${token.bondingProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{token.monRaised} MON raised</span>
                  <span>Target: {token.monTarget} MON</span>
                </div>
              </div>

              {/* Stats & Trade Action */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Market Cap</div>
                  <div className="text-xl font-extrabold font-mono text-white">
                    {token.marketCapMon} <span className="text-xs font-normal text-[#EB96FF]">MON</span>
                  </div>
                </div>

                {/* Liquid Aurora Button from Image 2 */}
                <AuroraButton
                  onClick={() => onQuickBuy(token)}
                  size="md"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Trade ${token.symbol}
                </AuroraButton>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
