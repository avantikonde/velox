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
    <div className="relative w-full">
      {/* Bitmela Folk Geometric Tricolor Frieze Ribbon */}
      <div className="mela-folk-band w-full" aria-hidden="true"></div>

      <div className="w-full h-8 bg-[#17151E] text-[#F4E7C7] border-b border-[#F4E7C7]/15 flex items-center px-3 sm:px-6 overflow-hidden select-none z-30 font-mono">
        
        {/* Left Quick Navigation Tools */}
        <div className="flex items-center gap-2 pr-3 border-r border-[#F4E7C7]/20 flex-shrink-0 text-[#F4E7C7]/70">
          <button className="hover:text-[#F2C23A] transition-colors" title="Trading Filters">
            <Sliders className="w-3 h-3" />
          </button>
          <button className="hover:text-[#F2C23A] transition-colors" title="Top Earners">
            <Trophy className="w-3 h-3" />
          </button>
          <button className="hover:text-[#E23A2E] transition-colors" title="Alerts">
            <Bell className="w-3 h-3" />
          </button>
          <button className="hover:text-emerald-400 transition-colors" title="Trade History">
            <History className="w-3 h-3" />
          </button>
        </div>

        {/* Live Swaps Indicator Label */}
        <div className="flex items-center gap-1.5 pl-3 pr-3 text-[10px] font-mono font-bold tracking-wider text-[#F2C23A] uppercase flex-shrink-0">
          <Zap className="w-3 h-3 text-[#F2C23A] animate-pulse" />
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
                className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded bg-[#24212D] hover:bg-[#FAF3E0] hover:text-[#17151E] border border-[#F4E7C7]/15 hover:border-[#17151E] transition-all cursor-pointer flex-shrink-0 group"
              >
                {/* Meme Coin Logo */}
                <div className="w-4 h-4 rounded-full overflow-hidden border border-[#F2C23A] shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                  <img
                    src={logoUrl}
                    alt={trade.tokenSymbol}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Status Dot */}
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isBuy ? 'bg-[#F2C23A] animate-ping' : 'bg-[#E23A2E]'}`}></span>

                {/* User Address */}
                <span className="text-[#F4E7C7]/60 group-hover:text-[#17151E] text-[10px]">{trade.user}</span>

                {/* Action & Amount */}
                <span className={`font-bold text-[10px] ${isBuy ? 'text-[#F2C23A] group-hover:text-[#17151E]' : 'text-[#E23A2E]'}`}>
                  {trade.type}
                </span>

                {/* Token Symbol */}
                <span className="font-bold text-[#F4E7C7] group-hover:text-[#17151E] text-[11px]">
                  ${trade.tokenSymbol}
                </span>

                {/* Mon Amount */}
                <span className="text-[#F4E7C7]/60 group-hover:text-[#17151E] text-[10px]">for</span>
                <span className="text-[#F2C23A] group-hover:text-[#17151E] font-bold text-[10px]">
                  {trade.monAmount.toFixed(2)} MON
                </span>

                {/* Monad Speed Latency Tag */}
                <span className="text-[9px] text-[#17151E] bg-[#F2C23A] px-1 py-0.2 rounded font-mono font-bold">
                  {trade.latencyMs}ms
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
