import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap, Users } from 'lucide-react';

export function CTASection() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const submit = e => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0a0a1a 0%,#12103a 40%,#0a0e1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none pattern-grid-fine opacity-40" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(99,102,241,0.08),transparent 70%)' }} />

      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="section-label mb-6 inline-flex">Start Today</span>
            <h2 className="font-outfit font-black text-4xl md:text-5xl text-white leading-tight mt-4 mb-6">
              Build your property<br />empire from{' '}
              <span className="text-gradient-gold">AED 500</span>
            </h2>
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { v: 'AED 50M+', l: 'Assets on Platform' },
                { v: '8.5%',     l: 'Avg Annual Yield'   },
                { v: '2,400+',   l: 'Active Investors'   },
              ].map(s => (
                <div key={s.l}>
                  <p className="font-outfit font-black text-2xl text-white stat-value">{s.v}</p>
                  <p className="text-white/40 text-xs font-outfit uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: 'VARA Licensed' },
                { icon: Zap,    label: '5-min KYC'     },
                { icon: Users,  label: 'No minimum lock-up' },
              ].map(b => (
                <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-semibold text-white/60"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <b.icon className="w-3 h-3" /> {b.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: email signup */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top right,rgba(212,175,55,0.06),transparent 60%)' }} />
              <div className="relative z-10">
                <h3 className="font-outfit font-black text-2xl text-white mb-2">Get Early Access</h3>
                <p className="text-white/50 text-sm font-outfit mb-6">Join our waitlist and be the first to access new property listings.</p>

                {done ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3 py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="font-outfit font-bold text-white">You're on the list!</p>
                    <p className="text-white/40 text-sm font-outfit">We'll be in touch shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address" required
                      className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 font-outfit text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    <button type="submit"
                      className="w-full py-3.5 rounded-xl font-outfit font-black text-sm text-obsidian-950 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#F0CA2A 50%,#818cf8)' }}>
                      Get Early Access <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                <p className="text-white/20 text-[10px] font-outfit mt-4 text-center">
                  No spam. Unsubscribe anytime. VARA licensed platform.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default CTASection;
