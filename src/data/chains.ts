export interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  badge: string;
  iconColor: string;
  tps: string;
  finality: string;
  gasCost: string;
  rpcUrl: string;
  faucetAmount: number;
  explorerName: string;
  chainIdHex?: string;
  chainDecimalId?: number;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 'monad',
    name: 'Monad Testnet',
    symbol: 'MON',
    badge: 'Parallel L1',
    iconColor: '#68CFEB',
    tps: '10,000 TPS',
    finality: '~800ms',
    gasCost: '< 0.0001 MON',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    faucetAmount: 10.0,
    explorerName: 'MonadScan',
    chainIdHex: '0x279f',
    chainDecimalId: 10143
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    badge: 'Mainnet',
    iconColor: '#627EEA',
    tps: '15 TPS',
    finality: '~12s',
    gasCost: '~0.0008 ETH',
    rpcUrl: 'eth-mainnet.alchemyapi.io',
    faucetAmount: 0.5,
    explorerName: 'Etherscan'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    badge: 'High Speed',
    iconColor: '#14F195',
    tps: '65,000 TPS',
    finality: '~400ms',
    gasCost: '< 0.0005 SOL',
    rpcUrl: 'api.mainnet-beta.solana.com',
    faucetAmount: 5.0,
    explorerName: 'Solscan'
  },
  {
    id: 'base',
    name: 'Base L2',
    symbol: 'ETH',
    badge: 'Optimistic L2',
    iconColor: '#0052FF',
    tps: '2,000 TPS',
    finality: '~1s',
    gasCost: '< 0.00001 ETH',
    rpcUrl: 'mainnet.base.org',
    faucetAmount: 0.2,
    explorerName: 'Basescan'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ARB',
    badge: 'Rollup L2',
    iconColor: '#28A0F0',
    tps: '4,000 TPS',
    finality: '~250ms',
    gasCost: '< 0.0001 ETH',
    rpcUrl: 'arb1.arbitrum.io/rpc',
    faucetAmount: 25.0,
    explorerName: 'Arbiscan'
  }
];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

