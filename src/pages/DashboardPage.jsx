import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Building2, ShieldCheck, LogOut, ArrowRight, CheckCircle2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

const HOLDINGS = [
  { name:'Marina Heights Tower', location:'Dubai Marina',     tokens:15,  value:15000, yield:8.2, monthly:102  },
  { name:'Palm Residence',        location:'Palm Jumeirah',    tokens:5,   value:5000,  yield:9.1, monthly:37   },
  { name:'DIFC Sky Penthouse',    location:'DIFC',             tokens:10,  value:10000, yield:10.2,monthly:85   },
];
const TXS = [
  { type:'Dividend', property:'Marina Heights Tower', amount:'+AED 102',  date:'Oct 1, 2026',  color:'#34d399' },
  { type:'Purchase', property:'DIFC Sky Penthouse',   amount:'-AED 10,000',date:'Sep 15, 2026', color:'#818cf8' },
  { type:'Dividend', property:'Palm Residence',       amount:'+AED 37',   date:'Sep 1, 2026',  color:'#34d399' },
];

export default function DashboardPage() {
  const { firebaseUser, isLoading } = useAuthStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!isLoading && !firebaseUser) nav('/signin');
  }, [firebaseUser, isLoading, nav]);

  const handleLogout = async () => {
    await signOut(auth);
    nav('/');
  };

  if (isLoading || !firebaseUser) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  const firstName = firebaseUser.displayName?.split(' ')[0] || 'Investor';

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-obsidian-950 min-h-screen">
        <div className="container-xl">
          {/* Header */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="flex items-center justify-between mb-10">
            <div>
              <p className="text-white/40 text-sm font-outfit">Welcome back,</p>
              <h1 className="font-outfit font-black text-3xl text-white">{firstName} 👋</h1>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white text-sm font-outfit transition-colors"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <LogOut className="w-4 h-4"/> Sign Out
            </button>
          </motion.div>

          {/* KYC Banner */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
            className="mb-8 rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.25)' }}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400 flex-shrink-0"/>
              <div>
                <p className="font-outfit font-bold text-white text-sm">Complete KYC to unlock all features</p>
                <p className="text-white/40 text-xs font-outfit">Takes under 5 minutes. Required to invest.</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-outfit font-black text-obsidian-950 flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#D4AF37,#F0CA2A)' }}>
              Verify Now
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon:Wallet,       label:'Portfolio Value',  value:'AED 30,000', sub:'+2.4% this month',     color:'#D4AF37' },
              { icon:TrendingUp,   label:'Annual Yield',     value:'9.1%',       sub:'Blended across props', color:'#818cf8' },
              { icon:Building2,    label:'Properties',       value:'3',          sub:'Active investments',   color:'#34d399' },
              { icon:CheckCircle2, label:'KYC Status',       value:'Pending',    sub:'Complete to invest',   color:'#f59e0b' },
            ].map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                className="rounded-2xl p-5"
                style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background:`${s.color}15` }}>
                  <s.icon className="w-5 h-5" style={{ color:s.color }}/>
                </div>
                <p className="font-outfit font-black text-xl text-white stat-value mb-0.5">{s.value}</p>
                <p className="text-white/50 text-xs font-outfit">{s.label}</p>
                <p className="text-white/30 text-[10px] font-outfit mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Holdings */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <h2 className="font-outfit font-black text-white">My Holdings</h2>
                  <Link to="/portfolio" className="text-indigo-400 text-xs font-outfit hover:text-indigo-300 transition-colors flex items-center gap-1">
                    Full Portfolio <ArrowRight className="w-3 h-3"/>
                  </Link>
                </div>
                <div className="divide-y divide-white/5">
                  {HOLDINGS.map(h => (
                    <div key={h.name} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-outfit font-semibold text-white text-sm truncate">{h.name}</p>
                        <p className="text-white/40 text-xs">{h.location} · {h.tokens} tokens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-outfit font-black text-white text-sm stat-value">AED {h.value.toLocaleString()}</p>
                        <p className="text-emerald-400 text-xs font-bold">{h.yield}% yield</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick actions */}
              <div className="rounded-2xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="font-outfit font-black text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/properties" className="w-full flex items-center gap-3 p-3 rounded-xl text-white/60 hover:text-white transition-all text-sm font-outfit"
                    style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)' }}>
                    <Building2 className="w-4 h-4 text-indigo-400"/> Browse Properties
                  </Link>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-white/60 hover:text-white transition-all text-sm font-outfit"
                    style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)' }}>
                    <Wallet className="w-4 h-4 text-yellow-400"/> Add Funds
                  </button>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-outfit font-black text-white px-5 py-4 text-sm" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>Recent Activity</p>
                <div className="divide-y divide-white/5">
                  {TXS.map(t => (
                    <div key={t.property+t.date} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-xs font-outfit truncate">{t.property}</p>
                        <p className="text-white/30 text-[10px]">{t.date}</p>
                      </div>
                      <span className="font-outfit font-bold text-xs flex-shrink-0" style={{ color:t.color }}>{t.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
