import React, { useState, useEffect } from 'react';
import { Trade, Token, HotCallout } from '../types';
import { Radio, ArrowUpRight, ArrowDownRight, Zap, ShieldCheck, ExternalLink, Activity, Filter, MessageSquare, Heart } from 'lucide-react';
import { ChainConfig } from '../data/chains';
import { formatTimeAgo, formatExactTime } from '../utils/timeAgo';

interface LiveFeedViewProps {
  recentTrades: Trade[];
  tokens: Token[];
  callouts: HotCallout[];
  activeChain: ChainConfig;
  currencySymbol: string;
  onSelectToken: (token: Token) => void;
}

export const LiveFeedView: React.FC<LiveFeedViewProps> = ({
  recentTrades,
  tokens,
  callouts,
  activeChain,
  currencySymbol,
  onSelectToken
}) => {
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell' | 'whale'>('all');
  const [, setTick] = useState(0);

  // Live timer tick every second so relative timestamps continuously update
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredTrades = recentTrades.filter((t) => {
    if (filterType === 'buy') return t.type === 'BUY';
    if (filterType === 'sell') return t.type === 'SELL';
    if (filterType === 'whale') return t.monAmount >= 1.0;
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Breadcrumb & Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>VELOX</span>
            <span>/</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Feed
            </span>
            <span>/</span>
            <span className="text-slate-500">{activeChain.name}</span>
          </div>
          <h1 className="text-2xl font-black text-[#FAFAFA] flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            Sub-Second Transaction Stream
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Parallel trade execution stream with microsecond finality and zero MEV front-running.
          </p>
        </div>

        {/* Trade Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#1F1E19] border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-[#68CFEB] text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Swaps
          </button>
          <button
            onClick={() => setFilterType('whale')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'whale' ? 'bg-[#68CFEB] text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Whale (&gt;1 {currencySymbol})
          </button>
          <button
            onClick={() => setFilterType('buy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'buy' ? 'bg-emerald-400 text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Buys Only
          </button>
          <button
            onClick={() => setFilterType('sell')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'sell' ? 'bg-rose-400 text-[#141310] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sells Only
          </button>
        </div>
      </div>

      {/* Network Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-slate-500 text-[11px]">Network Throughput</span>
          <div className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            {activeChain.tps}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-slate-500 text-[11px]">Block Finality</span>
          <div className="text-base font-extrabold text-[#68CFEB]">
            {activeChain.finality}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-slate-500 text-[11px]">Gas Cost</span>
          <div className="text-base font-extrabold text-[#FAFAFA]">
            {activeChain.gasCost}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-slate-500 text-[11px]">Anti-Sniper Genesis</span>
          <div className="text-base font-extrabold text-[#68CFEB] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#68CFEB]" />
            Active (0.5 Cap)
          </div>
        </div>
      </div>

      {/* Two Column Layout: Main Swaps Stream + Community Callouts Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Real-time Live Trades Stream */}
        <div className="lg:col-span-8 rounded-2xl bg-[#1F1E19] border border-white/[0.08] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#68CFEB]" />
              <h3 className="font-bold text-sm text-[#FAFAFA]">Live Execution Stream</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              ● Streaming @ ~800ms
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 bg-[#25241E]/40 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4 text-right">Amount ({currencySymbol})</th>
                  <th className="py-3 px-4 text-right">Tokens</th>
                  <th className="py-3 px-4">Trader</th>
                  <th className="py-3 px-4 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredTrades.map((t) => {
                  const isBuy = t.type === 'BUY';
                  const tok = tokens.find(tk => tk.id === t.tokenId || tk.symbol === t.tokenSymbol);
                  return (
                    <tr
                      key={t.id}
                      onClick={() => tok && onSelectToken(tok)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">
                            {t.timestampMs ? formatTimeAgo(t.timestampMs) : t.timestamp}
                          </span>
                          {t.timestampMs && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({formatExactTime(t.timestampMs)})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Buy / Sell Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          isBuy 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {t.type}
                        </span>
                      </td>

                      {/* Token */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {t.tokenImageUrl && (
                            <img
                              src={t.tokenImageUrl}
                              alt={t.tokenSymbol}
                              className="w-5 h-5 rounded-md object-cover border border-white/10"
                            />
                          )}
                          <span className="font-bold text-[#FAFAFA] group-hover:text-[#68CFEB] transition-colors">
                            ${t.tokenSymbol}
                          </span>
                        </div>
                      </td>

                      {/* Native Amount */}
                      <td className="py-3 px-4 text-right font-extrabold text-[#FAFAFA]">
                        {t.monAmount.toFixed(2)} {t.currencySymbol || currencySymbol}
                      </td>

                      {/* Token Amount */}
                      <td className="py-3 px-4 text-right text-slate-300">
                        {t.tokenAmount.toLocaleString()}
                      </td>

                      {/* Trader Address */}
                      <td className="py-3 px-4 text-slate-400">
                        <span className="hover:text-white transition-colors">{t.user}</span>
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-4 text-right">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#68CFEB] text-[10px]">
                          {t.latencyMs}ms
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Hot Community Sentiment & Callouts */}
        <div className="lg:col-span-4 rounded-2xl bg-[#1F1E19] border border-white/[0.08] p-4 flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#68CFEB]" />
              <h3 className="font-bold text-sm text-[#FAFAFA]">Trader Intelligence</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Community</span>
          </div>

          <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[580px]">
            {callouts.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-[#25241E] border border-white/[0.04] hover:border-white/10 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <a
                    href={c.xProfileUrl || `https://x.com/${c.xHandle || c.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group/author hover:opacity-90 transition-opacity"
                    title={`View @${c.xHandle || c.author} on X (Twitter)`}
                  >
                    <div className="relative">
                      <img
                        src={c.avatarUrl}
                        alt={c.author}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                        }}
                        className="w-6 h-6 rounded-full object-cover border border-white/10 group-hover/author:border-[#68CFEB]/60 transition-colors"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-black rounded-full flex items-center justify-center border border-white/20">
                        <svg className="w-1.5 h-1.5 fill-white" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-200 group-hover/author:text-[#68CFEB] transition-colors font-mono">
                        @{c.xHandle || c.author}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover/author:text-[#68CFEB] transition-colors" />
                    </div>
                  </a>
                  <span className="text-[10px] text-slate-500 font-mono">{c.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {c.content}
                </p>

                <div
                  onClick={() => {
                    const tok = tokens.find(t => t.symbol === c.tokenSymbol);
                    if (tok) onSelectToken(tok);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#141310] border border-white/[0.06] hover:border-[#68CFEB]/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={c.tokenImageUrl} alt={c.tokenSymbol} className="w-5 h-5 rounded-md object-cover" />
                    <span className="text-xs font-bold text-[#FAFAFA] font-mono">${c.tokenSymbol}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    +{c.profitMon} {c.currencySymbol || currencySymbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

