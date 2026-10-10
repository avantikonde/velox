import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, Gift, Share2, Check, ArrowRight, Shield, Zap, Users, Flame, Clock } from 'lucide-react';
import { ChainConfig } from '../data/chains';
import { neonService } from '../services/neonService';
import confetti from 'canvas-confetti';

interface RewardsViewProps {
  userAddress: string;
  activeChain: ChainConfig;
  onOpenLaunchModal: () => void;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const RewardsView: React.FC<RewardsViewProps> = ({
  userAddress,
  activeChain,
  onOpenLaunchModal
}) => {
  const accountKey = userAddress ? userAddress.toLowerCase() : 'default_trader';

  // Helpers to read persisted rewards data
  const getPersistedPoints = (): number => {
    try {
      const val = localStorage.getItem(`velox_rewards_points_${accountKey}`);
      return val ? parseInt(val, 10) : 4250;
    } catch {
      return 4250;
    }
  };

  const getPersistedStreak = (): number => {
    try {
      const val = localStorage.getItem(`velox_rewards_streak_${accountKey}`);
      return val ? parseInt(val, 10) : 7;
    } catch {
      return 7;
    }
  };

  const getPersistedLastClaim = (): number => {
    try {
      const val = localStorage.getItem(`velox_rewards_last_claim_${accountKey}`);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  };

  const [points, setPoints] = useState<number>(getPersistedPoints);
  const [streakDays, setStreakDays] = useState<number>(getPersistedStreak);
  const [claimedToday, setClaimedToday] = useState<boolean>(() => {
    const lastClaim = getPersistedLastClaim();
    return lastClaim > 0 && Date.now() - lastClaim < TWENTY_FOUR_HOURS_MS;
  });
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(() => {
    const lastClaim = getPersistedLastClaim();
    if (lastClaim <= 0) return 0;
    const elapsed = Date.now() - lastClaim;
    return elapsed < TWENTY_FOUR_HOURS_MS ? TWENTY_FOUR_HOURS_MS - elapsed : 0;
  });
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync state whenever active account changes & fetch from Neon PostgreSQL
  useEffect(() => {
    setPoints(getPersistedPoints());
    setStreakDays(getPersistedStreak());

    neonService.getRewards(accountKey).then((cloudRewards) => {
      if (cloudRewards && cloudRewards.points) {
        setPoints(cloudRewards.points);
        setStreakDays(cloudRewards.streak);
        localStorage.setItem(`velox_rewards_points_${accountKey}`, cloudRewards.points.toString());
        localStorage.setItem(`velox_rewards_streak_${accountKey}`, cloudRewards.streak.toString());
        if (cloudRewards.lastClaim) {
          localStorage.setItem(`velox_rewards_last_claim_${accountKey}`, cloudRewards.lastClaim.toString());
        }
      }
    }).catch(err => console.warn('Neon getRewards sync:', err));
  }, [accountKey]);

  // Real-time 1-second countdown timer enforcing exact 24-hour interval
  useEffect(() => {
    const updateCountdown = () => {
      const lastClaim = getPersistedLastClaim();
      if (!lastClaim) {
        setClaimedToday(false);
        setTimeRemainingMs(0);
        return;
      }

      const elapsed = Date.now() - lastClaim;
      if (elapsed < TWENTY_FOUR_HOURS_MS) {
        setClaimedToday(true);
        setTimeRemainingMs(TWENTY_FOUR_HOURS_MS - elapsed);
      } else {
        setClaimedToday(false);
        setTimeRemainingMs(0);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [accountKey]);

  const handleClaimDailyStreak = () => {
    const lastClaim = getPersistedLastClaim();
    const elapsed = Date.now() - lastClaim;

    // Strict 24-hour enforcement: Prevent duplicate claims
    if (lastClaim > 0 && elapsed < TWENTY_FOUR_HOURS_MS) {
      return;
    }

    const newPoints = points + 50;
    // Streak increments if claimed within 48h (or first claim); resets if missed >48h
    const newStreak = (lastClaim > 0 && elapsed <= 48 * 60 * 60 * 1000) 
      ? streakDays + 1 
      : (lastClaim === 0 ? streakDays + 1 : 1);
    const nowMs = Date.now();

    setPoints(newPoints);
    setStreakDays(newStreak);
    setClaimedToday(true);
    setTimeRemainingMs(TWENTY_FOUR_HOURS_MS);

    // Persist to localStorage across all views, refreshes, and tabs
    try {
      localStorage.setItem(`velox_rewards_points_${accountKey}`, newPoints.toString());
      localStorage.setItem(`velox_rewards_streak_${accountKey}`, newStreak.toString());
      localStorage.setItem(`velox_rewards_last_claim_${accountKey}`, nowMs.toString());
    } catch (e) {
      console.warn('Could not persist rewards claim:', e);
    }

    // Persist to Neon PostgreSQL Cloud Database
    neonService.saveRewards(accountKey, newPoints, newStreak, nowMs).catch(err => console.warn('Neon saveRewards:', err));

    // Celebration confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#68CFEB', '#FFD700', '#1F4B5D']
    });
  };

  const formatCountdown = (ms: number): string => {
    if (ms <= 0) return '00h 00m 00s';
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const referralLink = `https://velox.trade/ref/${userAddress.slice(0, 8)}`;

  const handleCopyRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>VELOX</span>
            <span>/</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              Rewards & Airdrop
            </span>
            <span>/</span>
            <span className="text-slate-500">Season 1 Genesis</span>
          </div>
          <h1 className="text-2xl font-black text-[#FAFAFA] flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400" />
            Velox Rewards & Season 1 Airdrop
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn velocity points for every multi-chain swap, fair-launch creation, and daily active streak.
          </p>
        </div>

        {/* Total Points Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-[#1F4B5D]/60 to-[#1F1E19] border border-[#68CFEB]/40 font-mono">
          <div className="w-9 h-9 rounded-xl bg-[#68CFEB]/20 text-[#68CFEB] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Your Balance</div>
            <div className="text-lg font-black text-[#68CFEB]">
              {points.toLocaleString()} <span className="text-xs font-normal text-slate-300">PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-mono">Loyalty Tier</span>
          <div className="text-lg font-extrabold text-[#68CFEB] flex items-center gap-1.5">
            <span>💎 Velocity Diamond</span>
          </div>
          <p className="text-[11px] text-slate-500">Top 5% active platform traders</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-mono">Trading Fee Rebate</span>
          <div className="text-lg font-extrabold text-emerald-400">
            15% Cashback
          </div>
          <p className="text-[11px] text-slate-500">Credited automatically in real-time</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-mono">Est. $VLX Genesis Allocation</span>
          <div className="text-lg font-extrabold text-amber-300 font-mono">
            ~12,500 VLX
          </div>
          <p className="text-[11px] text-slate-500">Snapshot scheduled upon Mainnet launch</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-1">
          <span className="text-xs text-slate-400 font-mono">Active Chain</span>
          <div className="text-lg font-extrabold text-[#FAFAFA] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeChain.iconColor }}></span>
            {activeChain.name}
          </div>
          <p className="text-[11px] text-slate-500">{activeChain.tps} speed rewards multiplier (1.5x)</p>
        </div>

      </div>

      {/* Daily Streak & Referral Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Daily Streak Box */}
        <div className="p-5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-mono font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {streakDays}-Day Daily Streak
              </span>
              <span className="text-xs font-mono text-slate-400">+50 PTS / Day</span>
            </div>
            <h3 className="text-lg font-bold text-[#FAFAFA]">Daily Velocity Check-in</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log in and execute transactions daily on the parallel bonding curve to keep your bonus multiplier high.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={handleClaimDailyStreak}
              disabled={claimedToday}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 font-mono ${
                claimedToday
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#141310] shadow-md shadow-[#68CFEB]/20 active:scale-95'
              }`}
            >
              {claimedToday ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Claimed for Today (+50 PTS)</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Claim Daily Streak (+50 PTS)</span>
                </>
              )}
            </button>

            {/* 24-Hour Countdown & Streak Info Bar */}
            {claimedToday ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141310] border border-emerald-500/20 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#68CFEB] animate-pulse" />
                  <span className="text-[11px]">Next check-in unlocks in:</span>
                </div>
                <span className="font-bold text-[#68CFEB] text-[11px]">
                  {formatCountdown(timeRemainingMs)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] text-[11px] font-mono text-slate-400">
                <span>Available to claim today</span>
                <span className="text-emerald-400 font-bold">● Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Referral Program Box */}
        <div className="p-5 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1F4B5D]/60 text-[#68CFEB] border border-[#68CFEB]/30 text-xs font-mono font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Referral Program
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">20% Friend Fee Share</span>
            </div>
            <h3 className="text-lg font-bold text-[#FAFAFA]">Invite Traders, Earn Royalties</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your link. You earn 20% of trading fees generated by friends across all chains, paid instantly.
            </p>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#25241E] border border-white/10 font-mono text-xs">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="bg-transparent text-slate-300 px-2 flex-1 focus:outline-none select-all text-[11px]"
              />
              <button
                onClick={handleCopyRef}
                className="px-3 py-1.5 rounded-lg bg-[#68CFEB] hover:bg-[#58BFDB] text-[#141310] font-bold text-[11px] transition-all flex items-center gap-1 flex-shrink-0"
              >
                {copiedRef ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedRef ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Season 1 Quests & Milestones */}
      <div className="rounded-2xl bg-[#1F1E19] border border-white/[0.08] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#68CFEB]" />
            <h3 className="font-bold text-sm text-[#FAFAFA]">Season 1 Airdrop Quests</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Complete quests to climb leaderboards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          
          <div className="p-3.5 rounded-xl bg-[#25241E] border border-emerald-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-[#FAFAFA] flex items-center gap-2">
                <span>Multi-Chain Pioneer</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Completed</span>
              </div>
              <p className="text-[11px] text-slate-400">Swap tokens across 2+ different blockchains</p>
            </div>
            <span className="font-bold text-emerald-400">+250 PTS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#25241E] border border-emerald-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-[#FAFAFA] flex items-center gap-2">
                <span>FairSlot Genesis Defender</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Completed</span>
              </div>
              <p className="text-[11px] text-slate-400">Execute a trade protected by the 60s Anti-Sniper Shield</p>
            </div>
            <span className="font-bold text-emerald-400">+300 PTS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#25241E] border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-[#FAFAFA] flex items-center gap-2">
                <span>King of the Hill Supporter</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">In Progress</span>
              </div>
              <p className="text-[11px] text-slate-400">Buy or hold $CHOG or the current featured King coin</p>
            </div>
            <span className="font-bold text-[#68CFEB]">+150 PTS</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#25241E] border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-[#FAFAFA] flex items-center gap-2">
                <span>Launch Pad Creator</span>
              </div>
              <p className="text-[11px] text-slate-400">Deploy your own bonding curve meme coin</p>
            </div>
            <button
              onClick={onOpenLaunchModal}
              className="px-2.5 py-1 rounded-lg bg-[#68CFEB]/20 text-[#68CFEB] hover:bg-[#68CFEB]/40 border border-[#68CFEB]/30 font-bold text-[11px] transition-colors"
            >
              +500 PTS 🚀
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

