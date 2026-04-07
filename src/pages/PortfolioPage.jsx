import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

const HOLDINGS = [
  { id:'marina-heights-tower', name:'Marina Heights Tower', location:'Dubai Marina',  tokens:15,  value:15000, yield:8.2,  totalReturn:2.1,  status:'active'  },
  { id:'palm-residence',        name:'Palm Residence',       location:'Palm Jumeirah', tokens:5,   value:5000,  yield:9.1,  totalReturn:0.8,  status:'active'  },
  { id:'difc-penthouse',        name:'DIFC Sky Penthouse',   location:'DIFC',          tokens:10,  value:10000, yield:10.2, totalReturn:1.2,  status:'active'  },
];
const TRANSACTIONS = [
  { type:'DIVIDEND', property:'Marina Heights Tower', amount:102,  date:'Oct 1, 2026'  },
  { type:'PURCHASE', property:'DIFC Sky Penthouse',   amount:-10000,date:'Sep 15, 2026'},
  { type:'DIVIDEND', property:'Palm Residence',       amount:37,   date:'Sep 1, 2026'  },
  { type:'DIVIDEND', property:'Marina Heights Tower', amount:102,  date:'Sep 1, 2026'  },
  { type:'PURCHASE', property:'Palm Residence',       amount:-5000, date:'Aug 3, 2026' },
  { type:'PURCHASE', property:'Marina Heights Tower', amount:-15000,date:'Jul 12, 2026'},
];

export default function PortfolioPage() {
  const { firebaseUser, isLoading } = useAuthStore();
  const nav = useNavigate();
  const [tab, setTab]     = useState('holdings');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { if (!isLoading && !firebaseUser) nav('/signin'); }, [firebaseUser, isLoading, nav]);

  if (isLoading || !firebaseUser) {
    return <div className="min-h-screen bg-obsidian-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>;
  }

  const filtered = filter === 'ALL' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.type === filter);
  const totalValue = HOLDINGS.reduce((s,h) => s+h.value, 0);
  const totalReturn = HOLDINGS.reduce((s,h) => s+(h.value*h.totalReturn/100), 0);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-obsidian-950 min-h-screen">
        <div className="container-xl">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-8">
            <h1 className="font-outfit font-black text-3xl text-white mb-1">My Portfolio</h1>
            <p className="text-white/40 font-outfit text-sm">Track your real estate investments</p>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label:'Total Value',    value:`AED ${totalValue.toLocaleString()}`,       icon:DollarSign, color:'#D4AF37' },
              { label:'Total Return',   value:`+AED ${totalReturn.toFixed(0)}`,            icon:TrendingUp, color:'#34d399' },
              { label:'Avg. Yield',     value:'9.1%',                                     icon:TrendingUp, color:'#818cf8' },
              { label:'Properties',     value:HOLDINGS.length,                             icon:Building2,  color:'#60a5fa' },
            ].map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25` }}>
                <s.icon className="w-5 h-5 mb-3" style={{ color:s.color }}/>
                <p className="font-outfit font-black text-xl text-white stat-value">{s.value}</p>
                <p className="text-white/40 text-xs font-outfit mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background:'rgba(255,255,255,0.03)' }}>
            {[['holdings','Holdings'],['transactions','Transactions']].map(([v,l]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-5 py-2 rounded-lg text-sm font-outfit font-bold transition-all ${tab===v ? 'text-white' : 'text-white/40 hover:text-white'}`}
                style={tab===v ? { background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)' } : {}}>
                {l}
              </button>
            ))}
          </div>

          {tab==='holdings' && (
            <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/25"
                style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span className="col-span-2">Property</span><span>Tokens</span><span>Value</span><span>Yield</span>
              </div>
              {HOLDINGS.map((h,i) => (
                <motion.div key={h.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.07 }}
                  className="flex flex-col md:grid md:grid-cols-5 gap-4 items-start md:items-center px-6 py-4 hover:bg-white/2 transition-colors"
                  style={{ borderBottom:i<HOLDINGS.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-indigo-400"/>
                    </div>
                    <div>
                      <Link to={`/properties/${h.id}`} className="font-outfit font-semibold text-white text-sm hover:text-indigo-300 transition-colors">{h.name}</Link>
                      <p className="text-white/40 text-xs">{h.location}</p>
                    </div>
                  </div>
                  <span className="font-outfit text-white/70 text-sm">{h.tokens}</span>
                  <span className="font-outfit font-bold text-white text-sm stat-value">AED {h.value.toLocaleString()}</span>
                  <span className="font-outfit font-bold text-emerald-400 text-sm">{h.yield}%</span>
                </motion.div>
              ))}
            </div>
          )}

          {tab==='transactions' && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {['ALL','PURCHASE','DIVIDEND','SALE'].map(f => (
                  <button key={f} onClick={()=>setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-outfit font-bold transition-all ${filter===f?'text-obsidian-950':'text-white/50 hover:text-white'}`}
                    style={{ background:filter===f?'linear-gradient(135deg,#D4AF37,#F0CA2A)':'rgba(255,255,255,0.05)', border:filter===f?'none':'1px solid rgba(255,255,255,0.1)' }}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                {filtered.map((t,i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4"
                    style={{ borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: t.type==='DIVIDEND'?'rgba(52,211,153,0.12)':t.type==='PURCHASE'?'rgba(99,102,241,0.12)':'rgba(239,68,68,0.12)' }}>
                      <span className="text-[9px] font-black" style={{ color:t.type==='DIVIDEND'?'#34d399':t.type==='PURCHASE'?'#818cf8':'#ef4444' }}>{t.type[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-outfit font-semibold text-white text-sm">{t.property}</p>
                      <p className="text-white/30 text-xs">{t.date}</p>
                    </div>
                    <span className={`font-outfit font-black text-sm stat-value ${t.amount>0?'text-emerald-400':'text-white/70'}`}>
                      {t.amount>0?'+':''}AED {Math.abs(t.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
