import React, { useState } from 'react';
import { Token, HotCallout, LeaderboardEntry, FilterTimeframe } from '../types';
import { TrendingUp, TrendingDown, MessageSquare, Heart, Flame, Trophy, CheckCircle2 } from 'lucide-react';

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
      
      {/* COLUMN 1: TRENDING TOKENS (Bitmela Ticket Stub Format) */}
      <section className="lg:col-span-5 rounded-xl terminal-col-panel p-4 flex flex-col h-[700px] border border-[#17151E] shadow-xl">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E7C7]/15 mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#E23A2E]" />
            <h3 className="font-extrabold text-sm text-[#F4E7C7] uppercase tracking-wider font-sans">Trending Coins</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2C23A] text-[#17151E] font-mono font-bold">
              LIVE
            </span>
          </div>

          {/* Timeframe Chips in Bitmela Monospace */}
          <div className="flex items-center gap-1 bg-[#24212D] p-1 rounded border border-[#F4E7C7]/15 text-[11px] font-mono">
            {(['1h', '4h', '12h', '24h'] as FilterTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded transition-all font-bold ${
                  timeframe === tf ? 'bg-[#F2C23A] text-[#17151E] shadow-sm' : 'text-[#F4E7C7]/60 hover:text-[#F4E7C7]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Category Sub-nav */}
        <div className="flex items-center gap-2 mb-3 font-mono text-xs">
          <button
            onClick={() => setCategory('memes')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              category === 'memes' ? 'bg-[#E23A2E] text-[#F4E7C7]' : 'text-[#F4E7C7]/70 hover:bg-[#F4E7C7]/10'
            }`}
          >
            Memes
          </button>
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              category === 'all' ? 'bg-[#E23A2E] text-[#F4E7C7]' : 'text-[#F4E7C7]/70 hover:bg-[#F4E7C7]/10'
            }`}
          >
            All Tokens
          </button>
        </div>

        {/* Scrollable Token Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {tokens.map((token) => {
            const isPos = token.priceChange24h >= 0;
            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-[#24212D]/80 hover:bg-[#FAF3E0] hover:text-[#17151E] border border-[#F4E7C7]/10 hover:border-[#17151E] transition-all cursor-pointer"
              >
                {/* Left: Avatar & Ticker */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded overflow-hidden border border-[#F2C23A] flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
                    {token.isGraduated && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-bl flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#F4E7C7] group-hover:text-[#17151E] transition-colors truncate font-sans">
                        {token.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#17151E] text-[#F2C23A] group-hover:bg-[#17151E] group-hover:text-[#F4E7C7]">
                        ${token.symbol}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#F4E7C7]/60 group-hover:text-[#17151E]/70 font-mono mt-0.5">
                      <span>{token.priceMon} MON</span>
                      <span>•</span>
                      <span>Curve: {token.bondingProgress}%</span>
                    </div>

                    {/* Progress Bar Mini */}
                    <div className="w-28 h-1 bg-[#17151E] rounded overflow-hidden mt-1 border border-[#F4E7C7]/15">
                      <div
                        className="h-full bg-gradient-to-r from-[#F2C23A] to-[#E23A2E]"
                        style={{ width: `${token.bondingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Right: Market Cap & Price Change */}
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-mono font-bold text-[#F2C23A] group-hover:text-[#17151E]">
                    {token.marketCapMon} <span className="text-[10px] text-[#F4E7C7] group-hover:text-[#17151E]">MON</span>
                  </div>
                  <div className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                    isPos ? 'text-emerald-400 group-hover:text-emerald-700' : 'text-[#E23A2E]'
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

      {/* COLUMN 2: HOT CALLOUTS & TRADES */}
      <section className="lg:col-span-4 rounded-xl terminal-col-panel p-4 flex flex-col h-[700px] border border-[#17151E] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E7C7]/15 mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#F2C23A]" />
            <h3 className="font-extrabold text-sm text-[#F4E7C7] uppercase tracking-wider font-sans">Hot Callouts</h3>
          </div>
          <span className="text-xs font-mono text-[#F4E7C7]/60">Live Stream</span>
        </div>

        {/* Callout Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {callouts.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-lg bg-[#24212D]/80 border border-[#F4E7C7]/10 hover:border-[#F2C23A] transition-all space-y-2.5"
            >
              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={c.avatarUrl} alt={c.author} className="w-6 h-6 rounded object-cover border border-[#F2C23A]" />
                  <span className="text-xs font-bold text-[#F4E7C7] font-mono">@{c.author}</span>
                  <span className="text-[10px] text-[#F4E7C7]/50 font-mono">{c.timeAgo}</span>
                </div>

                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2C23A] text-[#17151E] font-bold">
                  + {c.profitMon} MON
                </div>
              </div>

              {/* Comment text in editorial serif */}
              <p className="text-xs text-[#F4E7C7]/90 font-serif italic leading-relaxed">
                "{c.content}"
              </p>

              {/* Attached Token Badge */}
              <div
                onClick={() => {
                  const tok = tokens.find(t => t.symbol === c.tokenSymbol);
                  if (tok) onSelectToken(tok);
                }}
                className="flex items-center justify-between p-2 rounded bg-[#17151E] border border-[#F4E7C7]/20 hover:border-[#F2C23A] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={c.tokenImageUrl} alt={c.tokenSymbol} className="w-6 h-6 rounded object-cover" />
                  <div>
                    <span className="text-xs font-bold text-[#F2C23A] font-mono">${c.tokenSymbol}</span>
                    <span className="text-[10px] text-[#F4E7C7]/60 ml-1.5">{c.tokenName}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono">
                  <span className="text-[#F4E7C7]/60">Position: </span>
                  <span className="text-[#F2C23A] font-bold">{c.positionMon} MON</span>
                </div>
              </div>

              {/* Social interactions */}
              <div className="flex items-center gap-4 text-[11px] text-[#F4E7C7]/60 pt-1 font-mono">
                <button className="flex items-center gap-1 hover:text-[#F2C23A] transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> {c.replies}
                </button>
                <button className="flex items-center gap-1 hover:text-[#E23A2E] transition-colors">
                  <Heart className="w-3.5 h-3.5" /> {c.likes}
                </button>
              </div>
            </div>
          ))}

          {/* Quick CTA inside Callouts */}
          <div className="p-4 rounded-lg bg-[#24212D] border-2 border-dashed border-[#F4E7C7]/25 text-center space-y-2.5">
            <p className="text-xs text-[#F4E7C7] font-serif">
              Have an unstoppable meme thesis? Fair launch with zero upfront liquidity.
            </p>
            <button
              onClick={onOpenLaunchModal}
              className="px-4 py-2 rounded mela-btn-red text-xs transition-all active:scale-95 inline-block"
            >
              + LAUNCH TOKEN 🚀
            </button>
          </div>
        </div>
      </section>

      {/* COLUMN 3: LEADERBOARD */}
      <section className="lg:col-span-3 rounded-xl terminal-col-panel p-4 flex flex-col h-[700px] border border-[#17151E] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E7C7]/15 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F2C23A]" />
            <h3 className="font-extrabold text-sm text-[#F4E7C7] uppercase tracking-wider font-sans">Leaderboard</h3>
          </div>
          <span className="text-xs font-mono text-[#F2C23A] font-bold">Top PnL</span>
        </div>

        {/* Tab switcher: Traders | Earners */}
        <div className="flex rounded bg-[#24212D] p-1 border border-[#F4E7C7]/15 mb-3 text-xs font-mono">
          <button
            onClick={() => setLeaderboardTab('traders')}
            className={`flex-1 py-1 rounded font-bold transition-all ${
              leaderboardTab === 'traders' ? 'bg-[#F2C23A] text-[#17151E]' : 'text-[#F4E7C7]/60 hover:text-[#F4E7C7]'
            }`}
          >
            Traders
          </button>
          <button
            onClick={() => setLeaderboardTab('earners')}
            className={`flex-1 py-1 rounded font-bold transition-all ${
              leaderboardTab === 'earners' ? 'bg-[#F2C23A] text-[#17151E]' : 'text-[#F4E7C7]/60 hover:text-[#F4E7C7]'
            }`}
          >
            Earners
          </button>
        </div>

        {/* Leaderboard Rows */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
          {leaderboard.map((lb) => (
            <div
              key={lb.rank}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#24212D]/80 border border-[#F4E7C7]/10 hover:border-[#F2C23A] transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank number badge */}
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 ${
                  lb.rank === 1 ? 'bg-[#F2C23A] text-[#17151E] shadow-sm font-extrabold' :
                  lb.rank === 2 ? 'bg-[#FAF3E0] text-[#17151E]' :
                  lb.rank === 3 ? 'bg-[#E23A2E] text-[#F4E7C7]' :
                  'bg-[#17151E] text-[#F4E7C7]/60 border border-[#F4E7C7]/20'
                }`}>
                  {lb.rank}
                </span>

                <img src={lb.avatarUrl} alt={lb.handle} className="w-8 h-8 rounded object-cover border border-[#F4E7C7]/20" />

                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#F4E7C7] truncate font-mono">
                    @{lb.handle}
                  </div>
                  <div className="text-[10px] text-[#F4E7C7]/60 font-mono">
                    {lb.winRate}% win • {lb.tradesCount} txs
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className="text-right flex-shrink-0 font-mono">
                <span className="text-xs font-bold text-[#F2C23A]">
                  +{lb.profitMon.toFixed(1)} MON
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Network Speed Micro-Badge */}
        <div className="mt-auto pt-3 border-t border-[#F4E7C7]/15 flex items-center justify-between text-[11px] font-mono text-[#F4E7C7]/70">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Monad Parallel L1
          </span>
          <span className="text-[#F2C23A] font-bold">~800ms Finality</span>
        </div>
      </section>

    </div>
  );
};
