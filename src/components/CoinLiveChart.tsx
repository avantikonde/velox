import React, { useState } from 'react';
import { Token } from '../types';
import { TrendingUp, TrendingDown, ExternalLink, Copy, Check, BarChart3, Activity, Layers } from 'lucide-react';

interface CoinLiveChartProps {
  token: Token;
  height?: number;
  showLinks?: boolean;
}

export const CoinLiveChart: React.FC<CoinLiveChartProps> = ({
  token,
  height = 140,
  showLinks = true
}) => {
  const [copied, setCopied] = useState(false);
  const [chartType, setChartType] = useState<'area' | 'candles' | 'depth'>('area');
  const [activeTf, setActiveTf] = useState<'1h' | '24h' | '7d'>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Sparkline data array (or fallback)
  const rawData = token.sparkline7d && token.sparkline7d.length > 0
    ? token.sparkline7d
    : [0.85, 0.88, 0.84, 0.92, 0.95, 0.98, 1.05, 1.10, 1.08, 1.14];

  // Slice data based on timeframe
  const data = activeTf === '1h'
    ? rawData.slice(-12)
    : activeTf === '24h'
    ? rawData.slice(-24)
    : rawData;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  // Generate SVG path coordinates
  const svgWidth = 500;
  const svgHeight = height;
  const paddingBottom = 15;
  const paddingTop = 10;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * svgWidth;
    const y = paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX},${prev.y} ${cpX},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
  const displayedPrice = hoveredPoint 
    ? hoveredPoint.val 
    : (token.usdPrice ?? token.priceMon);

  const isPos = token.priceChange24h >= 0;

  const handleCopyContract = () => {
    if (token.contractAddress && navigator.clipboard) {
      navigator.clipboard.writeText(token.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatPrice = (p: number) => {
    if (p >= 1) return `$${p.toFixed(2)}`;
    if (p >= 0.01) return `$${p.toFixed(4)}`;
    return `$${p.toExponential(4).replace('e-', 'e-')}`;
  };

  return (
    <div className="w-full rounded-2xl bg-[#141310] border border-white/[0.08] p-4 space-y-3 font-mono">
      
      {/* Top Header: Price, 24h Change, Chart Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-[#FAFAFA]">
              {formatPrice(displayedPrice)}
            </span>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPos ? '+' : ''}{token.priceChange24h}% (24h)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
            <span>24h H: <span className="text-slate-200">{formatPrice(token.high24h ?? maxVal)}</span></span>
            <span>•</span>
            <span>24h L: <span className="text-slate-200">{formatPrice(token.low24h ?? minVal)}</span></span>
            {token.usd24hVol && (
              <>
                <span>•</span>
                <span>24h Vol: <span className="text-slate-200">${(token.usd24hVol / 1e6).toFixed(1)}M</span></span>
              </>
            )}
          </div>
        </div>

        {/* Timeframe & View Toggles */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {/* Timeframe */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#25241E] border border-white/5 text-[11px]">
            {(['1h', '24h', '7d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setActiveTf(tf)}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-all ${
                  activeTf === tf ? 'bg-[#68CFEB] text-[#141310]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#25241E] border border-white/5 text-[11px]">
            <button
              onClick={() => setChartType('area')}
              title="Area Line Chart"
              className={`p-1 rounded transition-all ${chartType === 'area' ? 'bg-white/10 text-[#68CFEB]' : 'text-slate-400 hover:text-white'}`}
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('candles')}
              title="Candlestick View"
              className={`p-1 rounded transition-all ${chartType === 'candles' ? 'bg-white/10 text-[#68CFEB]' : 'text-slate-400 hover:text-white'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div 
        className="relative w-full overflow-hidden select-none cursor-crosshair"
        style={{ height: `${height}px` }}
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const idx = Math.round((mouseX / rect.width) * (points.length - 1));
          setHoverIndex(idx);
        }}
      >
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`chartGradient-${token.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#68CFEB" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#1F4B5D" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#141310" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={paddingTop} x2={svgWidth} y2={paddingTop} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1={paddingTop + chartHeight / 2} x2={svgWidth} y2={paddingTop + chartHeight / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1={svgHeight - paddingBottom} x2={svgWidth} y2={svgHeight - paddingBottom} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

          {chartType === 'area' ? (
            <>
              {/* Filled Area */}
              <path d={areaD} fill={`url(#chartGradient-${token.id})`} />
              
              {/* Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#68CFEB"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            /* Candlestick Visualization */
            points.map((pt, idx) => {
              if (idx === 0) return null;
              const prev = points[idx - 1];
              const isUp = pt.val >= prev.val;
              const candleWidth = Math.max(3, (svgWidth / points.length) * 0.7);
              const topY = Math.min(pt.y, prev.y);
              const bodyHeight = Math.max(2, Math.abs(pt.y - prev.y));

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line
                    x1={pt.x}
                    y1={topY - 3}
                    x2={pt.x}
                    y2={topY + bodyHeight + 3}
                    stroke={isUp ? '#34d399' : '#f87171'}
                    strokeWidth="1"
                  />
                  {/* Body */}
                  <rect
                    x={pt.x - candleWidth / 2}
                    y={topY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isUp ? '#34d399' : '#f87171'}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Hover Crosshair & Dot */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={0}
                x2={hoveredPoint.x}
                y2={svgHeight}
                stroke="#68CFEB"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.7"
              />
              <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="#68CFEB" className="animate-ping" opacity="0.6" />
              <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3" fill="#68CFEB" stroke="#141310" strokeWidth="1.5" />
            </g>
          )}

          {/* End Pulse Dot (when not hovered) */}
          {!hoveredPoint && points.length > 0 && (
            <g>
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3.5" fill="#68CFEB" className="animate-ping" opacity="0.7" />
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill="#68CFEB" />
            </g>
          )}
        </svg>

        {/* Floating Tooltip during hover */}
        {hoveredPoint && (
          <div
            className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-[#1F1E19]/90 border border-[#68CFEB]/60 rounded-md px-2 py-0.5 text-[10px] text-[#FAFAFA] font-bold shadow-lg"
            style={{ left: `${(hoveredPoint.x / svgWidth) * 100}%` }}
          >
            {formatPrice(hoveredPoint.val)}
          </div>
        )}
      </div>

      {/* Bottom Metadata & External Verification Links (pump.fun & CoinGecko) */}
      {showLinks && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs">
          
          {/* Contract Address with Copy */}
          {token.contractAddress && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-[11px] text-slate-500">CA:</span>
              <span className="text-[11px] font-mono text-slate-300">
                {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
              </span>
              <button
                onClick={handleCopyContract}
                title="Copy Contract Address"
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}

          {/* Official Verification Links */}
          <div className="flex items-center gap-2">
            {token.pumpFunUrl && (
              <a
                href={token.pumpFunUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25241E] hover:bg-[#2C2B24] border border-white/10 text-[#68CFEB] hover:text-white text-[11px] font-bold transition-all"
              >
                <span>pump.fun</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {token.coingeckoUrl && (
              <a
                href={token.coingeckoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25241E] hover:bg-[#2C2B24] border border-white/10 text-emerald-400 hover:text-white text-[11px] font-bold transition-all"
              >
                <span>CoinGecko</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

