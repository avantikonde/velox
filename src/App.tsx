import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { KingOfTheHill } from './components/KingOfTheHill';
import { TokenCard } from './components/TokenCard';
import { LaunchModal } from './components/LaunchModal';
import { TradeModal } from './components/TradeModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { AuroraButton } from './components/AuroraButton';
import { INITIAL_TOKENS } from './data/mockTokens';
import { Token, Trade, WalletState } from './types';
import { Search, Flame, Sparkles, Trophy, CheckCircle, Code2, RefreshCw, PlusCircle, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'graduating' | 'graduated'>('trending');
  
  // Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    monBalance: 25.0,
    tokens: {
      'pune-purple': 150000,
      'giga-parallel': 50000
    }
  });

  // Modals
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showContractsModal, setShowContractsModal] = useState(false);

  // Live Simulated Trades
  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: 'tx-1',
      tokenId: 'pune-purple',
      tokenSymbol: 'PUNE',
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
      tokenId: 'chai-wala',
      tokenSymbol: 'CHAI',
      type: 'SELL',
      user: '0x12c...aa8',
      monAmount: 0.35,
      tokenAmount: 1428,
      timestamp: '2m ago',
      txHash: '0x44bf...11c',
      latencyMs: 745
    }
  ]);

  // Simulate continuous Monad 10k TPS trade activity every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokens.length === 0) return;
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      const isBuy = Math.random() > 0.3;
      const monAmt = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
      const tokenAmt = Math.round(monAmt / randomToken.priceMon);
      const latency = Math.floor(Math.random() * 150 + 720); // 720ms - 870ms

      const newTrade: Trade = {
        id: `tx-${Date.now()}`,
        tokenId: randomToken.id,
        tokenSymbol: randomToken.symbol,
        type: isBuy ? 'BUY' : 'SELL',
        user: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 5)}`,
        monAmount: monAmt,
        tokenAmount: tokenAmt,
        timestamp: 'Just now',
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...`,
        latencyMs: latency
      };

      setRecentTrades(prev => [newTrade, ...prev.slice(0, 15)]);

      // Dynamically bump bonding curve progress
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

  // Connect / Disconnect Wallet Simulator
  const toggleWallet = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: !prev.isConnected
    }));
  };

  // Faucet claim (+10 MON)
  const claimFaucet = () => {
    setWallet(prev => ({
      ...prev,
      monBalance: prev.monBalance + 10.0
    }));
  };

  // Launch New Token Handler
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

  // Execute Trade Handler (Buy / Sell)
  const handleExecuteTrade = (tokenId: string, type: 'BUY' | 'SELL', monAmount: number, tokenAmount: number) => {
    // Update Wallet
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

    // Update Token in list
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

    // Record trade
    const activeTok = tokens.find(t => t.id === tokenId);
    if (activeTok) {
      const newTrade: Trade = {
        id: `tx-${Date.now()}`,
        tokenId,
        tokenSymbol: activeTok.symbol,
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

  // Filter Tokens
  const filteredTokens = tokens.filter(tok => {
    const matchesSearch = 
      tok.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'new') return tok.createdAt.includes('now') || tok.createdAt.includes('m ago');
    if (activeFilter === 'graduating') return tok.bondingProgress >= 60 && !tok.isGraduated;
    if (activeFilter === 'graduated') return tok.isGraduated;
    return true; // 'trending'
  });

  const kingOfTheHillToken = tokens[0] || INITIAL_TOKENS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#09101c] tech-grid-bg text-white relative overflow-hidden">
      
      {/* Background Aurora Ambient Lights (Aurora Blossom Theme) */}
      <div className="aurora-ambient-glow -top-40 -left-40 w-[600px] h-[600px] bg-[#EB96FF]/20"></div>
      <div className="aurora-ambient-glow top-[30%] -right-40 w-[600px] h-[600px] bg-[#0B5777]/25"></div>
      <div className="aurora-ambient-glow -bottom-40 left-1/3 w-[700px] h-[500px] bg-[#193153]/40"></div>

      {/* Top Navbar */}
      <Navbar
        wallet={wallet}
        onConnectWallet={toggleWallet}
        onOpenLaunchModal={() => setIsLaunchOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Real-time Ticker */}
      <LiveActivityTicker recentTrades={recentTrades} />

      {/* Hackathon Faucet & Demo Bar */}
      <div className="w-full bg-[#193153]/50 border-b border-[#EB96FF]/15 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EB96FF]/15 text-[#EB96FF] font-semibold border border-[#EB96FF]/30">
              <Sparkles className="w-3 h-3" /> Monad Blitz Pune V3 Ready
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Testing on local/devnet state. Sub-second parallel settlement active.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={claimFaucet}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EB96FF]/20 hover:bg-[#EB96FF]/30 text-[#F9D4E0] border border-[#EB96FF]/40 font-mono text-[11px] transition-colors"
            >
              <PlusCircle className="w-3 h-3" /> Faucet: +10 MON
            </button>
            <button
              onClick={() => setShowContractsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors"
            >
              <Code2 className="w-3 h-3 text-[#EB96FF]" /> View Solidity Contracts
            </button>
          </div>
        </div>
      </div>

      {/* Hero: King of the Hill Spotlight */}
      <KingOfTheHill
        token={kingOfTheHillToken}
        onSelectToken={(t) => setSelectedToken(t)}
        onQuickBuy={(t) => setSelectedToken(t)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Controls: Search & Filter Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#193153]/40 border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'trending' ? 'bg-[#EB96FF] text-[#09101c] shadow-lg shadow-[#EB96FF]/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Trending
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'new' ? 'bg-[#EB96FF] text-[#09101c] shadow-lg shadow-[#EB96FF]/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Newly Launched
            </button>
            <button
              onClick={() => setActiveFilter('graduating')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'graduating' ? 'bg-[#EB96FF] text-[#09101c] shadow-lg shadow-[#EB96FF]/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Near Graduation (60%+)
            </button>
            <button
              onClick={() => setActiveFilter('graduated')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'graduated' ? 'bg-[#EB96FF] text-[#09101c] shadow-lg shadow-[#EB96FF]/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Graduated
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coin name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#193153]/30 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF] transition-colors"
            />
          </div>

        </div>

        {/* Tokens Grid */}
        {filteredTokens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTokens.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onSelect={(tok) => setSelectedToken(tok)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl glass-panel border border-white/5 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#193153] flex items-center justify-center text-[#EB96FF]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No coins found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to launch a token for this search keyword on the Monad bonding curve!
            </p>
            <AuroraButton onClick={() => setIsLaunchOpen(true)} size="md">
              Launch This Coin
            </AuroraButton>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#EB96FF]/15 bg-[#09101c]/90 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MonadPump 💜</span>
            <span>— Built for Monad Blitz Pune V3</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Theme: Aurora Blossom</span>
            <span>•</span>
            <span className="font-mono text-[#EB96FF]">10,000 TPS Parallel EVM</span>
          </div>
        </div>
      </footer>

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

      {/* Solidity Contracts View Modal (For Demo to Judges) */}
      {showContractsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl glass-panel p-6 sm:p-8 bg-[#0c1524] border border-[#EB96FF]/30 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#EB96FF]" />
                <h2 className="text-lg font-bold text-white">Smart Contracts Architecture</h2>
              </div>
              <button onClick={() => setShowContractsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <p className="text-xs text-slate-300 mb-4">
              Written in Solidity for Foundry / Hardhat. Ready to compile with <code className="text-[#EB96FF]">forge build</code> and deploy directly to the Monad Testnet tomorrow!
            </p>

            <div className="p-4 rounded-xl bg-[#070b13] border border-white/10 overflow-x-auto font-mono text-[11px] text-slate-300 max-h-96">
              <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MonadPumpFactory
 * @notice High-throughput Bonding Curve Token Factory for Monad Parallel L1
 */
contract MonadPumpFactory {
    uint256 public constant GRADUATION_TARGET = 50 ether; // 50 MON to graduate
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether; // 1 Billion tokens

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 monRaised;
        bool graduated;
    }

    mapping(address => TokenInfo) public tokens;

    event TokenLaunched(address indexed token, string name, string symbol);
    event TokensPurchased(address indexed token, address buyer, uint256 monIn, uint256 tokensOut);
    event TokenGraduated(address indexed token, uint256 totalMonLocked);

    function createToken(string memory name, string memory symbol) external payable returns (address) {
        BondingCurveToken token = new BondingCurveToken(name, symbol, address(this));
        tokens[address(token)] = TokenInfo(address(token), name, symbol, msg.value, false);
        emit TokenLaunched(address(token), name, symbol);

        if (msg.value > 0) {
            _buy(address(token), msg.sender, msg.value);
        }
        return address(token);
    }

    function buy(address token) external payable {
        _buy(token, msg.sender, msg.value);
    }

    function _buy(address token, address buyer, uint256 monIn) internal {
        TokenInfo storage info = tokens[token];
        require(!info.graduated, "Already graduated to DEX");
        
        info.monRaised += monIn;
        uint256 tokensOut = (monIn * TOTAL_SUPPLY) / GRADUATION_TARGET;
        BondingCurveToken(token).transfer(buyer, tokensOut);

        emit TokensPurchased(token, buyer, monIn, tokensOut);

        if (info.monRaised >= GRADUATION_TARGET) {
            info.graduated = true;
            emit TokenGraduated(token, info.monRaised);
        }
    }
}`}</pre>
            </div>

            <div className="mt-4 flex justify-end">
              <AuroraButton onClick={() => setShowContractsModal(false)} size="sm">
                Close
              </AuroraButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
