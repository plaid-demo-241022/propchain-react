import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ahmed Al-Rashidi', title: 'Software Engineer, Dubai', initials: 'AA', gradient: 'from-indigo-500 to-purple-600',
    quote: "PropChain completely changed how I think about real estate. I started with AED 500 and now have fractional ownership in three Dubai properties. The rental income hits my account every month like clockwork.",
    yield: '8.4%', invested: 'AED 15,000', stars: 5,
  },
  {
    name: 'Sarah Mitchell', title: 'Investment Banker, DIFC', initials: 'SM', gradient: 'from-gold-500 to-amber-600',
    quote: "As someone in finance, I was skeptical at first. But the VARA licensing, transparent on-chain records, and professional property management won me over. The 8.7% yield beats most of my traditional investments.",
    yield: '8.7%', invested: 'AED 50,000', stars: 5,
  },
  {
    name: 'Khalid Al-Farouq', title: 'Entrepreneur, Abu Dhabi', initials: 'KF', gradient: 'from-emerald-500 to-teal-600',
    quote: "I've invested in Dubai real estate the traditional way before — it took months, lawyers, and AED 2M minimum. PropChain let me diversify across 5 properties in one afternoon. The 24/7 trading is a game changer.",
    yield: '9.1%', invested: 'AED 100,000', stars: 5,
  },
];

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prev = () => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx(i => (i + 1) % TESTIMONIALS.length);

  return (
    <section ref={ref} className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%,rgba(99,102,241,0.06),transparent)' }} />
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="section-label mb-4">Investor Stories</span>
          <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
            Trusted by <span className="text-gradient-gold">real investors</span>
          </h2>
        </motion.div>

        {/* Desktop: 3 col */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="rounded-3xl p-7 flex flex-col"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Stars n={t.stars} />
              <p className="text-white/70 text-sm font-outfit leading-relaxed my-5 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="font-outfit font-black text-white text-sm">{t.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-outfit font-bold text-white text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-outfit font-black text-base text-gradient-gold">{t.yield}</p>
                  <p className="text-white/25 text-[10px] uppercase tracking-wide">yield</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-7"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Stars n={TESTIMONIALS[idx].stars} />
              <p className="text-white/70 text-sm font-outfit leading-relaxed my-5">"{TESTIMONIALS[idx].quote}"</p>
              <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${TESTIMONIALS[idx].gradient} flex items-center justify-center`}>
                  <span className="font-outfit font-black text-white text-sm">{TESTIMONIALS[idx].initials}</span>
                </div>
                <div className="flex-1">
                  <p className="font-outfit font-bold text-white text-sm">{TESTIMONIALS[idx].name}</p>
                  <p className="text-white/40 text-xs">{TESTIMONIALS[idx].title}</p>
                </div>
                <div className="text-right">
                  <p className="font-outfit font-black text-base text-gradient-gold">{TESTIMONIALS[idx].yield}</p>
                  <p className="text-white/25 text-[10px] uppercase">yield</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: i === idx ? '#D4AF37' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TestimonialsSection;
