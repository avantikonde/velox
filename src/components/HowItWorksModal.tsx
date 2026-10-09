import React from 'react';
import { X, Zap, Shield, Rocket, Cpu, CheckCircle2 } from 'lucide-react';
import { AuroraButton } from './AuroraButton';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 bg-[#0c1524]/95 border border-[#EB96FF]/30 shadow-2xl shadow-[#EB96FF]/20 my-8">
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none rounded-3xl"></div>

        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#EB96FF]/15 border border-[#EB96FF]/30 text-[#EB96FF]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">How MonadPump Works</h2>
              <p className="text-xs text-slate-400">Architecture, Bonding Curves & Monad Blitz Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 space-y-6 text-sm text-slate-300">
          
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-[#EB96FF]/15">
            <div className="w-8 h-8 rounded-xl bg-[#EB96FF]/20 text-[#EB96FF] flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Instant 1-Click Launch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Creators deploy a token with zero upfront liquidity. A mathematical linear bonding curve acts as the automated market maker from block 0.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-[#EB96FF]/15">
            <div className="w-8 h-8 rounded-xl bg-[#0B5777]/30 text-[#F9D4E0] flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Sub-Second Parallel Trading</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Monad's parallel execution and MonadDb, thousands of trades occur simultaneously with sub-second finality (~800ms) and fractions of a cent in gas fees.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#193153]/30 border border-emerald-500/20">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Rug-Proof Graduation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once the bonding curve reaches 50 MON (100% progress), the token graduates. The 50 MON + remaining supply is permanently locked into a Monad AMM liquidity pool. Nobody can pull liquidity.
              </p>
            </div>
          </div>

          {/* Color Scheme homage */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#193153]/50 to-[#0B5777]/30 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Aurora Blossom Palette</div>
              <div className="text-[11px] text-slate-400">Official Theme for Monad Blitz Pune V3</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#F9D4E0]" title="#F9D4E0"></span>
              <span className="w-4 h-4 rounded-full bg-[#EB96FF]" title="#EB96FF"></span>
              <span className="w-4 h-4 rounded-full bg-[#0B5777]" title="#0B5777"></span>
              <span className="w-4 h-4 rounded-full bg-[#193153]" title="#193153"></span>
            </div>
          </div>

          <div className="pt-2">
            <AuroraButton onClick={onClose} size="md" className="w-full">
              Got it, let's ship! ⚡
            </AuroraButton>
          </div>

        </div>

      </div>
    </div>
  );
};
