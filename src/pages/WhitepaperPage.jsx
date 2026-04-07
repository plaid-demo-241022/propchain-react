import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

const SECTIONS = [
  {
    id:'executive', title:'Executive Summary',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>PropChain is a VARA-licensed real estate tokenization platform enabling fractional ownership of premium Dubai properties from AED 500. By combining blockchain technology with institutional-grade property management, PropChain democratizes access to one of the world's most lucrative real estate markets.</p>
        <p>The platform operates under a dual-token model: property tokens representing fractional ownership, and governance tokens enabling platform participation. All transactions are settled on-chain, providing full transparency and immutability.</p>
        <p>PropChain has tokenized AED 50M+ in real estate assets, serves 2,400+ investors from 42 countries, and delivers an average annual yield of 8.5% across its portfolio.</p>
      </div>
    ),
  },
  {
    id:'market', title:'Market Opportunity',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>Dubai's real estate market reached AED 528 billion in transactions in 2023, making it one of the fastest-growing property markets globally. Despite this scale, retail investor participation remains limited due to high entry barriers.</p>
        <p>The global real estate tokenization market is projected to reach $1.4 trillion by 2026. PropChain is positioned at the intersection of this growth with Dubai's regulatory clarity through VARA.</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[['AED 528B','Dubai RE Market 2023'],['$1.4T','Global Tokenization 2026'],['8.5%','Avg Dubai Yield']].map(([v,l])=>(
            <div key={l} className="rounded-xl p-4 text-center" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-outfit font-black text-xl text-white mb-1">{v}</p>
              <p className="text-white/40 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:'tech', title:'Technology Stack',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>PropChain's infrastructure is built on an EVM-compatible blockchain with custom smart contracts audited by leading security firms. Our token standard (ERC-1400) supports regulatory compliance natively.</p>
        {['Smart Contract Layer — ERC-1400 security tokens with transfer restrictions','KYC/AML Layer — AI-powered identity verification integrated with UAE government systems','Settlement Layer — Automated dividend distribution via on-chain escrow contracts','Trading Layer — Order-book DEX with institutional liquidity providers'].map(i=>(
          <div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5"/><span>{i}</span></div>
        ))}
      </div>
    ),
  },
  {
    id:'tokenomics', title:'Tokenomics',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>Each property is represented by a fixed supply of tokens at AED 1,000 per token. Token holders receive proportional rental income, capital appreciation, and voting rights on property management decisions.</p>
        <div className="grid grid-cols-2 gap-4">
          {[['Token Price','AED 1,000'],['Min. Investment','AED 500 (0.5 token)'],['Dividend Frequency','Monthly'],['Secondary Market','24/7 DEX Trading'],['Management Fee','1% annually'],['Transaction Fee','0.5% on trades']].map(([l,v])=>(
            <div key={l} className="flex justify-between p-3 rounded-lg" style={{ background:'rgba(255,255,255,0.04)' }}>
              <span className="text-white/40 text-xs">{l}</span>
              <span className="text-white font-semibold text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id:'compliance', title:'Compliance & Legal',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>PropChain operates under VARA (Virtual Assets Regulatory Authority) License #VA-2024-001, SCA regulatory compliance, and UAE Central Bank AML/CFT frameworks.</p>
        <p>All property tokens are classified as regulated securities under UAE law. Investors undergo full KYC/AML verification before participation. Non-compliant transfers are blocked at the smart contract level.</p>
        {['VARA License #VA-2024-001','SCA Regulated Securities','UAE Central Bank AML Framework','ISO 27001 Information Security','GDPR Data Protection Compliance'].map(c=>(
          <div key={c} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/><span>{c}</span></div>
        ))}
      </div>
    ),
  },
  {
    id:'security', title:'Security Framework',
    content: (
      <div className="space-y-4 text-white/60 font-outfit text-sm leading-relaxed">
        <p>PropChain employs a defense-in-depth security approach combining cryptographic guarantees, institutional custody, and regulatory oversight.</p>
        {['256-bit AES encryption for all data at rest','TLS 1.3 for all data in transit','Multi-signature cold wallet custody by institutional partners','Smart contract audits by CertiK and Quantstamp','Real-time transaction monitoring and anomaly detection','Bug bounty program with up to $100,000 rewards'].map(s=>(
          <div key={s} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"/><span>{s}</span></div>
        ))}
      </div>
    ),
  },
  {
    id:'roadmap', title:'Roadmap',
    content: (
      <div className="space-y-4">
        {[
          { phase:'Phase 1 — Q1 2024', title:'Platform Launch',          done:true,  items:['VARA license obtained','First 3 properties tokenized','KYC system live'] },
          { phase:'Phase 2 — Q3 2024', title:'Secondary Market',         done:true,  items:['DEX trading launched','AED 50M assets milestone','Mobile app beta'] },
          { phase:'Phase 3 — Q1 2025', title:'DeFi Integration',         done:false, items:['Token staking rewards','Yield farming pools','Cross-chain bridge'] },
          { phase:'Phase 4 — Q3 2025', title:'International Expansion',  done:false, items:['Saudi Arabia market','GCC property listings','Institutional API'] },
        ].map(p=>(
          <div key={p.phase} className="rounded-xl p-5" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${p.done?'rgba(52,211,153,0.2)':'rgba(255,255,255,0.08)'}` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.done?'text-emerald-400 bg-emerald-400/10':'text-white/40 bg-white/5'}`}>{p.done?'Complete':'Upcoming'}</span>
              <span className="text-white/30 text-xs font-outfit">{p.phase}</span>
            </div>
            <p className="font-outfit font-bold text-white text-sm mb-2">{p.title}</p>
            {p.items.map(i=>(
              <div key={i} className="flex items-center gap-2 text-xs text-white/50 font-outfit">
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${p.done?'text-emerald-400':'text-white/20'}`}/>{i}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
];

export default function WhitepaperPage() {
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => Math.max(0, i-1));
  const next = () => setActive(i => Math.min(SECTIONS.length-1, i+1));

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 bg-obsidian-950 min-h-screen">
        <div className="container-xl">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between mb-8">
            <div>
              <span className="section-label mb-3 inline-flex">Official Document</span>
              <h1 className="font-outfit font-black text-3xl text-white mt-3">PropChain Whitepaper</h1>
              <p className="text-white/40 text-sm font-outfit mt-1">v2.1 · October 2026</p>
            </div>
            <button className="btn-secondary text-sm inline-flex items-center gap-2">
              <Download className="w-4 h-4"/> Download PDF
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* TOC sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl p-4" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/25 px-2 mb-3">Contents</p>
                <ul className="space-y-1">
                  {SECTIONS.map((s,i) => (
                    <li key={s.id}>
                      <button onClick={()=>setActive(i)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-outfit transition-all ${active===i?'text-white font-bold':'text-white/40 hover:text-white'}`}
                        style={active===i?{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)' }:{}}>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}
                  className="rounded-3xl p-8" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-white/25 text-xs font-outfit uppercase tracking-widest mb-2">Section {String(active+1).padStart(2,'0')}</p>
                  <h2 className="font-outfit font-black text-2xl text-white mb-6">{SECTIONS[active].title}</h2>
                  {SECTIONS[active].content}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-6">
                <button onClick={prev} disabled={active===0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                  <ChevronLeft className="w-4 h-4"/> Previous
                </button>
                <span className="text-white/25 text-xs font-outfit">{active+1} / {SECTIONS.length}</span>
                <button onClick={next} disabled={active===SECTIONS.length-1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-outfit font-semibold text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                  Next <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
