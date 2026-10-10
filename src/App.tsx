import React, { useState, useEffect, useCallback } from 'react';
import { PumpSidebar } from './components/PumpSidebar';
import { PumpTopHeader } from './components/PumpTopHeader';
import { KingOfTheHill } from './components/KingOfTheHill';
import { TokenCard } from './components/TokenCard';
import { PumpTerminal } from './components/PumpTerminal';
import { LeaderboardView } from './components/LeaderboardView';
import { LiveFeedView } from './components/LiveFeedView';
import { RewardsView } from './components/RewardsView';
import { LaunchModal } from './components/LaunchModal';
import { TradeModal } from './components/TradeModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { AuthModal } from './components/AuthModal';
import { SimpleInteractiveBackground } from './components/SimpleInteractiveBackground';
import { INITIAL_TOKENS, MOCK_HOT_CALLOUTS, MOCK_LEADERBOARD } from './data/mockTokens';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN, ChainConfig } from './data/chains';
import { Token, Trade, WalletState, ViewMode, HotCallout, LeaderboardEntry, User, NavigationTab } from './types';
import { authService } from './services/authService';
import { neonService } from './services/neonService';
import { Search, Flame, Sparkles, Trophy, CheckCircle, Code2, Compass } from 'lucide-react';

const VALID_TABS: NavigationTab[] = ['home', 'explore', 'leaderboard', 'live-feed', 'terminal', 'rewards'];

const loadInitialTokens = (): Token[] => {
  try {
    const saved = localStorage.getItem('velox_community_tokens');
    if (saved) {
      const customTokens: Token[] = JSON.parse(saved);
      const customIds = new Set(customTokens.map(t => t.id));
      const filteredInitial = INITIAL_TOKENS.filter(t => !customIds.has(t.id));
      return [...customTokens, ...filteredInitial];
    }
  } catch (e) {
    console.warn('Failed to parse saved tokens:', e);
  }
  return INITIAL_TOKENS;
};

export const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>(loadInitialTokens);
  const [callouts, setCallouts] = useState<HotCallout[]>(MOCK_HOT_CALLOUTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'graduating' | 'graduated'>('trending');
  
  // Multi-Chain State
  const [activeChain, setActiveChain] = useState<ChainConfig>(DEFAULT_CHAIN);
  const [chainBalances, setChainBalances] = useState<Record<string, number>>({
    monad: 25.0,
    ethereum: 4.8,
    solana: 38.5,
    base: 1.25,
    arbitrum: 320.0
  });

  // URL Hash Routing
  const getInitialTab = (): NavigationTab => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      if (hash === ('callouts' as any)) return 'live-feed';
      if (VALID_TABS.includes(hash)) return hash;
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);

  // Sync hash routing on browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      if (hash === ('callouts' as any)) {
        setActiveTab('live-feed');
      } else if (VALID_TABS.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch cloud tokens from Neon PostgreSQL on startup
  useEffect(() => {
    neonService.getCommunityTokens().then((dbTokens) => {
      if (dbTokens && dbTokens.length > 0) {
        setTokens(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const newFromDb = dbTokens.filter(t => !existingIds.has(t.id));
          if (newFromDb.length === 0) return prev;
          return [...newFromDb, ...prev];
        });
      }
    }).catch(err => {
      console.warn('Neon getCommunityTokens initial load:', err);
    });
  }, []);

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Left Sidebar Expand/Collapse State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Wallet State
  const currentChainBal = chainBalances[activeChain.id] ?? 25.0;
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    monBalance: currentChainBal,
    tokens: {
      'dogecoin': 15000,
      'pepe': 5000000,
      'shiba-inu': 20000000
    }
  });

  // Keep wallet monBalance in sync with activeChain balance
  useEffect(() => {
    setWallet(prev => ({
      ...prev,
      monBalance: chainBalances[activeChain.id] ?? 25.0
    }));
  }, [activeChain.id, chainBalances]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showContractsModal, setShowContractsModal] = useState(false);

  // Live Trades
  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: 'tx-1',
      tokenId: 'dogecoin',
      tokenSymbol: 'DOGE',
      tokenImageUrl: INITIAL_TOKENS[0].imageUrl,
      type: 'BUY',
      user: '0x84f...19e',
      monAmount: 2.5,
      tokenAmount: 29070,
      timestamp: 'Just now',
      txHash: '0x918f...28b',
      latencyMs: 780,
      currencySymbol: 'SOL'
    },
    {
      id: 'tx-2',
      tokenId: 'pepe',
      tokenSymbol: 'PEPE',
      tokenImageUrl: INITIAL_TOKENS[1].imageUrl,
      type: 'BUY',
      user: '0x32a...49f',
      monAmount: 1.2,
      tokenAmount: 298500000,
      timestamp: '1m ago',
      txHash: '0x38fa...99a',
      latencyMs: 812,
      currencySymbol: 'ETH'
    },
    {
      id: 'tx-3',
      tokenId: 'shiba-inu',
      tokenSymbol: 'SHIB',
      tokenImageUrl: INITIAL_TOKENS[2].imageUrl,
      type: 'SELL',
      user: '0x12c...aa8',
      monAmount: 0.85,
      tokenAmount: 155900000,
      timestamp: '2m ago',
      txHash: '0x44bf...11c',
      latencyMs: 745,
      currencySymbol: 'ETH'
    }
  ]);

  // Simulate continuous high-throughput trade activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokens.length === 0) return;
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      const isBuy = Math.random() > 0.3;
      const monAmt = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
      const tokenAmt = Math.round(monAmt / randomToken.priceMon);
      const latency = Math.floor(Math.random() * 140 + 740);

      const newTrade: Trade = {
        id: `tx-${Date.now()}`,
        tokenId: randomToken.id,
        tokenSymbol: randomToken.symbol,
        tokenImageUrl: randomToken.imageUrl,
        type: isBuy ? 'BUY' : 'SELL',
        user: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 5)}`,
        monAmount: monAmt,
        tokenAmount: tokenAmt,
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        latencyMs: latency,
        currencySymbol: randomToken.chainSymbol || activeChain.symbol
      };

      setRecentTrades(prev => [newTrade, ...prev.slice(0, 15)]);

      // Dynamically update bonding curve metrics
      setTokens(prev => prev.map(t => {
        if (t.id === randomToken.id) {
          const newMonRaised = t.monRaised + (isBuy ? monAmt : -monAmt * 0.5);
          const progress = Math.min(100, Math.round((newMonRaised / t.monTarget) * 100));
          return {
            ...t,
            monRaised: Math.max(0, newMonRaised),
            bondingProgress: progress,
            isGraduated: progress >= 100,
            marketCapMon: parseFloat((t.marketCapMon + (isBuy ? monAmt : -monAmt * 0.5)).toFixed(1)),
            priceChange24h: parseFloat((t.priceChange24h + (isBuy ? 1.4 : -1.1)).toFixed(1))
          };
        }
        return t;
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [tokens, activeChain.symbol]);

  // Real-time live price tracking across all coins (DOGE, PEPE, SHIB, BONK, FLOKI, FAIR)
  useEffect(() => {
    const liveTracker = setInterval(() => {
      setTokens(prevTokens => prevTokens.map(token => {
        // Micro-fluctuation between -0.3% and +0.3% to simulate live orderbook flow
        const jitterRatio = (Math.random() - 0.49) * 0.005;
        const currentUsd = token.usdPrice ?? token.priceMon;
        const newUsdPrice = Math.max(0.00000001, currentUsd * (1 + jitterRatio));
        const newPriceMon = token.priceMon * (1 + jitterRatio);
        
        // Update 24h change & volume
        const newChange24h = parseFloat((token.priceChange24h + jitterRatio * 15).toFixed(2));
        const addedVol = Math.floor(Math.random() * 450 + 50);
        const newVol24h = token.volume24h + addedVol;
        const newUsdVol = (token.usd24hVol ?? 0) + addedVol * 5;

        // Recalculate market caps
        const newMarketCapMon = parseFloat((token.marketCapMon * (1 + jitterRatio)).toFixed(1));
        const newUsdMarketCap = token.usdMarketCap ? Math.round(token.usdMarketCap * (1 + jitterRatio)) : undefined;

        // Append to sparkline7d for real-time live charting
        let newSparkline = token.sparkline7d;
        if (token.sparkline7d && token.sparkline7d.length > 0) {
          const sparkCopy = [...token.sparkline7d];
          // Update the last point with current price
          sparkCopy[sparkCopy.length - 1] = newUsdPrice;
          newSparkline = sparkCopy;
        }

        return {
          ...token,
          usdPrice: newUsdPrice,
          priceMon: newPriceMon,
          priceChange24h: newChange24h,
          volume24h: newVol24h,
          usd24hVol: newUsdVol,
          marketCapMon: newMarketCapMon,
          usdMarketCap: newUsdMarketCap,
          sparkline7d: newSparkline
        };
      }));
    }, 2500);

    return () => clearInterval(liveTracker);
  }, []);

  // Real-time countdown timer for Anti-Sniper Shield active tokens
  useEffect(() => {
    const shieldTimer = setInterval(() => {
      setTokens(prev => {
        let hasActiveShield = false;
        const updated = prev.map(t => {
          if (t.shieldActive && (t.shieldRemainingSeconds ?? 0) > 0) {
            hasActiveShield = true;
            const remaining = (t.shieldRemainingSeconds ?? 0) - 1;
            return {
              ...t,
              shieldRemainingSeconds: remaining,
              shieldActive: remaining > 0
            };
          }
          return t;
        });
        return hasActiveShield ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(shieldTimer);
  }, []);

  const handleOpenConnectWallet = () => {
    setIsConnectWalletOpen(true);
  };

  const handleWalletConnected = (newWallet: Partial<WalletState>) => {
    setWallet(prev => ({
      ...prev,
      ...newWallet,
      isConnected: true
    }));
  };

  const handleDisconnectWallet = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: false
    }));
  };

  const claimFaucet = () => {
    const added = activeChain.faucetAmount;
    setChainBalances(prev => ({
      ...prev,
      [activeChain.id]: (prev[activeChain.id] ?? 0) + added
    }));
  };

  const handleOpenLaunchModal = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setIsLaunchOpen(true);
  };

  const handleLaunchToken = (newToken: Token, initialBuyMon: number) => {
    const tokenWithShield: Token = {
      ...newToken,
      shieldActive: true,
      shieldRemainingSeconds: 60,
      maxShieldBuyMon: 0.5,
      chain: activeChain.id,
      chainSymbol: activeChain.symbol
    };

    if (initialBuyMon > 0) {
      setChainBalances(prev => ({
        ...prev,
        [activeChain.id]: Math.max(0, (prev[activeChain.id] ?? 0) - initialBuyMon)
      }));
      setWallet(prev => ({
        ...prev,
        tokens: {
          ...prev.tokens,
          [tokenWithShield.id]: Math.round(initialBuyMon / tokenWithShield.priceMon)
        }
      }));
    }

    // Persist to community tokens so collaborators & all sessions can view it
    try {
      const saved = JSON.parse(localStorage.getItem('velox_community_tokens') || '[]');
      const updated = [tokenWithShield, ...saved];
      localStorage.setItem('velox_community_tokens', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not persist token:', err);
    }

    // Persist to Neon PostgreSQL Cloud Database
    neonService.saveToken(tokenWithShield).catch(err => console.warn('Neon saveToken:', err));

    setTokens(prev => [tokenWithShield, ...prev]);
    setSelectedToken(tokenWithShield);
  };

  const handleExecuteTrade = (tokenId: string, type: 'BUY' | 'SELL', monAmount: number, tokenAmount: number) => {
    setChainBalances(prev => {
      const current = prev[activeChain.id] ?? 0;
      return {
        ...prev,
        [activeChain.id]: type === 'BUY' ? Math.max(0, current - monAmount) : current + monAmount
      };
    });

    setWallet(prev => {
      const currentTokenBal = prev.tokens[tokenId] || 0;
      return {
        ...prev,
        tokens: {
          ...prev.tokens,
          [tokenId]: type === 'BUY' ? currentTokenBal + tokenAmount : Math.max(0, currentTokenBal - tokenAmount)
        }
      };
    });

    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        const delta = type === 'BUY' ? monAmount : -monAmount;
        const newRaised = Math.max(0, t.monRaised + delta);
        const newProgress = Math.min(100, Math.round((newRaised / t.monTarget) * 100));
        return {
          ...t,
          monRaised: newRaised,
          bondingProgress: newProgress,
          isGraduated: newProgress >= 100,
          marketCapMon: parseFloat((t.marketCapMon + delta).toFixed(1)),
          priceChange24h: parseFloat((t.priceChange24h + (type === 'BUY' ? 4.2 : -3.8)).toFixed(1))
        };
      }
      return t;
    }));

    const activeTok = tokens.find(t => t.id === tokenId);
    if (activeTok) {
      const now = Date.now();
      const newTrade: Trade = {
        id: `tx-${now}`,
        tokenId,
        tokenSymbol: activeTok.symbol,
        tokenImageUrl: activeTok.imageUrl,
        type,
        user: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
        monAmount,
        tokenAmount,
        timestamp: 'Just now',
        timestampMs: now,
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        latencyMs: 792,
        currencySymbol: activeTok.chainSymbol || activeChain.symbol
      };
      setRecentTrades(prev => [newTrade, ...prev.slice(0, 15)]);

      // Persist to Neon PostgreSQL Cloud Database
      neonService.saveTrade(newTrade).catch(err => console.warn('Neon saveTrade:', err));
    }
  };

  const filteredTokens = tokens.filter(tok => {
    const matchesSearch = 
      tok.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'new') return tok.createdAt.includes('now') || tok.createdAt.includes('m ago');
    if (activeFilter === 'graduating') return tok.bondingProgress >= 60 && !tok.isGraduated;
    if (activeFilter === 'graduated') return tok.isGraduated;
    return true;
  });

  const kingOfTheHillToken = tokens.find(t => t.id === 'dogecoin') || tokens[0] || INITIAL_TOKENS[0];

  return (
    <div className="min-h-screen flex bg-[#141310] clean-grid-bg text-[#FAFAFA] relative overflow-x-hidden font-sans">
      
      {/* Advanced Simple Interactive Background */}
      <SimpleInteractiveBackground />

      {/* LEFT SIDEBAR: Collapsible */}
      <PumpSidebar
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenLaunchModal={handleOpenLaunchModal}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenContractsModal={() => setShowContractsModal(true)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* RIGHT MAIN CONTENT AREA */}
      <div 
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'pl-[220px]' : 'pl-[64px]'}
        `}
      >
        
        {/* TOP BAR: Clean Minimalist Top Strip with Multi-Chain Selector */}
        <PumpTopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenLaunchModal={handleOpenLaunchModal}
          onOpenAuthModal={() => setIsAuthOpen(true)}
          onClaimFaucet={claimFaucet}
          currentUser={currentUser}
          onLogout={() => {
            authService.logout();
            setCurrentUser(null);
          }}
          wallet={wallet}
          onConnectWallet={handleOpenConnectWallet}
          activeChain={activeChain}
          onSelectChain={setActiveChain}
        />

        {/* Real-time Ticker: Compact Live Swaps Bar */}
        <LiveActivityTicker
          recentTrades={recentTrades}
          tokens={tokens}
          onSelectToken={(t) => setSelectedToken(t)}
        />

        {/* Hero: King of the Hill Spotlight Card (SHOWN ONLY ON HOME TAB) */}
        {activeTab === 'home' && (
          <KingOfTheHill
            token={tokens.find(t => t.id === kingOfTheHillToken.id) || kingOfTheHillToken}
            onSelectToken={(t) => setSelectedToken(t)}
            onQuickBuy={(t) => setSelectedToken(t)}
            currencySymbol={activeChain.symbol}
          />
        )}

        {/* Main Content Router Viewport */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1">
          
          {/* 1. LEADERBOARD ROUTE */}
          {activeTab === 'leaderboard' && (
            <LeaderboardView
              leaderboard={leaderboard}
              currencySymbol={activeChain.symbol}
              activeChain={activeChain}
              onSelectTokenSymbol={(sym) => {
                const tok = tokens.find(t => t.symbol === sym);
                if (tok) setSelectedToken(tok);
              }}
            />
          )}

          {/* 2. LIVE FEED ROUTE */}
          {activeTab === 'live-feed' && (
            <LiveFeedView
              recentTrades={recentTrades}
              tokens={tokens}
              callouts={callouts}
              activeChain={activeChain}
              currencySymbol={activeChain.symbol}
              onSelectToken={(tok) => setSelectedToken(tok)}
            />
          )}

          {/* 3. TERMINAL ROUTE */}
          {activeTab === 'terminal' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>VELOX</span>
                  <span>/</span>
                  <span className="text-[#68CFEB] font-semibold">Pro Terminal</span>
                  <span>/</span>
                  <span>{activeChain.name}</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  ● Real-Time Pipelining
                </span>
              </div>
              <PumpTerminal
                tokens={filteredTokens}
                callouts={callouts}
                leaderboard={leaderboard}
                onSelectToken={(t) => setSelectedToken(t)}
                onOpenLaunchModal={handleOpenLaunchModal}
                currencySymbol={activeChain.symbol}
              />
            </div>
          )}

          {/* 4. REWARDS ROUTE */}
          {activeTab === 'rewards' && (
            <RewardsView
              userAddress={wallet.address}
              activeChain={activeChain}
              onOpenLaunchModal={handleOpenLaunchModal}
            />
          )}

          {/* 5. HOME & EXPLORE ROUTES (TOKEN DISCOVERY MATRIX) */}
          {(activeTab === 'home' || activeTab === 'explore') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Explore Header (Only on Explore tab) */}
              {activeTab === 'explore' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                      <span>VELOX</span>
                      <span>/</span>
                      <span className="text-[#68CFEB] font-semibold">Explore</span>
                    </div>
                    <h1 className="text-2xl font-black text-[#FAFAFA] flex items-center gap-2">
                      <Compass className="w-6 h-6 text-[#68CFEB]" />
                      Explore All Coins
                    </h1>
                    <p className="text-xs text-slate-400">
                      Discover new bonding curve coins launched across all supported blockchains.
                    </p>
                  </div>
                </div>
              )}

              {/* Controls: Filter Tabs in Grid View */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1F1E19] border border-white/[0.08] overflow-x-auto text-xs font-medium">
                  <button
                    onClick={() => setActiveFilter('trending')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'trending' ? 'bg-[#68CFEB] text-[#1F1E19] shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending
                  </button>
                  <button
                    onClick={() => setActiveFilter('new')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'new' ? 'bg-[#68CFEB] text-[#1F1E19] shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Newly Launched
                  </button>
                  <button
                    onClick={() => setActiveFilter('graduating')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'graduating' ? 'bg-[#68CFEB] text-[#1F1E19] shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-300" /> Near Graduation (60%+)
                  </button>
                  <button
                    onClick={() => setActiveFilter('graduated')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'graduated' ? 'bg-[#68CFEB] text-[#1F1E19] shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Graduated
                  </button>
                </div>

                {/* Search in Grid */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter coin or symbol..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#25241E] border border-white/[0.08] text-[#FAFAFA] placeholder-slate-400 text-xs focus:outline-none focus:border-[#68CFEB] transition-colors"
                  />
                </div>

              </div>

              {/* Tokens Grid */}
              {filteredTokens.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {filteredTokens.map((token) => (
                    <TokenCard
                      key={token.id}
                      token={token}
                      onSelect={(tok) => setSelectedToken(tok)}
                      currencySymbol={activeChain.symbol}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-2xl bg-[#1F1E19] border border-white/[0.08] space-y-4 mb-10">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#25241E] flex items-center justify-center text-[#68CFEB]">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#FAFAFA]">No tokens matched</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Be the first to launch a token for this keyword on the bonding curve!
                  </p>
                  <button 
                    onClick={handleOpenLaunchModal} 
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] text-xs font-extrabold transition-all active:scale-95 shadow-md shadow-[#68CFEB]/20 inline-block"
                  >
                    Launch Coin 🚀
                  </button>
                </div>
              )}
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] bg-[#1F1E19]/90 py-6 mt-10 text-xs text-slate-400">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#FAFAFA]">VELOX ⚡</span>
              <span>— Multi-Chain Instant Fair-Launchpad & DEX</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Active: {activeChain.name} ({activeChain.symbol})</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{activeChain.tps}</span>
              <span>•</span>
              <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-white transition-colors">
                Architecture & Docs
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <LaunchModal
        isOpen={isLaunchOpen}
        onClose={() => setIsLaunchOpen(false)}
        onLaunch={handleLaunchToken}
        userBalance={wallet.monBalance}
        currencySymbol={activeChain.symbol}
        chainName={activeChain.name}
        wallet={wallet}
        onOpenConnectWallet={handleOpenConnectWallet}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        chainConfig={activeChain}
      />

      <TradeModal
        token={selectedToken}
        isOpen={Boolean(selectedToken)}
        onClose={() => setSelectedToken(null)}
        wallet={wallet}
        onExecuteTrade={handleExecuteTrade}
        currencySymbol={activeChain.symbol}
        onOpenConnectWallet={handleOpenConnectWallet}
        chainConfig={activeChain}
      />

      <ConnectWalletModal
        isOpen={isConnectWalletOpen}
        onClose={() => setIsConnectWalletOpen(false)}
        onWalletConnected={handleWalletConnected}
        activeChainSymbol={activeChain.symbol}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user: User, connectedWallet?: Partial<WalletState>) => {
          setCurrentUser(user);
          if (connectedWallet) {
            setWallet(prev => ({
              ...prev,
              ...connectedWallet,
              isConnected: true
            }));
          }
          setIsAuthOpen(false);
        }}
      />

      {/* Solidity Contracts Modal */}
      {showContractsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#1F1E19] border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#68CFEB]" />
                <h3 className="font-bold text-sm text-[#FAFAFA]">Velox Verified Smart Contracts</h3>
              </div>
              <button onClick={() => setShowContractsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#141310] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Factory & Parallel AMM</span>
                <div className="text-[#68CFEB] select-all font-bold">0x71C283F01bc7d92837fE76281bAA8192A0B577719</div>
              </div>
              <div className="p-3 rounded-xl bg-[#141310] border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Anti-Sniper FairSlot Shield Guard</span>
                <div className="text-emerald-400 select-all font-bold">0x8892aF01827419A918fAA8192A0B577719BCA019</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
