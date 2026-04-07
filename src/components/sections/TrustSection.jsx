import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Key, CheckCircle2 } from 'lucide-react';

const PARTNERS = ['Emaar Properties','DAMAC','Nakheel','Meraas','Dubai Land Dept','DIFC Authority'];
const LICENSES = [
  { label: 'VARA Licensed',       sub: 'Virtual Assets Regulatory Authority', color: '#D4AF37' },
  { label: 'SCA Regulated',       sub: 'Securities & Commodities Authority',   color: '#818cf8' },
  { label: 'ISO 27001',           sub: 'Information Security Certified',       color: '#34d399' },
  { label: 'AML/KYC Compliant',  sub: 'Anti-Money Laundering Framework',      color: '#60a5fa' },
];
const SECURITY = [
  { icon: Shield, title: '256-bit Encryption',    desc: 'All data encrypted at rest and in transit using AES-256 and TLS 1.3.' },
  { icon: Lock,   title: 'Cold Storage',           desc: 'Investor funds held in multi-signature cold wallets by institutional custodians.' },
  { icon: Key,    title: 'Multi-Sig Wallets',      desc: 'Smart contracts require multiple authorized signatures for all fund movements.' },
  { icon: CheckCircle2, title: 'Regular Audits',  desc: 'Quarterly smart contract audits by top-tier blockchain security firms.' },
];

export function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#020617 0%,#0a0a1e 50%,#020617 100%)' }}>
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-label mb-4">Trust & Security</span>
          <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
            Built on <span className="text-gradient-gold">institutional trust</span>
          </h2>
          <p className="text-white/50 text-lg font-outfit mt-4 max-w-2xl mx-auto">
            Partnered with Dubai's leading developers, licensed by VARA, and secured by bank-grade infrastructure.
          </p>
        </motion.div>

        {/* Developer partners */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          className="mb-12 rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25 text-center mb-6">Development Partners</p>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="px-5 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/40 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {p}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* License badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {LICENSES.map((l, i) => (
            <motion.div key={l.label} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: `${l.color}08`, border: `1px solid ${l.color}25` }}>
              <p className="font-outfit font-black text-sm mb-1" style={{ color: l.color }}>{l.label}</p>
              <p className="text-white/30 text-[10px] font-outfit leading-tight">{l.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Security features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-outfit font-bold text-white text-sm mb-2">{s.title}</h3>
              <p className="text-white/40 text-xs font-outfit leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default TrustSection;
