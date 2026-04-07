import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, Wallet, FileCheck, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react';

const STEPS = [
  {
    n: '01', icon: Search, title: 'Browse Properties',
    desc: 'Explore our curated selection of VARA-approved Dubai properties. Filter by yield, location, property type, and minimum investment.',
    detail: 'Each property listing includes full financial projections, legal documents, independent valuations, and on-chain transaction history.',
    color: '#6366f1',
  },
  {
    n: '02', icon: Wallet, title: 'Choose Your Amount',
    desc: 'Invest as little as AED 500. Select the number of tokens you want to purchase — each token represents a fractional share of the property.',
    detail: 'Pay via bank transfer, card, or crypto. Your tokens are minted on-chain immediately and appear in your dashboard within minutes.',
    color: '#D4AF37',
  },
  {
    n: '03', icon: FileCheck, title: 'Complete KYC',
    desc: 'Our AI-powered KYC process takes under 5 minutes. Upload your Emirates ID or passport — we handle the rest.',
    detail: 'Full AML/KYC compliance per VARA regulations. All investor data is encrypted and stored securely. One-time process for all future investments.',
    color: '#34d399',
  },
  {
    n: '04', icon: TrendingUp, title: 'Earn & Trade',
    desc: 'Receive automated monthly rental income directly to your wallet. Trade your tokens 24/7 on our secondary marketplace.',
    detail: 'Track live property performance, rental yields, and capital appreciation in your dashboard. Withdraw earnings to your bank or crypto wallet anytime.',
    color: '#818cf8',
  },
];

export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#020617 0%,#0a0a1e 50%,#020617 100%)' }}>
      <div className="absolute inset-0 pattern-grid-fine opacity-60 pointer-events-none" />
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-label mb-4">How It Works</span>
          <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
            Invest in 4 <span className="text-gradient-gold">simple steps</span>
          </h2>
          <p className="text-white/50 text-lg font-outfit mt-4 max-w-2xl mx-auto">
            From account creation to earning rental income — the entire process takes less than 24 hours.
          </p>
        </motion.div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden md:block">
          {/* Step numbers */}
          <div className="relative flex justify-between mb-8">
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-px"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full" style={{ background: 'linear-gradient(90deg,#6366f1,#D4AF37)' }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${(active / (STEPS.length - 1)) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.5 }} />
            </div>
            {STEPS.map((s, i) => (
              <button key={s.n} onClick={() => setActive(i)} className="flex flex-col items-center gap-3 w-1/4 relative z-10">
                <motion.div className="w-10 h-10 rounded-full flex items-center justify-center font-outfit font-black text-sm transition-all duration-300 cursor-pointer"
                  animate={{ background: i <= active ? `linear-gradient(135deg,${STEPS[active].color},${s.color})` : 'rgba(255,255,255,0.06)', borderColor: i <= active ? s.color : 'rgba(255,255,255,0.1)', scale: i === active ? 1.15 : 1 }}
                  style={{ border: '2px solid', color: i <= active ? '#020617' : 'rgba(255,255,255,0.3)' }}>
                  {s.n}
                </motion.div>
                <span className={`text-xs font-outfit font-bold uppercase tracking-wider transition-colors ${i === active ? 'text-white' : 'text-white/30'}`}>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${STEPS[active].color}30` }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(600px circle at 20% 50%,${STEPS[active].color}08,transparent 60%)` }} />
              <div className="relative z-10 flex gap-10 items-start">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${STEPS[active].color}15`, border: `1px solid ${STEPS[active].color}30` }}>
                  {(() => { const I = STEPS[active].icon; return <I className="w-8 h-8" style={{ color: STEPS[active].color }} />; })()}
                </div>
                <div>
                  <h3 className="font-outfit font-black text-2xl text-white mb-3">{STEPS[active].title}</h3>
                  <p className="text-white/60 font-outfit mb-4 leading-relaxed">{STEPS[active].desc}</p>
                  <p className="text-white/40 text-sm font-outfit leading-relaxed">{STEPS[active].detail}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden space-y-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${active === i ? s.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
              <button onClick={() => setActive(active === i ? -1 : i)}
                className="w-full flex items-center gap-4 p-5 text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: active === i ? s.color : 'rgba(255,255,255,0.06)', color: active === i ? '#020617' : 'rgba(255,255,255,0.3)' }}>
                  {s.n}
                </div>
                <span className="font-outfit font-bold text-white flex-1">{s.title}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${active === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-white/50 text-sm font-outfit leading-relaxed">{s.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          className="text-center mt-12">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-sm">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
export default HowItWorksSection;
