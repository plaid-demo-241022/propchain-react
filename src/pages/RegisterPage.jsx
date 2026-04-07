import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Chrome, Check } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Navbar } from '@/components/layouts/Navbar';

function strength(pw) {
  return [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw)].filter(Boolean).length;
}
const strengthLabel = ['','Weak','Fair','Strong'];
const strengthColor = ['','#ef4444','#f59e0b','#34d399'];

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const pw = strength(password);

  const handleEmail = async e => {
    e.preventDefault();
    if (!agreed) { setError('Please accept the terms.'); return; }
    setLoading(true); setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      nav('/dashboard');
    } catch (err) {
      const MSGS = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/invalid-email':        'Please enter a valid email address.',
      };
      setError(MSGS[err.code] || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      nav('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError('Google sign-in failed.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian-950 flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 pattern-grid-fine opacity-30 pointer-events-none"/>
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          className="w-full max-w-md relative z-10">
          <div className="rounded-3xl p-8"
            style={{ background:'rgba(6,6,28,0.95)', border:'1px solid rgba(99,102,241,0.2)', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#D4AF37,#6366f1)' }}>
                  <span className="font-outfit font-black text-sm text-white">PC</span>
                </div>
                <span className="font-outfit font-black text-white">PropChain</span>
              </Link>
              <h1 className="font-outfit font-black text-2xl text-white mb-1">Create your account</h1>
              <p className="text-white/40 text-sm font-outfit">Start investing in Dubai real estate today</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-red-400 text-sm font-outfit"
                style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>{error}</div>
            )}

            <button onClick={handleGoogle} disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-outfit font-semibold text-white/70 hover:text-white mb-5 transition-all"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <Chrome className="w-5 h-5"/> Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.08)' }}/>
              <span className="text-white/25 text-xs font-outfit">or</span>
              <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.08)' }}/>
            </div>

            <form onSubmit={handleEmail} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-outfit placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"/>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-outfit placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"/>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
                  <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required minLength={8}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-outfit placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    {showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3].map(i=>(
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ background: i<=pw ? strengthColor[pw] : 'rgba(255,255,255,0.1)' }}/>
                      ))}
                    </div>
                    <p className="text-xs font-outfit" style={{ color: strengthColor[pw] }}>{strengthLabel[pw]}</p>
                  </div>
                )}
                <div className="mt-2 space-y-1">
                  {[['8+ characters',password.length>=8],['Uppercase letter',/[A-Z]/.test(password)],['Number',/[0-9]/.test(password)]].map(([l,ok])=>(
                    <p key={l} className={`text-xs font-outfit flex items-center gap-1.5 ${ok?'text-emerald-400':'text-white/30'}`}>
                      <Check className="w-3 h-3"/>{l}
                    </p>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div onClick={()=>setAgreed(!agreed)}
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed?'bg-indigo-500':'bg-white/10 border border-white/20'}`}>
                  {agreed && <Check className="w-3 h-3 text-white"/>}
                </div>
                <span className="text-white/40 text-xs font-outfit leading-relaxed">
                  I agree to the <Link to="/whitepaper" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link> and <Link to="/whitepaper" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>. I understand this investment involves risk.
                </span>
              </label>
              <button type="submit" disabled={loading||!agreed}
                className="w-full py-3.5 rounded-xl font-outfit font-black text-sm text-obsidian-950 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:pointer-events-none"
                style={{ background:'linear-gradient(135deg,#D4AF37,#F0CA2A 50%,#818cf8)' }}>
                {loading ? <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"/> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-white/30 text-sm font-outfit mt-6">
              Already have an account?{' '}
              <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
