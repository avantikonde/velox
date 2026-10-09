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
    <div className="w-full h-8 bg-[#0D111A]/90 border-b border-white/[0.08] flex items-center px-3 sm:px-6 overflow-hidden select-none z-30 font-mono text-xs">
      
      {/* Live Swaps Indicator Label */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-white/10 text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex-shrink-0">
        <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span>LIVE SWAPS:</span>
      </div>

      {/* Compact Horizontal Marquee of Token Swaps */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] pl-3 flex-1">
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
              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] hover:border-[#836EF9]/40 transition-all cursor-pointer flex-shrink-0 group active:scale-95"
            >
              {/* Meme Coin Logo */}
              <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                <img
                  src={logoUrl}
                  alt={trade.tokenSymbol}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Dot */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>

              {/* User Address */}
              <span className="text-slate-400 text-[10px]">{trade.user}</span>

              {/* Action & Amount */}
              <span className={`font-bold text-[10px] ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trade.type}
              </span>

              {/* Token Symbol */}
              <span className="font-bold text-white text-[11px] group-hover:text-[#A78BFA] transition-colors">
                ${trade.tokenSymbol}
              </span>

              {/* Mon Amount */}
              <span className="text-slate-400 text-[10px]">for</span>
              <span className="text-slate-200 font-bold text-[10px]">
                {trade.monAmount.toFixed(2)} MON
              </span>

              {/* Monad Speed Latency Tag */}
              <span className="text-[9px] text-[#A78BFA] bg-[#836EF9]/10 px-1 py-0.2 rounded font-mono font-medium">
                {trade.latencyMs}ms
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
