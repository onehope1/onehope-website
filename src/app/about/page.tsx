'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Heart, MapPin, Users, ShieldCheck, ArrowRight, Award, 
  TrendingUp, Activity, DollarSign, CheckCircle2, Eye, Gift, 
  ShoppingCart, Truck, FileText
} from 'lucide-react';

// Count-up counter triggered on viewport intersection
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
    const duration = 1.5;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const val = Math.floor(easeProgress * value);
      setDisplayText(`${val.toLocaleString()}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, hasStarted, suffix]);

  return (
    <div 
      ref={elementRef} 
      className="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col justify-between items-center text-center h-[140px] select-none hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl sm:text-3xl font-black font-poppins text-[#0A2540] tracking-tight">{displayText}</p>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#0A2540]/60">{label}</span>
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="bg-white font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        
        {/* ================= 1. CINEMATIC HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white pt-32 pb-20 md:pt-40 md:pb-28 -mt-[82px] lg:-mt-[100px] min-h-[75vh]">
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

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-20 text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black font-poppins leading-tight tracking-tight select-none">
              <span className="text-white block">About</span>
              <span className="bg-gradient-to-r from-[#1E63FF] via-[#00A86B] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                OneHope.
              </span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm tracking-widest font-black uppercase font-poppins max-w-xl mx-auto leading-relaxed">
              Hope starts with one act of kindness. Together, we turn compassion into real impact.
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
                <Link
                  href="/volunteer"
                  className="w-full px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
                >
                  Become a Volunteer
                </Link>
              </motion.div>
            </div>

            {/* Bottom trust badges */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-6 text-[10px] font-bold text-slate-350 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Verified Campaigns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Transparent Donations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Real Impact</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. OUR STORY ================= */}
        <section className="py-16 bg-white font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                  Our Beginnings
                </span>
                <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                  Our Story
                </h2>
                
                <div className="space-y-4 text-xs sm:text-sm text-[#0A2540]/80 leading-relaxed font-semibold">
                  <p>
                    OneHope started with a simple belief: One person can change one life.
                  </p>
                  <p>
                    What began as helping a few people in Rishikesh became a mission to create hope through food, education, healthcare, animal welfare, and community support.
                  </p>
                  <p>
                    Every campaign begins with one small action. Every smile reminds us why we continue.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-transform duration-500 hover:scale-[1.01]">
                  <Image
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600"
                    alt="Rishikesh operations"
                    fill
                    sizes="(max-w-7xl) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 3. MISSION & VISION ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Our Purpose
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Mission & Vision
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Mission Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                    <Heart size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2540] font-poppins">Our Mission</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                    To connect compassionate people with verified causes and create transparent impact.
                  </p>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2540] font-poppins">Our Vision</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                    A world where helping someone becomes as easy as making a payment online.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= 4. OUR CORE VALUES ================= */}
        <section className="py-16 bg-white font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Our Values
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { title: 'Compassion', desc: 'Helping every life with dignity.', icon: Heart },
                { title: 'Transparency', desc: 'Every donation is trackable.', icon: Eye },
                { title: 'Community', desc: 'People helping people.', icon: Users },
                { title: 'Impact', desc: 'Small actions creating lasting change.', icon: TrendingUp }
              ].map((val, idx) => (
                <div key={idx} className="p-5 bg-white border border-slate-200/60 rounded-2xl text-left space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                    <val.icon size={18} />
                  </div>
                  <h3 className="font-bold text-[#0A2540] text-sm font-poppins">{val.title}</h3>
                  <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed font-semibold">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. IMPACT SECTION ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Welfare Delivered
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Our Tracked Impact
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <AnimatedCounter value={3840} suffix="+" label="People Helped" icon={Users} />
              <AnimatedCounter value={124500} suffix="+" label="Meals Served" icon={Heart} />
              <AnimatedCounter value={14} label="Campaigns Mapped" icon={CheckCircle2} />
              <AnimatedCounter value={44} label="Active Volunteers" icon={Activity} />
            </div>
          </div>
        </section>

        {/* ================= 6. HOW ONEHOPE WORKS ================= */}
        <section className="py-16 bg-white font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Our Sponsoring Timelines
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                How OneHope Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto relative">
              {/* Timeline connecting lines on desktop */}
              <div className="absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-slate-200 hidden md:block z-0 pointer-events-none" />
              
              {[
                { step: '1', title: 'Donate', desc: 'Secure payment via Razorpay keys.', icon: Gift },
                { step: '2', title: 'Verification', desc: 'Allocation instantly logged on public ledger.', icon: ShieldCheck },
                { step: '3', title: 'Purchase', desc: 'Grains & kits sourced from local suppliers.', icon: ShoppingCart },
                { step: '4', title: 'Distribution', desc: 'Delivered by volunteer squad.', icon: Truck },
                { step: '5', title: 'Impact Report', desc: 'Detailed updates shared directly with you.', icon: FileText }
              ].map((item, idx) => (
                <div key={idx} className="relative p-5 bg-white border border-slate-200/60 rounded-2xl text-center space-y-3 z-10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#0047AB] text-white flex items-center justify-center mx-auto text-xs font-black shadow-sm">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#0A2540] text-sm font-poppins flex justify-center items-center gap-1.5">
                      <item.icon size={13} className="text-[#0047AB]" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-[#667085] text-[10px] leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. TRANSPARENCY PROMISE ================= */}
        <section className="py-16 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-xl mx-auto px-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6 text-left">
              <div className="text-center space-y-2">
                <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                  Our Promise
                </span>
                <h3 className="text-xl font-bold text-[#0A2540] font-poppins">
                  Transparency Promise
                </h3>
              </div>
              
              <div className="space-y-3.5 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Verified campaigns only</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Secure payment gateway</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Donation tracking</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Regular updates</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2ECC71]" /> <span>Financial transparency</span></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
