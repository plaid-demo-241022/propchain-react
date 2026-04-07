import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link2, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatAED } from '@/lib/data/properties';
import { cn } from '@/lib/utils/cn';

const STATUS_STYLES = {
  active:       { label: 'Active',       bg: 'rgba(52,211,153,0.12)', color: '#34d399', dot: '#34d399' },
  funded:       { label: 'Fully Funded', bg: 'rgba(99,102,241,0.12)', color: '#818cf8', dot: '#818cf8' },
  'coming-soon':{ label: 'Coming Soon',  bg: 'rgba(212,175,55,0.12)', color: '#D4AF37', dot: '#D4AF37' },
};

function FundingRing({ pct, size = 56 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#rg)" strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PropertyCard({ property }) {
  const cardRef = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMove = (e) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    rotX.set((e.clientX - left) / width - 0.5);
    rotY.set((e.clientY - top) / height - 0.5);
  };
  const handleLeave = () => { rotX.set(0); rotY.set(0); };

  const st = STATUS_STYLES[property.status] || STATUS_STYLES.active;

  return (
    <div className="perspective-1000" ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="rounded-3xl overflow-hidden h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Gradient border wrapper */}
        <div className="rounded-3xl p-px h-full" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(99,102,241,0.15))' }}>
          <div className="rounded-[calc(1.5rem-1px)] overflow-hidden h-full flex flex-col" style={{ background: 'rgba(6,6,28,0.95)' }}>

            {/* Image area */}
            <div className="relative h-48 overflow-hidden">
              <div className={cn('absolute inset-0 bg-gradient-to-br', property.gradient, 'opacity-60')} />
              {property.image && (
                <img src={property.image} alt={property.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" loading="lazy" />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(6,6,28,0.95) 100%)' }} />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-obsidian-950" style={{ background: 'linear-gradient(135deg,#D4AF37,#F0CA2A)' }}>
                  {property.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                  <Link2 className="w-2.5 h-2.5" /> On-Chain
                </span>
              </div>

              {/* Status */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5" style={{ background: st.bg, color: st.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                  {st.label}
                </span>
              </div>

              {/* Yield */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center gap-1.5">
                  <FundingRing pct={property.funded} size={48} />
                  <div>
                    <p className="font-black text-lg leading-none stat-value text-gradient-gold">{property.annualYield}%</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">Yield</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-outfit font-bold text-white text-base leading-tight">{property.name}</h3>
              </div>
              <p className="flex items-center gap-1 text-white/40 text-xs mb-4">
                <MapPin className="w-3 h-3" />{property.location}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  <span className="text-white/30">Funded</span>
                  <span style={{ color: '#D4AF37' }}>{property.funded}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#6366f1,#D4AF37)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${property.funded}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Min. Invest', value: formatAED(property.minInvestment) },
                  { label: 'Total Value', value: formatAED(property.totalValue) },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-0.5">{s.label}</p>
                    <p className="font-outfit font-bold text-sm text-white stat-value">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <TrendingUp className="w-3 h-3" /> VARA Verified
                </span>
                <Link
                  to={`/properties/${property.id}`}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  View Asset →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default PropertyCard;
