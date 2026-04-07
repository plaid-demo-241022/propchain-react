import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { useWalletDetection } from '@/lib/hooks/useWalletDetection';
import { cn } from '@/lib/utils/cn';

export function WalletStatusBar({ className }) {
  const { wallets, checked } = useWalletDetection();

  return (
    <div
      className={cn('w-full flex items-center justify-between px-4 py-1', className)}
      style={{ background: 'rgba(2,6,23,0.9)', borderBottom: '1px solid rgba(99,102,241,0.12)' }}
      aria-live="polite"
      aria-label="Wallet detection status"
    >
      {/* Left: trust badges */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-outfit font-bold tracking-wide" style={{ color: '#D4AF37' }}>
          <Shield className="w-3 h-3" /> VARA Licensed
        </span>
        <span className="flex items-center gap-1 text-[9px] font-outfit font-bold uppercase tracking-widest text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      {/* Right: wallet detection */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-white/25 uppercase tracking-widest text-[9px] font-outfit font-semibold">
          <Wallet className="w-3 h-3" /> Browser
        </span>
        <AnimatePresence mode="wait">
          {!checked ? (
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5">
              {[52, 72].map(w => (
                <span key={w} className="h-5 rounded-full animate-pulse" style={{ width: w, background: 'rgba(99,102,241,0.12)' }} />
              ))}
            </motion.div>
          ) : wallets.length === 0 ? (
            <motion.span key="none" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-outfit font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.22)', color: 'rgba(252,165,165,0.85)' }}>
              <XCircle className="w-3 h-3" /> No Wallet
            </motion.span>
          ) : (
            <motion.div key="wallets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-1.5">
              {wallets.map((w, i) => (
                <motion.span key={w.id} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-outfit font-semibold"
                  style={{ background: 'rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.2)', color: 'rgba(240,202,42,0.9)' }}>
                  <span role="img" aria-hidden="true">{w.icon}</span>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  {w.name} Installed
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default WalletStatusBar;
