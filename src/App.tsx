import React, { useState, useEffect } from 'react';
import { PumpSidebar } from './components/PumpSidebar';
import { PumpTopHeader } from './components/PumpTopHeader';
import { KingOfTheHill } from './components/KingOfTheHill';
import { TokenCard } from './components/TokenCard';
import { PumpTerminal } from './components/PumpTerminal';
import { LaunchModal } from './components/LaunchModal';
import { TradeModal } from './components/TradeModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { AuthModal } from './components/AuthModal';
import { SimpleInteractiveBackground } from './components/SimpleInteractiveBackground';
import { TriomixLanding } from './components/TriomixLanding';
import { INITIAL_TOKENS, MOCK_HOT_CALLOUTS, MOCK_LEADERBOARD } from './data/mockTokens';
import { Token, Trade, WalletState, ViewMode, HotCallout, LeaderboardEntry, User } from './types';
import { authService } from './services/authService';
import { Search, Flame, Sparkles, Trophy, CheckCircle, Code2 } from 'lucide-react';

export const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [callouts, setCallouts] = useState<HotCallout[]>(MOCK_HOT_CALLOUTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'leaderboard' | 'callouts' | 'terminal'>('home');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'graduating' | 'graduated'>('trending');

  // UI View state: defaults to Triomix animated landing page with instant undo capability
  const [currentView, setCurrentView] = useState<'landing' | 'pump'>(() => {
    return (localStorage.getItem('monad_active_ui') as 'landing' | 'pump') || 'landing';
  });

  const handleSwitchUI = (mode: 'landing' | 'pump') => {
    setCurrentView(mode);
    localStorage.setItem('monad_active_ui', mode);
  };
  
  // Left Sidebar Expand/Collapse State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    monBalance: 25.0,
    tokens: {
      'chog-monad': 150000,
      'giga-parallel': 50000
    }
  });

  // Authentication State (Google + Email)
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showContractsModal, setShowContractsModal] = useState(false);

  // Live Trades with token logos
  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: 'tx-1',
      tokenId: 'chog-monad',
      tokenSymbol: 'CHOG',
      tokenImageUrl: INITIAL_TOKENS[0].imageUrl,
      type: 'BUY',
      user: '0x84f...19e',
      monAmount: 0.5,
      tokenAmount: 1028,
      timestamp: 'Just now',
      txHash: '0x918f...28b',
      latencyMs: 780
    },
    {
      id: 'tx-2',
      tokenId: 'giga-parallel',
      tokenSymbol: 'PARALLEL',
      tokenImageUrl: INITIAL_TOKENS[1].imageUrl,
      type: 'BUY',
      user: '0x32a...49f',
      monAmount: 1.2,
      tokenAmount: 3738,
      timestamp: '1m ago',
      txHash: '0x38fa...99a',
      latencyMs: 812
    },
    {
      id: 'tx-3',
      tokenId: 'aurora-blossom',
      tokenSymbol: 'AURORA',
      tokenImageUrl: INITIAL_TOKENS[2].imageUrl,
      type: 'SELL',
      user: '0x12c...aa8',
      monAmount: 0.35,
      tokenAmount: 1428,
      timestamp: '2m ago',
      txHash: '0x44bf...11c',
      latencyMs: 745
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
        latencyMs: latency
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
    }, 5500);

    return () => clearInterval(interval);
  }, [tokens]);

  const toggleWallet = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: !prev.isConnected
    }));
  };

  const claimFaucet = () => {
    setWallet(prev => ({
      ...prev,
      monBalance: prev.monBalance + 10.0
    }));
  };

  const handleLaunchToken = (newToken: Token, initialBuyMon: number) => {
    if (initialBuyMon > 0) {
      setWallet(prev => ({
        ...prev,
        monBalance: prev.monBalance - initialBuyMon,
        tokens: {
          ...prev.tokens,
          [newToken.id]: Math.round(initialBuyMon / newToken.priceMon)
        }
      }));
    }
    setTokens(prev => [newToken, ...prev]);
    setSelectedToken(newToken);
  };

  const handleExecuteTrade = (tokenId: string, type: 'BUY' | 'SELL', monAmount: number, tokenAmount: number) => {
    setWallet(prev => {
      const currentTokenBal = prev.tokens[tokenId] || 0;
      return {
        ...prev,
        monBalance: type === 'BUY' ? prev.monBalance - monAmount : prev.monBalance + monAmount,
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
      const newTrade: Trade = {
        id: `tx-${Date.now()}`,
        tokenId,
        tokenSymbol: activeTok.symbol,
        tokenImageUrl: activeTok.imageUrl,
        type,
        user: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
        monAmount,
        tokenAmount,
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        latencyMs: 792
      };
      setRecentTrades(prev => [newTrade, ...prev.slice(0, 15)]);
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

  const kingOfTheHillToken = tokens[0] || INITIAL_TOKENS[0];

  const handleSelectSidebarTab = (tab: 'home' | 'explore' | 'leaderboard' | 'callouts' | 'terminal') => {
    setActiveTab(tab);
    if (tab === 'home' || tab === 'explore') {
      setViewMode('grid');
    } else {
      setViewMode('terminal');
    }
  };

  if (currentView === 'landing') {
    return (
      <TriomixLanding
        onRevertToOriginalUI={() => handleSwitchUI('pump')}
        onLaunchApp={() => handleSwitchUI('pump')}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#080B11] clean-grid-bg text-slate-100 relative overflow-x-hidden font-sans">
      
      {/* Advanced Simple Interactive Background (Subtle cursor-following ambient glow & particles) */}
      <SimpleInteractiveBackground />

      {/* LEFT SIDEBAR: Collapsible */}
      <PumpSidebar
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        activeTab={activeTab}
        onSelectTab={handleSelectSidebarTab}
        onOpenLaunchModal={() => setIsLaunchOpen(true)}
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
        
        {/* TOP BAR: Clean Minimalist Top Strip */}
        <PumpTopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenLaunchModal={() => setIsLaunchOpen(true)}
          onOpenAuthModal={() => setIsAuthOpen(true)}
          onClaimFaucet={claimFaucet}
          currentUser={currentUser}
          onLogout={() => {
            authService.logout();
            setCurrentUser(null);
          }}
          wallet={wallet}
          onConnectWallet={toggleWallet}
        />

        {/* Real-time Ticker: Compact Live Swaps Bar */}
        <LiveActivityTicker
          recentTrades={recentTrades}
          tokens={tokens}
          onSelectToken={(t) => setSelectedToken(t)}
        />

        {/* Hero: King of the Hill Spotlight Card */}
        <KingOfTheHill
          token={kingOfTheHillToken}
          onSelectToken={(t) => setSelectedToken(t)}
          onQuickBuy={(t) => setSelectedToken(t)}
        />

        {/* Main Content Viewport: Terminal vs Grid */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1">
          {viewMode === 'terminal' ? (
            <PumpTerminal
              tokens={filteredTokens}
              callouts={callouts}
              leaderboard={leaderboard}
              onSelectToken={(t) => setSelectedToken(t)}
              onOpenLaunchModal={() => setIsLaunchOpen(true)}
            />
          ) : (
            <div>
              {/* Controls: Filter Tabs in Grid View */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0D111A] border border-white/[0.08] overflow-x-auto text-xs font-medium">
                  <button
                    onClick={() => setActiveFilter('trending')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'trending' ? 'bg-[#836EF9] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending
                  </button>
                  <button
                    onClick={() => setActiveFilter('new')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'new' ? 'bg-[#836EF9] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Newly Launched
                  </button>
                  <button
                    onClick={() => setActiveFilter('graduating')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'graduating' ? 'bg-[#836EF9] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-300" /> Near Graduation (60%+)
                  </button>
                  <button
                    onClick={() => setActiveFilter('graduated')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeFilter === 'graduated' ? 'bg-[#836EF9] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
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
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D111A] border border-white/[0.08] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9] transition-colors"
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
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-2xl bg-[#0D111A] border border-white/[0.08] space-y-4 mb-10">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#131926] flex items-center justify-center text-[#836EF9]">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">No tokens matched</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Be the first to launch a token for this keyword on the Monad bonding curve!
                  </p>
                  <button 
                    onClick={() => setIsLaunchOpen(true)} 
                    className="px-4 py-2 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#836EF9]/20 inline-block"
                  >
                    Launch Coin 🚀
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] bg-[#080B11]/90 py-6 mt-10 text-xs text-slate-400">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">monad.pump 💜</span>
              <span>— Instant Fair-Launchpad & DEX for Monad Parallel L1</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>RPC: testnet-rpc.monad.xyz</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">10,000 TPS Parallel EVM</span>
              <span>•</span>
              <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-white transition-colors">
                Docs
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
      />

      <TradeModal
        token={selectedToken}
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        wallet={wallet}
        onExecuteTrade={handleExecuteTrade}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* Smart Contracts View Modal */}
      {showContractsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D111A] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#836EF9]" />
                <h2 className="text-base font-bold text-white">Smart Contracts Architecture (Solidity)</h2>
              </div>
              <button onClick={() => setShowContractsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <p className="text-xs text-slate-400 mb-3">
              Deployable directly to Monad Testnet via <code className="text-purple-300">forge script</code>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#080B11] border border-white/[0.06] overflow-x-auto font-mono text-[11px] text-slate-300 max-h-80">
              <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MonadPumpToken is ERC20 {
    address public factory;
    
    constructor(string memory name, string memory symbol, address _factory) ERC20(name, symbol) {
        factory = _factory;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == factory, "Only factory");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == factory, "Only factory");
        _burn(from, amount);
    }
}

contract MonadPumpFactory {
    uint256 public constant GRADUATION_TARGET = 50 ether; // 50 MON to graduate
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether;

    struct TokenState {
        address token;
        string name;
        string symbol;
        uint256 monRaised;
        bool graduated;
    }

    mapping(address => TokenState) public tokens;

    event TokenLaunched(address indexed token, string name, string symbol, address creator);
    event TradeExecuted(address indexed token, address trader, bool isBuy, uint256 monAmount, uint256 tokenAmount);
    event TokenGraduated(address indexed token, uint256 monLocked);

    function createToken(string memory name, string memory symbol) external payable returns (address) {
        MonadPumpToken token = new MonadPumpToken(name, symbol, address(this));
        tokens[address(token)] = TokenState(address(token), name, symbol, msg.value, false);
        emit TokenLaunched(address(token), name, symbol, msg.sender);

        if (msg.value > 0) {
            _buy(address(token), msg.sender, msg.value);
        }
        return address(token);
    }

    function buy(address token) external payable {
        _buy(token, msg.sender, msg.value);
    }

    function _buy(address token, address buyer, uint256 monIn) internal {
        TokenState storage state = tokens[token];
        require(!state.graduated, "Token graduated to DEX AMM");

        state.monRaised += monIn;
        uint256 tokensOut = (monIn * TOTAL_SUPPLY) / GRADUATION_TARGET;
        MonadPumpToken(token).mint(buyer, tokensOut);

        emit TradeExecuted(token, buyer, true, monIn, tokensOut);

        if (state.monRaised >= GRADUATION_TARGET) {
            state.graduated = true;
            emit TokenGraduated(token, state.monRaised);
        }
    }
}`}</pre>
            </div>

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowContractsModal(false)} 
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button: Switch back to Triomix Landing Page */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => handleSwitchUI('landing')}
          className="group px-4 py-2.5 bg-[#0e101f]/95 hover:bg-[#181c3b] border border-purple-500/40 text-purple-200 text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Return to Triomix Animated Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
          <span>Animated Landing Page</span>
        </button>
      </div>

    </div>
  );
};
