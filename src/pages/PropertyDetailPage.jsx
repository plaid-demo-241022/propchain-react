import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize2, TrendingUp, Users, Calendar, ArrowLeft, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { getPropertyById, getRelatedProperties, formatAED } from '@/lib/data/properties';

const TABS = ['Overview','Financials','Documents','Updates'];

function FundingRing({ pct }) {
  const r = 54, circ = 2*Math.PI*r, dash = (pct/100)*circ;
  return (
    <svg width="120" height="120" className="rotate-[-90deg]">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
      <motion.circle cx="60" cy="60" r={r} fill="none" stroke="url(#rg2)" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration:1.5, ease:'easeOut' }}/>
      <defs>
        <linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#D4AF37"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const property = getPropertyById(id);
  const [tab, setTab] = useState('Overview');
  const [amount, setAmount] = useState(500);

  if (!property) {
    return (
      <><Navbar />
        <main className="pt-40 text-center min-h-screen bg-obsidian-950">
          <p className="text-white/60 font-outfit text-xl mb-6">Property not found</p>
          <Link to="/properties" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>Back to Properties</Link>
        </main>
        <Footer /></>
    );
  }

  const tokens = Math.floor(amount / property.tokenPrice);
  const annualReturn = ((amount * property.annualYield) / 100).toFixed(0);
  const monthlyReturn = (annualReturn / 12).toFixed(0);
  const related = getRelatedProperties(id, 3);

  return (
    <>
      <Navbar />
      <main className="pt-28 bg-obsidian-950 min-h-screen">
        {/* Hero */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${property.gradient} opacity-60`}/>
          {property.image && <img src={property.image} alt={property.name} className="w-full h-full object-cover opacity-40 mix-blend-overlay"/>}
          <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom,transparent 20%,rgba(2,6,23,1) 100%)' }}/>
          <div className="absolute top-4 left-4">
            <Link to="/properties" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-outfit transition-colors">
              <ArrowLeft className="w-4 h-4"/> Properties
            </Link>
          </div>
        </div>

        <div className="container-xl -mt-16 relative z-10 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase text-obsidian-950"
                    style={{ background:'linear-gradient(135deg,#D4AF37,#F0CA2A)' }}>{property.type}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-400"
                    style={{ background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.25)' }}>
                    {property.status === 'active' ? '● Active' : property.status === 'coming-soon' ? '● Coming Soon' : '● Funded'}
                  </span>
                </div>
                <h1 className="font-outfit font-black text-3xl md:text-4xl text-white mb-2">{property.name}</h1>
                <p className="flex items-center gap-2 text-white/50 font-outfit"><MapPin className="w-4 h-4"/>{property.location}</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                  { l:'Annual Yield', v:`${property.annualYield}%`,     accent:'#D4AF37' },
                  { l:'Funded',       v:`${property.funded}%`,           accent:'#818cf8' },
                  { l:'Min. Invest',  v:formatAED(property.minInvestment), accent:'#34d399' },
                  { l:'Total Value',  v:formatAED(property.totalValue),  accent:'#60a5fa' },
                ].map(s=>(
                  <div key={s.l} className="rounded-2xl p-4"
                    style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.accent}25` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color:`${s.accent}80` }}>{s.l}</p>
                    <p className="font-outfit font-black text-xl text-white stat-value" style={{ color:s.accent }}>{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Funding progress */}
              <div className="rounded-2xl p-6 mb-8"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <FundingRing pct={property.funded}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="font-outfit font-black text-xl text-white leading-none">{property.funded}%</p>
                        <p className="text-white/30 text-[9px] uppercase tracking-wider">Funded</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-outfit mb-3">
                      <span className="text-white/50">{property.availableTokens.toLocaleString()} tokens available</span>
                      <span className="text-white/50">{property.totalTokens.toLocaleString()} total</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background:'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background:'linear-gradient(90deg,#6366f1,#D4AF37)' }}
                        initial={{ width:0 }} animate={{ width:`${property.funded}%` }} transition={{ duration:1.5 }}/>
                    </div>
                    <p className="text-white/30 text-xs font-outfit">Monthly rental income: {formatAED(property.rentalIncome)}/mo</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background:'rgba(255,255,255,0.03)' }}>
                {TABS.map(t=>(
                  <button key={t} onClick={()=>setTab(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-outfit font-bold transition-all ${tab===t ? 'text-white' : 'text-white/40 hover:text-white'}`}
                    style={tab===t ? { background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)' } : {}}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {tab==='Overview' && (
                <div className="space-y-6">
                  <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <h3 className="font-outfit font-black text-white mb-3">About This Property</h3>
                    <p className="text-white/55 font-outfit text-sm leading-relaxed">{property.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-outfit font-black text-white mb-4">Property Details</h3>
                      <div className="space-y-3">
                        {property.bedrooms && <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-white/40"><Bed className="w-4 h-4"/>Bedrooms</span><span className="text-white font-semibold">{property.bedrooms}</span></div>}
                        {property.bathrooms && <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-white/40"><Bath className="w-4 h-4"/>Bathrooms</span><span className="text-white font-semibold">{property.bathrooms}</span></div>}
                        <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-white/40"><Maximize2 className="w-4 h-4"/>Area</span><span className="text-white font-semibold">{property.area.toLocaleString()} sqft</span></div>
                        <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-white/40"><Users className="w-4 h-4"/>Developer</span><span className="text-white font-semibold">{property.developer}</span></div>
                        {property.completionYear && <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-white/40"><Calendar className="w-4 h-4"/>Completion</span><span className="text-white font-semibold">{property.completionYear}</span></div>}
                      </div>
                    </div>
                    <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-outfit font-black text-white mb-4">Highlights</h3>
                      <ul className="space-y-2">
                        {property.highlights.map(h=>(
                          <li key={h} className="flex items-center gap-2 text-sm text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/>{h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <h3 className="font-outfit font-black text-white mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map(a=>(
                        <span key={a} className="px-3 py-1.5 rounded-full text-xs font-outfit font-semibold text-white/60"
                          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {tab==='Financials' && (
                <div className="rounded-2xl p-6" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-outfit font-black text-white mb-6">Financial Projections</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { l:'Annual Yield',        v:`${property.annualYield}%` },
                      { l:'Monthly Rental',      v:formatAED(property.rentalIncome)+'/mo' },
                      { l:'Token Price',         v:formatAED(property.tokenPrice) },
                      { l:'Total Property Value',v:formatAED(property.totalValue) },
                    ].map(s=>(
                      <div key={s.l} className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.03)' }}>
                        <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-1">{s.l}</p>
                        <p className="font-outfit font-black text-xl text-white stat-value">{s.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab==='Documents' && (
                <div className="space-y-3">
                  {['Property Valuation Report','Title Deed Certificate','VARA Compliance Certificate','Financial Projections Report','Property Management Agreement'].map((d,i)=>(
                    <div key={d} className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400"/>
                        <span className="text-white/70 text-sm font-outfit">{d}</span>
                      </div>
                      <a href="#" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-outfit transition-colors">
                        <ExternalLink className="w-3.5 h-3.5"/>View
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {tab==='Updates' && (
                <div className="space-y-4">
                  {[
                    { date:'Oct 2026', title:'Q3 Rental Income Distributed', body:'Monthly rental income of '+formatAED(property.rentalIncome)+' distributed to all token holders on schedule.' },
                    { date:'Sep 2026', title:'Property Inspection Completed', body:'Annual professional inspection completed. Property rated in excellent condition with no maintenance required.' },
                    { date:'Aug 2026', title:'Tenant Lease Renewed', body:'Existing tenant renewed lease for 12 months at a 5% rental increase, boosting projected annual yield.' },
                  ].map(u=>(
                    <div key={u.title} className="rounded-2xl p-5"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-yellow-400/70 text-xs font-bold uppercase tracking-wider mb-1">{u.date}</p>
                      <h4 className="font-outfit font-bold text-white mb-2">{u.title}</h4>
                      <p className="text-white/50 text-sm font-outfit">{u.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Investment widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl p-6"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,175,55,0.2)', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
                <h3 className="font-outfit font-black text-white text-lg mb-5">Invest Now</h3>
                <div className="mb-4">
                  <label className="text-white/40 text-xs font-outfit uppercase tracking-wider block mb-2">Investment Amount (AED)</label>
                  <input type="number" value={amount} min={property.minInvestment} step={property.tokenPrice}
                    onChange={e=>setAmount(Math.max(property.minInvestment, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-lg font-outfit font-bold focus:outline-none focus:border-yellow-500/50 transition-colors stat-value"/>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[500,1000,5000,10000].map(v=>(
                    <button key={v} onClick={()=>setAmount(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-outfit font-bold transition-all ${amount===v ? 'text-obsidian-950 bg-yellow-400' : 'text-white/50 bg-white/5 border border-white/10 hover:text-white'}`}>
                      {formatAED(v)}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 mb-5 p-4 rounded-xl" style={{ background:'rgba(255,255,255,0.03)' }}>
                  {[
                    { l:'Tokens',         v:`${tokens} tokens` },
                    { l:'Monthly Return', v:`AED ${Number(monthlyReturn).toLocaleString()}` },
                    { l:'Annual Return',  v:`AED ${Number(annualReturn).toLocaleString()}` },
                  ].map(s=>(
                    <div key={s.l} className="flex justify-between text-sm">
                      <span className="text-white/40 font-outfit">{s.l}</span>
                      <span className="text-white font-outfit font-bold stat-value">{s.v}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register"
                  className="w-full py-4 rounded-xl font-outfit font-black text-obsidian-950 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
                  style={{ background:'linear-gradient(135deg,#D4AF37,#F0CA2A 50%,#818cf8)' }}>
                  <TrendingUp className="w-4 h-4"/>Invest {formatAED(amount)}
                </Link>
                <p className="text-white/20 text-[10px] font-outfit mt-3 text-center">VARA licensed · Capital at risk</p>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-outfit font-black text-2xl text-white mb-6">Related Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(p=><PropertyCard key={p.id} property={p}/>)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
