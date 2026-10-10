// Web3 Wallet Service supporting real injected browser extension wallets:
// - MetaMask & EVM (window.ethereum / eth_requestAccounts / EIP-6963)
// - Phantom & Solana (window.solana / window.phantom.solana / EIP-6963)
// - Coinbase Wallet (window.coinbaseWalletExtension / EIP-6963)
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

// In-memory cache for EIP-6963 multi-wallet announcements
interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

const eip6963Providers: Map<string, EIP6963ProviderDetail> = new Map();
let isEIP6963Listening = false;

export const initEIP6963 = () => {
  if (typeof window === 'undefined' || isEIP6963Listening) return;
  isEIP6963Listening = true;

  window.addEventListener('eip6963:announceProvider', (event: any) => {
    if (event?.detail?.info?.rdns && event?.detail?.provider) {
      eip6963Providers.set(event.detail.info.rdns.toLowerCase(), event.detail);
    }
  });

  try {
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  } catch (e) {
    // ignore
  }
};

// Initialize immediately on module load if in browser
if (typeof window !== 'undefined') {
  initEIP6963();
}

export const isSafariBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium') && !ua.includes('Edg');
};

export const getInjectedEthereum = (): any => {
  if (typeof window === 'undefined') return null;
  return (window as any).ethereum || null;
};

export const getMetaMaskProvider = (): any => {
  if (typeof window === 'undefined') return null;

  // 1. Check EIP-6963 providers (io.metamask)
  for (const [rdns, detail] of eip6963Providers.entries()) {
    if (rdns.includes('metamask') || detail.info.name.toLowerCase().includes('metamask')) {
      return detail.provider;
    }
  }

  const eth = (window as any).ethereum;
  if (!eth) return null;

  // 2. Check if multiple EVM providers are injected (e.g. MetaMask + Phantom + Coinbase together)
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    const mm = eth.providers.find((p: any) => p.isMetaMask && !p.isPhantom);
    if (mm) return mm;
    const fallbackMm = eth.providers.find((p: any) => p.isMetaMask);
    if (fallbackMm) return fallbackMm;
  }

  // 3. Direct window.ethereum flags
  if (eth.isMetaMask) {
    return eth;
  }

  // 4. Return window.ethereum if present
  return eth;
};

export const getPhantomProvider = (): any => {
  if (typeof window === 'undefined') return null;

  // EIP-6963 for Phantom
  for (const [rdns, detail] of eip6963Providers.entries()) {
    if (rdns.includes('phantom') || detail.info.name.toLowerCase().includes('phantom')) {
      return detail.provider;
    }
  }

  // Solana injection
  const solana = (window as any).phantom?.solana || (window as any).solana;
  if (solana && solana.isPhantom) return solana;

  // EVM injection for Phantom
  const eth = (window as any).phantom?.ethereum;
  if (eth) return eth;

  return solana || null;
};

export const getCoinbaseProvider = (): any => {
  if (typeof window === 'undefined') return null;

  for (const [rdns, detail] of eip6963Providers.entries()) {
    if (rdns.includes('coinbase') || detail.info.name.toLowerCase().includes('coinbase')) {
      return detail.provider;
    }
  }

  if ((window as any).coinbaseWalletExtension) {
    return (window as any).coinbaseWalletExtension;
  }

  const eth = (window as any).ethereum;
  if (eth?.isCoinbaseWallet) return eth;

  if (Array.isArray(eth?.providers)) {
    const cb = eth.providers.find((p: any) => p.isCoinbaseWallet);
    if (cb) return cb;
  }

  return null;
};

export const getInjectedSolana = (): any => {
  return getPhantomProvider();
};

export const isMetaMaskInstalled = (): boolean => {
  const mm = getMetaMaskProvider();
  return Boolean(mm && (mm.isMetaMask || typeof mm.request === 'function'));
};

export const isPhantomInstalled = (): boolean => {
  return Boolean(getPhantomProvider());
};

export const isCoinbaseInstalled = (): boolean => {
  return Boolean(getCoinbaseProvider());
};

export const isGenericInjectedInstalled = (): boolean => {
  return Boolean(getInjectedEthereum());
};

export const getAvailableWallets = (): AvailableWallet[] => {
  initEIP6963();

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
 * Actively probes for provider with a brief timeout (handles delayed injection)
 */
const waitForProvider = async (
  getProviderFn: () => any,
  maxWaitMs: number = 500
): Promise<any> => {
  const initial = getProviderFn();
  if (initial) return initial;

  try {
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  } catch (e) {
    // ignore
  }

  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 60));
    const p = getProviderFn();
    if (p) return p;
  }
  return null;
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
    const solana = await waitForProvider(getPhantomProvider, 400);
    if (!solana) {
      const isSafari = isSafariBrowser();
      if (isSafari) {
        throw new Error(
          'SAFARI_WALLET_NOT_DETECTED: Phantom extension was not detected in Safari. If your Phantom is installed in Google Chrome or Brave, open this website in that browser.'
        );
      }
      throw new Error(
        'EXTENSION_NOT_DETECTED: Phantom wallet extension was not detected. Please verify your extension is installed and enabled in your browser.'
      );
    }

    try {
      if (typeof solana.connect === 'function') {
        const resp = await solana.connect();
        const pubkey = resp?.publicKey?.toString() || solana.publicKey?.toString();
        if (!pubkey) {
          throw new Error('No public key returned from Phantom wallet.');
        }
        return {
          address: pubkey,
          walletType: 'phantom',
          connectorName: 'Phantom Wallet'
        };
      } else if (typeof solana.request === 'function') {
        const accounts: string[] = await solana.request({ method: 'eth_requestAccounts' });
        return {
          address: accounts[0],
          walletType: 'phantom',
          connectorName: 'Phantom EVM Wallet'
        };
      }
      throw new Error('Unsupported Phantom interface.');
    } catch (err: any) {
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        throw new Error('Connection request was declined in Phantom.');
      }
      throw new Error(err.message || 'Failed to connect to Phantom extension.');
    }
  }

  // 2. METAMASK / COINBASE / INJECTED EVM
  if (walletId === 'metamask' || walletId === 'coinbase' || walletId === 'injected') {
    const provider = await waitForProvider(
      () => {
        if (walletId === 'metamask') return getMetaMaskProvider();
        if (walletId === 'coinbase') return getCoinbaseProvider();
        return getInjectedEthereum();
      },
      600
    );

    if (!provider || typeof provider.request !== 'function') {
      const isSafari = isSafariBrowser();
      const walletLabel = walletId === 'coinbase' ? 'Coinbase Wallet' : walletId === 'metamask' ? 'MetaMask' : 'EVM Wallet';

      if (isSafari) {
        throw new Error(
          `SAFARI_WALLET_NOT_DETECTED: ${walletLabel} extension was not detected in Safari.\n\n` +
          `• If you installed ${walletLabel} in Google Chrome, Brave, or Arc: Please open this URL in that browser!\n` +
          `• If you installed the ${walletLabel} Safari extension: Go to Safari Settings → Extensions → Enable ${walletLabel} and grant permissions for localhost.`
        );
      }

      throw new Error(
        `EXTENSION_NOT_DETECTED: ${walletLabel} extension is not detected in this browser window. Please check your browser extension settings or allow access on this site.`
      );
    }

    try {
      // Direct EIP-1193 trigger: pops up extension window on user's device
      const accounts: string[] = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts authorized from browser wallet extension.');
      }

      const connectorName = provider.isMetaMask 
        ? 'MetaMask' 
        : provider.isCoinbaseWallet 
          ? 'Coinbase Wallet' 
          : 'Injected EVM Provider';

      return {
        address: accounts[0],
        walletType: walletId,
        connectorName
      };
    } catch (err: any) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        throw new Error(`Connection request was declined in ${walletId === 'metamask' ? 'MetaMask' : 'your wallet extension'}.`);
      }
      throw new Error(err.message || 'Failed to connect to browser wallet extension.');
    }
  }

  // 3. INSTANT DEMO WALLET
  return {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    walletType: 'demo',
    connectorName: 'Instant Demo Wallet',
    balance: 25.0
  };
};
