import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Wallet, CheckCircle2, AlertCircle, Copy, ExternalLink, LogOut, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useWalletDetection } from '@/lib/hooks/useWalletDetection';

// ── helpers ──────────────────────────────────────────────────────────────────
function hex(h) {
  const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
  return `${r},${g},${b}`;
}
function trunc(a) { return `${a.slice(0,6)}…${a.slice(-4)}`; }

function pickEvm(target) {
  const eth = window.ethereum;
  if (!eth) return null;
  const list = eth.providers ?? [eth];
  for (const p of list) {
    if (target==='metamask' && p.isMetaMask && !p.isRabby && !p.isBraveWallet) return p;
    if (target==='coinbase' && (p.isCoinbaseWallet||p.isCoinbaseBrowser)) return p;
    if (target==='rabby'   && p.isRabby) return p;
  }
  return null;
}
function getSol() { return window.phantom?.solana ?? window.solana ?? null; }

// ── wallet icons (inline SVG) ─────────────────────────────────────────────
function MMIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#1A1A2E"/>
      <path d="M32.5 7L22.1 14.7l1.9-4.5L32.5 7z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 7l10.3 7.8-1.8-4.6L7.5 7z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28.8 26.2l-2.8 4.3 6 1.7 1.7-5.8-4.9-.2z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 26.4l1.7 5.8 6-1.7-2.8-4.3-4.9.2z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CBIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#0052FF"/>
      <circle cx="20" cy="20" r="11" fill="white"/>
      <rect x="16" y="16" width="8" height="8" rx="2" fill="#0052FF"/>
    </svg>
  );
}
function PHIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#4E44CE"/>
      <path d="M20 8C13.4 8 8 13.4 8 20c0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12 0-6.6-5.4-12-12-12zm-2 17.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zm4-5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="white" opacity="0.9"/>
    </svg>
  );
}
function WCIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#3396FF"/>
      <path d="M11 20c2.5-2.5 6.5-2.5 9 0l.3.3c.2.2.5.2.7 0l.3-.3c2.5-2.5 6.5-2.5 9 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M14 23l.3.3c1.5 1.5 3.9 1.5 5.4 0l.6-.6c.2-.2.5-.2.7 0l.6.6c1.5 1.5 3.9 1.5 5.4 0l.3-.3" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function RabbyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#8697FF"/>
      <ellipse cx="20" cy="18" rx="9" ry="7" fill="white" opacity="0.95"/>
      <ellipse cx="13" cy="14" rx="3" ry="4.5" fill="white" opacity="0.95"/>
      <ellipse cx="27" cy="14" rx="3" ry="4.5" fill="white" opacity="0.95"/>
      <circle cx="16.5" cy="18.5" r="2" fill="#8697FF"/>
      <circle cx="23.5" cy="18.5" r="2" fill="#8697FF"/>
    </svg>
  );
}
function TWIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
      <rect width="40" height="40" rx="10" fill="#0500FF"/>
      <path d="M20 8l10 4v8c0 5.5-4.2 10.6-10 12-5.8-1.4-10-6.5-10-12V12l10-4z" fill="white" opacity="0.95"/>
      <path d="M16 20l3 3 5-5" stroke="#0500FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── connect implementations ───────────────────────────────────────────────
async function connectMM() {
  const p = pickEvm('metamask');
  if (!p) throw new Error('MetaMask is not installed');
  const accounts = await p.request({ method: 'eth_requestAccounts' });
  if (!accounts?.length) throw new Error('No accounts returned');
  const addr = accounts[0];
  let balance = '—', network = 'Ethereum';
  try {
    const bHex = await p.request({ method: 'eth_getBalance', params: [addr, 'latest'] });
    balance = `${(parseInt(bHex, 16) / 1e18).toFixed(4)} ETH`;
    const cHex = await p.request({ method: 'eth_chainId' });
    const chains = { 1:'Ethereum Mainnet',5:'Goerli',11155111:'Sepolia',137:'Polygon',56:'BNB Chain',43114:'Avalanche',42161:'Arbitrum',10:'Optimism',8453:'Base' };
    network = chains[parseInt(cHex,16)] ?? `Chain #${parseInt(cHex,16)}`;
  } catch { /* non-fatal */ }
  return { address: addr, balance, network };
}
async function connectCB() {
  const p = pickEvm('coinbase');
  if (!p) throw new Error('Coinbase Wallet is not installed');
  const a = await p.request({ method: 'eth_requestAccounts' });
  if (!a?.length) throw new Error('No accounts returned');
  return { address: a[0], balance: '—', network: 'Ethereum' };
}
async function connectRabby() {
  const p = pickEvm('rabby');
  if (!p) throw new Error('Rabby Wallet is not installed');
  const a = await p.request({ method: 'eth_requestAccounts' });
  if (!a?.length) throw new Error('No accounts returned');
  return { address: a[0], balance: '—', network: 'Ethereum' };
}
async function connectPhantom() {
  const sol = getSol();
  if (!sol) throw new Error('Phantom is not installed');
  const resp = await sol.connect();
  return { address: resp.publicKey.toString(), balance: '—', network: 'Solana' };
}
async function notInstalled(name) { throw new Error(`${name} requires the browser extension. Please install it first.`); }

// ── wallet registry ───────────────────────────────────────────────────────
const WALLETS = [
  { id:'metamask',      name:'MetaMask',       desc:'Most popular EVM wallet',       icon:<MMIcon/>,    color:'#E27625', installUrl:'https://metamask.io/download/',                  popular:true,  connect:connectMM },
  { id:'walletconnect', name:'WalletConnect',   desc:'Connect any mobile wallet',     icon:<WCIcon/>,    color:'#3396FF', installUrl:'https://walletconnect.com/',                     popular:true,  connect:()=>notInstalled('WalletConnect') },
  { id:'coinbase',      name:'Coinbase Wallet', desc:'Self-custody by Coinbase',      icon:<CBIcon/>,    color:'#0052FF', installUrl:'https://www.coinbase.com/wallet/downloads',      popular:false, connect:connectCB },
  { id:'phantom',       name:'Phantom',         desc:'Multichain: EVM + Solana',      icon:<PHIcon/>,    color:'#4E44CE', installUrl:'https://phantom.app/',                           popular:false, connect:connectPhantom },
  { id:'rabby',         name:'Rabby Wallet',    desc:'DeFi-native EVM wallet',        icon:<RabbyIcon/>, color:'#8697FF', installUrl:'https://rabby.io/',                              popular:false, connect:connectRabby },
  { id:'trust',         name:'Trust Wallet',    desc:'Multi-chain mobile wallet',     icon:<TWIcon/>,    color:'#3375BB', installUrl:'https://trustwallet.com/',                       popular:false, connect:()=>notInstalled('Trust Wallet') },
];

// ── sub-views ─────────────────────────────────────────────────────────────
function WalletRow({ wallet, isInstalled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button onClick={onClick} whileHover={{ x:3 }} whileTap={{ scale:0.98 }}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left"
      style={{ background: hov ? `rgba(${hex(wallet.color)},0.08)` : 'rgba(255,255,255,0.03)', border: hov ? `1px solid rgba(${hex(wallet.color)},0.25)` : '1px solid rgba(255,255,255,0.04)', transition:'background 0.15s,border 0.15s' }}>
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">{wallet.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-outfit font-semibold text-sm text-white">{wallet.name}</span>
          {wallet.popular && <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ background:`rgba(${hex(wallet.color)},0.15)`, color:wallet.color }}>Popular</span>}
          {isInstalled && <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Installed</span>}
        </div>
        <p className="text-[11px] text-white/40 mt-0.5 font-outfit">{wallet.desc}</p>
      </div>
      {isInstalled ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> : <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0"/>}
    </motion.button>
  );
}

function ConnectingView({ wallet, onCancel }) {
  return (
    <div className="flex flex-col items-center py-10 px-6 text-center">
      <div className="relative w-24 h-24 mb-6">
        {[0,1,2].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full border"
            style={{ borderColor:`rgba(${hex(wallet.color)},${0.5-i*0.14})` }}
            animate={{ scale:[1,1.2+i*0.12,1], opacity:[0.8,0.2,0.8] }}
            transition={{ duration:1.8, repeat:Infinity, delay:i*0.3 }}/>
        ))}
        <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ background:`rgba(${hex(wallet.color)},0.1)` }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden">{wallet.icon}</div>
        </div>
      </div>
      <h3 className="font-outfit font-bold text-lg text-white mb-2">Connecting to {wallet.name}</h3>
      <p className="text-sm text-white/40 font-outfit mb-8 max-w-[240px]">Check your wallet extension and approve the connection request.</p>
      <button onClick={onCancel} className="text-sm text-white/40 hover:text-white/70 font-outfit transition-colors">Cancel</button>
    </div>
  );
}

function ConnectedView({ state, onDisconnect, onCopy, copied }) {
  return (
    <div className="flex flex-col items-center py-6 px-6 text-center">
      <div className="relative w-20 h-20 mb-5">
        <motion.div className="absolute inset-0 rounded-full" style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.25)' }} initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring' }}/>
        <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl overflow-hidden">{state.wallet.icon}</div>
        </div>
        <motion.div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center" initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.2 }}>
          <CheckCircle2 className="w-4 h-4 text-obsidian-950"/>
        </motion.div>
      </div>
      <h3 className="font-outfit font-bold text-lg text-white mb-0.5">Connected</h3>
      <p className="text-xs text-white/35 font-outfit mb-5">{state.network}</p>
      <motion.button onClick={onCopy} whileTap={{ scale:0.97 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3" style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)' }}>
        <span className="font-mono text-sm" style={{ color:'#D4AF37' }}>{trunc(state.address)}</span>
        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5 text-white/30"/>}
      </motion.button>
      <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-5" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-sm text-white/40 font-outfit">Balance</span>
        <span className="font-outfit font-bold text-white">{state.balance}</span>
      </div>
      <div className="w-full flex gap-2">
        <a href={`https://etherscan.io/address/${state.address}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white transition-colors"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <ExternalLink className="w-3.5 h-3.5"/> Explorer
        </a>
        <button onClick={onDisconnect} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-red-400 hover:text-red-300 transition-colors"
          style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)' }}>
          <LogOut className="w-3.5 h-3.5"/> Disconnect
        </button>
      </div>
    </div>
  );
}

function ErrorView({ wallet, message, onRetry, onBack }) {
  const isNotInstalled = message.toLowerCase().includes('not installed');
  return (
    <div className="flex flex-col items-center py-8 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
        <AlertCircle className="w-8 h-8 text-red-400"/>
      </div>
      <h3 className="font-outfit font-bold text-lg text-white mb-2">{isNotInstalled ? `${wallet.name} Not Found` : 'Connection Failed'}</h3>
      <p className="text-sm text-white/40 font-outfit mb-6 max-w-[260px]">{message}</p>
      <div className="w-full flex gap-2">
        <button onClick={onBack} className="flex-1 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white transition-colors" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>Back</button>
        {isNotInstalled ? (
          <a href={wallet.installUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white"
            style={{ background:`rgba(${hex(wallet.color)},0.15)`, border:`1px solid rgba(${hex(wallet.color)},0.3)` }}>
            <Download className="w-3.5 h-3.5"/> Install
          </a>
        ) : (
          <button onClick={onRetry} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white"
            style={{ background:`rgba(${hex(wallet.color)},0.15)`, border:`1px solid rgba(${hex(wallet.color)},0.3)` }}>
            <RefreshCw className="w-3.5 h-3.5"/> Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ── modal shell ───────────────────────────────────────────────────────────
function WalletModal({ onClose, connected, onConnect, onDisconnect, installedIds }) {
  const [view, setView] = useState(connected ? 'connected' : 'select');
  const [active, setActive] = useState(connected?.wallet ?? null);
  const [errMsg, setErrMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => { if (connected) setView('connected'); }, [connected]);
  useEffect(() => () => { abortRef.current = true; }, []);

  const pick = useCallback(async (wallet) => {
    abortRef.current = false;
    setActive(wallet); setView('connecting');
    try {
      const res = await wallet.connect();
      if (abortRef.current) return;
      onConnect({ wallet, ...res }); setView('connected');
    } catch (e) {
      if (abortRef.current) return;
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setErrMsg(msg.includes('4001') || msg.toLowerCase().includes('reject') ? 'You rejected the request in your wallet.' : msg);
      setView('error');
    }
  }, [onConnect]);

  const retry = useCallback(() => { if (active) pick(active); }, [active, pick]);
  const disconnect = useCallback(() => {
    const sol = getSol();
    if (sol && connected?.wallet?.id === 'phantom') sol.disconnect().catch(()=>{});
    onDisconnect(); setView('select'); setActive(null);
  }, [connected, onDisconnect]);
  const copy = useCallback(() => {
    if (!connected?.address) return;
    navigator.clipboard.writeText(connected.address).catch(()=>{});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [connected]);

  const sorted = [...WALLETS].sort((a,b) => (installedIds.includes(a.id)?0:1)-(installedIds.includes(b.id)?0:1));
  const titles = { select:'Connect Wallet', connected:'Your Wallet' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.72)', backdropFilter:'blur(10px)' }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}
      aria-modal="true" role="dialog">
      <motion.div
        initial={{ opacity:0, scale:0.96, y:28 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.94, y:16 }}
        transition={{ type:'spring', stiffness:380, damping:32 }}
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background:'rgba(5,5,24,0.99)', border:'1px solid rgba(99,102,241,0.2)', boxShadow:'0 40px 100px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

        {(view==='select'||view==='connected') && (
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="font-outfit font-bold text-[15px] text-white">{titles[view]}</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-all" aria-label="Close">
              <X className="w-4 h-4"/>
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view==='select' && (
            <motion.div key="select" initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:14 }} transition={{ duration:0.18 }}
              className="p-3 max-h-[70vh] overflow-y-auto no-scrollbar">
              {installedIds.length>0 && (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/25 font-outfit px-2 mb-2 mt-1">Detected in Browser</p>
                  <div className="space-y-1 mb-3">
                    {sorted.filter(w=>installedIds.includes(w.id)).map(w => <WalletRow key={w.id} wallet={w} isInstalled onClick={()=>pick(w)}/>)}
                  </div>
                </>
              )}
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/25 font-outfit px-2 mb-2 mt-1">{installedIds.length>0?'Other Wallets':'Select a Wallet'}</p>
              <div className="space-y-1">
                {sorted.filter(w=>!installedIds.includes(w.id)).map(w => <WalletRow key={w.id} wallet={w} isInstalled={false} onClick={()=>pick(w)}/>)}
              </div>
              <p className="text-center text-[10px] text-white/20 font-outfit mt-4 mb-1 px-4">
                By connecting you agree to our <a href="/whitepaper" className="underline underline-offset-2 hover:text-white/40 transition-colors">Terms of Service</a>
              </p>
            </motion.div>
          )}
          {view==='connecting' && active && (
            <motion.div key="connecting" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:0.18 }}>
              <ConnectingView wallet={active} onCancel={() => { abortRef.current=true; setView('select'); }}/>
            </motion.div>
          )}
          {view==='connected' && connected && (
            <motion.div key="connected" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }} transition={{ duration:0.18 }}>
              <ConnectedView state={connected} onDisconnect={disconnect} onCopy={copy} copied={copied}/>
            </motion.div>
          )}
          {view==='error' && active && (
            <motion.div key="error" initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-14 }} transition={{ duration:0.18 }}>
              <ErrorView wallet={active} message={errMsg} onRetry={retry} onBack={()=>setView('select')}/>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── public trigger ────────────────────────────────────────────────────────
export function ConnectWalletButton({ className }) {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(null);
  const { wallets, checked } = useWalletDetection();
  const installedIds = wallets.map(w => w.id);

  useEffect(() => {
    const esc = e => { if (e.key==='Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (!connected) return;
    const p = pickEvm('metamask');
    if (!p) return;
    const handler = accounts => {
      if (!accounts?.length) setConnected(null);
      else if (accounts[0] !== connected.address) setConnected(prev => prev ? { ...prev, address:accounts[0] } : null);
    };
    p.on('accountsChanged', handler);
    return () => p.removeListener?.('accountsChanged', handler);
  }, [connected]);

  return (
    <>
      {connected ? (
        <motion.button onClick={() => setOpen(true)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          className={cn('inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-outfit text-sm font-semibold', className)}
          style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.25)', color:'rgba(52,211,153,0.9)' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/>
          </span>
          <span className="w-5 h-5 rounded-md overflow-hidden">{connected.wallet.icon}</span>
          {trunc(connected.address)}
        </motion.button>
      ) : (
        <motion.button onClick={() => setOpen(true)} whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.98 }}
          className={cn('relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-outfit text-sm font-bold overflow-hidden', className)}
          style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.3)', color:'rgba(165,180,252,0.95)', boxShadow:'0 0 20px rgba(99,102,241,0.1)' }}>
          <Wallet className="w-4 h-4"/>
          Connect Wallet
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent -skew-x-12 pointer-events-none"
            animate={{ x:['-100%','200%'] }} transition={{ duration:3, repeat:Infinity, ease:'linear', repeatDelay:2.5 }}/>
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <WalletModal onClose={() => setOpen(false)} connected={connected}
            onConnect={s => setConnected(s)} onDisconnect={() => setConnected(null)} installedIds={installedIds}/>
        )}
      </AnimatePresence>
    </>
  );
}
export default ConnectWalletButton;
