import React from 'react';
import { Zap, Trophy, History, Sliders, Bell } from 'lucide-react';
import { Trade, Token } from '../types';

interface LiveActivityTickerProps {
  recentTrades: Trade[];
  onSelectToken?: (token: Token) => void;
  tokens?: Token[];
}

export const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({
  recentTrades,
  onSelectToken,
  tokens = []
}) => {
  return (
    <div className="w-full h-8 bg-[#070c16]/95 border-b border-[#EB96FF]/15 backdrop-blur-xl flex items-center px-3 sm:px-6 overflow-hidden select-none z-40">
      
      {/* Left Quick Navigation Tools (Matching pump.fun Reference Image) */}
      <div className="flex items-center gap-2 pr-3 border-r border-white/10 flex-shrink-0 text-slate-400">
        <button className="hover:text-white transition-colors" title="Trading Filters">
          <Sliders className="w-3 h-3" />
        </button>
        <button className="hover:text-amber-300 transition-colors" title="Top Earners">
          <Trophy className="w-3 h-3" />
        </button>
        <button className="hover:text-[#EB96FF] transition-colors" title="Alerts">
          <Bell className="w-3 h-3" />
        </button>
        <button className="hover:text-emerald-400 transition-colors" title="Trade History">
          <History className="w-3 h-3" />
        </button>
      </div>

      {/* Live Swaps Indicator Label */}
      <div className="flex items-center gap-1.5 pl-3 pr-3 text-[10px] font-mono font-bold tracking-wider text-[#EB96FF] uppercase flex-shrink-0">
        <Zap className="w-3 h-3 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">LIVE SWAPS:</span>
      </div>

      {/* Compact Horizontal Marquee of Token Swaps */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] font-mono flex-1">
        {recentTrades.map((trade) => {
          const isBuy = trade.type === 'BUY';
          const matchedToken = tokens.find(t => t.id === trade.tokenId || t.symbol === trade.tokenSymbol);
          const logoUrl = trade.tokenImageUrl || matchedToken?.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

          return (
            <div
              key={trade.id}
              onClick={() => {
                if (matchedToken && onSelectToken) {
                  onSelectToken(matchedToken);
                }
              }}
              title={`Click to trade $${trade.tokenSymbol}`}
              className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-[#193153]/40 hover:bg-[#193153]/70 border border-[#EB96FF]/20 hover:border-[#EB96FF]/50 transition-all cursor-pointer flex-shrink-0 group"
            >
              {/* Meme Coin Logo */}
              <div className="w-4 h-4 rounded-full overflow-hidden border border-[#EB96FF]/40 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                <img
                  src={logoUrl}
                  alt={trade.tokenSymbol}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Dot */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isBuy ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>

              {/* User Address */}
              <span className="text-slate-400 text-[10px]">{trade.user}</span>

              {/* Action & Amount */}
              <span className={`font-bold text-[10px] ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trade.type}
              </span>

              {/* Token Symbol */}
              <span className="font-bold text-white text-[11px] group-hover:text-[#EB96FF] transition-colors">
                ${trade.tokenSymbol}
              </span>

              {/* Mon Amount */}
              <span className="text-slate-400 text-[10px]">for</span>
              <span className="text-[#F9D4E0] font-bold text-[10px]">
                {trade.monAmount.toFixed(2)} MON
              </span>

              {/* Monad Speed Latency Tag */}
              <span className="text-[9px] text-[#EB96FF] bg-[#EB96FF]/10 px-1 py-0.2 rounded font-mono">
                {trade.latencyMs}ms
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
