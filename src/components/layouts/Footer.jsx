import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Send, CheckCircle2, Shield, Zap } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'Browse Properties', href: '/properties' },
    { label: 'How It Works',      href: '/how-it-works' },
    { label: 'Dashboard',         href: '/dashboard' },
    { label: 'Portfolio',         href: '/portfolio' },
  ],
  Company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Whitepaper',  href: '/whitepaper' },
    { label: 'Press',       href: '/about' },
    { label: 'Careers',     href: '/about' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/whitepaper' },
    { label: 'Privacy Policy',   href: '/whitepaper' },
    { label: 'VARA Disclosure',  href: '/whitepaper' },
    { label: 'Risk Disclosure',  href: '/whitepaper' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);

  const submit = e => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <footer aria-label="Site footer" style={{ background: 'rgba(2,6,23,0.98)', borderTop: '1px solid rgba(99,102,241,0.12)' }}>
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#6366f1)' }}>
                <span className="font-outfit font-black text-[15px] text-white">PC</span>
              </div>
              <span className="font-outfit font-black text-lg text-white">
                Prop<span className="text-gradient-gold">Chain</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm font-outfit leading-relaxed mb-6 max-w-xs">
              VARA-licensed fractional real estate investment platform. Own Dubai's premium properties from AED 500.
            </p>

            {/* Blockchain indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">On-Chain · Dubai Mainnet</span>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mb-8">
              {[
                { icon: Twitter,  label: 'Twitter',  href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Github,   label: 'GitHub',   href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            {done ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-outfit">
                <CheckCircle2 className="w-4 h-4" /> Thanks! You're on the list.
              </div>
            ) : (
              <form onSubmit={submit} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email" required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 font-outfit focus:outline-none focus:border-indigo-500/50" />
                <button type="submit"
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#6366f1)' }}>
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-white/50 hover:text-white text-sm font-outfit transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* License badges */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Shield, label: 'VARA Licensed',     color: '#D4AF37' },
              { icon: Shield, label: 'SCA Regulated',     color: '#818cf8' },
              { icon: Zap,    label: 'ISO 27001',         color: '#34d399' },
              { icon: Shield, label: 'AML/KYC Compliant', color: '#60a5fa' },
            ].map(b => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold"
                style={{ background: `rgba(${b.color === '#D4AF37' ? '212,175,55' : b.color === '#818cf8' ? '129,140,248' : b.color === '#34d399' ? '52,211,153' : '96,165,250'},0.1)`, border: `1px solid ${b.color}30`, color: b.color }}>
                <b.icon className="w-3 h-3" /> {b.label}
              </span>
            ))}
          </div>
          <p className="text-white/20 text-xs font-outfit">© {new Date().getFullYear()} PropChain FZE. All rights reserved.</p>
        </div>

        <p className="mt-4 text-white/15 text-[10px] font-outfit leading-relaxed max-w-2xl">
          PropChain is licensed by the Virtual Assets Regulatory Authority (VARA) of Dubai. Investing in tokenized real estate involves risk. Past performance is not indicative of future results. This is not financial advice.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
