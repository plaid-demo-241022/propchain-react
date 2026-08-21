import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Activity, BarChart2, Zap, Shield, Globe, Clock,
  ChevronUp, ChevronDown, Info, RefreshCw,
  Wallet, X, Copy, CheckCircle2, AlertCircle, ExternalLink,
  LogOut, Download, ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { cn } from '@/lib/utils/cn';

// ─── Static mock data (no live API) ──────────────────────────────────────────
const BTC_PRICE      = 97_842.50;
const BTC_CHANGE_24H = +2.34;          // %
const BTC_CHANGE_7D  = +11.7;          // %
const BTC_MARKET_CAP = '1.93T';
const BTC_VOLUME_24H = '48.2B';
const BTC_DOMINANCE  = '54.8%';
const BTC_ALL_TIME_HIGH = 108_135;
const BTC_CIRCULATING  = '19.73M';
const BTC_MAX_SUPPLY   = '21M';

// Sparkline path — static SVG coordinates representing ~30 days of movement
const SPARKLINE_POINTS = [
  [0,68],[3,72],[6,65],[9,70],[12,60],[15,55],[18,62],[21,50],
  [24,45],[27,52],[30,48],[33,40],[36,35],[39,42],[42,30],[45,22],
  [48,28],[51,20],[54,15],[57,18],[60,10],[63,14],[66,8],[69,12],
  [72,5],[75,10],[78,3],[81,8],[84,0],[87,4],[90,2],
];
function toSvgPath(pts) {
  return pts.map(([x,y],i) => `${i===0?'M':'L'} ${x} ${y}`).join(' ');
}
const SPARK_PATH  = toSvgPath(SPARKLINE_POINTS);
const SPARK_CLOSE = `${SPARK_PATH} L 90 100 L 0 100 Z`;

// Block-height ticker
const CURRENT_BLOCK = 896_412;

// Metrics for the stats grid
const METRICS = [
  { label:'Market Cap',      value:'$'+BTC_MARKET_CAP,  icon:Globe,    color:'#D4AF37', sub:'#1 by market cap' },
  { label:'24h Volume',      value:'$'+BTC_VOLUME_24H,  icon:Activity, color:'#818cf8', sub:'Spot + derivatives' },
  { label:'Dominance',       value:BTC_DOMINANCE,       icon:BarChart2,color:'#34d399', sub:'Of total crypto mkt' },
  { label:'Halving',         value:'~2028',              icon:Clock,    color:'#f59e0b', sub:'Next halving est.' },
  { label:'Block Height',    value:CURRENT_BLOCK.toLocaleString(), icon:Zap, color:'#60a5fa', sub:'Latest confirmed' },
  { label:'All-Time High',   value:'$'+BTC_ALL_TIME_HIGH.toLocaleString(), icon:TrendingUp, color:'#f472b6', sub:'Nov 22, 2024' },
];

// Fear & Greed (static)
const FEAR_GREED = 72; // 0–100, ≥60 = Greed

// Recent mock transactions (mempool-style feed)
const MEMPOOL = [
  { hash:'3a9f…e71c', amount:'12.4500',  fee:'0.00012', age:'2s'  },
  { hash:'b02d…1a3e', amount:'0.0821',   fee:'0.00008', age:'4s'  },
  { hash:'7c4e…f990', amount:'245.0000', fee:'0.00045', age:'9s'  },
  { hash:'d11a…8b2f', amount:'1.3300',   fee:'0.00011', age:'15s' },
  { hash:'e5f6…3c09', amount:'0.5000',   fee:'0.00009', age:'21s' },
  { hash:'00cb…4471', amount:'88.8888',  fee:'0.00033', age:'30s' },
];

// Price history sparkline data for the chart panel (mock weekly candles)
const CANDLES = [
  { d:'Mon', o:86200, h:88400, l:85100, c:87900 },
  { d:'Tue', o:87900, h:90200, l:87000, c:89500 },
  { d:'Wed', o:89500, h:91800, l:88200, c:88700 },
  { d:'Thu', o:88700, h:92100, l:88000, c:91600 },
  { d:'Fri', o:91600, h:95000, l:91000, c:94200 },
  { d:'Sat', o:94200, h:97100, l:93400, c:96800 },
  { d:'Sun', o:96800, h:98500, l:96100, c:97842 },
];
const CANDLE_MIN = 85000;
const CANDLE_RANGE = 98500 - 85000;
function candlePct(v) { return 100 - ((v - CANDLE_MIN) / CANDLE_RANGE) * 100; }

// ─── Bitcoin "B" logo (inline SVG) ───────────────────────────────────────────
function BtcLogo({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="20" fill="#F7931A"/>
      <path
        d="M27.8 17.5c.4-2.5-1.5-3.9-4.1-4.8l.8-3.4-2.1-.5-.8 3.3-1.7-.4.8-3.3-2.1-.5-.8 3.4-3.4-.8-.5 2.2s1.5.4 1.5.4c.8.2 1 .7.9 1.1l-2.2 8.8c-.1.3-.4.7-1.1.6l-1.5-.4-.6 2.4 3.2.8-.8 3.4 2.1.5.8-3.4 1.7.4-.8 3.4 2.1.5.8-3.4c3.4.6 6-.2 7.1-3.2.9-2.4-.1-3.8-1.8-4.7 1.3-.3 2.2-1.2 2.5-2.9zm-4.5 6.3c-.6 2.6-5 1.2-6.4.9l1.1-4.6c1.4.3 5.9 1 5.3 3.7zm.7-6.4c-.6 2.3-4.3 1.1-5.5.8l1-4.1c1.2.3 5.2.9 4.5 3.3z"
        fill="white"
      />
    </svg>
  );
}

// ─── Bitcoin wallet helpers ───────────────────────────────────────────────────

function truncBtc(addr) {
  if (!addr) return '';
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

// Detect installed Bitcoin-native wallets by sniffing window providers
function detectBtcWallets() {
  const found = [];
  if (typeof window === 'undefined') return found;
  if (window.unisat)                              found.push('unisat');
  if (window.XverseProviders?.BitcoinProvider ||
      window.BitcoinProvider)                    found.push('xverse');
  if (window.okxwallet?.bitcoin)                 found.push('okx');
  if (window.phantom?.bitcoin)                   found.push('phantom');
  return found;
}

// ── Wallet icon SVGs ──────────────────────────────────────────────────────────
function UnisatIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#F7931A"/>
      <circle cx="20" cy="20" r="10" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M20 12v16M12 20h16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}
function XverseIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#1A1033"/>
      <path d="M13 13l14 14M27 13L13 27" stroke="#F7931A" strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
  );
}
function OKXIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#000"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white"/>
      <rect x="22" y="11" width="7" height="7" rx="1.5" fill="white"/>
      <rect x="11" y="22" width="7" height="7" rx="1.5" fill="white"/>
      <rect x="22" y="22" width="7" height="7" rx="1.5" fill="white"/>
    </svg>
  );
}
function PhantomBtcIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#4E44CE"/>
      <circle cx="20" cy="20" r="9" fill="white" opacity="0.15"/>
      <path d="M14 20c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="2.5" fill="white"/>
    </svg>
  );
}

// ── Connect implementations ───────────────────────────────────────────────────
async function connectUnisat() {
  const p = window.unisat;
  if (!p) throw new Error('UniSat is not installed');
  const accounts = await p.requestAccounts();
  if (!accounts?.length) throw new Error('No accounts returned');
  const address = accounts[0];
  let balance = '—';
  try {
    const b = await p.getBalance();
    // b.total is in satoshis
    balance = `${(b.total / 1e8).toFixed(8)} BTC`;
  } catch { /* non-fatal */ }
  return { address, balance, network: 'Bitcoin Mainnet' };
}

async function connectXverse() {
  const p = window.XverseProviders?.BitcoinProvider ?? window.BitcoinProvider;
  if (!p) throw new Error('Xverse is not installed');
  // Xverse uses the Wallet Standard / BIP-122 provider
  const resp = await p.request('getAccounts', null);
  const accounts = resp?.result ?? resp;
  if (!accounts?.length) throw new Error('No accounts returned');
  const address = accounts[0].address ?? accounts[0];
  return { address, balance: '—', network: 'Bitcoin Mainnet' };
}

async function connectOKX() {
  const p = window.okxwallet?.bitcoin;
  if (!p) throw new Error('OKX Wallet is not installed');
  const resp = await p.connect();
  const address = resp?.address ?? resp;
  if (!address) throw new Error('No address returned');
  let balance = '—';
  try {
    const b = await p.getBalance();
    if (b?.total != null) balance = `${(b.total / 1e8).toFixed(8)} BTC`;
  } catch { /* non-fatal */ }
  return { address, balance, network: 'Bitcoin Mainnet' };
}

async function connectPhantomBtc() {
  const p = window.phantom?.bitcoin;
  if (!p) throw new Error('Phantom (Bitcoin) is not installed');
  const accounts = await p.requestAccounts();
  if (!accounts?.length) throw new Error('No accounts returned');
  return { address: accounts[0].address ?? accounts[0], balance: '—', network: 'Bitcoin Mainnet' };
}

async function notInstalledBtc(name) {
  throw new Error(`${name} requires the browser extension. Please install it first.`);
}

// Re-fetch address + balance for an already-connected wallet (used for status checks)
async function refreshWalletStatus(walletId) {
  try {
    switch (walletId) {
      case 'unisat': {
        const p = window.unisat;
        if (!p) return null;
        const accounts = await p.getAccounts();
        if (!accounts?.length) return null;           // locked / disconnected
        const address = accounts[0];
        let balance = '—';
        try {
          const b = await p.getBalance();
          balance = `${(b.total / 1e8).toFixed(8)} BTC`;
        } catch { /* non-fatal */ }
        return { address, balance };
      }
      case 'xverse': {
        const p = window.XverseProviders?.BitcoinProvider ?? window.BitcoinProvider;
        if (!p) return null;
        const resp = await p.request('getAccounts', null);
        const accounts = resp?.result ?? resp;
        if (!accounts?.length) return null;
        return { address: accounts[0].address ?? accounts[0], balance: '—' };
      }
      case 'okx': {
        const p = window.okxwallet?.bitcoin;
        if (!p) return null;
        const accounts = await p.getAccounts();
        if (!accounts?.length) return null;
        let balance = '—';
        try {
          const b = await p.getBalance();
          if (b?.total != null) balance = `${(b.total / 1e8).toFixed(8)} BTC`;
        } catch { /* non-fatal */ }
        return { address: accounts[0], balance };
      }
      case 'phantom': {
        const p = window.phantom?.bitcoin;
        if (!p) return null;
        const accounts = await p.getAccounts?.();
        if (!accounts?.length) return null;
        return { address: accounts[0].address ?? accounts[0], balance: '—' };
      }
      default:
        return null;
    }
  } catch {
    return null;   // any error = treat as disconnected
  }
}

// ── Wallet registry ───────────────────────────────────────────────────────────
const BTC_WALLETS = [
  {
    id: 'unisat',
    name: 'UniSat',
    desc: 'Native Bitcoin wallet & Ordinals',
    icon: <UnisatIcon />,
    color: '#F7931A',
    installUrl: 'https://unisat.io/',
    connect: connectUnisat,
  },
  {
    id: 'xverse',
    name: 'Xverse',
    desc: 'Bitcoin, Ordinals & Stacks',
    icon: <XverseIcon />,
    color: '#FF6B35',
    installUrl: 'https://www.xverse.app/',
    connect: connectXverse,
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    desc: 'Multi-chain including Bitcoin',
    icon: <OKXIcon />,
    color: '#FFFFFF',
    installUrl: 'https://www.okx.com/web3/wallet',
    connect: connectOKX,
  },
  {
    id: 'phantom',
    name: 'Phantom',
    desc: 'Now supports native Bitcoin',
    icon: <PhantomBtcIcon />,
    color: '#4E44CE',
    installUrl: 'https://phantom.app/',
    connect: connectPhantomBtc,
  },
];

// ── Sub-views ─────────────────────────────────────────────────────────────────
function BtcWalletRow({ wallet, isInstalled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button onClick={onClick} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all"
      style={{
        background: hov ? `rgba(247,147,26,0.07)` : 'rgba(255,255,255,0.03)',
        border: hov ? `1px solid rgba(247,147,26,0.22)` : '1px solid rgba(255,255,255,0.05)',
      }}>
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">{wallet.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-outfit font-semibold text-sm text-white">{wallet.name}</span>
          {isInstalled && (
            <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Detected
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/40 mt-0.5 font-outfit">{wallet.desc}</p>
      </div>
      {isInstalled
        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/>
        : <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0"/>}
    </motion.button>
  );
}

function BtcConnectingView({ wallet, onCancel }) {
  return (
    <div className="flex flex-col items-center py-10 px-6 text-center">
      <div className="relative w-24 h-24 mb-6">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full border border-orange-400"
            style={{ opacity: 0.5 - i * 0.14 }}
            animate={{ scale: [1, 1.2 + i * 0.12, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}/>
        ))}
        <div className="absolute inset-3 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(247,147,26,0.1)' }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden">{wallet.icon}</div>
        </div>
      </div>
      <h3 className="font-outfit font-bold text-lg text-white mb-2">Connecting to {wallet.name}</h3>
      <p className="text-sm text-white/40 font-outfit mb-8 max-w-[240px]">
        Approve the connection request in your wallet extension.
      </p>
      <button onClick={onCancel} className="text-sm text-white/40 hover:text-white/70 font-outfit transition-colors">
        Cancel
      </button>
    </div>
  );
}

function BtcConnectedView({ state, onDisconnect, onCopy, copied, onRefresh, refreshing, lastChecked }) {
  return (
    <div className="flex flex-col items-center py-6 px-6 text-center">
      {/* Wallet avatar */}
      <div className="relative w-20 h-20 mb-5">
        <motion.div className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.3)' }}
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}/>
        <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl overflow-hidden">{state.wallet.icon}</div>
        </div>
        <motion.div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: '#F7931A' }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-white"/>
        </motion.div>
      </div>

      <h3 className="font-outfit font-bold text-lg text-white mb-0.5">Connected</h3>
      <p className="text-xs text-white/35 font-outfit mb-5">{state.network}</p>

      {/* Address copy button */}
      <motion.button onClick={onCopy} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3"
        style={{ background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.2)' }}>
        <span className="font-mono text-sm" style={{ color: '#F7931A' }}>{truncBtc(state.address)}</span>
        {copied
          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>
          : <Copy className="w-3.5 h-3.5 text-white/30"/>}
      </motion.button>

      {/* Balance row with refresh */}
      <div className="w-full rounded-xl mb-2 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-white/40 font-outfit">Balance</span>
          <div className="flex items-center gap-2">
            <span className="font-outfit font-bold text-white stat-value">{state.balance}</span>
            <motion.button onClick={onRefresh} disabled={refreshing}
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
              className="text-white/25 hover:text-white/60 transition-colors disabled:cursor-wait"
              title="Refresh balance">
              <RefreshCw className="w-3.5 h-3.5"/>
            </motion.button>
          </div>
        </div>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(247,147,26,0.04)' }}>
          <div className="flex items-center gap-1.5">
            {refreshing ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400"/>
              </span>
            ) : (
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
            )}
            <span className="text-[10px] font-outfit text-white/30">
              {refreshing ? 'Checking status…' : 'Wallet active'}
            </span>
          </div>
          {lastChecked && (
            <span className="text-[10px] font-outfit text-white/20">
              {lastChecked}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex gap-2 mt-3">
        <a href={`https://mempool.space/address/${state.address}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <ExternalLink className="w-3.5 h-3.5"/> Mempool
        </a>
        <button onClick={onDisconnect}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-red-400 hover:text-red-300 transition-colors"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <LogOut className="w-3.5 h-3.5"/> Disconnect
        </button>
      </div>
    </div>
  );
}

function BtcErrorView({ wallet, message, onRetry, onBack }) {
  const isNotInstalled = message.toLowerCase().includes('not installed');
  return (
    <div className="flex flex-col items-center py-8 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertCircle className="w-8 h-8 text-red-400"/>
      </div>
      <h3 className="font-outfit font-bold text-lg text-white mb-2">
        {isNotInstalled ? `${wallet.name} Not Found` : 'Connection Failed'}
      </h3>
      <p className="text-sm text-white/40 font-outfit mb-6 max-w-[260px]">{message}</p>
      <div className="w-full flex gap-2">
        <button onClick={onBack}
          className="flex-1 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Back
        </button>
        {isNotInstalled ? (
          <a href={wallet.installUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white"
            style={{ background: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.3)' }}>
            <Download className="w-3.5 h-3.5"/> Install
          </a>
        ) : (
          <button onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white"
            style={{ background: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.3)' }}>
            <RefreshCw className="w-3.5 h-3.5"/> Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────
function BtcWalletModal({ onClose, connected, onConnect, onDisconnect, detectedIds }) {
  const [view, setView]         = useState(connected ? 'connected' : 'select');
  const [active, setActive]     = useState(connected?.wallet ?? null);
  const [errMsg, setErrMsg]     = useState('');
  const [copied, setCopied]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const abortRef                = useRef(false);

  useEffect(() => { if (connected) setView('connected'); }, [connected]);
  useEffect(() => () => { abortRef.current = true; }, []);

  // ── Status checker ──────────────────────────────────────────────────────
  const checkStatus = useCallback(async () => {
    if (!connected?.wallet?.id) return;
    setRefreshing(true);
    const result = await refreshWalletStatus(connected.wallet.id);
    if (abortRef.current) return;
    if (!result) {
      // wallet locked / account removed — treat as disconnected
      onDisconnect();
      setView('select');
      setActive(null);
    } else {
      // Update address + balance in-place if they changed
      if (result.address !== connected.address || result.balance !== connected.balance) {
        onConnect({ ...connected, ...result });
      }
      const now = new Date();
      setLastChecked(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }
    setRefreshing(false);
  }, [connected, onConnect, onDisconnect]);

  // Auto-check every 30 s while connected view is open
  useEffect(() => {
    if (view !== 'connected') return;
    // Run once immediately when the connected view opens
    checkStatus();
    const interval = setInterval(checkStatus, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Account-change listeners for wallets that emit events
  useEffect(() => {
    if (!connected?.wallet?.id) return;
    const id = connected.wallet.id;

    const handleAccountChange = (newAccounts) => {
      const addr = Array.isArray(newAccounts) ? newAccounts[0] : newAccounts?.address;
      if (!addr) { onDisconnect(); return; }
      if (addr !== connected.address) onConnect({ ...connected, address: addr, balance: '—' });
    };

    if (id === 'unisat' && window.unisat) {
      window.unisat.on('accountsChanged', handleAccountChange);
      return () => window.unisat.removeListener?.('accountsChanged', handleAccountChange);
    }
    if (id === 'okx' && window.okxwallet?.bitcoin) {
      window.okxwallet.bitcoin.on('accountChanged', handleAccountChange);
      return () => window.okxwallet.bitcoin.removeListener?.('accountChanged', handleAccountChange);
    }
    // Phantom Bitcoin doesn't have a stable event API yet; polling covers it
  }, [connected, onConnect, onDisconnect]);

  const pick = useCallback(async (wallet) => {
    abortRef.current = false;
    setActive(wallet);
    setView('connecting');
    try {
      const res = await wallet.connect();
      if (abortRef.current) return;
      onConnect({ wallet, ...res });
      setView('connected');
    } catch (e) {
      if (abortRef.current) return;
      const raw = e instanceof Error ? e.message : 'Unknown error';
      const msg = (raw.includes('4001') || raw.toLowerCase().includes('reject'))
        ? 'You rejected the request in your wallet.'
        : raw;
      setErrMsg(msg);
      setView('error');
    }
  }, [onConnect]);

  const retry      = useCallback(() => { if (active) pick(active); }, [active, pick]);
  const disconnect = useCallback(() => {
    onDisconnect();
    setView('select');
    setActive(null);
  }, [onDisconnect]);
  const copy = useCallback(() => {
    if (!connected?.address) return;
    navigator.clipboard.writeText(connected.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [connected]);

  const sorted = [...BTC_WALLETS].sort((a, b) =>
    (detectedIds.includes(a.id) ? 0 : 1) - (detectedIds.includes(b.id) ? 0 : 1)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true" role="dialog">

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(8,4,0,0.99)',
          border: '1px solid rgba(247,147,26,0.25)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(247,147,26,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>

        {/* Header — only on select + connected views */}
        {(view === 'select' || view === 'connected') && (
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <BtcLogo size={22}/>
              <h2 className="font-outfit font-bold text-[15px] text-white">
                {view === 'select' ? 'Connect Bitcoin Wallet' : 'Bitcoin Wallet'}
              </h2>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-all"
              aria-label="Close">
              <X className="w-4 h-4"/>
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Select view */}
          {view === 'select' && (
            <motion.div key="select"
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.18 }}
              className="p-3 max-h-[70vh] overflow-y-auto no-scrollbar">

              {detectedIds.length > 0 && (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/25 font-outfit px-2 mb-2 mt-1">
                    Detected in Browser
                  </p>
                  <div className="space-y-1 mb-3">
                    {sorted.filter(w => detectedIds.includes(w.id)).map(w => (
                      <BtcWalletRow key={w.id} wallet={w} isInstalled onClick={() => pick(w)}/>
                    ))}
                  </div>
                </>
              )}

              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/25 font-outfit px-2 mb-2 mt-1">
                {detectedIds.length > 0 ? 'Other Wallets' : 'Bitcoin Wallets'}
              </p>
              <div className="space-y-1">
                {sorted.filter(w => !detectedIds.includes(w.id)).map(w => (
                  <BtcWalletRow key={w.id} wallet={w} isInstalled={false} onClick={() => pick(w)}/>
                ))}
              </div>

              {/* Network badge */}
              <div className="mx-2 mt-4 mb-1 px-3 py-2.5 rounded-xl flex items-center gap-2.5"
                style={{ background: 'rgba(247,147,26,0.06)', border: '1px solid rgba(247,147,26,0.12)' }}>
                <BtcLogo size={18}/>
                <p className="text-[11px] text-white/40 font-outfit">
                  Connect a native Bitcoin wallet to view your BTC balance and address.
                </p>
              </div>
            </motion.div>
          )}

          {/* Connecting */}
          {view === 'connecting' && active && (
            <motion.div key="connecting"
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.18 }}>
              <BtcConnectingView wallet={active} onCancel={() => { abortRef.current = true; setView('select'); }}/>
            </motion.div>
          )}

          {/* Connected */}
          {view === 'connected' && connected && (
            <motion.div key="connected"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}>
              <BtcConnectedView
                state={connected}
                onDisconnect={disconnect}
                onCopy={copy}
                copied={copied}
                onRefresh={checkStatus}
                refreshing={refreshing}
                lastChecked={lastChecked}
              />
            </motion.div>
          )}

          {/* Error */}
          {view === 'error' && active && (
            <motion.div key="error"
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.18 }}>
              <BtcErrorView wallet={active} message={errMsg} onRetry={retry} onBack={() => setView('select')}/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Connect button (used in page header) ─────────────────────────────────────
function BtcConnectButton({ connected, onOpen }) {
  if (connected) {
    return (
      <motion.button onClick={onOpen} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-outfit text-sm font-semibold"
        style={{
          background: 'rgba(247,147,26,0.1)',
          border: '1px solid rgba(247,147,26,0.3)',
          color: 'rgba(247,147,26,0.95)',
        }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#F7931A' }}/>
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#F7931A' }}/>
        </span>
        <span className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0">{connected.wallet.icon}</span>
        {truncBtc(connected.address)}
      </motion.button>
    );
  }
  return (
    <motion.button onClick={onOpen} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-outfit text-sm font-bold overflow-hidden"
      style={{
        background: 'rgba(247,147,26,0.1)',
        border: '1px solid rgba(247,147,26,0.3)',
        color: 'rgba(247,147,26,0.95)',
        boxShadow: '0 0 20px rgba(247,147,26,0.1)',
      }}>
      <BtcLogo size={16}/>
      Connect Bitcoin Wallet
      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent -skew-x-12 pointer-events-none"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}/>
    </motion.button>
  );
}

// ─── Animated price counter ───────────────────────────────────────────────────
function AnimatedPrice({ target, prefix = '$', decimals = 2 }) {
  const [display, setDisplay] = useState(target * 0.96);
  useEffect(() => {
    let start = null;
    const duration = 1200;
    const from = target * 0.96;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * ease);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return (
    <span className="stat-value">
      {prefix}{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

// ─── Fear & Greed gauge ───────────────────────────────────────────────────────
function FearGreedGauge({ value }) {
  const angle = -90 + (value / 100) * 180;
  const label = value >= 75 ? 'Extreme Greed'
    : value >= 55 ? 'Greed'
    : value >= 45 ? 'Neutral'
    : value >= 25 ? 'Fear'
    : 'Extreme Fear';
  const color = value >= 55 ? '#34d399' : value >= 45 ? '#f59e0b' : '#f87171';

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        {/* Background arc */}
        <path d="M 10 85 A 70 70 0 0 1 150 85" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round"/>
        {/* Colored arc segments */}
        <path d="M 10 85 A 70 70 0 0 1 43 23" fill="none" stroke="#f87171" strokeWidth="12" strokeLinecap="round" opacity="0.7"/>
        <path d="M 43 23 A 70 70 0 0 1 80 14" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" opacity="0.7"/>
        <path d="M 80 14 A 70 70 0 0 1 117 23" fill="none" stroke="#facc15" strokeWidth="12" strokeLinecap="round" opacity="0.7"/>
        <path d="M 117 23 A 70 70 0 0 1 150 85" fill="none" stroke="#34d399" strokeWidth="12" strokeLinecap="round" opacity="0.7"/>
        {/* Needle */}
        <motion.g
          style={{ transformOrigin: '80px 85px' }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }}>
          <line x1="80" y1="85" x2="80" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="80" cy="85" r="5" fill="white"/>
        </motion.g>
      </svg>
      <motion.p className="font-outfit font-black text-lg leading-none -mt-1" style={{ color }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {value}
      </motion.p>
      <p className="text-white/40 text-xs font-outfit mt-1">{label}</p>
    </div>
  );
}

// ─── Candlestick chart ────────────────────────────────────────────────────────
function CandleChart({ candles }) {
  return (
    <div className="flex items-end gap-2 h-32 w-full px-2">
      {candles.map((c, i) => {
        const isGreen = c.c >= c.o;
        const bodyTop  = Math.min(candlePct(c.o), candlePct(c.c));
        const bodyH    = Math.abs(candlePct(c.o) - candlePct(c.c));
        const wickTop  = candlePct(c.h);
        const wickH    = Math.abs(candlePct(c.h) - candlePct(c.l));
        const color    = isGreen ? '#34d399' : '#f87171';
        return (
          <div key={c.d} className="flex-1 flex flex-col items-center gap-0" title={`${c.d}: O${c.o} H${c.h} L${c.l} C${c.c}`}>
            <div className="relative w-full flex flex-col items-center" style={{ height: '128px' }}>
              {/* Wick */}
              <motion.div
                className="absolute w-px rounded-full"
                style={{ top: `${wickTop}%`, height: `${wickH}%`, background: color, left: '50%', transform: 'translateX(-50%)' }}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.4 }}
              />
              {/* Body */}
              <motion.div
                className="absolute rounded-sm"
                style={{ top: `${bodyTop}%`, height: `${Math.max(bodyH, 1.5)}%`, width: '60%', background: color, opacity: 0.85 }}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.07 + 0.1, duration: 0.35 }}
              />
            </div>
            <p className="text-[9px] text-white/25 font-outfit mt-1">{c.d}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Live mempool row ─────────────────────────────────────────────────────────
function MempoolRow({ tx, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.2)' }}>
        <Zap className="w-3.5 h-3.5" style={{ color: '#F7931A' }}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[11px] text-white/60 truncate">{tx.hash}</p>
        <p className="text-[10px] text-white/25 font-outfit">{tx.fee} BTC fee · {tx.age} ago</p>
      </div>
      <p className="font-outfit font-bold text-sm text-white/80 stat-value flex-shrink-0">{tx.amount} ₿</p>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BitcoinPage() {
  const [activeTab, setActiveTab]       = useState('1W');
  const [mempoolTick, setMempoolTick]   = useState(0);
  const [walletOpen, setWalletOpen]     = useState(false);
  const [btcConnected, setBtcConnected] = useState(null);
  const [detectedIds, setDetectedIds]   = useState([]);
  const isUp = BTC_CHANGE_24H > 0;

  // Detect installed Bitcoin wallets once on mount
  useEffect(() => {
    const found = detectBtcWallets();
    setDetectedIds(found);
    // Re-check after a short delay (some injections are async)
    const t = setTimeout(() => setDetectedIds(detectBtcWallets()), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Background status checker (runs even when modal is closed) ──────────
  const [statusRefreshing, setStatusRefreshing] = useState(false);
  const [statusLastChecked, setStatusLastChecked] = useState(null);

  const checkBannerStatus = useCallback(async () => {
    if (!btcConnected?.wallet?.id) return;
    setStatusRefreshing(true);
    const result = await refreshWalletStatus(btcConnected.wallet.id);
    if (!result) {
      setBtcConnected(null);           // wallet locked / disconnected
    } else {
      if (result.address !== btcConnected.address || result.balance !== btcConnected.balance) {
        setBtcConnected(prev => prev ? { ...prev, ...result } : null);
      }
      const now = new Date();
      setStatusLastChecked(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }
    setStatusRefreshing(false);
  }, [btcConnected]);

  // Poll every 30 s while connected
  useEffect(() => {
    if (!btcConnected) return;
    checkBannerStatus();
    const interval = setInterval(checkBannerStatus, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcConnected?.wallet?.id]);

  // Account-change listeners on the page level (covers closed-modal case)
  useEffect(() => {
    if (!btcConnected?.wallet?.id) return;
    const id = btcConnected.wallet.id;
    const handleChange = (newAccounts) => {
      const addr = Array.isArray(newAccounts) ? newAccounts[0] : newAccounts?.address;
      if (!addr) { setBtcConnected(null); return; }
      if (addr !== btcConnected.address)
        setBtcConnected(prev => prev ? { ...prev, address: addr, balance: '—' } : null);
    };
    if (id === 'unisat' && window.unisat) {
      window.unisat.on('accountsChanged', handleChange);
      return () => window.unisat.removeListener?.('accountsChanged', handleChange);
    }
    if (id === 'okx' && window.okxwallet?.bitcoin) {
      window.okxwallet.bitcoin.on('accountChanged', handleChange);
      return () => window.okxwallet.bitcoin.removeListener?.('accountChanged', handleChange);
    }
  }, [btcConnected?.wallet?.id, btcConnected?.address]);

  // Escape key closes modal
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setWalletOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Simulate mempool refresh every 8s
  useEffect(() => {
    const t = setInterval(() => setMempoolTick(n => n + 1), 8000);
    return () => clearInterval(t);
  }, []);

  // Shuffle mempool on tick (just reorders — no real API)
  const displayMempool = [...MEMPOOL].sort(() => (mempoolTick % 2 === 0 ? 1 : -1));

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 bg-obsidian-950 min-h-screen">

        {/* ── Page header ── */}
        <div className="container-xl mb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <BtcLogo size={52}/>
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="font-outfit font-black text-3xl text-white">Bitcoin</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-obsidian-950"
                    style={{ background: 'linear-gradient(135deg,#F7931A,#ffb347)' }}>BTC</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.25)', color: '#F7931A' }}>
                    #1 Rank
                  </span>
                </div>
                <p className="text-white/40 text-sm font-outfit">Digital Gold · Proof of Work · Fixed Supply</p>
              </div>
            </div>

            {/* Right side: price + connect button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
              {/* Connect Bitcoin Wallet button */}
              <BtcConnectButton connected={btcConnected} onOpen={() => setWalletOpen(true)}/>

              {/* Live price hero */}
              <div className="text-right">
                <p className="font-outfit font-black text-4xl text-white leading-none mb-1">
                  <AnimatedPrice target={BTC_PRICE}/>
                </p>
                <div className={`flex items-center justify-end gap-1.5 text-sm font-bold font-outfit ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? <ArrowUpRight className="w-4 h-4"/> : <ArrowDownRight className="w-4 h-4"/>}
                  {isUp ? '+' : ''}{BTC_CHANGE_24H}% (24h)
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Connected wallet banner (visible when connected) ── */}
        <AnimatePresence>
          {btcConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="container-xl mb-4 overflow-hidden">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(247,147,26,0.07)', border: '1px solid rgba(247,147,26,0.2)' }}>
                {/* Main row */}
                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">{btcConnected.wallet.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-outfit font-bold text-white text-sm">{btcConnected.wallet.name}</p>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#F7931A' }}/>
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#F7931A' }}/>
                        </span>
                      </div>
                      <p className="font-mono text-xs text-white/40 mt-0.5">{btcConnected.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 font-outfit uppercase tracking-wider">Balance</p>
                      <p className="font-outfit font-bold text-white stat-value">{btcConnected.balance}</p>
                    </div>
                    {/* Manual refresh button */}
                    <motion.button
                      onClick={checkBannerStatus}
                      disabled={statusRefreshing}
                      animate={statusRefreshing ? { rotate: 360 } : { rotate: 0 }}
                      transition={statusRefreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
                      className="text-white/30 hover:text-white/70 transition-colors disabled:cursor-wait"
                      title="Refresh wallet status">
                      <RefreshCw className="w-4 h-4"/>
                    </motion.button>
                    <a href={`https://mempool.space/address/${btcConnected.address}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-outfit text-white/30 hover:text-white/70 transition-colors">
                      <ExternalLink className="w-3 h-3"/> Explorer
                    </a>
                    <button onClick={() => setBtcConnected(null)}
                      className="text-white/20 hover:text-red-400 transition-colors" title="Disconnect">
                      <LogOut className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
                {/* Status bar */}
                <div className="px-5 py-2 flex items-center justify-between gap-3"
                  style={{ borderTop: '1px solid rgba(247,147,26,0.1)', background: 'rgba(0,0,0,0.15)' }}>
                  <div className="flex items-center gap-2">
                    {statusRefreshing ? (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"/>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-400"/>
                      </span>
                    ) : (
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
                    )}
                    <span className="text-[10px] font-outfit text-white/30">
                      {statusRefreshing ? 'Checking wallet status…' : 'Wallet active · auto-refreshes every 30s'}
                    </span>
                  </div>
                  {statusLastChecked && (
                    <span className="text-[10px] font-outfit text-white/20 flex-shrink-0">
                      Last checked {statusLastChecked}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container-xl space-y-6">

          {/* ── Top metrics grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {METRICS.map((m, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl p-4 flex flex-col"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.color}22` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                  style={{ background: `${m.color}14` }}>
                  <m.icon className="w-4 h-4" style={{ color: m.color }}/>
                </div>
                <p className="font-outfit font-black text-base text-white stat-value leading-tight">{m.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: `${m.color}99` }}>{m.label}</p>
                <p className="text-white/20 text-[9px] font-outfit mt-0.5">{m.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Main 2-col layout ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left: Chart panel ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Price chart card */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

                {/* Chart header */}
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-white/40 text-xs font-outfit uppercase tracking-widest">BTC / USD</p>
                    <p className="font-outfit font-black text-2xl text-white stat-value mt-0.5">
                      <AnimatedPrice target={BTC_PRICE}/>
                    </p>
                    <div className={`flex items-center gap-1 text-sm font-bold font-outfit mt-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                      {isUp ? '+' : ''}{BTC_CHANGE_24H}% this week
                    </div>
                  </div>
                  {/* Timeframe tabs */}
                  <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {['1D','1W','1M','1Y'].map(t => (
                      <button key={t} onClick={() => setActiveTab(t)}
                        className="px-3 py-1.5 rounded-lg text-xs font-outfit font-bold transition-all"
                        style={activeTab === t
                          ? { background: 'rgba(247,147,26,0.2)', color: '#F7931A', border: '1px solid rgba(247,147,26,0.3)' }
                          : { color: 'rgba(255,255,255,0.3)', border: '1px solid transparent' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sparkline */}
                <div className="px-4 pt-4 pb-2">
                  <svg viewBox="0 0 90 100" className="w-full h-36" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="btcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F7931A" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#F7931A" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <motion.path d={SPARK_CLOSE} fill="url(#btcGrad)"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}/>
                    <motion.path d={SPARK_PATH} fill="none" stroke="#F7931A" strokeWidth="1.5"
                      pathLength="1"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}/>
                    {/* Latest price dot */}
                    <motion.circle cx="90" cy="2" r="2.5" fill="#F7931A"
                      animate={{ r: [2.5, 4, 2.5] }} transition={{ duration: 2, repeat: Infinity }}/>
                  </svg>
                </div>

                {/* Candle chart */}
                <div className="px-4 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20 mb-2 font-outfit px-2">7-Day Candles</p>
                  <CandleChart candles={CANDLES}/>
                </div>
              </motion.div>

              {/* ── Supply & Halving info row ── */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Supply bar */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(247,147,26,0.15)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(247,147,26,0.12)' }}>
                      <Shield className="w-3.5 h-3.5" style={{ color: '#F7931A' }}/>
                    </div>
                    <p className="font-outfit font-black text-white text-sm">Circulating Supply</p>
                  </div>
                  <p className="font-outfit font-black text-2xl text-white stat-value mb-1">
                    ₿ {BTC_CIRCULATING}
                  </p>
                  <p className="text-white/30 text-xs font-outfit mb-3">of {BTC_MAX_SUPPLY} max supply (hard cap)</p>
                  {/* Supply bar */}
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#F7931A,#ffb347)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(19.73/21)*100}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}/>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-white/30 font-outfit">Mined</span>
                    <span className="text-[10px] font-bold" style={{ color: '#F7931A' }}>
                      {((19.73/21)*100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>

                {/* Halving countdown */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
                      <Clock className="w-3.5 h-3.5 text-indigo-400"/>
                    </div>
                    <p className="font-outfit font-black text-white text-sm">Next Halving</p>
                  </div>
                  <p className="font-outfit font-black text-2xl text-white mb-1">~April 2028</p>
                  <p className="text-white/30 text-xs font-outfit mb-3">Block reward drops to 1.5625 BTC</p>
                  {/* Blocks remaining visual */}
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <motion.div key={i}
                        className="h-2 rounded-sm"
                        style={{ background: i < 20 ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.06)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.02 }}/>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/25 font-outfit mt-2">≈ 83,588 blocks remaining</p>
                </motion.div>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-4">

              {/* Fear & Greed */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-outfit font-black text-white text-sm">Fear & Greed Index</p>
                  <span className="flex items-center gap-1 text-[10px] text-white/30 font-outfit">
                    <Info className="w-3 h-3"/> Daily
                  </span>
                </div>
                <FearGreedGauge value={FEAR_GREED}/>
                <p className="text-center text-white/20 text-[10px] font-outfit mt-3">
                  Higher = more speculative demand
                </p>
              </motion.div>

              {/* 7-day performance */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-outfit font-black text-white text-sm mb-4">Performance</p>
                {[
                  { label: '24h',  value: BTC_CHANGE_24H, suffix: '%' },
                  { label: '7d',   value: BTC_CHANGE_7D,  suffix: '%' },
                  { label: '30d',  value: +24.8,          suffix: '%' },
                  { label: 'YTD',  value: +87.3,          suffix: '%' },
                  { label: '1Y',   value: +112.4,         suffix: '%' },
                ].map((row, i) => (
                  <motion.div key={row.label}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 + i * 0.06 }}
                    className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span className="text-white/40 text-sm font-outfit">{row.label}</span>
                    <div className={`flex items-center gap-1 font-outfit font-bold text-sm stat-value ${row.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {row.value > 0
                        ? <ChevronUp className="w-3.5 h-3.5"/>
                        : <ChevronDown className="w-3.5 h-3.5"/>}
                      {row.value > 0 ? '+' : ''}{row.value}{row.suffix}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick price levels */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <p className="font-outfit font-black text-white text-sm mb-4">Key Levels</p>
                {[
                  { label: 'All-Time High', value: '$108,135', color: '#f472b6' },
                  { label: 'Current',       value: '$97,842',  color: '#F7931A' },
                  { label: 'Support (S1)',   value: '$91,200',  color: '#34d399' },
                  { label: 'Support (S2)',   value: '$84,500',  color: '#60a5fa' },
                ].map((level, i) => (
                  <div key={level.label}
                    className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span className="text-white/40 text-xs font-outfit">{level.label}</span>
                    <span className="font-outfit font-bold text-sm stat-value" style={{ color: level.color }}>{level.value}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Mempool live feed ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60"/>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"/>
                  </span>
                  <p className="font-outfit font-black text-white text-sm">Mempool Feed</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(247,147,26,0.12)', color: '#F7931A', border: '1px solid rgba(247,147,26,0.2)' }}>
                  LIVE
                </span>
              </div>
              <button
                onClick={() => setMempoolTick(n => n + 1)}
                className="flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-xs font-outfit">
                <RefreshCw className="w-3.5 h-3.5"/> Refresh
              </button>
            </div>
            <div className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout">
                {displayMempool.map((tx, i) => (
                  <MempoolRow key={tx.hash + mempoolTick} tx={tx} index={i}/>
                ))}
              </AnimatePresence>
            </div>
            <div className="px-6 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-white/20 text-[10px] font-outfit">
                Showing mock mempool data · not connected to Bitcoin network · for UI demonstration only
              </p>
            </div>
          </motion.div>

          {/* ── Bottom info banner ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: 'linear-gradient(135deg, rgba(247,147,26,0.08), rgba(99,102,241,0.06))', border: '1px solid rgba(247,147,26,0.2)' }}>
            <BtcLogo size={44}/>
            <div className="flex-1">
              <p className="font-outfit font-black text-white text-base mb-1">
                Bitcoin · The Original Decentralized Currency
              </p>
              <p className="text-white/40 text-sm font-outfit leading-relaxed">
                Created by Satoshi Nakamoto in 2008. Fixed supply of 21 million coins.
                Secured by Proof-of-Work consensus. The hardest money ever created.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/25 text-[10px] font-outfit uppercase tracking-widest">Genesis Block</p>
              <p className="font-outfit font-bold text-white/60 text-sm mt-0.5">Jan 3, 2009</p>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Bitcoin Wallet Modal (self-contained, no connection to main app) ── */}
      <AnimatePresence>
        {walletOpen && (
          <BtcWalletModal
            onClose={() => setWalletOpen(false)}
            connected={btcConnected}
            onConnect={s => { setBtcConnected(s); setWalletOpen(false); }}
            onDisconnect={() => { setBtcConnected(null); setWalletOpen(false); }}
            detectedIds={detectedIds}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
