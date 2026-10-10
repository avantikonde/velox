import React from 'react';
import { X, Cpu } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D111A] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#836EF9]/15 text-[#A78BFA]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">MonadPump Protocol Architecture</h2>
              <p className="text-xs text-slate-400 font-mono">High-Throughput Fair Launchpad & Parallel AMM on Monad</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#131926] border border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-[#836EF9]/20 text-[#A78BFA] flex items-center justify-center font-bold font-mono flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Zero-Capital Fair Launch & Anti-Sniper Shield</h3>
              <p className="text-slate-400 leading-relaxed">
                Tokens deploy in a single transaction without seed liquidity. A mathematical bonding curve with a 60-second Anti-Sniper Shield (0.5 MON cap) ensures bot-resistant fair distribution from genesis.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#131926] border border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Sub-Second Parallel Trading (MonadBFT)</h3>
              <p className="text-slate-400 leading-relaxed">
                Superscalar pipelining executes thousands of buy and sell trades concurrently in ~800ms with gas fees under $0.0001, eliminating front-running and MEV sandwiches.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#131926] border border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold font-mono flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Rug-Proof AMM Graduation</h3>
              <p className="text-slate-400 leading-relaxed">
                When a token collects 50 MON (100% curve progress), liquidity is automatically burned and permanently locked into the primary Monad DEX pool.
              </p>
            </div>
          </div>

          {/* Network Parameters */}
          <div className="p-3.5 rounded-xl bg-[#080B11] border border-white/[0.06] font-mono text-xs space-y-1.5">
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Network Telemetry
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>Network: <span className="text-white font-semibold">Monad Testnet</span></div>
              <div>Consensus: <span className="text-white font-semibold">MonadBFT</span></div>
              <div>Finality: <span className="text-emerald-400 font-bold">~800ms</span></div>
              <div>Throughput: <span className="text-[#836EF9] font-bold">10,000 TPS</span></div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white font-bold text-xs font-mono transition-all"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
