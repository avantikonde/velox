import React, { useState } from 'react';
import { LeaderboardEntry, Token } from '../types';
import { Trophy, Medal, Flame, TrendingUp, Sparkles, Shield, ArrowUpRight, CheckCircle, ExternalLink, Filter } from 'lucide-react';
import { ChainConfig } from '../data/chains';

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
  currencySymbol: string;
  activeChain: ChainConfig;
  onSelectTokenSymbol?: (symbol: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  currencySymbol,
  activeChain,
  onSelectTokenSymbol
}) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [category, setCategory] = useState<'pnl' | 'winrate' | 'volume'>('pnl');

  const top3 = leaderboard.slice(0, 3);
  const restTraders = leaderboard.slice(3);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Breadcrumb Header & Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>VELOX</span>
            <span>/</span>
            <span className="text-[#68CFEB] font-semibold">Leaderboard</span>
            <span>/</span>
            <span className="text-slate-500">{activeChain.name} ({activeChain.symbol})</span>
          </div>
          <h1 className="text-2xl font-black text-[#FAFAFA] flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            Top Velocity Traders
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time on-chain profitability and execution rankings across all bonding curves.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#1F1E19] border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setCategory('pnl')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                category === 'pnl' ? 'bg-[#68CFEB] text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top PnL
            </button>
            <button
              onClick={() => setCategory('winrate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                category === 'winrate' ? 'bg-[#68CFEB] text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Win Rate
            </button>
            <button
              onClick={() => setCategory('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                category === 'volume' ? 'bg-[#68CFEB] text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Volume
            </button>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center p-1 rounded-xl bg-[#1F1E19] border border-white/[0.08] text-xs font-mono">
            {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg transition-all uppercase ${
                  timeframe === tf ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM SECTION */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* RANK 2: SILVER */}
          <div className="rounded-2xl bg-[#1F1E19] border border-slate-400/20 p-5 flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1 hover:border-slate-400/40 transition-all">
            <div className="absolute top-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-400/10 text-slate-300 font-bold border border-slate-400/20">
              🥈 Rank #2
            </div>
            {top3[1].badge && (
              <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                {top3[1].badge}
              </div>
            )}
            
            <div className="relative mt-4 mb-3">
              <img
                src={top3[1].avatarUrl}
                alt={top3[1].handle}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-400 shadow-lg shadow-slate-400/10"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
            </div>

            <h3 className="font-bold text-base text-[#FAFAFA] font-mono">@{top3[1].handle}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{top3[1].tradesCount} trades • {top3[1].winRate}% Win</p>

            <div className="mt-4 w-full p-3 rounded-xl bg-[#25241E] border border-white/5 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Net Profit</span>
              <span className="text-sm font-extrabold text-emerald-400">
                +{top3[1].profitMon.toFixed(1)} {currencySymbol}
              </span>
            </div>
          </div>

          {/* RANK 1: GOLD (CENTER HIGHLIGHT) */}
          <div className="rounded-2xl bg-gradient-to-b from-[#1F4B5D]/40 to-[#1F1E19] border-2 border-amber-400/50 p-6 flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2 shadow-xl shadow-amber-400/5">
            <div className="absolute top-3 left-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-1">
              <span>👑 Champion</span>
            </div>
            {top3[0].badge && (
              <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold">
                {top3[0].badge}
              </div>
            )}

            <div className="relative mt-3 mb-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                👑
              </div>
              <img
                src={top3[0].avatarUrl}
                alt={top3[0].handle}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-2xl shadow-amber-400/30"
              />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center font-mono">
                1
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-[#FAFAFA] font-mono">@{top3[0].handle}</h3>
            <p className="text-xs text-amber-300/80 font-mono mt-0.5">{top3[0].tradesCount} trades • {top3[0].winRate}% Win Rate</p>

            <div className="mt-4 w-full p-3.5 rounded-xl bg-[#25241E] border border-amber-400/20 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-300 font-medium">Net Profit</span>
              <span className="text-base font-black text-emerald-400">
                +{top3[0].profitMon.toFixed(1)} {currencySymbol}
              </span>
            </div>
          </div>

          {/* RANK 3: BRONZE */}
          <div className="rounded-2xl bg-[#1F1E19] border border-amber-700/20 p-5 flex flex-col items-center text-center relative overflow-hidden order-3 md:order-3 hover:border-amber-700/40 transition-all">
            <div className="absolute top-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-700/10 text-amber-500 font-bold border border-amber-700/20">
              🥉 Rank #3
            </div>
            {top3[2].badge && (
              <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                {top3[2].badge}
              </div>
            )}

            <div className="relative mt-4 mb-3">
              <img
                src={top3[2].avatarUrl}
                alt={top3[2].handle}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 shadow-lg shadow-amber-700/10"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
            </div>

            <h3 className="font-bold text-base text-[#FAFAFA] font-mono">@{top3[2].handle}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{top3[2].tradesCount} trades • {top3[2].winRate}% Win</p>

            <div className="mt-4 w-full p-3 rounded-xl bg-[#25241E] border border-white/5 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Net Profit</span>
              <span className="text-sm font-extrabold text-emerald-400">
                +{top3[2].profitMon.toFixed(1)} {currencySymbol}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* COMPREHENSIVE RANKING TABLE */}
      <div className="rounded-2xl bg-[#1F1E19] border border-white/[0.08] overflow-hidden">
        
        {/* Table Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-[#68CFEB]" />
            <h2 className="font-bold text-sm text-[#FAFAFA]">Global Ranking ({timeframe.toUpperCase()})</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing top {leaderboard.length} high-frequency accounts
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 bg-[#25241E]/40 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Trader</th>
                <th className="py-3 px-4 text-center">Badge</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4 text-right">Trades</th>
                <th className="py-3 px-4 text-right">Volume ({currencySymbol})</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
                <th className="py-3 px-4 text-center">Fav Coin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.handle}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 font-bold">
                    {entry.rank === 1 ? (
                      <span className="text-amber-400 font-extrabold flex items-center gap-1">🥇 #1</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-300 font-extrabold flex items-center gap-1">🥈 #2</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-600 font-extrabold flex items-center gap-1">🥉 #3</span>
                    ) : (
                      <span className="text-slate-400">#{entry.rank}</span>
                    )}
                  </td>

                  {/* Trader Handle & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={entry.avatarUrl}
                        alt={entry.handle}
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <span className="font-bold text-[#FAFAFA] group-hover:text-[#68CFEB] transition-colors">
                          @{entry.handle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {entry.badge ? (
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-slate-300 whitespace-nowrap">
                        {entry.badge}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Win Rate */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-bold text-[#FAFAFA]">{entry.winRate}%</span>
                      <div className="w-16 h-1 bg-[#141310] rounded-full overflow-hidden mt-1 border border-white/5">
                        <div
                          className="h-full bg-[#68CFEB] rounded-full"
                          style={{ width: `${entry.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Trades Count */}
                  <td className="py-3.5 px-4 text-right text-slate-300">
                    {entry.tradesCount}
                  </td>

                  {/* Total Volume */}
                  <td className="py-3.5 px-4 text-right text-slate-300">
                    {(entry.volumeMon ?? entry.profitMon * 3.2).toFixed(1)}
                  </td>

                  {/* Net Profit */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-emerald-400">
                      +{entry.profitMon.toFixed(1)} {currencySymbol}
                    </span>
                  </td>

                  {/* Favorite Coin */}
                  <td className="py-3.5 px-4 text-center">
                    {entry.favToken ? (
                      <button
                        onClick={() => onSelectTokenSymbol?.(entry.favToken!)}
                        className="px-2 py-0.5 rounded-lg bg-[#1F4B5D]/40 text-[#68CFEB] hover:bg-[#1F4B5D]/80 border border-[#68CFEB]/30 transition-colors font-bold text-[11px]"
                      >
                        ${entry.favToken}
                      </button>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

