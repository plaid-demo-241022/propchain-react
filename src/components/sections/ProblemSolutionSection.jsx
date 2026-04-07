import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';

const PROBLEMS = [
  'Minimum AED 1–5M to participate',
  'Complex legal processes & paperwork',
  'Zero liquidity — money locked for years',
  'Opaque fees and hidden costs',
  'Geographic barriers for foreign investors',
  'No automated dividend distribution',
];
const SOLUTIONS = [
  'Start investing from just AED 500',
  'Fully digital, KYC-in-5-minutes onboarding',
  '24/7 token trading on secondary market',
  'Full fee transparency on-chain',
  'Open to global investors, VARA licensed',
  'Automated monthly rental income',
];

export function ProblemSolutionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none" />
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-label mb-4">The Problem We Solve</span>
          <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
            Real estate was <span className="text-gradient-dual">broken</span>.<br />We fixed it.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Old way */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-8"
            style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400/70 mb-6">The Old Way</p>
            <ul className="space-y-3.5">
              {PROBLEMS.map((p, i) => (
                <motion.li key={p} initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-3 text-white/40 text-sm font-outfit">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <X className="w-3 h-3 text-red-400" />
                  </span>
                  <span className="line-through">{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* PropChain way */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top right,rgba(99,102,241,0.08),transparent 60%)' }} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6" style={{ color: 'rgba(212,175,55,0.7)' }}>The PropChain Way</p>
            <ul className="space-y-3.5">
              {SOLUTIONS.map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, x: 12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 text-white text-sm font-outfit font-medium">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <Check className="w-3 h-3 text-yellow-400" />
                  </span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }} className="text-center mt-12">
          <Link to="/properties" className="btn-primary inline-flex items-center gap-2 text-sm">
            Start Investing Today <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
export default ProblemSolutionSection;
