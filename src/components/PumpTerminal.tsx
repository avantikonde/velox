import React, { useState } from 'react';
import { Token, HotCallout, LeaderboardEntry, FilterTimeframe } from '../types';
import { TrendingUp, TrendingDown, MessageSquare, Heart, ShieldCheck, Flame, ArrowUpRight, Trophy, Zap, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { AuroraButton } from './AuroraButton';

interface PumpTerminalProps {
  tokens: Token[];
  callouts: HotCallout[];
  leaderboard: LeaderboardEntry[];
  onSelectToken: (token: Token) => void;
  onOpenLaunchModal: () => void;
}

export const PumpTerminal: React.FC<PumpTerminalProps> = ({
  tokens,
  callouts,
  leaderboard,
  onSelectToken,
  onOpenLaunchModal
}) => {
  const [timeframe, setTimeframe] = useState<FilterTimeframe>('24h');
  const [category, setCategory] = useState<'memes' | 'all'>('memes');
  const [leaderboardTab, setLeaderboardTab] = useState<'traders' | 'earners'>('traders');

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
      
      {/* COLUMN 1: TRENDING TOKENS (pump.fun Style) */}
      <section className="lg:col-span-5 rounded-2xl terminal-col-panel p-4 flex flex-col h-[700px]">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#EB96FF]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Trending</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold">
              Live
            </span>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center gap-1 bg-[#193153]/50 p-1 rounded-xl border border-white/5 text-[11px] font-mono">
            {(['1h', '4h', '12h', '24h'] as FilterTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  timeframe === tf ? 'bg-[#EB96FF] text-[#070c16] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Category Sub-nav */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setCategory('memes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              category === 'memes' ? 'bg-white/10 text-[#F9D4E0] border border-[#EB96FF]/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Memes
          </button>
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              category === 'all' ? 'bg-white/10 text-[#F9D4E0] border border-[#EB96FF]/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tokens
          </button>
        </div>

        {/* Scrollable Token Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {tokens.map((token) => {
            const isPos = token.priceChange24h >= 0;
            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-[#193153]/20 hover:bg-[#193153]/50 border border-white/5 hover:border-[#EB96FF]/30 transition-all cursor-pointer"
              >
                {/* Left: Avatar & Ticker */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#EB96FF]/25 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
                    {token.isGraduated && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-bl-md flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white group-hover:text-[#EB96FF] transition-colors truncate">
                        {token.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#EB96FF]/15 text-[#EB96FF]">
                        ${token.symbol}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{token.priceMon} MON</span>
                      <span>•</span>
                      <span className="text-slate-500">Curve: {token.bondingProgress}%</span>
                    </div>

                    {/* Progress Bar Mini */}
                    <div className="w-28 h-1 bg-[#09101c] rounded-full overflow-hidden mt-1 border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#0B5777] via-[#EB96FF] to-[#F9D4E0]"
                        style={{ width: `${token.bondingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Right: Market Cap & Price Change */}
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-mono font-bold text-white">
                    {token.marketCapMon} <span className="text-[10px] text-[#EB96FF]">MON</span>
                  </div>
                  <div className={`text-[11px] font-mono font-semibold flex items-center justify-end gap-0.5 mt-0.5 ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPos ? '+' : ''}{token.priceChange24h}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COLUMN 2: HOT CALLOUTS & TRADES (pump.fun Center Feed) */}
      <section className="lg:col-span-4 rounded-2xl terminal-col-panel p-4 flex flex-col h-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0B5777]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Hot Callouts</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Real-time Stream</span>
        </div>

        {/* Callout Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {callouts.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-[#193153]/25 border border-white/5 hover:border-[#EB96FF]/20 transition-all space-y-2.5"
            >
              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={c.avatarUrl} alt={c.author} className="w-6 h-6 rounded-full object-cover border border-[#EB96FF]/30" />
                  <span className="text-xs font-bold text-slate-200">@{c.author}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{c.timeAgo}</span>
                </div>

                <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                  + {c.profitMon} MON
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {c.content}
              </p>

              {/* Attached Token Badge */}
              <div
                onClick={() => {
                  const tok = tokens.find(t => t.symbol === c.tokenSymbol);
                  if (tok) onSelectToken(tok);
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-[#070c16]/80 border border-white/10 hover:border-[#EB96FF]/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={c.tokenImageUrl} alt={c.tokenSymbol} className="w-6 h-6 rounded-md object-cover" />
                  <div>
                    <span className="text-xs font-bold text-white">${c.tokenSymbol}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{c.tokenName}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono">
                  <span className="text-slate-400">Position: </span>
                  <span className="text-[#F9D4E0] font-bold">{c.positionMon} MON</span>
                </div>
              </div>

              {/* Social interactions */}
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <button className="flex items-center gap-1 hover:text-[#EB96FF] transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> {c.replies}
                </button>
                <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                  <Heart className="w-3.5 h-3.5" /> {c.likes}
                </button>
              </div>
            </div>
          ))}

          {/* Quick CTA inside Callouts */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#193153]/40 to-[#0B5777]/30 border border-[#EB96FF]/20 text-center space-y-2">
            <p className="text-xs text-slate-300">
              Have an unstoppable meme thesis? Launch with zero upfront capital.
            </p>
            <AuroraButton onClick={onOpenLaunchModal} size="sm">
              Launch Your Coin 🚀
            </AuroraButton>
          </div>
        </div>
      </section>

      {/* COLUMN 3: LEADERBOARD (pump.fun Right Feed) */}
      <section className="lg:col-span-3 rounded-2xl terminal-col-panel p-4 flex flex-col h-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Leaderboard</h3>
          </div>
          <span className="text-xs font-mono text-[#EB96FF]">Top PnL</span>
        </div>

        {/* Tab switcher: Traders | Earners */}
        <div className="flex rounded-xl bg-[#193153]/50 p-1 border border-white/5 mb-3 text-xs">
          <button
            onClick={() => setLeaderboardTab('traders')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all ${
              leaderboardTab === 'traders' ? 'bg-[#EB96FF] text-[#070c16] shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Traders
          </button>
          <button
            onClick={() => setLeaderboardTab('earners')}
            className={`flex-1 py-1 rounded-lg font-bold transition-all ${
              leaderboardTab === 'earners' ? 'bg-[#EB96FF] text-[#070c16] shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Earners
          </button>
        </div>

        {/* Leaderboard Rows */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {leaderboard.map((lb) => (
            <div
              key={lb.rank}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#193153]/20 border border-white/5 hover:border-[#EB96FF]/20 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank number badge */}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 ${
                  lb.rank === 1 ? 'bg-amber-400 text-black shadow-md shadow-amber-400/40' :
                  lb.rank === 2 ? 'bg-slate-300 text-black' :
                  lb.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-white/10 text-slate-400'
                }`}>
                  {lb.rank}
                </span>

                <img src={lb.avatarUrl} alt={lb.handle} className="w-8 h-8 rounded-full object-cover border border-white/10" />

                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">
                    @{lb.handle}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lb.winRate}% win rate • {lb.tradesCount} trades
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{lb.profitMon.toFixed(1)} MON
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Network Speed Micro-Badge */}
        <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Monad Parallel L1
          </span>
          <span className="text-[#EB96FF] font-bold">~800ms finality</span>
        </div>
      </section>

    </div>
  );
};
