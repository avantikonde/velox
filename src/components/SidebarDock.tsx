import React from 'react';
import { Sparkles, LayoutGrid, Columns3, MessageSquare, Trophy, Plus, HelpCircle, ShieldCheck } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarDockProps {
  currentTab: 'spotlight' | 'tokens' | 'terminal' | 'callouts' | 'leaderboard';
  onSelectTab: (tab: 'spotlight' | 'tokens' | 'terminal' | 'callouts' | 'leaderboard') => void;
  onOpenLaunchModal: () => void;
  onOpenHowItWorks: () => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({
  currentTab,
  onSelectTab,
  onOpenLaunchModal,
  onOpenHowItWorks
}) => {
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center">
      {/* Outer Floating Capsule Dock (Inspired by Image 2 Side Navigation) */}
      <div className="floating-dock-pill rounded-full p-2 flex flex-col items-center gap-2 shadow-2xl">
        
        {/* Launch "+" Quick Action */}
        <button
          onClick={onOpenLaunchModal}
          title="Launch Token in 1-Click"
          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-[#1F4B5D] to-[#68CFEB] text-[#1F1E19] shadow-lg shadow-[#68CFEB]/30 hover:scale-110 active:scale-95 transition-all mb-1"
        >
          <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="w-6 h-[1px] bg-white/10 my-0.5"></div>

        {/* 1. Terminal 3-Column View */}
        <button
          onClick={() => onSelectTab('terminal')}
          title="Terminal Multi-Column Feed"
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            currentTab === 'terminal'
              ? 'bg-[#68CFEB] text-[#1F1E19] shadow-md shadow-[#68CFEB]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Columns3 className="w-5 h-5" />
          {currentTab === 'terminal' && (
            <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-[#68CFEB] animate-ping" />
          )}
        </button>

        {/* 2. Tokens Grid View */}
        <button
          onClick={() => onSelectTab('tokens')}
          title="Tokens Grid View"
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            currentTab === 'tokens'
              ? 'bg-[#68CFEB] text-[#1F1E19] shadow-md shadow-[#68CFEB]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* 3. King of the Hill / Spotlight */}
        <button
          onClick={() => onSelectTab('spotlight')}
          title="King of the Hill Spotlight"
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            currentTab === 'spotlight'
              ? 'bg-[#68CFEB] text-[#1F1E19] shadow-md shadow-[#68CFEB]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* 4. Hot Callouts */}
        <button
          onClick={() => onSelectTab('callouts')}
          title="Hot Callouts & Trades Stream"
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            currentTab === 'callouts'
              ? 'bg-[#68CFEB] text-[#1F1E19] shadow-md shadow-[#68CFEB]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* 5. Leaderboard */}
        <button
          onClick={() => onSelectTab('leaderboard')}
          title="Leaderboard (Top Traders & Earners)"
          className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all ${
            currentTab === 'leaderboard'
              ? 'bg-[#68CFEB] text-[#1F1E19] shadow-md shadow-[#68CFEB]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Trophy className="w-5 h-5" />
        </button>

        <div className="w-6 h-[1px] bg-white/10 my-0.5"></div>

        {/* Info / Architecture */}
        <button
          onClick={onOpenHowItWorks}
          title="Protocol Mechanics & Architecture"
          className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-[#68CFEB] hover:bg-white/10 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

      </div>
    </aside>
  );
};
