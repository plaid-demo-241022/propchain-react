import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { WalletStatusBar } from '@/components/ui/WalletStatusBar';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletModal';

const NAV_LINKS = [
  { label: 'Properties',   href: '/properties' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About',        href: '/about' },
  { label: 'Whitepaper',   href: '/whitepaper' },
];

const TICKER = [
  { label: 'Dubai RE Index',    value: '+2.4%',        up: true  },
  { label: 'PropChain Yield',   value: '8.5% avg',     up: true  },
  { label: 'AED/USD',           value: '3.6725',       up: false },
  { label: 'Assets on Chain',   value: 'AED 50M+',     up: true  },
  { label: 'VARA Licensed',     value: '#VA-2024-001', up: null  },
  { label: 'Active Investors',  value: '2,400+',       up: true  },
  { label: 'Marina Heights',    value: '8.2% yield',   up: true  },
  { label: 'DIFC Penthouse',    value: '10.2% yield',  up: true  },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label="PropChain – Home">
      <div className="relative w-9 h-9 flex-shrink-0">
        <div className="absolute inset-0 rounded-lg rotate-45 transition-all duration-500 group-hover:rotate-[55deg]"
          style={{ background: 'linear-gradient(135deg,#D4AF37 0%,#6366f1 100%)', padding: '1.5px' }}>
          <div className="w-full h-full rounded-[6px] bg-obsidian-950 flex items-center justify-center -rotate-45 group-hover:-rotate-[55deg] transition-all duration-500">
            <span className="font-outfit font-black text-[15px] leading-none"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PC
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-outfit font-black text-lg text-white tracking-tight leading-none">
          Prop<span className="text-gradient-gold">Chain</span>
        </span>
        <span className="text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: 'rgba(99,102,241,0.7)' }}>
          Real Estate Protocol
        </span>
      </div>
    </Link>
  );
}

function MarketTicker() {
  return (
    <div className="w-full overflow-hidden border-b"
      style={{ background: 'rgba(2,6,23,0.95)', borderColor: 'rgba(99,102,241,0.15)', backdropFilter: 'blur(12px)' }}
      aria-hidden="true">
      <div className="flex items-center h-8">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full border-r"
          style={{ borderColor: 'rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-6 text-[10px] font-semibold whitespace-nowrap">
                <span className="text-white/30 uppercase tracking-wider">{item.label}</span>
                <span className={cn('font-bold', item.up === true ? 'text-yellow-400' : item.up === false ? 'text-white/60' : 'text-indigo-400')}>
                  {item.value}
                </span>
                {item.up === true && <TrendingUp className="w-2.5 h-2.5 text-yellow-400" />}
                <span className="text-white/10 ml-4">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [showTicker, setShowTicker] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setShowTicker(y < 80);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Close drawer on route change
  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence>
        {showTicker && (
          <motion.div initial={{ height: 32, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <MarketTicker />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTicker && (
          <motion.div initial={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <WalletStatusBar />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={cn('transition-all duration-500', scrolled ? 'mx-6 my-2 rounded-2xl' : 'px-0')}
        style={scrolled ? { background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(24px)', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' } : {}}
        aria-label="Main navigation">
        <div className={cn('container-xl flex items-center justify-between transition-all duration-500', scrolled ? 'h-16 px-6' : 'h-20 py-4')}>
          <Logo />

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link to={link.href}
                  className={cn('relative px-5 py-2 font-outfit text-sm font-medium transition-colors duration-200 group',
                    location.pathname === link.href ? 'text-white' : 'text-white/60 hover:text-white')}>
                  {link.label}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-yellow-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <ConnectWalletButton />
            <Link to="/register"
              className="relative inline-flex items-center gap-2 px-6 py-2.5 font-outfit text-sm font-black text-obsidian-950 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
              style={{ background: 'linear-gradient(135deg,#D4AF37 0%,#F0CA2A 60%,#818cf8 100%)', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}>
              <span className="relative z-10">Invest Now</span>
              <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white rounded-xl hover:bg-white/5 transition-colors border border-white/10"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-4 right-4 lg:hidden rounded-2xl overflow-hidden z-40"
            style={{ background: 'rgba(4,4,20,0.97)', backdropFilter: 'blur(32px)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div className="p-5 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={link.href}
                    className="flex items-center justify-between w-full p-3.5 text-white/70 hover:text-white hover:bg-indigo-500/10 rounded-xl transition-all">
                    <span className="font-outfit font-semibold text-sm">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-2.5">
                <Link to="/signin" className="w-full py-3.5 text-center text-white/60 hover:text-white font-outfit text-sm font-semibold bg-white/5 rounded-xl border border-white/10">
                  Sign In
                </Link>
                <Link to="/register" className="w-full py-3.5 text-center font-outfit font-black text-sm text-obsidian-950 rounded-xl"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#F0CA2A 60%,#818cf8)' }}>
                  Invest Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Navbar;
