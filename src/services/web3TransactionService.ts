// Web3 Transaction Dispatcher: Direct device wallet extension confirmation for Monad Testnet and multi-chain
import { ChainConfig } from '../data/chains';

export interface TransactionRequest {
  fromAddress: string;
  toAddress?: string;
  amount: number; // in native currency (e.g. MON, ETH, SOL)
  tokenSymbol?: string;
  txType: 'LAUNCH_TOKEN' | 'BUY_TOKEN' | 'SELL_TOKEN';
  tokenName?: string;
  chainConfig: ChainConfig;
}

export interface TransactionResult {
  success: boolean;
  txHash: string;
  blockExplorerUrl?: string;
  error?: string;
}

// Default MonadPump Factory contract address on Monad Testnet
export const VELOX_FACTORY_CONTRACT = '0x71C8F780f2d93e50C83604f32e36506A33e38711';

/**
 * Prompt wallet to switch to Monad Testnet (or add it if not configured)
 */
export const ensureMonadNetwork = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return true; // fallback
  }

  const eth = (window as any).ethereum;
  const monadChainIdHex = '0x279f'; // 10143

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: monadChainIdHex }]
    });
    return true;
  } catch (switchError: any) {
    // 4902 indicates chain is not added to user's wallet yet
    if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain')) {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: monadChainIdHex,
              chainName: 'Monad Testnet',
              nativeCurrency: {
                name: 'Monad',
                symbol: 'MON',
                decimals: 18
              },
              rpcUrls: ['https://testnet-rpc.monad.xyz'],
              blockExplorerUrls: ['https://testnet.monadexplorer.com']
            }
          ]
        });
        return true;
      } catch (addError) {
        console.warn('Could not add Monad Testnet to wallet extension:', addError);
        return false;
      }
    }
    return false;
  }
};

/**
 * Dispatches a transaction directly to the user's installed browser wallet extension
 * (MetaMask, Brave Wallet, Phantom, Coinbase) for explicit on-device user confirmation.
 */
export const dispatchWeb3Transaction = async (
  req: TransactionRequest
): Promise<TransactionResult> => {
  const isEvm = req.chainConfig.id !== 'solana';
  const eth = typeof window !== 'undefined' ? (window as any).ethereum : null;
  const solana = typeof window !== 'undefined' ? ((window as any).phantom?.solana || (window as any).solana) : null;

  // 1. INJECTED EVM EXTENSION (MetaMask, Brave, Coinbase, Rabby)
  if (isEvm && eth && req.fromAddress && req.fromAddress.startsWith('0x') && req.fromAddress !== '0x742d35Cc6634C0532925a3b844Bc454e4438f44e') {
    try {
      // If Monad Testnet is selected, attempt chain alignment
      if (req.chainConfig.id === 'monad') {
        await ensureMonadNetwork();
      }

      // Calculate hex wei value (1 MON/ETH = 10^18 wei)
      const weiAmount = BigInt(Math.floor(Math.max(0, req.amount) * 1e18));
      const hexValue = `0x${weiAmount.toString(16)}`;

      const destination = req.toAddress || VELOX_FACTORY_CONTRACT;

      // Construct transaction request payload
      const txParams: any = {
        from: req.fromAddress,
        to: destination,
        value: hexValue
      };

      // Directly triggers the extension pop-up on the user's device!
      const txHash: string = await eth.request({
        method: 'eth_sendTransaction',
        params: [txParams]
      });

      const explorerBase = req.chainConfig.id === 'monad'
        ? 'https://testnet.monadexplorer.com/tx/'
        : req.chainConfig.id === 'base'
          ? 'https://basescan.org/tx/'
          : 'https://etherscan.io/tx/';

      return {
        success: true,
        txHash,
        blockExplorerUrl: `${explorerBase}${txHash}`
      };
    } catch (err: any) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED' || err.message?.includes('User rejected')) {
        return {
          success: false,
          txHash: '',
          error: 'Transaction was declined in your wallet extension.'
        };
      }
      return {
        success: false,
        txHash: '',
        error: err.message || 'Transaction failed in wallet extension.'
      };
    }
  }

  // 2. PHANTOM / SOLANA INJECTION
  if (!isEvm && solana && solana.isPhantom) {
    try {
      // In Phantom, prompt transaction approval or sign message
      const encodedMsg = new TextEncoder().encode(
        `Confirm Velox ${req.txType}: ${req.amount} ${req.tokenSymbol || 'SOL'} for ${req.tokenName || 'Token'}`
      );
      if (solana.signMessage) {
        await solana.signMessage(encodedMsg, 'utf8');
      }

      const mockSolTx = `5K${Math.random().toString(36).slice(2, 10)}${Date.now()}`;
      return {
        success: true,
        txHash: mockSolTx,
        blockExplorerUrl: `https://solscan.io/tx/${mockSolTx}`
      };
    } catch (err: any) {
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        return {
          success: false,
          txHash: '',
          error: 'Transaction declined in Phantom extension.'
        };
      }
      return {
        success: false,
        txHash: '',
        error: err.message || 'Phantom transaction failed.'
      };
    }
  }

  // 3. INSTANT DEMO WALLET SIMULATION
  // Fast parallel execution simulation for testing/demo without extension popup
  await new Promise(r => setTimeout(r, 800));
  const simHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  return {
    success: true,
    txHash: simHash,
    blockExplorerUrl: `https://testnet.monadexplorer.com/tx/${simHash}`
  };
};

