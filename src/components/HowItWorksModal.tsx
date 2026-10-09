import React from 'react';
import { X, Zap, Shield, Rocket, Cpu, CheckCircle2, Layers, ExternalLink } from 'lucide-react';
import { AuroraButton } from './AuroraButton';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 bg-[#0a1220]/95 border border-[#EB96FF]/30 shadow-2xl shadow-[#EB96FF]/20 my-8">
        
        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EB96FF]/15 border border-[#EB96FF]/30 text-[#EB96FF]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">MonadPump Protocol Architecture</h2>
              <p className="text-xs text-slate-400">High-Throughput Fair Launchpad & Parallel AMM on Monad L1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 space-y-5 text-sm text-slate-300">
          
          {/* Section 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-[#EB96FF]/15">
            <div className="w-8 h-8 rounded-xl bg-[#EB96FF]/20 text-[#EB96FF] flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Zero-Capital Fair Launch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Creators deploy an ERC-20 token in a single on-chain transaction without providing seed liquidity or paying exorbitant Uniswap LP initialization fees. A deterministic mathematical bonding curve acts as the automated market maker from genesis.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-[#EB96FF]/15">
            <div className="w-8 h-8 rounded-xl bg-[#0B5777]/30 text-[#F9D4E0] flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Sub-Second Parallel Trading (MonadBFT)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leveraging Monad’s superscalar pipelining and MonadDb, thousands of buy and sell trades execute concurrently. Trades finalize in ~800ms with gas fees costing under $0.0001 per transaction, eliminating front-running and MEV sandwich attacks.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-emerald-500/20">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Rug-Proof AMM Graduation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a token collects 50 MON through trading volume (100% curve progress), it graduates. The accumulated 50 MON along with remaining token supply is permanently deposited and locked into the primary Monad DEX pool. Liquidity can never be pulled.
              </p>
            </div>
          </div>

          {/* Network Parameters */}
          <div className="p-4 rounded-2xl bg-[#070c16] border border-white/10 font-mono text-xs space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-sans font-bold">
              Monad Network Specifications
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>Network: <span className="text-white">Monad Testnet</span></div>
              <div>Chain ID: <span className="text-[#EB96FF]">10143</span></div>
              <div>Throughput: <span className="text-emerald-400">10,000 TPS</span></div>
              <div>Finality: <span className="text-[#F9D4E0]">~800ms (Single-Slot)</span></div>
            </div>
          </div>

          <div className="pt-2">
            <AuroraButton onClick={onClose} size="md" className="w-full">
              Explore Markets ⚡
            </AuroraButton>
          </div>

        </div>

      </div>
    </div>
  );
};
