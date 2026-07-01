'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDatabase } from '@/context/DatabaseContext';
import { Logo } from './Logo';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Send, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { state, addNewsletterSubscriber } = useDatabase();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setError('');
    const success = addNewsletterSubscriber(email);
    if (success) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      setError('This email is already subscribed.');
    }
  };

  return (
    <footer className="bg-[#061325] text-[#E2E8F0] pt-20 pb-12 border-t border-white/5 font-inter relative overflow-hidden">
      {/* Ambient Animated Particles / Night Sky Starfield */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-0"
            animate={{
              opacity: [0, 0.4, 0.8, 0.4, 0],
              scale: [0.8, 1.2, 0.8],
              y: [0, -100 - Math.random() * 200]
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'easeInOut'
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
            }}
          />
        ))}
        {/* Subtle grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
        
        {/* Glowing background auroras */}
        <div className="absolute -top-40 left-1/4 w-[500px] h-[400px] bg-gradient-to-br from-[#1E63FF]/5 to-[#2ECC71]/3 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[350px] bg-[#1E63FF]/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Top Highlight: Spotlight Glassmorphic Call to Action Panel */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white/[0.03] backdrop-blur-[8px] border border-white/[0.08] p-8 md:p-12 rounded-[24px] shadow-sm mb-16 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden group"
          >
          {/* Subtle ambient light radial overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" 
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 70%)'
            }}
          />

          <div className="space-y-1.5 text-center md:text-left relative z-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl sm:text-2xl font-black font-poppins text-white !text-white !font-extrabold tracking-tight select-none"
            >
              Hope Starts with You.
            </motion.h3>
            <p className="text-[#CBD5E1] !text-[#CBD5E1] text-xs sm:text-sm font-semibold select-none leading-relaxed">
              Join us in bringing verified food, education, and care to those in need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
            <Link
              href="/donate"
              className="px-6 py-3.5 bg-[#0047AB] hover:bg-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center shadow-md transition-colors block w-full sm:w-auto"
            >
              Donate Now
            </Link>
            <Link
              href="/volunteer"
              className="px-6 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white !text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center transition-all font-semibold block w-full sm:w-auto"
            >
              Become a Volunteer
            </Link>
          </div>
        </motion.div>

        {/* Main Columns Grid - 2 Columns on mobile, 4 Columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="space-y-4 col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo size={36} light={true} />
            </Link>
            <p className="text-[#E2E8F0]/75 text-xs leading-relaxed font-semibold">
              Dedicated to direct, audited, and photo-verified ground actions in Rishikesh.
            </p>
            
            {/* Premium Colored squircle social icons matching the user image */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-poppins block">Connect Socially</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={state.settings.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8.5 h-8.5 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
                <a
                  href={state.settings.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href={state.settings.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8.5 h-8.5 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.122C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.496a3.003 3.003 0 0 0-2.11 2.122C0 8.04 0 12 0 12s0 3.96.502 5.837a3.003 3.003 0 0 0 2.11 2.122c1.86.496 9.388.496 9.388.496s7.528 0 9.388-.496a3.003 3.003 0 0 0 2.11-2.122C24 15.96 24 12 24 12s0-3.96-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/918630027341"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8.5 h-8.5 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.501-5.734-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.57 2.019 14.113 1 11.511 1c-5.44 0-9.866 4.372-9.87 9.802 0 1.814.498 3.51 1.442 5.013L2.09 19.982l3.415-.895l1.142.667z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="!text-white font-bold text-xs uppercase tracking-widest font-poppins">Explore</h4>
            <ul className="space-y-2 text-xs font-semibold">
              {[
                { label: 'Home', href: '/' },
                { label: 'Campaigns', href: '/campaigns' },
                { label: 'Stories', href: '/stories' },
                { label: 'Transparency', href: '/transparency' },
                { label: 'Volunteer', href: '/volunteer' }
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#2ECC71] text-[#E2E8F0]/90 transition-colors flex items-center gap-1">
                    <ChevronRight size={10} className="text-[#E2E8F0]/40" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-3 col-span-2 lg:col-span-1">
            <h4 className="!text-white font-bold text-xs uppercase tracking-widest font-poppins">Rishikesh Base</h4>
            <ul className="space-y-2.5 text-xs text-[#E2E8F0]/80 font-medium">
              <li className="flex gap-2">
                <MapPin size={14} className="text-[#2ECC71] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Mayakund, near Triveni Ghat, Rishikesh, 249201</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#2ECC71] shrink-0" />
                <a href={`mailto:${state.settings.supportEmail}`} className="hover:text-[#2ECC71] transition-colors">
                  {state.settings.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#2ECC71] shrink-0" />
                <a href={`tel:${state.settings.supportPhone}`} className="hover:text-[#2ECC71] transition-colors">
                  +91 {state.settings.supportPhone}
                </a>
              </li>
            </ul>

            {/* Ground Reels badged buttons */}
            <div className="pt-2 flex flex-wrap gap-2 text-left">
              <a href="https://youtube.com/@onehopeindia" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF3333] border border-[#FF0000]/20 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all">
                <span>▶</span> YouTube Reel
              </a>
              <a href="https://instagram.com/onehope.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#DD2A7B]/10 hover:bg-[#DD2A7B]/20 text-[#FF45A5] border border-[#DD2A7B]/20 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all">
                <span>▶</span> Insta Reel
              </a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3 col-span-2 lg:col-span-1">
            <h4 className="!text-white font-bold text-xs uppercase tracking-widest font-poppins">Stay Updated</h4>
            <p className="text-[#E2E8F0]/90 text-[11px] leading-relaxed font-semibold">
              Subscribe to get audited balance sheet details.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] focus:bg-white/[0.05] rounded-xl text-xs text-white placeholder-slate-400 font-medium transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-8 h-8 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white rounded-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
                  aria-label="Subscribe"
                >
                  <Send size={11} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[#2ECC71] font-bold text-[10px]">Successfully subscribed!</p>
              )}
              {error && (
                <p className="text-red-400 text-[10px] font-bold">{error}</p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright & policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#E2E8F0]/60 font-semibold">
          <p>© {new Date().getFullYear()} OneHope. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/privacy" className="hover:text-[#2ECC71] transition-colors">Privacy</Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="hover:text-[#2ECC71] transition-colors">Terms</Link>
            <span className="text-white/10">|</span>
            <Link href="/refund" className="hover:text-[#2ECC71] transition-colors">Refund</Link>
            <span className="text-white/10">|</span>
            <Link href="/cookies" className="hover:text-[#2ECC71] transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
