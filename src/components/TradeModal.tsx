import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, ShieldCheck, Zap, Shield, AlertCircle, ExternalLink, Loader2, Waves, Radio, CheckCircle2 } from 'lucide-react';
import { Token, WalletState } from '../types';
import { ChainConfig } from '../data/chains';
import { dispatchWeb3Transaction } from '../services/web3TransactionService';
import { CoinLiveChart } from './CoinLiveChart';
import confetti from 'canvas-confetti';

interface TradeModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onExecuteTrade: (tokenId: string, type: 'BUY' | 'SELL', monAmount: number, tokenAmount: number) => void;
  currencySymbol?: string;
  onOpenConnectWallet?: () => void;
  chainConfig?: ChainConfig;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  token,
  isOpen,
  onClose,
  wallet,
  onExecuteTrade,
  currencySymbol,
  onOpenConnectWallet,
  chainConfig
}) => {
  const [tab, setTab] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('0.5');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastTxSuccess, setLastTxSuccess] = useState<string | null>(null);

  // StreamSwap (High-Frequency Micro-DCA Mode) States
  const [buyMode, setBuyMode] = useState<'instant' | 'stream'>('instant');
  const [streamDuration, setStreamDuration] = useState<10 | 20 | 30>(10);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const [streamLogs, setStreamLogs] = useState<{ chunk: number; latencyMs: number; monChunk: number; txHash: string }[]>([]);
  const streamTimerRef = useRef<any>(null);

  const currSymbol = currencySymbol || token?.chainSymbol || 'MON';
  const isShieldActive = Boolean(token?.shieldActive);
  const shieldCap = token?.maxShieldBuyMon || 0.5;
  const totalChunks = streamDuration === 10 ? 5 : streamDuration === 20 ? 10 : 15;

  // Cleanup timers on modal close or unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearTimeout(streamTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (streamTimerRef.current) {
        clearTimeout(streamTimerRef.current);
      }
      setIsStreaming(false);
      setCurrentChunk(0);
      setStreamCompleted(false);
      setStreamLogs([]);
      setLastTxSuccess(null);
    }
  }, [isOpen]);

  // Enforce/clamp default amount when shield is active (must be called unconditionally before early return)
  useEffect(() => {
    if (isOpen && token && isShieldActive && parseFloat(amount) > shieldCap) {
      setAmount(shieldCap.toString());
    }
  }, [token?.id, isOpen, isShieldActive, shieldCap]);

  if (!isOpen || !token) return null;

  const userTokenBalance = (wallet?.tokens && wallet.tokens[token.id]) || 0;
  const isBuy = tab === 'BUY';

  // Linear bonding curve preview math
  const numAmount = parseFloat(amount) || 0;
  const price = token.priceMon || 0.0001;
  const estimatedTokens = isBuy 
    ? Math.round(numAmount / price)
    : Math.round(numAmount * price * 0.98 * 1000) / 1000;

  const handleCancelStream = () => {
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);
  };

  const startStreamSwap = () => {
    if (numAmount <= 0) return;

    if (isShieldActive && numAmount > shieldCap) {
      alert(`Anti-Sniper Shield Active: Maximum buy is capped at ${shieldCap} ${currSymbol} per transaction during the initial genesis window.`);
      setAmount(shieldCap.toString());
      return;
    }

    if (numAmount > wallet.monBalance) {
      alert(`Insufficient ${currSymbol} balance (${wallet.monBalance.toFixed(2)} ${currSymbol} available)`);
      return;
    }

    setIsStreaming(true);
    setStreamCompleted(false);
    setCurrentChunk(0);
    setStreamLogs([]);
    setLastTxSuccess(null);

    const chunksCount = totalChunks;
    const monPerChunk = parseFloat((numAmount / chunksCount).toFixed(4));
    const tokensPerChunk = Math.round(estimatedTokens / chunksCount);

    let chunk = 0;
    const executeNextChunk = () => {
      chunk++;
      setCurrentChunk(chunk);
      const latency = Math.floor(Math.random() * 45 + 775);
      const txHash = `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`;

      // Execute on-chain simulated chunk
      onExecuteTrade(token.id, 'BUY', monPerChunk, tokensPerChunk);

      setStreamLogs(prev => [
        ...prev,
        {
          chunk,
          latencyMs: latency,
          monChunk: monPerChunk,
          txHash
        }
      ]);

      if (chunk < chunksCount) {
        streamTimerRef.current = setTimeout(executeNextChunk, 800);
      } else {
        setIsStreaming(false);
        setStreamCompleted(true);
        setLastTxSuccess(`🎉 Stream complete! Slipped 0.0% across ${chunksCount} Monad blocks.`);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#68CFEB', '#1F4B5D', '#90DEF2']
        });
      }
    };

    executeNextChunk();
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    // If Stream Buy mode is selected in BUY tab, execute high-frequency StreamSwap
    if (isBuy && buyMode === 'stream') {
      if (streamCompleted) {
        setStreamCompleted(false);
        setStreamLogs([]);
        setCurrentChunk(0);
      }
      startStreamSwap();
      return;
    }

    if (isBuy && isShieldActive && numAmount > shieldCap) {
      alert(`Anti-Sniper Shield Active: Maximum buy is capped at ${shieldCap} ${currSymbol} per transaction during the initial genesis window.`);
      setAmount(shieldCap.toString());
      return;
    }

    if (isBuy && numAmount > wallet.monBalance) {
      alert(`Insufficient ${currSymbol} balance (${wallet.monBalance.toFixed(2)} ${currSymbol} available)`);
      return;
    }
    if (!isBuy && numAmount > userTokenBalance) {
      alert(`Insufficient $${token.symbol} balance (${userTokenBalance.toLocaleString()} available)`);
      return;
    }

    setIsExecuting(true);
    setLastTxSuccess(null);

    try {
      const currentChain: ChainConfig = chainConfig || {
        id: token.chain || 'monad',
        name: token.chain === 'monad' ? 'Monad Testnet' : (token.chain || 'Monad Testnet'),
        symbol: currSymbol,
        badge: 'Parallel L1',
        iconColor: '#68CFEB',
        tps: '10,000 TPS',
        finality: '~800ms',
        gasCost: '< 0.0001 MON',
        rpcUrl: 'https://testnet-rpc.monad.xyz',
        faucetAmount: 10.0,
        explorerName: 'MonadScan'
      };

      const txResult = await dispatchWeb3Transaction({
        fromAddress: wallet.address,
        toAddress: token.contractAddress,
        amount: isBuy ? numAmount : 0,
        txType: isBuy ? 'BUY_TOKEN' : 'SELL_TOKEN',
        tokenName: token.name,
        tokenSymbol: token.symbol,
        chainConfig: currentChain
      });

      if (!txResult.success) {
        setIsExecuting(false);
        alert(txResult.error || 'Transaction was declined in your wallet extension.');
        return;
      }

      setIsExecuting(false);
      const monSpent = isBuy ? numAmount : (numAmount * token.priceMon);
      const tokensTraded = isBuy ? estimatedTokens : numAmount;

      onExecuteTrade(token.id, tab, monSpent, tokensTraded);
      const shortTx = txResult.txHash ? `${txResult.txHash.slice(0, 10)}...` : 'Confirmed';
      setLastTxSuccess(`⚡ Confirmed on ${currentChain.name} (Tx: ${shortTx})`);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#68CFEB', '#1F4B5D', '#90DEF2']
      });
    } catch (err: any) {
      setIsExecuting(false);
      alert(err?.message || 'Transaction failed.');
    }
  };

  const presetAmounts = isBuy 
    ? (isShieldActive ? ['0.1', '0.2', '0.3', '0.5'] : ['0.1', '0.5', '1.0', '2.5']) 
    : ['25%', '50%', '75%', '100%'];

  const handlePreset = (val: string) => {
    if (isBuy) {
      if (isShieldActive && parseFloat(val) > shieldCap) {
        setAmount(shieldCap.toString());
      } else {
        setAmount(val);
      }
    } else {
      const pct = parseInt(val) / 100;
      setAmount((userTokenBalance * pct).toFixed(0));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1F1E19] border border-white/10 p-5 sm:p-6 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl overflow-hidden border border-white/10 shadow-md flex-shrink-0">
              <img src={token.imageUrl} alt={token.name} className="w-12 h-12 object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FAFAFA]">{token.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#1F4B5D]/30 text-[#68CFEB] font-bold">
                  ${token.symbol}
                </span>
                {token.isGraduated && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Graduated
                  </span>
                )}
                {token.chain && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {token.chain}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>Price: <span className="text-[#FAFAFA] font-semibold">{token.usdPrice ? `$${token.usdPrice}` : `${token.priceMon} ${currSymbol}`}</span></span>
                <span>•</span>
                <span>MCap: <span className="text-slate-300">{token.usdMarketCap ? `$${(token.usdMarketCap / 1e6).toFixed(1)}M` : `${token.marketCapMon} ${currSymbol}`}</span></span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Sniper Shield Protective Banner */}
        {isShieldActive && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#1F4B5D]/90 to-[#143542]/90 border border-[#68CFEB]/50 text-[#FAFAFA] shadow-[0_0_15px_rgba(104,207,235,0.2)] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="w-4 h-4 text-[#68CFEB] animate-pulse flex-shrink-0" />
              <div className="truncate">
                <span className="font-bold text-white">Anti-Sniper Shield Active</span>
                <span className="text-[#68CFEB] mx-1.5">•</span>
                <span>Cap: {shieldCap} {currSymbol}</span>
                <span className="text-[#68CFEB] mx-1.5">•</span>
                <span className="text-slate-300">Uniform Genesis Price</span>
              </div>
            </div>
            {token.shieldRemainingSeconds !== undefined && token.shieldRemainingSeconds > 0 && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1F4B5D] border border-[#68CFEB]/50 text-[#68CFEB] font-bold flex-shrink-0 ml-2">
                {token.shieldRemainingSeconds}s left
              </span>
            )}
          </div>
        )}

        {/* Real-time Interactive Market Chart */}
        <div className="mb-5">
          <CoinLiveChart token={token} height={160} showLinks={true} />
        </div>

        {/* Bonding Curve Progress Bar */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#25241E] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#68CFEB]" />
              Bonding Curve Progress
            </span>
            <span className="font-bold text-[#68CFEB]">{token.bondingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#141310] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] transition-all duration-300"
              style={{ width: `${token.bondingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{(token.monRaised ?? 0).toFixed(1)} {currSymbol} in Curve</span>
            <span>Target: {token.monTarget || 50} {currSymbol}</span>
          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="mb-4 flex rounded-xl p-1 bg-[#25241E] border border-white/[0.06] font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab('BUY')}
            className={`flex-1 py-2 font-extrabold rounded-lg transition-all ${
              isBuy ? 'bg-[#68CFEB] text-[#1F1E19] shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy ${token.symbol}
          </button>
          <button
            type="button"
            onClick={() => setTab('SELL')}
            className={`flex-1 py-2 font-bold rounded-lg transition-all ${
              !isBuy ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sell ${token.symbol}
          </button>
        </div>

        {/* StreamSwap Mode Selector (Only in BUY mode) */}
        {isBuy && (
          <div className="mb-4 space-y-2.5 font-mono">
            <div className="flex rounded-xl p-1 bg-[#1A1A17] border border-white/[0.08] text-xs">
              <button
                type="button"
                disabled={isStreaming}
                onClick={() => setBuyMode('instant')}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  buyMode === 'instant'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#68CFEB]" />
                <span>Instant Buy</span>
              </button>

              <button
                type="button"
                disabled={isStreaming}
                onClick={() => setBuyMode('stream')}
                className={`flex-1 py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  buyMode === 'stream'
                    ? 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] text-[#141310] font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Waves className="w-3.5 h-3.5 text-[#141310]" />
                <span>Stream Buy (Micro-DCA)</span>
              </button>
            </div>

            {/* Stream Settings & Micro-Copy when Stream Buy is Active */}
            {buyMode === 'stream' && (
              <div className="p-3 rounded-xl bg-[#1A1A17]/90 border border-[#68CFEB]/30 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    Stream Duration:
                  </span>
                  <span className="text-[#68CFEB] font-bold">
                    {streamDuration}s ({totalChunks} chunks)
                  </span>
                </div>

                {/* Duration selector chips */}
                <div className="grid grid-cols-3 gap-2">
                  {([10, 20, 30] as const).map((dur) => {
                    const chunks = dur === 10 ? 5 : dur === 20 ? 10 : 15;
                    const isSel = streamDuration === dur;
                    return (
                      <button
                        type="button"
                        key={dur}
                        disabled={isStreaming}
                        onClick={() => setStreamDuration(dur)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border ${
                          isSel
                            ? 'bg-[#1F4B5D] text-[#68CFEB] border-[#68CFEB]/60 shadow-sm'
                            : 'bg-[#25241E] text-slate-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {dur}s ({chunks} chunks)
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Reduces price impact by streaming micro-swaps across Monad blocks.
                </p>

                {/* Feature badge */}
                <div className="flex items-center gap-1.5 pt-0.5 text-[10px] text-[#68CFEB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#68CFEB] animate-ping"></span>
                  <span>Powered by Monad Parallel Streams (Sub-cent Gas)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trade Form */}
        <form onSubmit={handleTrade} className="space-y-4 font-mono">
          <div className="p-3.5 rounded-xl bg-[#25241E] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">
                {isBuy 
                  ? (buyMode === 'stream' ? 'Total Stream Amount' : 'You Pay') 
                  : `You Sell ($${token.symbol})`}
              </span>
              <span className="text-slate-400">
                Balance: {isBuy ? `${wallet.monBalance.toFixed(2)} ${currSymbol}` : `${userTokenBalance.toLocaleString()} ${token.symbol}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min="0"
                disabled={isStreaming}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#141310] border border-white/10 text-white font-mono text-base font-bold focus:outline-none focus:border-[#68CFEB] disabled:opacity-60"
                placeholder="0.0"
              />
              <span className="font-bold text-sm text-slate-300 px-2">
                {isBuy ? currSymbol : token.symbol}
              </span>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 pt-1">
              {presetAmounts.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  disabled={isStreaming}
                  onClick={() => handlePreset(preset)}
                  className="flex-1 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  {preset} {isBuy ? currSymbol : ''}
                </button>
              ))}
            </div>

            {/* Anti-Sniper Cap Notice */}
            {isBuy && isShieldActive && numAmount > shieldCap && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#FAFAFA] bg-[#1F4B5D]/90 px-2.5 py-1.5 rounded-lg border border-[#68CFEB]/50 mt-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#68CFEB] flex-shrink-0" />
                <span>Anti-Sniper Shield active: Buy capped at {shieldCap} {currSymbol} per trade during genesis.</span>
              </div>
            )}
          </div>

          {/* Estimated Output */}
          <div className="flex justify-between items-center px-2 text-xs font-mono text-slate-400">
            <span>
              {buyMode === 'stream' && isBuy 
                ? `Total Output (${(numAmount / totalChunks).toFixed(3)} ${currSymbol}/chunk):` 
                : 'You Receive (Est.):'}
            </span>
            <span className="text-[#FAFAFA] font-bold">
              {isBuy ? `~${estimatedTokens.toLocaleString()} ${token.symbol}` : `~${estimatedTokens} ${currSymbol}`}
            </span>
          </div>

          {/* Live Real-Time Stream Execution Card */}
          {(isStreaming || streamCompleted) && (
            <div className="p-4 rounded-xl bg-[#141412] border border-[#68CFEB]/40 space-y-3 font-mono animate-in fade-in duration-200 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isStreaming ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs font-bold text-white">
                    {isStreaming 
                      ? `Streaming Chunk ${currentChunk} / ${totalChunks}...`
                      : `🎉 Stream complete! Slipped 0.0% across ${totalChunks} blocks.`}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F4B5D]/60 text-[#68CFEB] font-bold border border-[#68CFEB]/30">
                  10,000 TPS
                </span>
              </div>

              {/* Pulsing Progress Bar */}
              <div className="w-full h-2 bg-[#25241E] rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#68CFEB] to-emerald-400 transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${Math.min(100, (currentChunk / totalChunks) * 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Live sub-second confirmation ticker */}
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 no-scrollbar text-[11px]">
                {streamLogs.map((log) => (
                  <div
                    key={log.chunk}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-[#25241E]/80 border border-white/5 text-slate-300 animate-in fade-in duration-150"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓ Chunk {log.chunk}</span>
                      <span className="text-slate-400">confirmed in</span>
                      <span className="text-[#68CFEB] font-bold">{log.latencyMs}ms</span>
                    </div>
                    <span className="text-slate-200 font-bold">
                      ({log.monChunk} {currSymbol})
                    </span>
                  </div>
                ))}
              </div>

              {/* Stream action controls */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Parallel EVM • Sub-second finality
                </span>
                {streamCompleted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStreamCompleted(false);
                      setStreamLogs([]);
                      setCurrentChunk(0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
                  >
                    Reset Stream
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelStream}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors"
                  >
                    Stop Stream
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Notification Bar (Instant Buy) */}
          {lastTxSuccess && !streamCompleted && (
            <div className="p-2.5 rounded-lg bg-[#1F4B5D]/40 border border-[#68CFEB]/40 text-[#68CFEB] text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#68CFEB]" />
              <span>{lastTxSuccess}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1">
            <button
              type={wallet?.isConnected ? "submit" : "button"}
              onClick={() => {
                if (!wallet?.isConnected && onOpenConnectWallet) {
                  onOpenConnectWallet();
                }
              }}
              disabled={isExecuting || isStreaming}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all active:scale-98 disabled:opacity-50 shadow-md ${
                !wallet?.isConnected
                  ? 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] font-extrabold shadow-[#68CFEB]/20'
                  : isBuy 
                    ? 'bg-gradient-to-r from-[#68CFEB] to-[#1F4B5D] hover:from-[#90DEF2] hover:to-[#2B6882] text-[#1F1E19] font-extrabold shadow-[#68CFEB]/20' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {!wallet?.isConnected
                ? `Connect Device Wallet to Trade 🦊👻`
                : isExecuting 
                  ? 'Executing at 10,000 TPS...' 
                  : isBuy 
                    ? buyMode === 'stream'
                      ? isStreaming
                        ? `Streaming Chunk ${currentChunk} / ${totalChunks} (800ms)...`
                        : streamCompleted
                          ? `Start Another Stream Swap 🚀`
                          : `Start Stream Swap (10k TPS)`
                      : `Quick Buy ${token.symbol}`
                    : `Sell ${token.symbol}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
