import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { properties } from '@/lib/data/properties';

const TYPES = ['All','Residential','Commercial','Off-Plan'];
const SORTS = [
  { v:'yield-desc',  l:'Highest Yield'  },
  { v:'funded-desc', l:'Most Funded'    },
  { v:'value-desc',  l:'Highest Value'  },
  { v:'value-asc',   l:'Lowest Value'   },
];
const PAGE_SIZE = 6;

export default function PropertiesPage() {
  const [search,  setSearch]  = useState('');
  const [type,    setType]    = useState('All');
  const [sort,    setSort]    = useState('yield-desc');
  const [page,    setPage]    = useState(1);
  const [filters, setFilters] = useState(false);
  const [minYield, setMinYield] = useState(0);

  const filtered = useMemo(() => {
    let res = [...properties];
    if (search) res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));
    if (type !== 'All') res = res.filter(p => p.type === type);
    if (minYield > 0)   res = res.filter(p => p.annualYield >= minYield);
    res.sort((a,b) => {
      if (sort==='yield-desc')  return b.annualYield - a.annualYield;
      if (sort==='funded-desc') return b.funded - a.funded;
      if (sort==='value-desc')  return b.totalValue - a.totalValue;
      if (sort==='value-asc')   return a.totalValue - b.totalValue;
      return 0;
    });
    return res;
  }, [search, type, sort, minYield]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 bg-obsidian-950 min-h-screen">
        <div className="container-xl">
          {/* Header */}
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="mb-10">
            <span className="section-label-gold mb-4 inline-flex">Marketplace</span>
            <h1 className="font-outfit font-black text-4xl md:text-5xl text-white mt-4 mb-2">
              Premium <span className="text-gradient-gold">Properties</span>
            </h1>
            <p className="text-white/50 font-outfit">{filtered.length} properties available · VARA approved</p>
          </motion.div>

          {/* Search + filters bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                placeholder="Search by name or location…"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 font-outfit focus:outline-none focus:border-indigo-500/50 transition-colors"/>
              {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"><X className="w-4 h-4"/></button>}
            </div>
            <select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-outfit focus:outline-none appearance-none cursor-pointer min-w-[160px]">
              {SORTS.map(s=><option key={s.v} value={s.v} className="bg-obsidian-900">{s.l}</option>)}
            </select>
            <button onClick={()=>setFilters(!filters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-outfit font-semibold transition-colors ${filters ? 'text-white bg-indigo-500/20 border border-indigo-500/40' : 'text-white/60 bg-white/5 border border-white/10 hover:text-white'}`}>
              <SlidersHorizontal className="w-4 h-4"/> Filters
            </button>
          </div>

          {/* Type tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TYPES.map(t => (
              <button key={t} onClick={()=>{setType(t);setPage(1);}}
                className={`px-4 py-2 rounded-full text-sm font-outfit font-bold transition-all ${type===t ? 'text-obsidian-950' : 'text-white/50 hover:text-white'}`}
                style={{ background: type===t ? 'linear-gradient(135deg,#D4AF37,#F0CA2A)' : 'rgba(255,255,255,0.05)', border: type===t ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Advanced filters */}
          {filters && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="mb-6 p-5 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex flex-wrap gap-6 items-center">
                <div>
                  <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-2">Min. Annual Yield</p>
                  <div className="flex gap-2">
                    {[0,6,7,8,9,10].map(v=>(
                      <button key={v} onClick={()=>{setMinYield(v);setPage(1);}}
                        className={`px-3 py-1.5 rounded-lg text-xs font-outfit font-bold transition-all ${minYield===v ? 'text-obsidian-950 bg-yellow-400' : 'text-white/50 bg-white/5 border border-white/10 hover:text-white'}`}>
                        {v===0?'Any':`${v}%+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {visible.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-outfit font-bold text-white/40 text-xl mb-2">No properties found</p>
              <button onClick={()=>{setSearch('');setType('All');setMinYield(0);}} className="text-indigo-400 text-sm font-outfit hover:text-indigo-300 transition-colors">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((p,i) => (
                  <motion.div key={p.id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: Math.min(i,5)*0.08 }}>
                    <PropertyCard property={p}/>
                  </motion.div>
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <button onClick={()=>setPage(pg=>pg+1)} className="btn-secondary text-sm px-8">
                    Load More ({filtered.length - visible.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
