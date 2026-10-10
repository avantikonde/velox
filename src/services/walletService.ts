// Web3 Wallet Service supporting real injected browser extension wallets:
// - MetaMask & EVM (window.ethereum / eth_requestAccounts)
// - Phantom & Solana (window.solana / window.phantom.solana)
// - Coinbase Wallet (window.coinbaseWalletExtension)
// - Generic Injected EIP-1193 providers

export interface AvailableWallet {
  id: 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo';
  name: string;
  category: 'evm' | 'solana' | 'all';
  isInstalled: boolean;
  installUrl: string;
  description: string;
  badge?: string;
}

export interface WalletConnectResult {
  address: string;
  walletType: 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo';
  connectorName: string;
  balance?: number;
}

export const getInjectedEthereum = (): any => {
  if (typeof window === 'undefined') return null;
  return (window as any).ethereum || null;
};

export const getInjectedSolana = (): any => {
  if (typeof window === 'undefined') return null;
  return (window as any).phantom?.solana || (window as any).solana || null;
};

export const isMetaMaskInstalled = (): boolean => {
  const eth = getInjectedEthereum();
  return Boolean(eth && (eth.isMetaMask || (!eth.isPhantom && !eth.isCoinbaseWallet)));
};

export const isPhantomInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const solana = (window as any).phantom?.solana || (window as any).solana;
  return Boolean(solana && solana.isPhantom);
};

export const isCoinbaseInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).coinbaseWalletExtension || (window as any).ethereum?.isCoinbaseWallet);
};

export const isGenericInjectedInstalled = (): boolean => {
  return Boolean(getInjectedEthereum());
};

export const getAvailableWallets = (): AvailableWallet[] => {
  return [
    {
      id: 'metamask',
      name: 'MetaMask',
      category: 'evm',
      isInstalled: isMetaMaskInstalled(),
      installUrl: 'https://metamask.io/download/',
      description: 'EVM browser extension & mobile app for Monad, Ethereum & Base.',
      badge: 'Popular EVM'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      category: 'solana',
      isInstalled: isPhantomInstalled(),
      installUrl: 'https://phantom.app/download',
      description: 'Multi-chain extension with native Solana & EVM support.',
      badge: 'Multi-Chain'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      category: 'evm',
      isInstalled: isCoinbaseInstalled(),
      installUrl: 'https://www.coinbase.com/wallet/downloads',
      description: 'Self-custody extension with Smart Wallet passkeys.',
      badge: 'Smart Wallet'
    },
    {
      id: 'injected',
      name: 'Browser Injected',
      category: 'all',
      isInstalled: isGenericInjectedInstalled(),
      installUrl: 'https://metamask.io/download/',
      description: 'Standard EIP-1193 browser extension (Rabby, Trust, OKX).',
      badge: 'EIP-1193'
    },
    {
      id: 'demo',
      name: 'Instant Demo Wallet',
      category: 'all',
      isInstalled: true,
      installUrl: '#',
      description: 'Instant local sandbox wallet preloaded with test tokens.',
      badge: 'Instant Zero-Setup'
    }
  ];
};

/**
 * Directly connects to the requested installed wallet extension,
 * popping up the device extension modal for user approval.
 */
export const connectToWallet = async (
  walletId: 'metamask' | 'phantom' | 'coinbase' | 'injected' | 'demo'
): Promise<WalletConnectResult> => {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection requires a browser environment.');
  }

  // 1. PHANTOM / SOLANA DIRECT INJECTION
  if (walletId === 'phantom') {
    const solana = getInjectedSolana();
    if (!solana) {
      window.open('https://phantom.app/download', '_blank', 'noopener,noreferrer');
      throw new Error('Phantom extension not detected on this device. Redirecting to official download page...');
    }

    try {
      const resp = await solana.connect();
      const pubkey = resp.publicKey?.toString() || solana.publicKey?.toString();
      if (!pubkey) {
        throw new Error('No public key returned from Phantom wallet.');
      }
      return {
        address: pubkey,
        walletType: 'phantom',
        connectorName: 'Phantom Wallet'
      };
    } catch (err: any) {
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        throw new Error('Connection request was declined in Phantom.');
      }
      throw new Error(err.message || 'Failed to connect to Phantom extension.');
    }
  }

  // 2. METAMASK / COINBASE / INJECTED EVM
  if (walletId === 'metamask' || walletId === 'coinbase' || walletId === 'injected') {
    const eth = getInjectedEthereum();
    if (!eth) {
      const url = walletId === 'coinbase' 
        ? 'https://www.coinbase.com/wallet/downloads' 
        : 'https://metamask.io/download/';
      window.open(url, '_blank', 'noopener,noreferrer');
      throw new Error(`${walletId === 'coinbase' ? 'Coinbase Wallet' : 'MetaMask'} not detected on this device. Redirecting to official download...`);
    }

    try {
      // Direct EIP-1193 trigger: pops up extension window on user's device
      const accounts: string[] = await eth.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts authorized from browser wallet extension.');
      }

      const connectorName = eth.isMetaMask 
        ? 'MetaMask' 
        : eth.isCoinbaseWallet 
          ? 'Coinbase Wallet' 
          : 'Injected EVM Provider';

      return {
        address: accounts[0],
        walletType: walletId,
        connectorName
      };
    } catch (err: any) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        throw new Error('Connection request was declined in your wallet extension.');
      }
      throw new Error(err.message || 'Failed to connect to browser wallet extension.');
    }
  }

  // 3. INSTANT DEMO WALLET
  return {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    walletType: 'demo',
    connectorName: 'Demo Wallet',
    balance: 25.0
  };
};

