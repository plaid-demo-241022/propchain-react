import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Users, ChevronDown } from 'lucide-react';

function DataBadge({ label, value, sub, accent = 'gold', delay = 0, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-premium rounded-2xl px-4 py-3 ${className}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-1"
        style={{ color: accent === 'gold' ? 'rgba(212,175,55,0.7)' : 'rgba(99,102,241,0.7)' }}>{label}</p>
      <p className="font-outfit font-black text-white text-lg leading-none stat-value">{value}</p>
      {sub && <p className="text-white/30 text-[10px] mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const springX = useSpring(mousePos.x, { stiffness: 80, damping: 25 });
  const springY = useSpring(mousePos.y, { stiffness: 80, damping: 25 });

  const handleMouseMove = e => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove}
      className="relative min-h-[105vh] flex items-center overflow-hidden bg-obsidian-950 noise-overlay">
      {/* Parallax background */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        <img src="/assets/property-downtown.png" alt="Dubai skyline"
          className="w-full h-full object-cover opacity-60 scale-110"
          style={{ filter: 'saturate(1.2) contrast(1.1)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg,rgba(2,6,23,0.97) 0%,rgba(2,6,23,0.85) 45%,rgba(2,6,23,0.4) 70%,rgba(2,6,23,0.7) 100%),linear-gradient(0deg,rgba(2,6,23,1) 0%,transparent 50%)' }} />
      </motion.div>

      {/* Mouse spotlight */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%,rgba(99,102,241,0.06) 0%,rgba(212,175,55,0.04) 35%,transparent 65%)` }} />
      <div className="absolute inset-0 z-[1] pattern-grid-fine opacity-100 pointer-events-none" />

      <div className="container-xl relative z-10 w-full pt-36 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          {/* Left */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
              <div className="section-label"><Shield className="w-3 h-3" />VARA Licensed · SCA Regulated</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(99,102,241,0.6)' }}>01 — Dubai Property Protocol</p>
              <h1 className="font-outfit font-black text-white leading-[0.88] tracking-tighter">
                <span className="block text-5xl md:text-7xl xl:text-8xl">Own Dubai's</span>
                <span className="block text-6xl md:text-8xl xl:text-[6.5rem] text-gradient-dual">Billion-Dollar</span>
                <span className="block text-5xl md:text-7xl xl:text-8xl text-white/90">Skyline.</span>
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-white/55 text-base md:text-lg font-outfit font-medium leading-relaxed max-w-lg mb-10">
              Fractional ownership of UAE's most prestigious properties — from AED 500. Blockchain-settled, automated dividends, instant liquidity.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
              <Link to="/properties" className="btn-primary group text-sm">
                Explore Assets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/how-it-works" className="btn-secondary text-sm group">
                View Performance <TrendingUp className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="w-full">
              <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(90deg,rgba(99,102,241,0.3),rgba(212,175,55,0.3),transparent)' }} />
              <div className="flex flex-wrap gap-8">
                {[
                  { Icon: Users,     stat: '2,400+', label: 'Investors', gold: true },
                  { Icon: Shield,    stat: 'VARA',   label: 'Licensed',  gold: false },
                  { Icon: TrendingUp,stat: '8.5%',   label: 'Avg Yield', gold: true },
                ].map(({ Icon, stat, label, gold }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: gold ? 'rgba(212,175,55,0.1)' : 'rgba(99,102,241,0.1)' }}>
                      <Icon className="w-4 h-4" style={{ color: gold ? '#D4AF37' : '#818cf8' }} />
                    </div>
                    <div>
                      <p className="text-white font-black text-base leading-none stat-value">{stat}</p>
                      <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right – property card stack */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 relative">
            <div className="relative flex justify-end items-center" style={{ minHeight: '560px' }}>
              <DataBadge label="Live Yield" value="8.5%" sub="annual avg" accent="gold" delay={0.7} className="absolute top-4 left-0 xl:left-8 z-30" />
              <DataBadge label="Min. Entry" value="AED 500" sub="fractional ownership" accent="indigo" delay={0.85} className="absolute bottom-24 left-0 xl:-left-4 z-30" />
              <DataBadge label="KYC Time" value="< 5 min" sub="AI-powered" accent="gold" delay={1.0} className="absolute top-1/3 right-0 z-30" />

              <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-72 xl:w-80 z-20" style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))' }}>
                <div className="rounded-[36px] p-px" style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.4),rgba(99,102,241,0.3))' }}>
                  <div className="rounded-[35px] overflow-hidden bg-obsidian-950">
                    <div className="relative h-72 xl:h-80 overflow-hidden">
                      <img src="/assets/property-marina.png" alt="Dubai Marina Property"
                        className="w-full h-full object-cover scale-105" style={{ filter: 'saturate(1.3) contrast(1.1)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(2,6,23,0.95) 100%)' }} />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-obsidian-950"
                          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0CA2A)' }}>Residential</span>
                      </div>
                    </div>
                    <div className="p-5 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-serif italic text-xl text-white leading-tight">Marina Heights</p>
                          <p className="text-white/40 text-xs mt-0.5">Dubai Marina, UAE</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xl leading-none stat-value text-gradient-gold">8.2%</p>
                          <p className="text-white/30 text-[9px] uppercase tracking-wider mt-0.5">Yield</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
                          <span className="text-white/30">Funding Progress</span>
                          <span style={{ color: '#D4AF37' }}>75%</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: '75%' }}
                            transition={{ duration: 1.8, delay: 1.2, ease: 'easeOut' }}
                            className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#6366f1,#D4AF37)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4 text-white/20" />
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom,transparent,#020617)' }} />
    </section>
  );
}
export default HeroSection;
