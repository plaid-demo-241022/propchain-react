import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian-950 flex items-center justify-center pt-20">
        <div className="absolute inset-0 pattern-grid-fine opacity-30 pointer-events-none"/>
        <div className="text-center relative z-10 px-4">
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}>
            <p className="font-outfit font-black text-[8rem] md:text-[12rem] leading-none text-gradient-dual opacity-20 select-none">404</p>
            <h1 className="font-outfit font-black text-3xl md:text-4xl text-white -mt-8 mb-4">Page Not Found</h1>
            <p className="text-white/50 font-outfit mb-10 max-w-sm mx-auto">This property doesn't exist on-chain. Let's get you back to the platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Home className="w-4 h-4"/> Go Home
              </Link>
              <Link to="/properties" className="btn-secondary inline-flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4"/> Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
