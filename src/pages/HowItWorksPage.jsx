import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wallet, FileCheck, TrendingUp, ChevronDown, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

const STEPS = [
  { icon: Search,     n:'01', title:'Browse Properties',  color:'#6366f1',
    desc:'Explore our curated selection of VARA-approved Dubai properties. Filter by yield, location, type, and minimum investment.',
    detail:'Each listing includes full financial projections, legal documents, independent valuations, and on-chain transaction history. Our team of real estate experts handpicks every property.' },
  { icon: Wallet,     n:'02', title:'Choose Your Amount', color:'#D4AF37',
    desc:'Invest as little as AED 500. Select the number of tokens you want to purchase — each represents a fractional share of the property.',
    detail:'Pay via bank transfer, card, or crypto. Your tokens are minted on-chain immediately and appear in your dashboard within minutes. No hidden fees.' },
  { icon: FileCheck,  n:'03', title:'Complete KYC',       color:'#34d399',
    desc:'Our AI-powered KYC takes under 5 minutes. Upload your Emirates ID or passport — we handle the rest.',
    detail:'Full AML/KYC compliance per VARA regulations. Investor data encrypted and stored securely. One-time process for all future investments across all properties.' },
  { icon: TrendingUp, n:'04', title:'Earn & Trade',       color:'#818cf8',
    desc:'Receive automated monthly rental income to your wallet. Trade tokens 24/7 on our secondary marketplace.',
    detail:'Track live property performance, yields, and capital appreciation in your dashboard. Withdraw earnings to your bank or crypto wallet anytime with no lock-up period.' },
];

const FAQS = [
  { q:'Is PropChain regulated?',                ans:'Yes. PropChain is fully licensed by VARA (Virtual Assets Regulatory Authority) and complies with SCA and UAE Central Bank regulations.' },
  { q:'What is the minimum investment?',        ans:'The minimum investment is AED 500 per property. There is no maximum limit.' },
  { q:'How are rental returns distributed?',    ans:'Rental income is distributed automatically every month directly to your connected wallet or bank account.' },
  { q:'Can I sell my tokens before maturity?',  ans:'Yes. Our 24/7 secondary marketplace allows you to buy and sell property tokens at any time, providing full liquidity.' },
  { q:'How does KYC work?',                     ans:'Our AI-powered KYC process takes under 5 minutes. You will need a valid passport or Emirates ID and a selfie.' },
  { q:'Are there any fees?',                    ans:'PropChain charges a transparent 1% annual management fee. There are no hidden fees. All costs are disclosed upfront on-chain.' },
  { q:'What happens if a property is sold?',    ans:'If the underlying property is sold, proceeds are distributed pro-rata to all token holders within 48 hours of completion.' },
  { q:'Is my investment protected?',            ans:'Investor funds are held in multi-signature cold wallets by institutional custodians, separate from PropChain operational funds.' },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* Hero */}
        <section className="pb-20 text-center" style={{ background:'linear-gradient(135deg,#0a0a1a,#12103a,#0a0e1a)' }}>
          <div className="container-xl max-w-3xl mx-auto">
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}>
              <span className="section-label mb-6 inline-flex">How It Works</span>
              <h1 className="font-outfit font-black text-5xl md:text-6xl text-white mt-4 mb-6">
                From AED 500 to <span className="text-gradient-gold">property owner</span> in 4 steps
              </h1>
              <p className="text-white/55 text-lg font-outfit leading-relaxed">
                The entire process — from account creation to earning rental income — takes less than 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-obsidian-950">
          <div className="container-xl max-w-5xl mx-auto space-y-6">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity:0, x: i%2===0 ? -32 : 32 }}
                whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.1 }}
                className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start"
                style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25` }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background:`${s.color}15`, border:`1px solid ${s.color}30` }}>
                    <s.icon className="w-8 h-8" style={{ color:s.color }}/>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black tracking-widest" style={{ color:`${s.color}70` }}>{s.n}</span>
                    <h2 className="font-outfit font-black text-xl text-white">{s.title}</h2>
                  </div>
                  <p className="text-white/60 font-outfit mb-3 leading-relaxed">{s.desc}</p>
                  <p className="text-white/35 text-sm font-outfit leading-relaxed">{s.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20" style={{ background:'rgba(10,10,30,0.6)' }}>
          <div className="container-xl max-w-3xl mx-auto">
            <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
              <h2 className="font-outfit font-black text-4xl text-white mb-4">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <motion.div key={f.q} initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${openFaq===i ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                  <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-outfit font-semibold text-white text-sm">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform flex-shrink-0 ml-4 ${openFaq===i ? 'rotate-180' : ''}`}/>
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} transition={{ duration:0.25 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-white/50 text-sm font-outfit leading-relaxed">{f.ans}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-obsidian-950">
          <div className="container-xl max-w-2xl mx-auto">
            <h2 className="font-outfit font-black text-4xl text-white mb-6">Ready to start investing?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4"/></Link>
              <Link to="/properties" className="btn-secondary inline-flex items-center gap-2">Browse Properties</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
