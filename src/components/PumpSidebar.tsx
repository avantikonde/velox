import React from 'react';
import { 
  ChevronsLeft, 
  ChevronsRight, 
  Home, 
  Compass, 
  Trophy, 
  Radio, 
  ShoppingBag, 
  Activity, 
  Coins, 
  Moon, 
  Plus, 
  Headphones, 
  Sliders, 
  Columns3, 
  LayoutGrid, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { ViewMode } from '../types';

interface PumpSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeTab: 'home' | 'explore' | 'leaderboard' | 'callouts' | 'terminal';
  onSelectTab: (tab: 'home' | 'explore' | 'leaderboard' | 'callouts' | 'terminal') => void;
  onOpenLaunchModal: () => void;
  onOpenHowItWorks: () => void;
  onOpenContractsModal: () => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
}

export const PumpSidebar: React.FC<PumpSidebarProps> = ({
  isExpanded,
  onToggleExpand,
  activeTab,
  onSelectTab,
  onOpenLaunchModal,
  onOpenHowItWorks,
  onOpenContractsModal,
  viewMode,
  onToggleViewMode
}) => {
  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-between
        bg-[#080B11] border-r border-white/[0.08]
        transition-all duration-300 ease-in-out select-none
        ${isExpanded ? 'w-[220px]' : 'w-[64px]'}
      `}
    >
      {/* Top: Logo + Toggle Arrow */}
      <div>
        <div className="h-16 px-3 flex items-center justify-between border-b border-white/[0.08] relative">
          
          {/* Logo Mark + Text */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            {/* Monad Isometric Seal */}
            <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="20"
                  height="20"
                  rx="6"
                  transform="rotate(45 18 18)"
                  stroke="url(#simpleMonadGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="simpleMonadGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#836EF9" />
                    <stop offset="0.6" stopColor="#A78BFA" />
                    <stop offset="1" stopColor="#00F59B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Brand Title */}
            {isExpanded && (
              <div className="flex items-center tracking-tight overflow-hidden whitespace-nowrap animate-in fade-in duration-150">
                <span className="font-extrabold text-sm tracking-widest text-white">
                  VELOX<span className="text-[#836EF9]">.</span>
                </span>
              </div>
            )}
          </div>

          {/* Color-Stick Toggle Arrow Button */}
          <button
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`
              flex items-center justify-center w-6 h-6 rounded-full
              bg-[#0D111A] hover:bg-[#131926]
              border border-white/10 hover:border-[#836EF9]/50
              text-[#836EF9] hover:text-white
              transition-all duration-200 active:scale-90
              ${isExpanded ? 'ml-auto' : 'mx-auto mt-0.5'}
            `}
          >
            {isExpanded ? (
              <ChevronsLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ChevronsRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar font-mono text-xs">
          
          {/* Home */}
          <button
            onClick={() => onSelectTab('home')}
            title="Home"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'home'
                ? 'bg-[#836EF9]/15 text-[#A78BFA] font-bold border border-[#836EF9]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Home</span>}
          </button>

          {/* Explore */}
          <button
            onClick={() => onSelectTab('explore')}
            title="Explore"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'explore'
                ? 'bg-[#836EF9]/15 text-[#A78BFA] font-bold border border-[#836EF9]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Explore</span>}
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => onSelectTab('leaderboard')}
            title="Leaderboard"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'leaderboard'
                ? 'bg-[#836EF9]/15 text-[#A78BFA] font-bold border border-[#836EF9]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Leaderboard</span>}
          </button>

          {/* Live Swaps */}
          <button
            onClick={() => onSelectTab('callouts')}
            title="Live"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all
              ${activeTab === 'callouts'
                ? 'bg-[#836EF9]/15 text-[#A78BFA] font-bold border border-[#836EF9]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Radio className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Live Feed</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="w-full h-[1px] bg-white/[0.08] mb-2"></div>
            {isExpanded && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Trading
              </div>
            )}
          </div>

          {/* Mayhem */}
          <button
            onClick={() => onSelectTab('terminal')}
            title="Terminal"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium
              text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Activity className="w-4 h-4 flex-shrink-0 text-purple-400" />
            {isExpanded && <span>Terminal</span>}
          </button>

          {/* Rewards */}
          <button
            onClick={onOpenHowItWorks}
            title="Rewards"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium
              text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Coins className="w-4 h-4 flex-shrink-0 text-amber-300" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Rewards</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                  New
                </span>
              </span>
            )}
          </button>

          {/* Launch Coin Button */}
          <div className="pt-3">
            {isExpanded ? (
              <button
                onClick={onOpenLaunchModal}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white font-bold text-xs shadow-md shadow-[#836EF9]/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Launch Coin</span>
              </button>
            ) : (
              <button
                onClick={onOpenLaunchModal}
                title="Launch coin"
                className="w-9 h-9 mx-auto rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white flex items-center justify-center font-bold shadow-md shadow-[#836EF9]/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Section: Support, Docs, View Toggle */}
      <div className="p-2 border-t border-white/[0.08] space-y-1 font-mono text-xs">
        
        {/* Support */}
        <button
          onClick={onOpenHowItWorks}
          title="Support & Docs"
          className={`
            w-full flex items-center gap-3 px-3 py-1.5 rounded-lg font-medium
            text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors
            ${!isExpanded ? 'justify-center px-0' : ''}
          `}
        >
          <Headphones className="w-4 h-4 flex-shrink-0" />
          {isExpanded && <span>Docs</span>}
        </button>

        {/* Smart Contracts */}
        <button
          onClick={onOpenContractsModal}
          title="Smart Contracts"
          className={`
            w-full flex items-center gap-3 px-3 py-1.5 rounded-lg font-medium
            text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors
            ${!isExpanded ? 'justify-center px-0' : ''}
          `}
        >
          <Code2 className="w-4 h-4 flex-shrink-0 text-[#836EF9]" />
          {isExpanded && (
            <span className="flex items-center justify-between flex-1">
              <span>Contracts</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </span>
          )}
        </button>

        {/* View Switcher: Terminal vs Grid */}
        <div className={`pt-1 flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center'}`}>
          {isExpanded && (
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Sliders className="w-3 h-3" />
              View
            </span>
          )}
          
          <div className="flex items-center gap-1 bg-[#0D111A] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => onToggleViewMode('terminal')}
              title="Terminal View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'terminal' ? 'bg-[#836EF9] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('grid')}
              title="Grid View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#836EF9] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </aside>
  );
};
