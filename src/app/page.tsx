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
    { title: 'Donate', desc: 'Your contribution is processed via bank-grade keys.', icon: Heart },
    { title: 'Verified', desc: 'Sponsorship allocation is instantly logged on our public database ledger.', icon: Eye },
    { title: 'Purchased', desc: 'Materials and grains are sourced directly from local Rishikesh suppliers.', icon: ShoppingCart },
    { title: 'Delivered', desc: 'Volunteer squads distribute raw grains and books directly on the ground.', icon: Truck },
    { title: 'Photos Uploaded', desc: 'Geo-tagged photos, video proof, and supplier receipt hashes are logged.', icon: UploadCloud },
    { title: 'Impact Report Sent', desc: 'A verified distribution update report is sent directly to your portal profile.', icon: ShieldCheck }
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
      <div className="bg-white font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        {/* ================= 1. EMOTIONAL HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white pt-24 pb-16 md:pt-36 md:pb-24">
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
                <span className="text-white block">Hope Starts</span>
                <span className="bg-gradient-to-r from-[#1E63FF] via-[#00A86B] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                  With One.
                </span>
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm tracking-widest font-black uppercase font-poppins">
                Feed. Educate. Care. Transparently.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <Link
                    href="/donate"
                    className="w-full px-8 py-3.5 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-lg shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center"
                  >
                    Donate Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] sm:max-w-none sm:w-auto">
                  <button
                    onClick={() => setActiveReelUrl('https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139')}
                    className="w-full px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
                  >
                    Watch Our Impact
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
              <AnimatedCounter value={124800} suffix="+" label="Meals Served" icon={Heart} />
              <AnimatedCounter value={840} suffix="+" label="Children Educated" icon={Award} />
              <AnimatedCounter value={180} suffix="+" label="Families Supported" icon={Users} />
              <AnimatedCounter value={420} suffix="+" label="Animals Fed" icon={ShieldCheck} />
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
              {[
                {
                  id: 'reel-1',
                  title: 'Daily Kitchen Breakfast Distribution',
                  desc: 'Freshly cooked nutrition served morning at Mayakund base slum nodes.',
                  thumb: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=350',
                  videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139'
                },
                {
                  id: 'reel-2',
                  title: 'Mobile Ghat-School Classrooms',
                  desc: 'Welfare kits, school notebooks, and bags provided to Ganga kids.',
                  thumb: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=350',
                  videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139'
                },
                {
                  id: 'reel-3',
                  title: 'Animal Care & Feed Drive',
                  desc: 'Nourishing feed served for street dogs across local ghat paths.',
                  thumb: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=350',
                  videoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0548a737f204853ebf9024f923b7e7c&profile_id=139'
                }
              ].map((reel) => (
                <motion.div
                  key={reel.id}
                  onClick={() => setActiveReelUrl(reel.videoUrl)}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[24px] overflow-hidden border border-slate-200/60 shadow-sm cursor-pointer relative group aspect-[9/16] h-[340px] mx-auto w-[220px] sm:w-auto shrink-0 sm:shrink snap-center"
                >
                  <Image 
                    src={reel.thumb} 
                    alt={reel.title} 
                    fill 
                    className="object-cover group-hover:scale-102 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  {/* Play circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 bg-white/20 group-hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg scale-100 group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-left space-y-1.5 z-10">
                    <h4 className="text-[11px] font-black text-white leading-tight font-poppins uppercase tracking-wider">{reel.title}</h4>
                    <p className="text-[9px] text-slate-350 font-semibold leading-relaxed line-clamp-2">{reel.desc}</p>
                  </div>
                </motion.div>
              ))}
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

        {/* ================= 8. TRANSPARENCY / AUDIT (Enriched) ================= */}
        <section className="py-16 bg-white font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Complete Transparency
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                How We Ensure Transparency
              </h2>
              <p className="text-[#667085] text-xs sm:text-sm font-semibold">
                Where your donation goes. Verified using public transparent ledgers, instant receipt records, and direct local supplier checkouts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
              
              {/* Left Column: Redesigned dashboard cards */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
                {trustCards.map((card, idx) => (
                  <div key={idx} className="relative p-4 sm:p-6 bg-[#F8FAFC]/65 border border-slate-200/50 rounded-[20px] flex flex-col justify-between space-y-3 h-[135px] sm:h-[160px] hover:bg-white hover:border-blue-500/20 transition-all duration-300 group overflow-hidden select-none">
                    {/* Floating geometric index behind text */}
                    <span className="absolute top-2 right-4 text-3xl sm:text-[42px] font-black text-slate-100 group-hover:text-blue-55 transition-colors pointer-events-none select-none">0{idx + 1}</span>
                    
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200/60 text-[#1E63FF] shrink-0 shadow-sm relative z-10">
                      <card.icon size={15} />
                    </div>
                    <div className="space-y-1 text-left relative z-10">
                      <h4 className="font-bold text-[#0A2540] text-xs sm:text-sm font-poppins leading-tight">{card.title}</h4>
                      <p className="text-[#667085] text-[10px] sm:text-[11px] leading-relaxed font-semibold">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Public Ledger Preview Mockup */}
              <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl text-white space-y-4 text-left relative overflow-hidden select-none">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Public Ledger Live</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Audit #9842</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>TX_HASH: 0x48f...b29</span>
                      <span className="text-emerald-400">₹8,500</span>
                    </div>
                    <p className="text-[11px] font-bold text-white">Daily Kitchen Grain Purchase</p>
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                      <span>Mayakund Slum Base</span>
                      <span className="text-blue-400">View Supplier Receipt ↗</span>
                    </div>
                  </div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/5 h-[110px] hidden sm:block">
                    <Image 
                      src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"
                      alt="Ledger distribution ground proof"
                      fill
                      className="object-cover opacity-90"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 10. PARTNER LOGOS (Infinite Moving Ticker) ================= */}
        <section className="py-14 bg-[#0A2540] border-t border-b border-[#0D3052] font-inter overflow-hidden relative select-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            <h3 className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6">
              Governed Under Active Alliances
            </h3>
            
            {/* Infinite Horizontal Marquee Container */}
            <div className="marquee-container mask-gradient py-2">
              <div className="marquee-content">
                {partnersList.map((partner, idx) => (
                  <div 
                    key={idx} 
                    className="px-6 py-3.5 border border-white/5 rounded-2xl bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.07] hover:border-white/15 font-poppins font-bold text-[10px] uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 group whitespace-nowrap"
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
                    className="px-6 py-3.5 border border-white/5 rounded-2xl bg-white/[0.03] text-slate-200 hover:text-white hover:bg-white/[0.07] hover:border-white/15 font-poppins font-bold text-[10px] uppercase tracking-wider transition-all duration-350 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 group whitespace-nowrap"
                  >
                    {partner.icon}
                    <span>{partner.name}</span>
                  </div>
                ))}
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

        {/* ================= 9. TESTIMONIALS SLIDER (Attached seamlessly to Footer) ================= */}
        <section className="py-16 bg-[#0A2540] font-inter overflow-hidden border-t border-white/10 select-none">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-10">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Community Voice
              </span>
              <h2 className="text-[28px] font-black text-white font-poppins tracking-tight">
                Supporter Endorsements
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
                  className="bg-white/[0.03] p-6.5 sm:p-8 rounded-[24px] border border-white/10 shadow-sm space-y-4 text-center"
                >
                  <div className="flex justify-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-semibold italic">
                    &ldquo;{activeTestimonials[activeTestimonial].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/10 shadow-sm shrink-0">
                      <Image 
                        src={activeTestimonials[activeTestimonial].avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} 
                        alt={activeTestimonials[activeTestimonial].name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left font-bold">
                      <span className="text-white text-xs block leading-tight">{activeTestimonials[activeTestimonial].name}</span>
                      <span className="text-[9px] text-slate-450 uppercase tracking-wider">{activeTestimonials[activeTestimonial].role}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
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
