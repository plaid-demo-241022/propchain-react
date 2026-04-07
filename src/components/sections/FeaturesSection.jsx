import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Coins, ArrowLeftRight, Zap, Shield, Clock, Eye } from 'lucide-react';

const FEATURES = [
  { n:'01', icon: Coins,        title: 'Ultra-Low Entry',       desc: 'Own a fraction of a AED 5M villa for just AED 500. Blockchain makes micro-ownership possible.',        color: '#D4AF37' },
  { n:'02', icon: ArrowLeftRight,title:'24/7 Token Trading',    desc: 'Buy and sell property tokens anytime on our secondary market. Real estate liquidity, finally.',       color: '#818cf8' },
  { n:'03', icon: Zap,          title: 'Automated Dividends',   desc: 'Rental income flows directly to your wallet every month. No chasing landlords, no delays.',           color: '#34d399' },
  { n:'04', icon: Shield,       title: 'VARA Compliant',        desc: 'Full regulatory compliance under VARA, SCA, and UAE Central Bank frameworks. Your money is safe.',   color: '#60a5fa' },
  { n:'05', icon: Clock,        title: 'Instant KYC',           desc: 'AI-powered identity verification in under 5 minutes. One-time process for all future investments.',   color: '#f472b6' },
  { n:'06', icon: Eye,          title: 'Full Transparency',     desc: 'Every transaction, fee, and return is recorded on-chain and auditable by anyone, anytime.',           color: '#fb923c' },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#020617 0%,#070718 50%,#020617 100%)' }}>
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-label mb-4">Platform Features</span>
          <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
            Everything you need to <span className="text-gradient-indigo">invest smarter</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {FEATURES.map((f, i) => (
            <motion.div key={f.n} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative p-8 group overflow-hidden"
              style={{ background: '#020617', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = `${f.color}06`}
              onMouseLeave={e => e.currentTarget.style.background = '#020617'}>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(400px circle at 0% 100%,${f.color}08,transparent)` }} />
              <span className="block text-[10px] font-black tracking-[0.2em] mb-4" style={{ color: `${f.color}60` }}>{f.n}</span>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}
                onMouseEnter={e => { e.currentTarget.style.background = `${f.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${f.color}12`; }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-outfit font-black text-lg text-white mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm font-outfit leading-relaxed">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg,transparent,${f.color}40,transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: '< 5 min', l: 'KYC Verification' },
            { v: 'AED 500', l: 'Minimum Investment' },
            { v: '24/7',    l: 'Secondary Market' },
            { v: '0%',      l: 'Hidden Fees' },
          ].map(s => (
            <div key={s.l} className="text-center p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-outfit font-black text-2xl text-white stat-value">{s.v}</p>
              <p className="text-white/40 text-xs font-outfit mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default FeaturesSection;
