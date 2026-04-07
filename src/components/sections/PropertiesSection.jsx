import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { properties } from '@/lib/data/properties';

export function PropertiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const featured = properties.filter(p => p.status === 'active').slice(0, 3);

  return (
    <section ref={ref} className="py-24 bg-obsidian-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(99,102,241,0.06),transparent)' }} />
      <div className="container-xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label-gold mb-4 inline-flex">Featured Assets</span>
            <h2 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4">
              Premium <span className="text-gradient-gold">Properties</span>
            </h2>
            <p className="text-white/50 text-lg font-outfit mt-3 max-w-xl">
              VARA-approved, independently valued, and fully managed by institutional property managers.
            </p>
          </div>
          <Link to="/properties" className="btn-secondary text-sm inline-flex items-center gap-2 flex-shrink-0">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}>
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1) 0%,rgba(212,175,55,0.08) 100%)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at left,rgba(99,102,241,0.12),transparent 60%)' }} />
          <div className="relative z-10">
            <p className="font-outfit font-black text-2xl md:text-3xl text-white mb-2">
              Join <span className="text-gradient-gold">2,400+ investors</span> already earning
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-indigo-500','bg-yellow-500','bg-emerald-500','bg-pink-500'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-obsidian-950 flex items-center justify-center`}>
                    <Users className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm font-outfit">Average 8.5% annual yield across all properties</p>
            </div>
          </div>
          <Link to="/register" className="btn-primary text-sm relative z-10 flex-shrink-0 inline-flex items-center gap-2">
            Start Investing from AED 500 <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
export default PropertiesSection;
