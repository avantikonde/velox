import React, { useEffect, useState } from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types';

interface LiveActivityTickerProps {
  recentTrades: Trade[];
}

export const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({ recentTrades }) => {
  return (
    <div className="w-full bg-[#0c1524]/90 border-y border-[#EB96FF]/10 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#EB96FF] uppercase tracking-wider flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          <span>Live Swaps:</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-mono">
          {recentTrades.slice(0, 8).map((trade) => {
            const isBuy = trade.type === 'BUY';
            return (
              <div
                key={trade.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#193153]/40 border border-white/5 flex-shrink-0"
              >
                <span className={`inline-block w-2 h-2 rounded-full ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className="text-slate-300">{trade.user}</span>
                <span className={`font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trade.type} {trade.tokenAmount.toLocaleString()} ${trade.tokenSymbol}
                </span>
                <span className="text-slate-500">for</span>
                <span className="text-[#F9D4E0] font-bold">{trade.monAmount.toFixed(2)} MON</span>
                <span className="text-[10px] text-[#EB96FF] bg-[#EB96FF]/10 px-1.5 py-0.2 rounded">
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
