'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Users, ShieldCheck, ArrowRight, CheckCircle2, Play, Flame, 
  MapPin, Award, Clock, Phone, BookOpen, Trees, 
  Home as HomeIcon, Lock, Shield, Star, Eye, 
  ShoppingCart, Truck, UploadCloud, TrendingUp, ChevronRight
} from 'lucide-react';

// Count-up counter triggered on viewport intersection with compact formatting
const AnimatedCounter: React.FC<{ value: number; suffix?: string; label: string; icon: React.ComponentType<any> }> = ({ value, suffix = '', label, icon: Icon }) => {
  const [displayText, setDisplayText] = useState('0');
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1.8;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      if (label.toLowerCase().includes("aid")) {
        const val = (easeProgress * 1.8).toFixed(1);
        setDisplayText(`₹${val} Cr`);
      } else if (label.toLowerCase().includes("lives")) {
        const val = (easeProgress * 12.8).toFixed(1);
        setDisplayText(`${val}K+`);
      } else if (label.toLowerCase().includes("communities")) {
        const val = Math.floor(easeProgress * 187);
        setDisplayText(`${val}+`);
      } else if (label.toLowerCase().includes("success")) {
        const val = Math.floor(easeProgress * 99);
        setDisplayText(`${val}%`);
      } else {
        const val = Math.floor(easeProgress * value);
        setDisplayText(`${val}${suffix}`);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, hasStarted, label, suffix]);

  return (
    <div 
      ref={elementRef} 
      className="bg-white p-4.5 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between items-center text-center shrink-0 snap-center min-w-[140px] h-[135px]"
    >
      <div className="w-8 h-8 rounded-lg bg-[#F8FBFF] flex items-center justify-center border border-[#E5EAF2] text-[#1E63FF] shrink-0">
        <Icon size={15} />
      </div>
      <div className="space-y-1">
        <span className="block text-2xl font-black font-poppins text-[#0A2540] tracking-tight leading-none">
          {displayText}
        </span>
        <span className="block text-[13px] font-bold text-[#667085] uppercase tracking-widest leading-none mt-1.5">
          {label}
        </span>
      </div>
    </div>
  );
};

export default function Home() {
  const { state } = useDatabase();

  const publicCampaigns = state.campaigns.filter(c => c.status === 'Active').slice(0, 3);
  const emergencyCampaign = publicCampaigns[0] || state.campaigns[0];
  const featuredStories = state.stories.slice(0, 3); // Display strictly 3 stories
  const activeTestimonials = state.testimonials.slice(0, 3);

  // Live metrics offsets
  const liveDonations = state.donations.reduce((acc, d) => acc + d.amount, 0) + 1250000;
  const liveMeals = state.cms.counters.mealsServed;
  const livePeople = 12842;
  const liveVolunteers = state.users.filter(u => u.volunteerStatus === 'Approved').length + 42;

  const causesList = [
    { title: 'Feed Hungry Children', desc: 'Daily organic grain distribution, nutritional supplements, and milk kitchens across slum nodes.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', icon: Heart, percent: 84 },
    { title: 'Help Homeless Rescue', desc: 'Providing dry shelter kits, tarps, warm bedding, and night shelter access to street families.', img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600', icon: HomeIcon, percent: 91 },
    { title: 'Medical Support Action', desc: 'Direct sponsorship of pediatric chemotherapy, diagnostic scans, and emergency surgeries.', img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600', icon: Shield, percent: 72 }
  ];  const trustCards = [
    { title: 'Public Ledger', desc: 'Verify disbursements hash and invoice entries transparently.', icon: ShieldCheck },
    { title: 'Verified Platform', desc: 'Direct verification loops and public database mappings.', icon: CheckCircle2 },
    { title: 'Audited Reports', desc: 'Independent monthly balance audits compiled and print-ready.', icon: Award },
    { title: 'Ground Delivery', desc: '100% direct volunteer squad procurement, no middleman cuts.', icon: Truck }
  ];

  const timelineSteps = [
    { title: 'Donate', desc: 'Sponsorship is processed via bank-grade keys.', icon: Heart },
    { title: 'Verification', desc: 'Transaction is allocated on a public transparency ledger.', icon: Eye },
    { title: 'Purchase', desc: 'Materials and grains bought from local farmers.', icon: ShoppingCart },
    { title: 'Delivery', desc: 'Volunteer squads distribute items at target field points.', icon: Truck },
    { title: 'Photo Proof', desc: 'Photos, videos, and distribution audit receipts uploaded.', icon: UploadCloud }
  ];

  const recentDonationsMock = [
    { id: '1', name: 'Rahul S.', amount: 500, time: '2 minutes ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { id: '2', name: 'Ayesha K.', amount: 2500, time: '8 minutes ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: '3', name: 'Vikram A.', amount: 1000, time: '15 minutes ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=100&w=100' },
    { id: '4', name: 'Neha D.', amount: 5000, time: '23 minutes ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=100&w=100' }
  ];

  const partnersList = [
    { 
      name: 'Local Supplier Network',
      icon: (
        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      )
    },
    { 
      name: 'Tata CSR Network',
      icon: (
        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12c0-5 4-9 9-9s9 4 9 9" />
          <path d="M12 3v18" />
          <path d="M7 16l5-5 5 5" />
        </svg>
      )
    },
    { 
      name: 'Razorpay Sandbox',
      icon: (
        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 14h10l-2 8 12-12H12l2-8z" strokeLinejoin="bevel" />
        </svg>
      )
    },
    { 
      name: 'KPMG Auditing',
      icon: (
        <span className="font-poppins font-black tracking-widest text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors">KPMG</span>
      )
    },
    { 
      name: 'Rishikesh Welfare Network',
      icon: (
        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22L12 8l8 14" />
          <path d="M8 22l4-7 4 7" />
          <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        </svg>
      )
    }
  ];

  const faqList = [
    { q: 'Where does my donation go?', a: 'Every rupee goes directly to ground procurement. Overhead and admin fees are fully sponsored internally, leaving 100% of your funds for direct impact.' },
    { q: 'Can I track my donation?', a: 'Yes! Upon completing a donation, a unique transaction hash is generated. As field supplies are purchased and dispatched, updates are posted under your tracking profile.' },
    { q: 'How do you maintain transparency?', a: 'We log transactions and invoices on our public transparency ledger. Anyone can audit distribution records, download invoices, and trace field points.' },
    { q: 'How quickly is aid delivered?', a: 'Emergency flash flood relief takes less than 24 hours. Daily kitchen distribution is conducted every morning across Mayakund base slum nodes.' },
    { q: 'Is payment secure?', a: 'Absolutely. We utilize tokenized encryption systems via Razorpay to process payments. OneHope never stores your card credentials.' }
  ];

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % activeTestimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeTestimonials.length]);

  return (
    <PublicLayout>
      <div className="bg-[#F8FBFF] font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        
        {/* ================= 1. EMOTIONAL HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white pt-6 pb-12 md:py-16">
          
          {/* Background Video Backdrop */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 animate-fade-in"
          >
            <source 
              src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139&oauth2_token_id=57447761" 
              type="video/mp4" 
            />
          </video>
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A2540] via-[#0A2540]/85 to-transparent z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#1E63FF]/12 rounded-full blur-[130px] pointer-events-none z-10" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[#22C55E] text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck size={12} />
                <span>100% Sourced & Audited Sponsoring</span>
              </span>

              <h1 className="text-[34px] sm:text-5xl font-black font-poppins leading-tight tracking-tight select-none">
                <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent block">
                  Sponsor Food & Education.
                </span>
                <span className="bg-gradient-to-r from-[#1E63FF] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                  Trace Every Rupee.
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Direct ground delivery in Rishikesh. No administrative cuts or overhead leaks. Check raw invoices, supplier receipts, and geo-tagged video proof for every sponsorship.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full pt-1">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <Link
                    href="/donate"
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-[18px] text-[13px] uppercase tracking-wider block text-center shadow-lg shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center"
                  >
                    Donate Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <button
                    onClick={() => {
                      const statsElem = document.getElementById('impact-stats-row');
                      if (statsElem) statsElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-6 py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-[18px] text-[13px] uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
                  >
                    See Our Impact
                  </button>
                </motion.div>
              </div>

              {/* Trust Signals underneath CTA buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2.5 pt-4 border-t border-white/10 text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#22C55E]" /> <span>Secure Payment (Razorpay)</span></div>
                <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#22C55E]" /> <span>Verified Platform</span></div>
                <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#22C55E]" /> <span>100% Direct Ground Sourcing</span></div>
                <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#22C55E]" /> <span>Transparent Public Ledger</span></div>
                <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#22C55E]" /> <span>Geo-tagged Video Proofs</span></div>
              </div>
            </motion.div>

            {/* Right Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full h-[230px] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.08)] bg-slate-800">
                <Image 
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600"
                  alt="Rural distributions ground proof"
                  fill
                  priority
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] to-transparent opacity-30" />
              </div>

              {/* Floating Glass Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white/[0.04] backdrop-blur-[10px] border border-white/[0.08] p-4 rounded-xl shadow-2xl text-white space-y-1.5 max-w-[190px]"
              >
                <div className="flex gap-1 items-center text-[#22C55E] text-[9px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={10} />
                  <span>Real-Time Audit</span>
                </div>
                <ul className="space-y-0.5 text-[9px] font-bold text-slate-200">
                  <li className="flex items-center gap-1">✓ 12.8K+ Lives Helped</li>
                  <li className="flex items-center gap-1">✓ ₹1.8 Cr Delivered</li>
                  <li className="flex items-center gap-1">✓ 99% Verified Delivery</li>
                  <li className="flex items-center gap-1">✓ Public Ledger Mapped</li>
                </ul>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ================= 2. LIVE DONATION TICKER MARQUEE ================= */}
        <section className="bg-[#EEF3FA] py-2 border-t border-b border-[#E5EAF2] overflow-hidden relative select-none">
          <style>{`
            @keyframes ticker-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-ticker-scroll {
              display: flex;
              width: max-content;
              animation: ticker-scroll 35s linear infinite;
            }
            .animate-ticker-scroll:hover {
              animation-play-state: paused;
            }
            .masked-marquee {
              mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
              -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
            }
          `}</style>
          <div className="relative overflow-hidden w-full masked-marquee text-[11px] font-bold text-[#0A2540]/80">
            <div className="animate-ticker-scroll gap-12">
              {[...Array(3)].map((_, outerIdx) => (
                <div key={outerIdx} className="flex gap-12 items-center shrink-0">
                  {recentDonationsMock.map(d => (
                    <div key={d.id} className="flex items-center gap-2">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white">
                        <Image src={d.avatar} alt={d.name} fill className="object-cover" />
                      </div>
                      <span>{d.name} donated <strong className="text-[#1E63FF]">₹{d.amount}</strong></span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {d.time}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. IMPACT STATS ================= */}
        <section className="py-10 bg-white border-b border-[#E5EAF2] font-inter" id="impact-stats-row">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="shrink-0 w-[240px] snap-center lg:w-auto">
                <AnimatedCounter value={livePeople} label="Lives Helped" icon={Heart} />
              </div>
              <div className="shrink-0 w-[240px] snap-center lg:w-auto">
                <AnimatedCounter value={18000000} suffix="+" label="Aid Delivered" icon={Award} />
              </div>
              <div className="shrink-0 w-[240px] snap-center lg:w-auto">
                <AnimatedCounter value={187} label="Communities" icon={Users} />
              </div>
              <div className="shrink-0 w-[240px] snap-center lg:w-auto">
                <AnimatedCounter value={99} suffix="%" label="Delivery Success" icon={ShieldCheck} />
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. FEATURED EMERGENCY CAMPAIGN (30% Larger) ================= */}
        <section className="py-16 bg-white max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#1E63FF]/8 text-[#1E63FF] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              <Flame size={10} className="fill-[#1E63FF]" />
              <span>Critical Emergency</span>
            </span>
            <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
              Urgent Welfare Appeals
            </h2>
            <p className="text-[#667085] text-xs sm:text-sm font-semibold">
              Critical flash-points requiring immediate support. Every rupee spent is linked directly to a verified field proof.
            </p>
          </div>

          {emergencyCampaign && (
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-[24px] overflow-hidden border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 max-w-4.5xl mx-auto group cursor-pointer"
            >
              {/* Photo cover aspect ratio and restricted height */}
              <div className="lg:col-span-7 relative h-[170px] lg:h-auto overflow-hidden min-h-[170px]">
                <Image 
                  src={emergencyCampaign.image}
                  alt={emergencyCampaign.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#0A2540] text-[#22C55E] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10">
                  Urgent Priority
                </div>
              </div>

              {/* Progress and Data details */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[#0A2540]/60"><MapPin size={10} /> {emergencyCampaign.location.split(',')[0]}</span>
                    <span className="text-[#1E63FF]">80G Tax Exemption</span>
                  </div>
                  
                  <h3 className="text-[18px] font-black text-[#0A2540] font-poppins leading-tight tracking-tight">
                    {emergencyCampaign.title}
                  </h3>
                  
                  <p className="text-[#667085] text-xs leading-relaxed font-semibold">
                    {emergencyCampaign.summary}
                  </p>
                </div>

                {/* Counter and fill progress */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold font-poppins">
                    <span className="text-[#667085]">Ledger Raised: <strong className="text-[#0A2540]">₹{emergencyCampaign.raisedAmount.toLocaleString()}</strong></span>
                    <span className="text-[#22C55E]">84% Completed</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '84%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#1E63FF] to-[#22C55E] rounded-full"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#667085] font-bold uppercase tracking-wider">
                    <span>Goal: ₹{emergencyCampaign.goalAmount.toLocaleString()}</span>
                    <span>140 People Donated</span>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-1">
                    <Link
                      href={{ pathname: '/donate', query: { campaignId: emergencyCampaign.id } }}
                      className="w-full text-center py-3 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider block shadow-md shadow-blue-500/10 btn-ripple font-poppins h-11 flex items-center justify-center"
                    >
                      Donate Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

        </section>

        {/* ================= 5. CAUSES WE SUPPORT (Peeking mobile swipe) ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-6">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Our Pillars
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                Welfare Initiatives We Run
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                100% direct ground operations providing food, clothing, education, and stray animal care in Rishikesh.
              </p>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-5 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {causesList.map((cause, idx) => (
                <div
                  key={idx}
                  className="w-[82vw] lg:w-auto shrink-0 snap-center p-[1px] rounded-[24px] overflow-hidden group cursor-pointer transition-all duration-300 relative shadow-sm border border-slate-200/50 bg-[#F8FAFC]/90 hover:bg-white hover:shadow-md hover:-translate-y-1"
                >
                  <div className="p-6 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      {/* Large premium icon container */}
                      <div className="w-12 h-12 rounded-2xl bg-blue-50/80 flex items-center justify-center border border-blue-100/50 text-[#1E63FF] transition-colors group-hover:bg-blue-100/50">
                        <cause.icon size={22} />
                      </div>
                      <div className="space-y-2 text-left">
                        <h3 className="text-lg font-bold text-[#0A2540] font-poppins">{cause.title}</h3>
                        <p className="text-[#667085] text-xs leading-relaxed font-semibold">{cause.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      {/* Progress bar */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400">
                          <span>Ground verified</span>
                          <span className="text-[#2ECC71]">{cause.percent}% Mapped</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: `${cause.percent}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2 w-full pt-1">
                        <Link href="/donate" className="flex-grow text-center py-2.5 bg-[#0047AB] hover:bg-[#003C91] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm block h-10 flex items-center justify-center">Sponsor</Link>
                        <Link href="/about" className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors block font-semibold h-10 flex items-center justify-center">Audit</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 6. FEATURED CAMPAIGNS (Peeking mobile swipe) ================= */}
        <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                100% Sourced on Ground
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Active Sponsoring Campaigns
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="text-xs font-bold text-[#1E63FF] hover:text-[#0047AB] flex items-center gap-1 group self-start sm:self-auto uppercase tracking-wider font-semibold"
            >
              <span>Explore All Campaigns</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Swipeable track on mobile / Grid on desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 md:pb-0 no-scrollbar w-full px-2 sm:px-0">
            {publicCampaigns.map((camp) => {
              const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
              return (
                <motion.div
                  key={camp.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-[82vw] md:w-auto shrink-0 snap-center bg-white rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-[#E5EAF2] hover:shadow-[0_20px_50px_rgba(9,37,64,0.05)] flex flex-col justify-between h-full cursor-pointer group"
                >
                  <div className="p-4 space-y-4">
                    {/* Cover photo aspect-video and restricted height */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 h-[170px] sm:h-auto">
                      <Image 
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#0A2540]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                        {camp.category}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-0.5"><MapPin size={10} /> {camp.location.split(',')[0]}</span>
                        <span className="text-[#22C55E] flex items-center gap-0.5">✔ Verified Cause</span>
                      </div>
                      
                      <h3 className="text-[18px] font-bold text-[#0A2540] leading-snug font-poppins line-clamp-1">
                        {camp.title}
                      </h3>
                      
                      <p className="text-[#667085] text-xs leading-relaxed line-clamp-2 font-medium">
                        {camp.summary}
                      </p>
                    </div>
                  </div>

                  {/* Avatars, Counter, Progress bar */}
                  <div className="p-4 pt-0 space-y-4 mt-auto">
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                          ].map((avatarUrl, aIdx) => (
                            <div key={aIdx} className="relative w-5 h-5 rounded-full overflow-hidden border-2 border-white bg-slate-100">
                              <Image src={avatarUrl} alt="Donor Avatar" fill className="object-cover" />
                            </div>
                          ))}
                          <span className="self-center pl-1 text-[9px] text-[#0A2540]/60 font-black">+{camp.volunteersCount} Donors</span>
                        </div>
                        <span className="text-[#22C55E] font-black">{percent}% Mapped</span>
                      </div>

                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-[#1E63FF] rounded-full" style={{ width: `${percent}%` }} />
                      </div>

                      <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-0.5">
                        <span>Raised: <strong className="text-[#0A2540]">₹{camp.raisedAmount.toLocaleString()}</strong></span>
                        <span>Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <Link 
                        href={`/campaigns/${camp.id}`}
                        className="text-center py-2 text-xs font-bold text-[#0A2540] border border-[#0A2540]/15 hover:border-[#0A2540] rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                      >
                        Details
                      </Link>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                        <Link 
                          href={{ pathname: '/donate', query: { campaignId: camp.id } }}
                          className="w-full text-center py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] rounded-xl transition-colors shadow-sm block text-center uppercase tracking-wider h-9 flex items-center justify-center font-semibold"
                        >
                          Donate
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>

        {/* ================= 7. HUMAN STORIES (Netflix Horizontal swipe layout) ================= */}
        <section className="py-16 bg-[#0A2540] text-white font-inter relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Verified Ground Stories
              </span>
              <h2 className="text-[28px] font-black text-white font-poppins tracking-tight">
                Stories of Direct Change
              </h2>
            </div>
            <Link
              href="/stories"
              className="text-xs font-bold text-white hover:text-slate-350 flex items-center gap-1 group self-start md:self-auto uppercase tracking-wider font-semibold"
            >
              <span>View Interactive Reels</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Compact horizontal swipe layout (9:16 aspect ratio peeking) */}
          <div className="relative overflow-hidden w-full masked-marquee z-10">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-6 sm:px-8 lg:px-10 pb-4 no-scrollbar">
              {featuredStories.map((story) => (
                <div
                  key={story.id}
                  className="shrink-0 w-[82vw] md:w-[260px] snap-center relative rounded-[24px] overflow-hidden aspect-[9/16] shadow-2xl border border-white/5 flex flex-col justify-end p-5 group cursor-pointer bg-slate-950 max-h-[460px] md:max-h-none"
                >
                  <Image 
                    src={story.media[0].url}
                    alt={story.title}
                    fill
                    sizes="260px"
                    className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-65 transition-all duration-700 rounded-[24px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent z-10" />

                  <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
                    <Play size={10} className="fill-white translate-x-0.5" />
                  </div>

                  <div className="relative z-20 space-y-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-slate-800">
                        <Image src={story.authorAvatar} alt={story.author} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold block leading-tight">{story.author}</span>
                        <span className="text-[8px] text-slate-400 flex items-center gap-0.5 font-semibold"><MapPin size={8} /> {story.location}</span>
                      </div>
                    </div>

                    <h3 className="font-poppins font-bold text-xs sm:text-sm leading-snug group-hover:text-[#1E63FF] transition-colors line-clamp-1">
                      {story.title}
                    </h3>
                    
                    <p className="text-slate-350 text-[10px] sm:text-xs line-clamp-2 leading-relaxed font-semibold">
                      &ldquo;{story.description}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>Likes: {story.likes}</span>
                      <span>Read Story</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. DONATION PROCESS TIMELINE ================= */}
        <section className="py-16 bg-white font-inter overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                100% Traceable Loop
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                Audited Sponsoring Cycle
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                A circular flow mapping your transaction directly to raw ground invoices, transport logs, and verified beneficiary photos.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto pl-8 sm:pl-0">
              
              {/* Central vertical line */}
              <div className="absolute left-[15px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-slate-150 -translate-x-1/2" />

              <div className="space-y-8 relative">
                {timelineSteps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center relative"
                    >
                      {/* Left Block (Desktop only) */}
                      <div className={`w-full pr-8 text-right hidden sm:block ${isEven ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {isEven && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#0A2540] text-sm font-poppins">{step.title}</h4>
                            <p className="text-[#667085] text-xs font-semibold leading-relaxed">{step.desc}</p>
                          </div>
                        )}
                      </div>

                      {/* Icon Marker */}
                      <div className="absolute left-0 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1E63FF] text-white flex items-center justify-center shadow-md z-10 shrink-0 font-extrabold text-xs">
                        {idx + 1}
                      </div>

                      {/* Right Block */}
                      <div className={`w-full pl-8 text-left ${!isEven ? 'opacity-100' : 'opacity-100 sm:opacity-0 pointer-events-none'}`}>
                        {(!isEven || true) && (
                          <div className="space-y-1 sm:hidden block">
                            <h4 className="font-bold text-[#0A2540] text-sm font-poppins">{step.title}</h4>
                            <p className="text-[#667085] text-xs font-semibold leading-relaxed">{step.desc}</p>
                          </div>
                        )}
                        {!isEven && (
                          <div className="space-y-1 hidden sm:block">
                            <h4 className="font-bold text-[#0A2540] text-sm font-poppins">{step.title}</h4>
                            <p className="text-[#667085] text-xs font-semibold leading-relaxed">{step.desc}</p>
                          </div>
                        )}
                      </div>

                    </motion.div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* ================= 9. TRANSPARENCY (Verification Section) ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Complete Transparency
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                Our Double-Audit System
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                Combining public transparency ledgers, instant receipt records, local supply chains, and weekly video disclosures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {trustCards.map((card, idx) => (
                <div key={idx} className="relative p-6 bg-[#F8FAFC]/65 border border-slate-200/50 rounded-[20px] flex flex-col justify-between space-y-4 h-[160px] hover:bg-white hover:border-blue-500/20 transition-all duration-300 group overflow-hidden select-none">
                  {/* Floating geometric index behind text */}
                  <span className="absolute top-2 right-4 text-[42px] font-black text-slate-100 group-hover:text-blue-50 transition-colors pointer-events-none select-none">0{idx + 1}</span>
                  
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200/60 text-[#1E63FF] shrink-0 shadow-sm relative z-10">
                    <card.icon size={16} />
                  </div>
                  <div className="space-y-1 text-left relative z-10">
                    <h4 className="font-bold text-[#0A2540] text-xs sm:text-sm font-poppins leading-tight">{card.title}</h4>
                    <p className="text-[#667085] text-[11px] leading-relaxed font-semibold">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 10. TESTIMONIALS SLIDER ================= */}
        <section className="py-16 bg-white font-inter overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Community Voice
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Supporter & Organizer Endorsements
              </h2>
            </div>

            {/* Testimonials Auto-scroll Card */}
            <div className="max-w-2xl mx-auto relative px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#F8FBFF] p-6.5 sm:p-8 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-4 text-center"
                >
                  <div className="flex justify-center gap-0.5 text-[#22C55E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <p className="text-[#1A202C] text-xs sm:text-sm leading-relaxed font-semibold italic">
                    &ldquo;{activeTestimonials[activeTestimonial].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-100 shadow-sm shrink-0">
                      <Image 
                        src={activeTestimonials[activeTestimonial].avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} 
                        alt={activeTestimonials[activeTestimonial].name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left font-bold">
                      <span className="text-[#0A2540] text-xs block leading-tight">{activeTestimonials[activeTestimonial].name}</span>
                      <span className="text-[9px] text-[#667085] uppercase tracking-wider">{activeTestimonials[activeTestimonial].role}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ================= 11. PARTNER LOGOS (Infinite Moving Ticker) ================= */}
        <section className="py-12 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            <h3 className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6">
              Governed & Audited Under Active Alliances
            </h3>
            
            {/* Infinite Horizontal Marquee Container */}
            <div className="marquee-container mask-gradient py-2">
              <div className="marquee-content">
                {partnersList.map((partner, idx) => (
                  <div 
                    key={idx} 
                    className="px-6 py-3.5 border border-slate-100 rounded-2xl bg-[#F8FAFC] text-[#0A2540]/60 hover:text-blue-600 hover:border-blue-500/20 font-poppins font-bold text-[10px] uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 group whitespace-nowrap"
                  >
                    {partner.icon}
                    <span>{partner.name}</span>
                  </div>
                ))}
              </div>
              <div className="marquee-content" aria-hidden="true">
                {partnersList.map((partner, idx) => (
                  <div 
                    key={`dup-${idx}`} 
                    className="px-6 py-3.5 border border-slate-100 rounded-2xl bg-[#F8FAFC] text-[#0A2540]/60 hover:text-blue-600 hover:border-blue-500/20 font-poppins font-bold text-[10px] uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 group whitespace-nowrap"
                  >
                    {partner.icon}
                    <span>{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 12. FAQ ACCORDION ================= */}
        <section className="py-16 max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 font-inter space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
              FAQ Portal
            </span>
            <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
              General Disclosure & FAQs
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqList.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div 
                  key={index}
                  className="border border-[#E5EAF2] rounded-[24px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center text-slate-800 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#0A2540]">{faq.q}</span>
                    <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight size={16} />
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#667085] leading-relaxed border-t border-slate-100 pt-3.5 font-semibold">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>



        {/* Sticky Mobile Donate Button Trigger (Height 56px, rounded 18px, native app shadow) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[90%] md:hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-[18px]">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/donate"
              className="w-full h-[56px] bg-gradient-to-r from-[#1E63FF] to-[#0047AB] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98 transition-all"
            >
              <Heart size={12} className="fill-white text-[#1E63FF]" />
              <span>Donate Now</span>
            </Link>
          </motion.div>
        </div>

      </div>
    </PublicLayout>
  );
}
