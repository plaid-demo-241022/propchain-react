import { motion } from 'framer-motion';
import { Linkedin, Target, Eye, Heart, Shield, Zap, Users } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

const team = [
  { name:'Omar Al-Farsi',    title:'Chief Executive Officer',     bio:'15+ years in UAE real estate. Former MD at Emaar Properties. MBA from INSEAD.',                  initials:'OA', color:'#D4AF37' },
  { name:'Dr. Priya Menon',  title:'Chief Technology Officer',    bio:'Blockchain architect. Ex-Consensys. PhD in Distributed Systems from MIT.',                       initials:'PM', color:'#2DD4BF' },
  { name:'James Whitfield',  title:'Head of Real Estate',         bio:'20+ years in MENA property markets. Former Director at Knight Frank Dubai.',                    initials:'JW', color:'#6366f1' },
  { name:'Fatima Al-Zahra',  title:'Head of Legal & Compliance',  bio:'VARA regulatory expert. Previously led compliance at a top UAE digital bank.',                   initials:'FA', color:'#a855f7' },
];
const timeline = [
  { year:'2022', title:'Founded in Dubai',         desc:'PropChain incorporated in Dubai with a mission to democratize UAE real estate through blockchain technology.' },
  { year:'2023', title:'VARA License Obtained',    desc:'Became one of the first UAE platforms to receive full VARA licensing. Closed $3M seed round.' },
  { year:'2023', title:'First Property Tokenized', desc:'Successfully tokenized a landmark AED 4.5M Palm Jumeirah villa with 300+ investors in 48 hours.' },
  { year:'2024', title:'AED 50M Milestone',        desc:'Reached AED 50M+ in tokenized real estate. Secondary market launched for 24/7 token trading.' },
];
const values = [
  { icon: Target, title:'Accessibility',  desc:'Premium real estate investment should be accessible to everyone, not just the ultra-wealthy.' },
  { icon: Eye,    title:'Transparency',   desc:'Every fee, every return, every decision — fully disclosed and verifiable on-chain.' },
  { icon: Shield, title:'Security',       desc:'Bank-grade security with full regulatory compliance. Your investment protected at every level.' },
  { icon: Zap,    title:'Innovation',     desc:'Pioneering the intersection of real estate, blockchain, and DeFi for the UAE market.' },
  { icon: Heart,  title:'Investor First', desc:'Every product decision starts with: how does this benefit our investors?' },
  { icon: Users,  title:'Community',      desc:'Building a community of informed, empowered real estate investors across the UAE and GCC.' },
];
const press = [
  { outlet:'Gulf News',          headline:'PropChain reaches AED 50M in tokenized real estate' },
  { outlet:'Arabian Business',   headline:'How PropChain is disrupting UAE real estate investment' },
  { outlet:'Khaleej Times',      headline:'VARA-licensed platform democratizes Dubai property ownership' },
  { outlet:'Forbes Middle East', headline:'The startup making Dubai real estate accessible from AED 500' },
];

const fade = (delay=0) => ({ initial:{ opacity:0, y:30 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true }, transition:{ duration:0.6, delay } });

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* Hero */}
        <section className="pb-20" style={{ background:'linear-gradient(135deg,#1A1F2E,#1F2E72,#1A1F2E)' }}>
          <div className="container-xl text-center max-w-3xl mx-auto">
            <motion.div {...fade()}>
              <span className="section-label-gold mb-6 inline-flex">Our Story</span>
              <h1 className="font-outfit font-black text-5xl md:text-6xl text-white mt-4 mb-6">
                Democratizing <span className="text-gradient-gold">UAE Real Estate</span>
              </h1>
              <p className="text-white/60 text-lg font-outfit leading-relaxed">
                We founded PropChain with a single belief: every investor deserves access to the same premium real estate opportunities previously reserved for the ultra-wealthy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-obsidian-950">
          <div className="container-xl">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="font-outfit font-black text-4xl text-white mb-4">Leadership Team</h2>
              <p className="text-white/50 font-outfit text-lg max-w-xl mx-auto">Decades of combined experience in UAE real estate, blockchain, and finance.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m,i) => (
                <motion.div key={m.name} {...fade(i*0.1)}
                  className="rounded-3xl p-6 text-center"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background:`${m.color}20`, border:`1px solid ${m.color}40` }}>
                    <span className="font-outfit font-black text-xl" style={{ color:m.color }}>{m.initials}</span>
                  </div>
                  <h3 className="font-outfit font-bold text-white mb-1">{m.name}</h3>
                  <p className="text-xs font-semibold mb-3" style={{ color:m.color }}>{m.title}</p>
                  <p className="text-white/40 text-xs font-outfit leading-relaxed mb-4">{m.bio}</p>
                  <a href="#" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white text-xs font-outfit transition-colors">
                    <Linkedin className="w-3.5 h-3.5"/>LinkedIn
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20" style={{ background:'rgba(10,10,30,0.8)' }}>
          <div className="container-xl max-w-4xl mx-auto">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="font-outfit font-black text-4xl text-white mb-4">Our Journey</h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background:'rgba(212,175,55,0.2)' }}/>
              <div className="space-y-8">
                {timeline.map((e,i) => (
                  <motion.div key={e.year} {...fade(i*0.1)} className="flex gap-6">
                    <div className="relative z-10 w-16 shrink-0 flex flex-col items-center pt-1">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background:'#D4AF37', boxShadow:'0 0 12px rgba(212,175,55,0.5)' }}/>
                    </div>
                    <div className="rounded-2xl p-6 flex-1"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-yellow-400 font-bold text-sm">{e.year}</span>
                      <h3 className="font-outfit font-black text-white text-lg mt-1 mb-2">{e.title}</h3>
                      <p className="text-white/50 text-sm font-outfit leading-relaxed">{e.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-obsidian-950">
          <div className="container-xl">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="font-outfit font-black text-4xl text-white mb-4">Our Values</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v,i) => (
                <motion.div key={v.title} {...fade(i*0.08)}
                  className="rounded-2xl p-6 group"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', transition:'border-color 0.3s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(212,175,55,0.3)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-yellow-500/20">
                    <v.icon className="w-6 h-6 text-yellow-400"/>
                  </div>
                  <h3 className="font-outfit font-black text-white text-lg mb-2">{v.title}</h3>
                  <p className="text-white/40 text-sm font-outfit leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Press */}
        <section className="py-20" style={{ background:'rgba(10,10,30,0.6)' }}>
          <div className="container-xl">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="font-outfit font-black text-4xl text-white mb-4">In the Press</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {press.map((p,i) => (
                <motion.div key={p.outlet} {...fade(i*0.1)}
                  className="rounded-2xl p-6 flex items-start gap-4 cursor-pointer"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', transition:'border-color 0.3s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(212,175,55,0.3)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.2)' }}>
                    <span className="text-yellow-400 font-black text-xs">{p.outlet.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-yellow-400/70 text-xs font-bold uppercase tracking-wider mb-1">{p.outlet}</p>
                    <p className="text-white/80 font-outfit font-semibold text-sm leading-snug">{p.headline}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
