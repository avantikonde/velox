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
  ExternalLink,
  Sparkles
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
        bg-[#17151E] text-[#F4E7C7] border-r border-[#17151E] shadow-2xl
        transition-all duration-300 ease-in-out select-none
        ${isExpanded ? 'w-[240px]' : 'w-[68px]'}
      `}
      style={{
        boxShadow: '4px 0 24px rgba(23, 21, 30, 0.35)'
      }}
    >
      {/* TOP SECTION: Bitmela Logo + Color-Stick Expand/Collapse Arrow */}
      <div>
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-[#F4E7C7]/15 relative">
          
          {/* Logo Mark + Text */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            {/* Monad Loop Seal in Bitmela Saffron & Scarlet */}
            <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="20"
                  height="20"
                  rx="6"
                  transform="rotate(45 18 18)"
                  stroke="url(#sidebarMonadGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="sidebarMonadGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F2C23A" />
                    <stop offset="0.55" stopColor="#E23A2E" />
                    <stop offset="1" stopColor="#2677C9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Brand Title (Bitmela Editorial Display Typography) */}
            {isExpanded && (
              <div className="flex items-center tracking-tight overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                <span className="font-extrabold text-sm tracking-[0.1em] font-sans text-[#F4E7C7]">
                  MONAD<span className="text-[#E23A2E]">.PUMP</span>
                </span>
              </div>
            )}
          </div>

          {/* Color-Stick Glowing Arrow Button */}
          <button
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`
              relative flex items-center justify-center w-7 h-7 rounded-full
              bg-gradient-to-tr from-[#17151E] via-[#24212D] to-[#E23A2E]/60
              border-2 border-[#F2C23A] hover:border-[#E23A2E]
              text-[#F2C23A] hover:text-[#F4E7C7] shadow-md
              transition-all duration-300 active:scale-90 hover:scale-105
              ${isExpanded ? 'ml-auto' : 'mx-auto mt-0.5'}
            `}
          >
            {isExpanded ? (
              <ChevronsLeft className="w-4 h-4 stroke-[2.5] text-[#F2C23A] hover:text-[#FAF3E0] transition-colors" />
            ) : (
              <ChevronsRight className="w-4 h-4 stroke-[2.5] text-[#F2C23A] hover:text-[#FAF3E0] transition-colors" />
            )}
          </button>
        </div>

        {/* NAVIGATION MENU ITEMS */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar font-mono text-xs">
          
          {/* 1. Home */}
          <button
            onClick={() => onSelectTab('home')}
            title="Home"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              transition-all ${
                activeTab === 'home'
                  ? 'bg-[#F2C23A] text-[#17151E] font-bold shadow-sm'
                  : 'text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Home</span>}
          </button>

          {/* 2. Explore */}
          <button
            onClick={() => onSelectTab('explore')}
            title="Explore"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              transition-all ${
                activeTab === 'explore'
                  ? 'bg-[#F2C23A] text-[#17151E] font-bold shadow-sm'
                  : 'text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Explore</span>}
          </button>

          {/* 3. Leaderboard */}
          <button
            onClick={() => onSelectTab('leaderboard')}
            title="Leaderboard"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-[#F2C23A] text-[#17151E] font-bold shadow-sm'
                  : 'text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Leaderboard</span>}
          </button>

          {/* 4. Live Swaps */}
          <button
            onClick={() => onSelectTab('callouts')}
            title="Live"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              transition-all ${
                activeTab === 'callouts'
                  ? 'bg-[#F2C23A] text-[#17151E] font-bold'
                  : 'text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Radio className="w-4 h-4 flex-shrink-0 text-[#E23A2E]" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Live</span>
                <span className="w-2 h-2 rounded-full bg-[#E23A2E] animate-ping"></span>
              </span>
            )}
          </button>

          {/* Divider & Discover Section */}
          <div className="pt-2 pb-1">
            <div className="w-full h-[1px] bg-[#F4E7C7]/15 mb-2"></div>
            {isExpanded && (
              <div className="px-3 text-[10px] uppercase font-bold text-[#F2C23A] tracking-[0.14em]">
                Discover
              </div>
            )}
          </div>

          {/* 5. GO */}
          <button
            onClick={() => onSelectTab('terminal')}
            title="GO"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>GO</span>}
          </button>

          {/* 6. Mayhem (Speed trades) */}
          <button
            onClick={() => onSelectTab('terminal')}
            title="Mayhem"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Activity className="w-4 h-4 flex-shrink-0 text-[#2677C9]" />
            {isExpanded && <span>Mayhem</span>}
          </button>

          {/* 7. Holder Rewards */}
          <button
            onClick={onOpenHowItWorks}
            title="Holder rewards"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Coins className="w-4 h-4 flex-shrink-0 text-[#F2C23A]" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Rewards</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E23A2E] text-[#F4E7C7]">
                  New
                </span>
              </span>
            )}
          </button>

          {/* 8. $CHOG / $MON */}
          <button
            onClick={() => onSelectTab('home')}
            title="$CHOG"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
              text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Moon className="w-4 h-4 flex-shrink-0 text-[#F4E7C7]" />
            {isExpanded && <span>$CHOG</span>}
          </button>

          {/* + Create Button: Bitmela Solid Monospace CTA */}
          <div className="pt-2">
            {isExpanded ? (
              <button
                onClick={onOpenLaunchModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md mela-btn-red text-xs transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ LAUNCH COIN</span>
              </button>
            ) : (
              <button
                onClick={onOpenLaunchModal}
                title="Launch token"
                className="w-10 h-10 mx-auto rounded-md mela-btn-red flex items-center justify-center text-xs transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: Support, Terminal, Panels View Switcher */}
      <div className="p-2 border-t border-[#F4E7C7]/15 space-y-1 font-mono text-xs">
        
        {/* Support / Docs */}
        <button
          onClick={onOpenHowItWorks}
          title="Support & Docs"
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
            text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-colors
            ${!isExpanded ? 'justify-center px-0' : ''}
          `}
        >
          <Headphones className="w-4 h-4 flex-shrink-0" />
          {isExpanded && <span>Support</span>}
        </button>

        {/* Verified Contracts Modal Trigger */}
        <button
          onClick={onOpenContractsModal}
          title="Smart Contracts"
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
            text-[#F4E7C7]/70 hover:text-[#F4E7C7] hover:bg-[#F4E7C7]/10 transition-colors
            ${!isExpanded ? 'justify-center px-0' : ''}
          `}
        >
          <Code2 className="w-4 h-4 flex-shrink-0 text-[#F2C23A]" />
          {isExpanded && (
            <span className="flex items-center justify-between flex-1">
              <span>Contracts</span>
              <ExternalLink className="w-3 h-3 text-[#F4E7C7]/50" />
            </span>
          )}
        </button>

        {/* Panels Toggle (3-Column Terminal vs Grid View) */}
        <div className={`pt-1 flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center'}`}>
          {isExpanded && (
            <span className="text-xs text-[#F4E7C7]/70 font-semibold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              Panels
            </span>
          )}
          
          <div className="flex items-center gap-1 bg-[#24212D] p-1 rounded-md border border-[#F4E7C7]/20">
            <button
              onClick={() => onToggleViewMode('terminal')}
              title="Terminal 3-Column View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'terminal' ? 'bg-[#F2C23A] text-[#17151E]' : 'text-[#F4E7C7]/60 hover:text-[#F4E7C7]'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('grid')}
              title="Grid Cards View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#F2C23A] text-[#17151E]' : 'text-[#F4E7C7]/60 hover:text-[#F4E7C7]'
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
