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
  Smartphone, 
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
        bg-[#090e18]/95 backdrop-blur-2xl border-r border-white/10
        transition-all duration-300 ease-in-out select-none
        ${isExpanded ? 'w-[240px]' : 'w-[68px]'}
      `}
    >
      {/* TOP SECTION: Logo + Color-Stick Expand/Collapse Arrow */}
      <div>
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-white/5 relative">
          
          {/* Logo Mark + Text */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            {/* Authentic Monad Isometric Tilted Loop */}
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
                    <stop stopColor="#EB96FF" />
                    <stop offset="0.6" stopColor="#71f4a5" />
                    <stop offset="1" stopColor="#0B5777" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Brand Title (Visible when expanded) */}
            {isExpanded && (
              <div className="flex items-center tracking-wider overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                <span className="font-extrabold text-sm tracking-[0.12em] text-white">
                  monad<span className="text-[#EB96FF]">.pump</span>
                </span>
              </div>
            )}
          </div>

          {/* Theme Color-Stick Glowing Arrow Button */}
          <button
            onClick={onToggleExpand}
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`
              relative flex items-center justify-center w-7 h-7 rounded-full
              bg-gradient-to-tr from-[#193153] via-[#0B5777] to-[#EB96FF]/40
              border border-[#EB96FF]/40 hover:border-[#EB96FF]
              text-[#EB96FF] hover:text-white shadow-md shadow-[#EB96FF]/20
              transition-all duration-300 active:scale-90 hover:scale-105
              ${isExpanded ? 'ml-auto' : 'mx-auto mt-0.5'}
            `}
          >
            {/* Color-Stick Arrow Direction */}
            {isExpanded ? (
              <ChevronsLeft className="w-4 h-4 stroke-[2.5] text-[#EB96FF] hover:text-[#F9D4E0] transition-colors" />
            ) : (
              <ChevronsRight className="w-4 h-4 stroke-[2.5] text-[#EB96FF] hover:text-[#F9D4E0] transition-colors" />
            )}
          </button>
        </div>

        {/* NAVIGATION MENU ITEMS (Matching Image 1 & Image 2) */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
          
          {/* 1. Home */}
          <button
            onClick={() => onSelectTab('home')}
            title="Home"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              transition-all ${
                activeTab === 'home'
                  ? 'bg-white/10 text-white font-bold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              transition-all ${
                activeTab === 'explore'
                  ? 'bg-white/10 text-white font-bold border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white/10 text-white font-bold border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>Leaderboard</span>}
          </button>

          {/* 4. Live / Callouts */}
          <button
            onClick={() => onSelectTab('callouts')}
            title="Live"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              transition-all ${
                activeTab === 'callouts'
                  ? 'bg-white/10 text-white font-bold border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Radio className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
            )}
          </button>

          {/* Divider & Discover Section (Image 1 Format) */}
          <div className="pt-2 pb-1">
            <div className="w-full h-[1px] bg-white/10 mb-2"></div>
            {isExpanded && (
              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Discover
              </div>
            )}
          </div>

          {/* 5. GO */}
          <button
            onClick={() => onSelectTab('terminal')}
            title="GO"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              text-slate-400 hover:text-white hover:bg-white/5 transition-all
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
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              text-slate-400 hover:text-white hover:bg-white/5 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Activity className="w-4 h-4 flex-shrink-0 text-[#EB96FF]" />
            {isExpanded && <span>Mayhem</span>}
          </button>

          {/* 7. Holder Rewards (With 'New' badge) */}
          <button
            onClick={onOpenHowItWorks}
            title="Holder rewards"
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              text-slate-400 hover:text-white hover:bg-white/5 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Coins className="w-4 h-4 flex-shrink-0 text-amber-300" />
            {isExpanded && (
              <span className="flex items-center justify-between flex-1">
                <span>Holder rewards</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
              text-slate-400 hover:text-white hover:bg-white/5 transition-all
              ${!isExpanded ? 'justify-center px-0' : ''}
            `}
          >
            <Moon className="w-4 h-4 flex-shrink-0 text-[#F9D4E0]" />
            {isExpanded && <span>$CHOG</span>}
          </button>

          {/* + Create Button (Matching Image 1 & Image 2) */}
          <div className="pt-2">
            {isExpanded ? (
              <button
                onClick={onOpenLaunchModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#71f4a5] hover:bg-[#5de091] text-[#070c16] font-bold text-xs shadow-lg shadow-[#71f4a5]/20 active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create</span>
              </button>
            ) : (
              <button
                onClick={onOpenLaunchModal}
                title="Create token"
                className="w-10 h-10 mx-auto rounded-xl bg-[#71f4a5] hover:bg-[#5de091] text-[#070c16] flex items-center justify-center font-bold shadow-lg shadow-[#71f4a5]/20 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: Support, Terminal, Panels View Switcher */}
      <div className="p-2 border-t border-white/5 space-y-1">
        
        {/* Support / Docs */}
        <button
          onClick={onOpenHowItWorks}
          title="Support & Docs"
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
            text-slate-400 hover:text-white hover:bg-white/5 transition-colors
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
            w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold
            text-slate-400 hover:text-white hover:bg-white/5 transition-colors
            ${!isExpanded ? 'justify-center px-0' : ''}
          `}
        >
          <Code2 className="w-4 h-4 flex-shrink-0 text-[#EB96FF]" />
          {isExpanded && (
            <span className="flex items-center justify-between flex-1">
              <span>Contracts</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </span>
          )}
        </button>

        {/* Panels Toggle (3-Column Terminal vs Grid View) */}
        <div className={`pt-1 flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center'}`}>
          {isExpanded && (
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              Panels
            </span>
          )}
          
          <div className="flex items-center gap-1 bg-[#121927] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => onToggleViewMode('terminal')}
              title="Terminal 3-Column View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'terminal' ? 'bg-[#EB96FF] text-[#070c16]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('grid')}
              title="Grid Cards View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#EB96FF] text-[#070c16]' : 'text-slate-400 hover:text-white'
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
