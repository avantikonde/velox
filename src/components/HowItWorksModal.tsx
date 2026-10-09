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
      <div className="relative w-full max-w-2xl rounded-2xl jaipur-ticket p-6 sm:p-8 border-2 border-[#17151E] shadow-2xl my-8">
        
        {/* Top Decorative Folk Band */}
        <div className="mela-folk-band -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 h-2" aria-hidden="true"></div>

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#F4E7C7]/15 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#F2C23A] text-[#17151E]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#F4E7C7] font-sans">MonadPump Protocol Architecture</h2>
              <p className="text-xs text-[#F4E7C7]/70 font-mono">High-Throughput Fair Launchpad & Parallel AMM on Monad L1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#F4E7C7]/60 hover:text-[#F4E7C7] font-mono text-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 space-y-5 text-sm">
          
          {/* Section 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#24212D] border border-[#F4E7C7]/15">
            <div className="w-8 h-8 rounded bg-[#F2C23A] text-[#17151E] flex items-center justify-center font-bold font-mono flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-[#F4E7C7] text-sm mb-1 font-sans">Zero-Capital Fair Launch</h3>
              <p className="text-xs text-[#F4E7C7]/80 font-serif leading-relaxed">
                Creators deploy an ERC-20 token in a single on-chain transaction without providing seed liquidity or paying exorbitant Uniswap LP initialization fees. A deterministic mathematical bonding curve acts as the automated market maker from genesis.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#24212D] border border-[#F4E7C7]/15">
            <div className="w-8 h-8 rounded bg-[#E23A2E] text-[#F4E7C7] flex items-center justify-center font-bold font-mono flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-[#F4E7C7] text-sm mb-1 font-sans">Sub-Second Parallel Trading (MonadBFT)</h3>
              <p className="text-xs text-[#F4E7C7]/80 font-serif leading-relaxed">
                Leveraging Monad’s superscalar pipelining and MonadDb, thousands of buy and sell trades execute concurrently. Trades finalize in ~800ms with gas fees costing under $0.0001 per transaction, eliminating front-running and MEV sandwich attacks.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#24212D] border border-emerald-500/20">
            <div className="w-8 h-8 rounded bg-emerald-500 text-[#17151E] flex items-center justify-center font-bold font-mono flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-[#F4E7C7] text-sm mb-1 font-sans">Rug-Proof AMM Graduation</h3>
              <p className="text-xs text-[#F4E7C7]/80 font-serif leading-relaxed">
                When a token collects 50 MON through trading volume (100% curve progress), it graduates. The accumulated 50 MON along with remaining token supply is permanently deposited and locked into the primary Monad DEX pool. Liquidity can never be pulled.
              </p>
            </div>
          </div>

          {/* Network Parameters */}
          <div className="p-4 rounded-xl bg-[#0E0C13] border border-[#F4E7C7]/15 font-mono text-xs space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-[#F2C23A] font-bold">
              Monad Network Specifications
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#F4E7C7]/80">
              <div>Network: <span className="text-[#F4E7C7] font-bold">Monad Testnet</span></div>
              <div>Consensus: <span className="text-[#F4E7C7] font-bold">MonadBFT</span></div>
              <div>Finality: <span className="text-emerald-400 font-bold">1 Slot (Sub-Second)</span></div>
              <div>Target TPS: <span className="text-[#F2C23A] font-bold">10,000 TPS</span></div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded mela-btn-gold text-xs"
            >
              GOT IT
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
