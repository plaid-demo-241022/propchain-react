import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Shield, DollarSign } from 'lucide-react';

const STATS = [
  { icon: DollarSign, value: 'AED 50M+', label: 'Assets Tokenized',     sub: 'across Dubai & UAE',         accent: '#D4AF37', bars: [40,65,50,80,60,90,75] },
  { icon: TrendingUp, value: '8.5%',     label: 'Average Annual Yield',  sub: 'across all properties',      accent: '#818cf8', bars: [55,70,60,85,65,80,70] },
  { icon: Users,      value: '2,400+',   label: 'Active Investors',      sub: 'from 42 countries',          accent: '#34d399', bars: [30,50,45,70,55,75,65] },
  { icon: Shield,     value: 'VARA',     label: 'Licensed & Regulated',  sub: '#VA-2024-001 · SCA Approved', accent: '#60a5fa', bars: [80,85,90,88,92,95,98] },
];

function MiniBar() { return null; } // inline bars rendered in parent

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-obsidian-950">
      <div className="container-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.accent}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                style={{ background: s.accent, filter: 'blur(32px)' }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.accent}18` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.accent }} />
                </div>
                <div className="flex items-end gap-0.5 h-8">
                  {s.bars.map((h, j) => (
                    <motion.div key={j} className="w-1.5 rounded-sm"
                      style={{ background: `${s.accent}50` }}
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${(h / 100) * 32}px` } : { height: 0 }}
                      transition={{ duration: 0.5, delay: j * 0.05 }} />
                  ))}
                </div>
              </div>
              <p className="font-outfit font-black text-3xl text-white stat-value leading-none mb-1">{s.value}</p>
              <p className="font-outfit font-semibold text-sm text-white mb-1">{s.label}</p>
              <p className="text-white/35 text-xs font-outfit">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default StatsSection;
