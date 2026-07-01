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
  const [isReelsMuted, setIsReelsMuted] = useState(true);

  const homeHeroTitle = state.cms.hero.title || 'Hope Starts With One.';
  const homeHeroSubtitle = state.cms.hero.subtitle || 'Welcome to OneHope, an international-level humanitarian platform dedicated to helping children, families, and communities with absolute transparency, integrity, and compassion.';
  const homeHeroBg = state.cms.hero.backgroundImage || 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139&oauth2_token_id=57447761';
  const ctaDonateText = state.cms.hero.ctaDonateText || 'Donate Now';
  const ctaVolunteerText = state.cms.hero.ctaVolunteerText || 'Watch Our Impact';

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
    { title: 'Donate', desc: 'Your contribution is processed via bank-grade keys.', icon: Heart },
    { title: 'Verified', desc: 'Sponsorship allocation is instantly logged on our public database ledger.', icon: Eye },
    { title: 'Purchased', desc: 'Materials and grains are sourced directly from local Rishikesh suppliers.', icon: ShoppingCart },
    { title: 'Delivered', desc: 'Volunteer squads distribute raw grains and books directly on the ground.', icon: Truck },
    { title: 'Photos Uploaded', desc: 'Geo-tagged photos, video proof, and supplier receipt hashes are logged.', icon: UploadCloud },
    { title: 'Impact Report Sent', desc: 'A verified distribution update report is sent directly to your portal profile.', icon: ShieldCheck }
  ];  const recentDonationsList = state.donations.length > 0 
    ? [...state.donations]
        .filter(d => d.status === 'Success')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
        .map((d, index) => {
          let timeText = 'recently';
          try {
            const diffMs = new Date().getTime() - new Date(d.date).getTime();
            const diffMins = Math.max(1, Math.floor(diffMs / 60000));
            timeText = `${diffMins} minutes ago`;
            if (diffMins >= 60) {
              const diffHrs = Math.floor(diffMins / 60);
              timeText = `${diffHrs} hours ago`;
              if (diffHrs >= 24) {
                timeText = `${Math.floor(diffHrs / 24)} days ago`;
              }
            }
          } catch (e) {}
          return {
            id: d.id || String(index),
            name: d.isAnonymous ? 'Anonymous' : d.donorName,
            amount: d.amount,
            time: timeText,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(d.donorName || 'A')}`
          };
        })
    : [
        { id: '1', name: 'Rahul S.', amount: 500, time: '2 minutes ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
        { id: '2', name: 'Ayesha K.', amount: 2500, time: '8 minutes ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
        { id: '3', name: 'Vikram A.', amount: 1000, time: '15 minutes ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=100&w=100' },
        { id: '4', name: 'Neha D.', amount: 5000, time: '23 minutes ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=100&w=100' }
      ];

  const partnersList = [
    { 
      name: 'Local Supplier Network',
      icon: (
        <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12c0-5 4-9 9-9s9 4 9 9" />
          <path d="M12 3v18" />
          <path d="M7 16l5-5 5 5" />
        </svg>
      )
    },
    { 
      name: 'Razorpay Sandbox',
      icon: (
        <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 14h10l-2 8 12-12H12l2-8z" strokeLinejoin="bevel" />
        </svg>
      )
    },
    { 
      name: 'KPMG Auditing',
      icon: (
        <span className="font-poppins font-black tracking-widest text-[11px] text-slate-300 group-hover:text-white transition-colors">KPMG</span>
      )
    },
    { 
      name: 'Rishikesh Welfare Network',
      icon: (
        <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [activeReelUrl, setActiveReelUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % activeTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTestimonials.length]);

  useEffect(() => {
    if (activeReelUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeReelUrl]);

  return (
    <PublicLayout>
      <div className="bg-white font-inter select-none overflow-hidden md:pb-0 text-[16px] text-[#1A202C]">
        {/* ================= 1. EMOTIONAL HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white pt-24 pb-16 md:pt-36 md:pb-24">
          {/* Background Video or Image Backdrop */}
          {homeHeroBg.includes('.mp4') || homeHeroBg.includes('vimeo') || homeHeroBg.includes('video') ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 animate-fade-in"
              key={homeHeroBg}
            >
              <source src={homeHeroBg} type="video/mp4" />
            </video>
          ) : (
            <img
              src={homeHeroBg}
              alt="Home Background Banner"
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 animate-fade-in"
              key={homeHeroBg}
            />
          )}
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/80 to-transparent z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#1E63FF]/12 rounded-full blur-[130px] pointer-events-none z-10" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-12 space-y-6 text-center"
            >
              <h1 className="text-4xl sm:text-6xl font-black font-poppins leading-tight tracking-tight select-none">
                <span className="text-white block">{homeHeroTitle}</span>
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm tracking-widest font-black uppercase font-poppins max-w-xl mx-auto leading-relaxed">
                {homeHeroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <Link
                    href="/donate"
                    className="w-full px-8 py-3.5 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-lg shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center font-bold"
                  >
                    {ctaDonateText}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <button
                    onClick={() => setActiveReelUrl(homeHeroBg)}
                    className="w-full px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
                  >
                    {ctaVolunteerText}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= LIVE DONATION TICKER MARQUEE ================= */}
        <section className="bg-[#EEF3FA] py-2.5 border-b border-[#E5EAF2] overflow-hidden relative select-none">
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
                  {recentDonationsList.map(d => (
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
        {/* ================= 2. WHY ONEHOPE TRUST STRIP ================= */}
        <section className="bg-white border-b border-slate-100 py-5 font-inter select-none">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4 gap-x-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540] uppercase tracking-wider shrink-0">
              <span className="text-[#1E63FF] font-poppins">Why OneHope?</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold text-slate-600 w-full max-w-xl">
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Direct Ground Welfare</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Public Ledger</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Weekly Reports</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Serving Rishikesh</span></div>
            </div>
          </div>
        </section>

        {/* ================= 3. LIVE IMPACT STATS ================= */}
        <section className="py-10 bg-[#F8FBFF] border-b border-[#E5EAF2] font-inter" id="impact-stats-row">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <AnimatedCounter value={state.cms.counters.mealsServed} suffix="+" label="Meals Served" icon={Heart} />
              <AnimatedCounter value={state.cms.counters.childrenEducated} suffix="+" label="Children Educated" icon={Award} />
              <AnimatedCounter value={state.cms.counters.medicalSupplies} suffix="+" label="Medical Supplies" icon={Users} />
              <AnimatedCounter value={state.cms.counters.disasterResponded} suffix="+" label="Disasters Met" icon={ShieldCheck} />
            </div>
          </div>
        </section>

        {/* ================= 4. FEATURED EMERGENCY CAMPAIGN ================= */}
        {emergencyCampaign && (
          <section className="py-16 bg-white max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1 bg-[#1E63FF]/8 text-[#1E63FF] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                <Flame size={10} className="fill-[#1E63FF]" />
                <span>Critical Emergency</span>
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Featured Urgent Initiative
              </h2>
            </div>

            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[28px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 items-center hover:shadow-[0_20px_50px_rgba(9,37,64,0.05)] cursor-pointer group text-left"
            >
              {/* Cover Photo */}
              <div className="lg:col-span-6 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 min-h-[220px]">
                <Image 
                  src={emergencyCampaign.image}
                  alt={emergencyCampaign.title}
                  fill
                  className="object-cover group-hover:scale-101 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Critical
                </div>
              </div>

              {/* Campaign details */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between h-full py-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-0.5"><MapPin size={10} /> {emergencyCampaign.location}</span>
                    <span className="text-[#1E63FF] flex items-center gap-0.5">✔ Active procurement</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-poppins leading-tight leading-snug">
                    {emergencyCampaign.title}
                  </h3>

                  <p className="text-[#667085] text-xs sm:text-sm leading-relaxed font-semibold">
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

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-1">
                    <Link
                      href={{ pathname: '/donate', query: { campaignId: emergencyCampaign.id } }}
                      className="w-full text-center py-3 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-xl text-[11px] uppercase tracking-wider block shadow-md shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center font-semibold"
                    >
                      Sponsor
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center pt-2">
              <Link
                href="/campaigns"
                className="px-6 py-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[#0A2540] font-bold rounded-xl text-xs uppercase tracking-wider transition-all block font-semibold"
              >
                View All Active Campaigns
              </Link>
            </div>
          </section>
        )}

        {/* ================= SLIDEABLE ONGOING CAMPAIGNS CAROUSEL ================= */}
        <section className="py-16 bg-[#F8FBFF] border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="space-y-1">
                <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                  Active Support Areas
                </span>
                <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                  Ongoing Relief Campaigns
                </h2>
              </div>
              <Link
                href="/campaigns"
                className="text-xs font-bold text-[#1E63FF] hover:underline uppercase tracking-wider flex items-center gap-1 font-semibold"
              >
                <span>Browse All Campaigns</span>
                <span>→</span>
              </Link>
            </div>

            {/* Slideable container */}
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {state.campaigns.filter(c => c.status === 'Active').map((camp) => {
                const percent = Math.min(100, Math.round(((camp.raisedAmount || 0) / camp.goalAmount) * 100));
                return (
                  <motion.div
                    key={camp.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-[24px] border border-[#E5EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col min-w-[280px] w-[280px] sm:w-[320px] sm:min-w-[320px] snap-center shrink-0 text-left hover:shadow-[0_12px_40px_rgba(9,37,64,0.04)] transition-all duration-300"
                  >
                    <div className="relative aspect-video w-full">
                      <Image src={camp.image} alt={camp.title} fill className="object-cover" />
                      <div className="absolute top-4 left-4 bg-[#1E63FF] text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {camp.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-[#0A2540] text-sm font-poppins line-clamp-2 leading-tight h-10">{camp.title}</h3>
                        <p className="text-[#667085] text-xs line-clamp-2 leading-relaxed h-8 font-medium">{camp.summary}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-[#667085]">Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                          <span className="text-[#22C55E]">{percent}% Complete</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#1E63FF] to-[#22C55E]" style={{ width: `${percent}%` }} />
                        </div>
                        <Link
                          href={{ pathname: '/donate', query: { campaignId: camp.id } }}
                          className="w-full text-center py-2.5 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-xl text-[10px] uppercase tracking-wider block mt-2 font-poppins"
                        >
                          Sponsor Relief
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 5. GROUND REALITY VIDEO REELS ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter" id="our-work-reels">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Ground Verification Reels
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Daily Welfare Updates
              </h2>
            </div>

            {/* Swipeable track on mobile, columns on desktop */}
            <div className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto sm:overflow-visible pb-6 sm:pb-0 snap-x snap-mandatory no-scrollbar max-w-4xl mx-auto scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {(state.stories.filter(s => s.media?.[0]?.type === 'video').slice(0, 3).length > 0 
                ? state.stories.filter(s => s.media?.[0]?.type === 'video').slice(0, 3)
                : [
                    {
                      id: 'reel-1',
                      title: 'Daily Kitchen Breakfast Distribution',
                      desc: 'Freshly cooked nutrition served morning at Mayakund base slum nodes.',
                      media: [{ url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139', type: 'video' }]
                    },
                    {
                      id: 'reel-2',
                      title: 'Mobile Ghat-School Classrooms',
                      desc: 'Welfare kits, school notebooks, and bags provided to Ganga kids.',
                      media: [{ url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139', type: 'video' }]
                    },
                    {
                      id: 'reel-3',
                      title: 'Animal Care & Feed Drive',
                      desc: 'Nourishing feed served for street dogs across local ghat paths.',
                      media: [{ url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139', type: 'video' }]
                    }
                  ]
              ).map((reel) => {
                const url = reel.media[0]?.url || '';
                const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
                const isInstagram = url.includes('instagram.com');
                
                return (
                  <motion.div
                    key={reel.id}
                    whileHover={{ y: -4 }}
                    className="bg-slate-950 rounded-[24px] overflow-hidden border border-slate-800 shadow-sm relative group aspect-[9/16] h-[340px] mx-auto w-[220px] sm:w-auto shrink-0 sm:shrink snap-center text-left"
                  >
                    {/* Inline video/embed */}
                    {isYoutube ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}?autoplay=1&mute=1&loop=1&playlist=${url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}&controls=0&modestbranding=1&rel=0`}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        allow="autoplay; encrypted-media"
                        style={{ border: 'none' }}
                      />
                    ) : isInstagram ? (
                      <iframe
                        src={`${url.split('?')[0].replace(/\/$/, '')}/embed`}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        scrolling="no"
                        style={{ border: 'none' }}
                      />
                    ) : (
                      <video
                        src={url}
                        autoPlay
                        loop
                        muted={isReelsMuted}
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                        key={url}
                      />
                    )}
                    
                    {/* Absolute mute/unmute control */}
                    {!isYoutube && !isInstagram && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReelsMuted(!isReelsMuted);
                        }}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        {isReelsMuted ? (
                          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM12 4L9.91 6.09 12 8.18V4zm-9 4v8h4l5 5V3L7 8H3zm16.5 4c0 3.28-2.16 6.05-5.18 7.02l1.42 1.42C20.61 18.91 22.5 15.68 22.5 12c0-3.68-1.89-6.91-4.76-8.44l-1.42 1.42c3.02.97 5.18 3.74 5.18 7.02z"/></svg>
                        )}
                      </button>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-left space-y-1.5 z-10">
                      <h4 className="text-[11px] font-black text-white leading-tight font-poppins uppercase tracking-wider">{reel.title}</h4>
                      <p className="text-[9px] text-slate-350 font-semibold leading-relaxed line-clamp-2">{reel.description || reel.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 6. HUMAN STORY SECTION ================= */}
        <section className="py-16 bg-white text-slate-900 font-inter relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Real Impact Stories
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Priya's Journey to School
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                How direct community sponsorship changes lives in Rishikesh, child by child.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F8FAFC] border border-slate-100 rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-sm">
              
              {/* Left Column: Image with Before/After tags */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] w-full rounded-[20px] overflow-hidden bg-slate-100 shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600"
                    alt="Priya studying happily"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Before vs After absolute overlay */}
                <div className="absolute -bottom-4 -right-2 sm:right-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl space-y-2 max-w-[200px] text-left">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block">Before</span>
                    <p className="text-[10px] font-semibold text-slate-650 leading-tight">No books, studied under solar lantern at Ganga ghats.</p>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5 space-y-0.5">
                    <span className="text-[9px] font-bold text-[#2ECC71] uppercase tracking-widest block">After Sponsorship</span>
                    <p className="text-[10px] font-bold text-[#0A2540] leading-tight">Enrolled in school, got books & bags, topped English class.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Quotes & Story */}
              <div className="lg:col-span-7 space-y-6 text-left lg:pl-4">
                <span className="text-[10px] font-bold text-[#1E63FF] uppercase tracking-widest block">Featured Story</span>
                
                <blockquote className="text-xl sm:text-2xl font-poppins font-black text-[#0A2540] leading-tight italic">
                  &ldquo;My mother works at Ganga Ghat. Without OneHope sponsors, my studies would have stopped at sunset. Today, I have real books of my own.&rdquo;
                </blockquote>
                
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-[#0A2540]">Priya Kumari</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Student, Ganga Ghat Slum Base, Rishikesh</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  Priya is one of the 120 children attending our Ganga Ghat mobile classroom nodes. Direct grain sponsorship for her family ensured she did not have to skip school to beg at the temples.
                </p>

                <div className="pt-2">
                  <Link 
                    href="/stories"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E63FF] hover:text-[#0047AB] uppercase tracking-wider font-semibold"
                  >
                    <span>Read More Beneficiary Stories</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= INF-SCROLL SUPPORTERS & FIELD PARTNERS MARQUEE ================= */}
        {state.testimonials.length > 0 && (
          <section className="py-12 bg-white border-t border-slate-100 overflow-hidden" id="supporters-marquee-section">
            <div className="max-w-7xl mx-auto px-6 text-center mb-8">
              <span className="text-[#1E63FF] text-[10px] font-extrabold uppercase tracking-widest block font-poppins">
                Our Family
              </span>
              <h2 className="text-xl font-bold text-[#0A2540] font-poppins tracking-tight mt-0.5">
                Sponsors & Field Partners
              </h2>
            </div>

            <div className="marquee-container mask-gradient">
              <div className="marquee-content animate-marquee py-2">
                {[...state.testimonials, ...state.testimonials, ...state.testimonials].map((test, idx) => (
                  <div key={`${test.id}-${idx}`} className="flex items-center gap-4 bg-[#F8FAFC] border border-slate-150 rounded-2xl p-4 min-w-[280px] shadow-[0_2px_12px_rgba(0,0,0,0.01)] shrink-0 select-none">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1E63FF]/20 bg-slate-100 shrink-0">
                      <Image
                        src={test.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt={test.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left space-y-0.5">
                      <span className="font-bold text-xs text-[#0A2540] block">{test.name}</span>
                      <span className="text-[9px] text-[#1E63FF] font-bold uppercase tracking-wider block">{test.role}</span>
                      <p className="text-[10px] text-slate-500 italic max-w-[200px] line-clamp-1">"{test.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= 7. DONATION PROCESS TIMELINE ================= */}
        <section className="py-16 bg-[#F8FAFC] font-inter overflow-hidden border-t border-b border-[#E5EAF2]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                100% Traceable Loop
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                How Sponsoring Works
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                A circular flow mapping your transaction directly to raw ground invoices, transport logs, and verified beneficiary photos.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              
              {/* Central vertical line */}
              <div className="absolute left-[16px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 -translate-x-1/2" />

              <div className="space-y-8 relative">
                {timelineSteps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6"
                    >
                      {/* Left Block */}
                      <div className={`w-full sm:w-[45%] text-left sm:text-right hidden sm:block ${isEven ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {isEven && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#0A2540] text-sm font-poppins">{step.title}</h4>
                            <p className="text-[#667085] text-xs font-semibold leading-relaxed">{step.desc}</p>
                          </div>
                        )}
                      </div>

                      {/* Icon Marker */}
                      <div className="absolute left-[16px] sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1E63FF] text-white flex items-center justify-center shadow-md z-10 shrink-0 font-extrabold text-xs animate-pulse-slow">
                        {idx + 1}
                      </div>

                      {/* Right Block */}
                      <div className={`w-full sm:w-[45%] text-left pl-10 sm:pl-0 ${!isEven ? 'opacity-100' : 'opacity-100 sm:opacity-0 pointer-events-none'}`}>
                        <div className="space-y-1 block">
                          <h4 className="font-bold text-[#0A2540] text-sm font-poppins">{step.title}</h4>
                          <p className="text-[#667085] text-xs font-semibold leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>



        {/* ================= 11. FAQ ACCORDION ================= */}
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
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#667085] leading-relaxed border-t border-slate-100 pt-3.5 font-semibold text-left">
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

        {/* ================= 9. TESTIMONIALS SLIDER (TripGod style, attached seamlessly to Footer) ================= */}
        <section className="pt-8 pb-16 bg-[#0A2540] border-t border-white/10 font-inter overflow-hidden select-none relative">
          <style>{`
            @keyframes reviews-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-reviews-scroll {
              display: flex;
              width: max-content;
              animation: reviews-scroll 35s linear infinite;
              gap: 1.5rem;
            }
            .animate-reviews-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-6 relative z-10 text-center">
            
            {/* TripGod style heading section with brand-blue line */}
            <div className="flex flex-col items-center space-y-2 px-6">
              <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-[#1E63FF] font-poppins">
                VOICES OF HOPE
              </span>
              <h2 className="!text-white text-xl sm:text-2xl font-black font-poppins uppercase tracking-tight max-w-xl leading-tight">
                Why Hearts Trust OneHope
              </h2>
              <div className="w-12 h-1 bg-[#1E63FF] rounded-full mt-1" />
            </div>

            {/* Infinite Horizontal Reviews Marquee Container */}
            <div className="relative overflow-hidden w-full mask-gradient py-2">
              <div className="animate-reviews-scroll">
                {[
                  {
                    id: 'r1',
                    name: 'Rakesh Sharma',
                    role: 'Rishikesh, Uttarakhand',
                    quote: 'Rishikesh ke garib baccho ko khana milte dekh dil bhar aaya. OneHope ka ye direct aid sach me kamaal hai.',
                    badge: 'FOOD AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r2',
                    name: 'Aishwarya Kapoor',
                    role: 'Delhi, India',
                    quote: "Sponsoring Priya's study kit was the best decision. The video updates showing her holding her new books brought tears to my eyes.",
                    badge: 'EDUCATION SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r3',
                    name: 'Vikram Adhikari',
                    role: 'Dehradun, India',
                    quote: 'Jab meri aankhon ke samne ek injured street dog ka treatment hua, tab mujhe 100% bharosa ho gaya ki OneHope ka kaam bilkul sachha hai.',
                    badge: 'ANIMAL WELFARE',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r4',
                    name: 'Meera Deshmukh',
                    role: 'Mumbai, India',
                    quote: 'Direct ground procurement is completely transparent. I received the exact GPS coordinates and grocery receipts for the family I sponsored.',
                    badge: 'FAMILY AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r5',
                    name: 'Sanjay Pandey',
                    role: 'Lucknow, India',
                    quote: 'Maine Rishikesh Ganga ghat par baccho ko khush hote dekha jab unhe fresh garam khana mila. Aise transparency aur kahin nahi dekhi.',
                    badge: 'FOOD AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r6',
                    name: 'Neha Dutt',
                    role: 'Bangalore, India',
                    quote: 'Seeing young girls get hygiene kits and school books without any administrative middleman cuts is so satisfying.',
                    badge: 'EDUCATION SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'r7',
                    name: 'Kamlesh Kothari',
                    role: 'Rishikesh, Uttarakhand',
                    quote: 'Buzurgo ke chehre ki wo pyari smile dekh kar dil khush ho gaya. Thank you OneHope hamari help seedha un tak pahunchane ke liye.',
                    badge: 'ELDERLY CARE SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
                  }
                ].map((testimonial, idx) => (
                  <div 
                    key={testimonial.id}
                    className="w-[260px] sm:w-[290px] shrink-0 bg-slate-900/40 border border-white/10 backdrop-blur-md p-5 rounded-[20px] shadow-sm flex flex-col justify-between space-y-4 text-left hover:border-white/20 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Star ratings */}
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" stroke="none" />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <p className="text-slate-100 text-xs sm:text-[12.5px] leading-relaxed font-semibold italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Category Badge Outline (TripGod style in brand blue, high contrast) */}
                      <div>
                        <span className="inline-block border border-blue-500/30 text-blue-300 bg-blue-500/10 font-poppins font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:border-blue-400/50 group-hover:bg-blue-500/20 transition-all">
                          {testimonial.badge}
                        </span>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-0.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/10 shadow-sm shrink-0">
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left font-bold">
                          <span className="text-white text-xs block leading-tight">{testimonial.name}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Duplicate row for infinite looping effect */}
                {[
                  {
                    id: 'dup-r1',
                    name: 'Rakesh Sharma',
                    role: 'Rishikesh, Uttarakhand',
                    quote: 'Rishikesh ke garib baccho ko khana milte dekh dil bhar aaya. OneHope ka ye direct aid sach me kamaal hai.',
                    badge: 'FOOD AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r2',
                    name: 'Aishwarya Kapoor',
                    role: 'Delhi, India',
                    quote: "Sponsoring Priya's study kit was the best decision. The video updates showing her holding her new books brought tears to my eyes.",
                    badge: 'EDUCATION SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r3',
                    name: 'Vikram Adhikari',
                    role: 'Dehradun, India',
                    quote: 'Jab meri aankhon ke samne ek injured street dog ka treatment hua, tab mujhe 100% bharosa ho gaya ki OneHope ka kaam bilkul sachha hai.',
                    badge: 'ANIMAL WELFARE',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r4',
                    name: 'Meera Deshmukh',
                    role: 'Mumbai, India',
                    quote: 'Direct ground procurement is completely transparent. I received the exact GPS coordinates and grocery receipts for the family I sponsored.',
                    badge: 'FAMILY AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r5',
                    name: 'Sanjay Pandey',
                    role: 'Lucknow, India',
                    quote: 'Maine Rishikesh Ganga ghat par baccho ko khush hote dekha jab unhe fresh garam khana mila. Aise transparency aur kahin nahi dekhi.',
                    badge: 'FOOD AID SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r6',
                    name: 'Neha Dutt',
                    role: 'Bangalore, India',
                    quote: 'Seeing young girls get hygiene kits and school books without any administrative middleman cuts is so satisfying.',
                    badge: 'EDUCATION SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=100'
                  },
                  {
                    id: 'dup-r7',
                    name: 'Kamlesh Kothari',
                    role: 'Rishikesh, Uttarakhand',
                    quote: 'Buzurgo ke chehre ki wo pyari smile dekh kar dil khush ho gaya. Thank you OneHope hamari help seedha un tak pahunchane ke liye.',
                    badge: 'ELDERLY CARE SPONSOR',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
                  }
                ].map((testimonial, idx) => (
                  <div 
                    key={testimonial.id}
                    className="w-[260px] sm:w-[290px] shrink-0 bg-slate-900/40 border border-white/10 backdrop-blur-md p-5 rounded-[20px] shadow-sm flex flex-col justify-between space-y-4 text-left hover:border-white/20 transition-all group"
                    aria-hidden="true"
                  >
                    <div className="space-y-3">
                      {/* Star ratings */}
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" stroke="none" />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <p className="text-slate-100 text-xs sm:text-[12.5px] leading-relaxed font-semibold italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Category Badge Outline (TripGod style in brand blue, high contrast) */}
                      <div>
                        <span className="inline-block border border-blue-500/30 text-blue-300 bg-blue-500/10 font-poppins font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:border-blue-400/50 group-hover:bg-blue-500/20 transition-all">
                          {testimonial.badge}
                        </span>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-0.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/10 shadow-sm shrink-0">
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left font-bold">
                          <span className="text-white text-xs block leading-tight">{testimonial.name}</span>
                          <span className="text-[9px] text-slate-450 uppercase tracking-wider">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

        {/* Fullscreen Video Modal for Ground Reels */}
        <AnimatePresence>
          {activeReelUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setActiveReelUrl(null)}
            >
              <button 
                onClick={() => {
                  setActiveReelUrl(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-red-400 p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md z-[1000] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div 
                className="relative max-w-sm w-full aspect-[9/16] bg-slate-955 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <video 
                  src={activeReelUrl}
                  autoPlay
                  controls
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
                
                {/* Voice Mute Button Overlay */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-16 right-4 text-white p-3 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm z-50 transition-colors shadow-lg"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5V14.5H7.75L12 18.75z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PublicLayout>
  );
}
