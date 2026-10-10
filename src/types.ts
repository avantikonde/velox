export interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  creator: string;
  createdAt: string;
  marketCapMon: number;
  priceMon: number;
  bondingProgress: number; // 0 - 100
  monRaised: number;
  monTarget: number;
  holdersCount: number;
  volume24h: number;
  priceChange24h: number;
  isGraduated: boolean;
  repliesCount?: number;
  shieldActive?: boolean;
  shieldRemainingSeconds?: number;
  maxShieldBuyMon?: number;
  chain?: string;
  chainSymbol?: string;
  contractAddress?: string;
  pumpFunUrl?: string;
  coingeckoUrl?: string;
  usdPrice?: number;
  usdMarketCap?: number;
  usd24hVol?: number;
  high24h?: number;
  low24h?: number;
  ath?: number;
  circulatingSupply?: string;
  sparkline7d?: number[];
}

export interface Trade {
  id: string;
  tokenId: string;
  tokenSymbol: string;
  tokenImageUrl?: string;
  type: 'BUY' | 'SELL';
  user: string;
  monAmount: number;
  tokenAmount: number;
  timestamp: string;
  txHash: string;
  latencyMs: number;
  currencySymbol?: string;
}

export interface HotCallout {
  id: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
  tokenSymbol: string;
  tokenName: string;
  tokenImageUrl: string;
  positionMon: number;
  profitMon: number;
  isPositive: boolean;
  replies: number;
  likes: number;
  currencySymbol?: string;
  xHandle?: string;
  xProfileUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  avatarUrl: string;
  profitMon: number;
  winRate: number;
  tradesCount: number;
  volumeMon?: number;
  badge?: string;
  favToken?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  authProvider: 'google' | 'email' | 'apple' | 'github' | 'wallet';
  createdAt: string;
  monadWalletAddress: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string;
  monBalance: number;
  chainBalances?: Record<string, number>; // chainId -> balance
  tokens: Record<string, number>; // tokenId -> user balance
  walletType?: 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo';
  connectorName?: string;
}

export type ViewMode = 'terminal' | 'grid';
export type NavigationTab = 'home' | 'explore' | 'terminal' | 'live-feed' | 'leaderboard' | 'rewards';
export type FilterTimeframe = '1h' | '4h' | '12h' | '24h';
