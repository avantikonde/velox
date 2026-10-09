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
}

export interface Trade {
  id: string;
  tokenId: string;
  tokenSymbol: string;
  type: 'BUY' | 'SELL';
  user: string;
  monAmount: number;
  tokenAmount: number;
  timestamp: string;
  txHash: string;
  latencyMs: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string;
  monBalance: number;
  tokens: Record<string, number>; // tokenId -> user balance
}
