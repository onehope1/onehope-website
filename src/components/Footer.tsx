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
    <footer className="bg-[#0A2540] text-[#E2E8F0] pt-20 pb-12 border-t border-white/10 font-inter relative overflow-hidden">
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

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/10 my-12" />

        {/* Main Columns Grid - Stacked cleanly for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              {/* Force white variant of logo if rendered in dark layout */}
              <Logo size={42} light={true} />
            </Link>
            <p className="text-[#E2E8F0]/70 text-xs leading-relaxed pr-4 font-semibold">
              Dedicated to restoring hope, dignity, and a better future for children and families. Verified on a public digital ledger.
            </p>
            
            {/* Social Links inside circular buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={state.settings.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white hover:text-[#1E63FF] hover:bg-white flex items-center justify-center transform transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href={state.settings.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white hover:text-[#1E63FF] hover:bg-white flex items-center justify-center transform transition-all duration-300 hover:-translate-y-1"
                aria-label="YouTube"
              >
                <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
              <a
                href={state.settings.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white hover:text-[#1E63FF] hover:bg-white flex items-center justify-center transform transition-all duration-300 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>

            {/* Impact Counter */}
            <div className="pt-4 border-t border-white/10 space-y-1 text-left">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Live Impact</span>
              <span className="text-[#2ECC71] text-xs font-poppins font-black block">12.8K+ Assisted • 99% Verified</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest font-poppins">Explore</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {[
                { label: 'Home', href: '/' },
                { label: 'Campaigns', href: '/campaigns' },
                { label: 'Stories', href: '/stories' },
                { label: 'Transparency', href: '/transparency' },
                { label: 'About', href: '/about' }
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-[#2ECC71] text-[#E2E8F0]/90 transition-colors flex items-center gap-1">
                    <ChevronRight size={10} className="text-[#E2E8F0]/40" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/10 space-y-2 text-left">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-poppins">Quick Donate</h5>
              <div className="flex flex-col space-y-1.5 text-[11px] font-semibold text-[#E2E8F0]/80">
                <Link href="/donate?amount=100&campaignId=camp-1" className="hover:text-[#2ECC71] transition-colors">Sponsor 1 Meal (₹100)</Link>
                <Link href="/donate?amount=500&campaignId=camp-2" className="hover:text-[#2ECC71] transition-colors">Sponsor School kit (₹500)</Link>
                <Link href="/donate?amount=2500&campaignId=camp-3" className="hover:text-[#2ECC71] transition-colors">Sponsor Family Ration (₹2500)</Link>
              </div>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest font-poppins">Rishikesh Base</h4>
            <ul className="space-y-3.5 text-xs text-[#E2E8F0]/80 font-medium">
              <li className="flex gap-2.5">
                <MapPin size={16} className="text-[#2ECC71] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Mayakund, near Triveni Ghat, Rishikesh, Uttarakhand, 249201, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#2ECC71] shrink-0" />
                <a href={`mailto:${state.settings.supportEmail}`} className="hover:text-[#2ECC71] transition-colors">
                  {state.settings.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#2ECC71] shrink-0" />
                <a href={`tel:${state.settings.supportPhone}`} className="hover:text-[#2ECC71] transition-colors">
                  +91 {state.settings.supportPhone}
                </a>
              </li>
            </ul>

            {/* Ground Reels Grid */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-poppins block">Ground Reels</span>
              <div className="flex gap-2">
                <a href="https://youtube.com/@onehopeindia" target="_blank" rel="noreferrer" className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 block group">
                  <Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=120" alt="Reel thumbnail" fill className="object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-70 group-hover:opacity-100"><span className="text-[8px] text-white font-bold">▶ Reel</span></div>
                </a>
                <a href="https://instagram.com/onehope.in" target="_blank" rel="noreferrer" className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/10 block group">
                  <Image src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=120" alt="Reel thumbnail" fill className="object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-70 group-hover:opacity-100"><span className="text-[8px] text-white font-bold">▶ Reel</span></div>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest font-poppins">Stay Updated</h4>
            <p className="text-[#E2E8F0]/70 text-xs leading-relaxed font-semibold">
              Receive brief verified impact milestones and audit balance sheet details directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] focus:bg-white/[0.05] rounded-2xl text-xs text-white placeholder-slate-400 font-medium transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-8 h-8 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
                  aria-label="Subscribe"
                >
                  <Send size={12} />
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E2E8F0]/60 font-semibold">
          <p>© {new Date().getFullYear()} OneHope. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/privacy" className="hover:text-[#2ECC71] transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="hover:text-[#2ECC71] transition-colors">Terms of Service</Link>
            <span className="text-white/10">|</span>
            <Link href="/refund" className="hover:text-[#2ECC71] transition-colors">Refund Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="/cookies" className="hover:text-[#2ECC71] transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
