'use client';

import React from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MapPin, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { state } = useDatabase();

  return (
    <PublicLayout>
      {/* Premium Hero Banner with Meteors and Ultra-Light Gradient Contrast Text */}
      <section className="bg-[#0A2540] py-20 md:py-32 relative overflow-hidden font-inter border-b border-[#0A2540]">
        
        {/* Grid background with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Aceternity style Meteors Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute top-1/2 left-1/2 w-[2px] h-[50px] bg-gradient-to-b from-[#0047AB] to-[#2ECC71] rotate-[215deg] opacity-0"
              animate={{
                x: [-300, 300],
                y: [-300, 300],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: 'linear'
              }}
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 80}%`,
              }}
            />
          ))}
        </div>

        {/* Text Reveal Stagger on Mount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[#2ECC71] text-[10px] font-extrabold uppercase tracking-widest px-4.5 py-2.5 rounded-full backdrop-blur-sm">
            <MapPin size={12} />
            <span>Established in Rishikesh, India</span>
          </span>
          
          <h1 className="text-3xl sm:text-5xl md:text-6.5xl font-black font-poppins tracking-tight leading-tight select-none">
            <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent block">
              About OneHope Rishikesh
            </span>
          </h1>
          
          <p className="text-[#E2E8F0] max-w-2.5xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            A technology-driven humanitarian platform delivering honest relief to underprivileged communities in Northern India and emergency zones.
          </p>
        </motion.div>
      </section>

      {/* Pillars & Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24 bg-white font-inter">
        
        {/* Founders Story split with generous grid spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2540] font-poppins tracking-tight border-l-4 border-[#0047AB] pl-4">
              Founded in the Foothills of Rishikesh
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#0A2540]/80 leading-relaxed font-medium">
              <p>
                OneHope was established in 2026 along the banks of the Ganges in Rishikesh, Uttarakhand. Witnessing first-hand the educational deficiencies in high-altitude mountain hamlets and nutritional crises in urban migrant railway sidings, our founders set out to build a transparency system that leaves zero room for doubt.
              </p>
              <p>
                Unlike traditional platforms, OneHope relies on technological checkpoints. Every book bag distributed, medicine pack allocated, or hot meal served is registered in our local client databases, geo-tagged, photographed respectfully, and mapped to a financial statement that anyone can scrutinize in real time.
              </p>
              <p>
                We operate with a decentralized network of active field volunteers who check-in and check-out via their dashboards at target zones, ensuring structured execution.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-slate-50 border border-slate-100 transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
                alt="Rishikesh operations"
                fill
                sizes="(max-w-7xl) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Accountability pillars - Sitting directly on page background with breathing room */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#0047AB] text-xs font-extrabold uppercase tracking-widest block font-poppins">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-[#0A2540] font-poppins tracking-tight">Our Operational Pillars</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">We bind our field work to strict principles of humanitarian care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Honest Audits', desc: 'Every transaction is logged. We publish bank statement ledger lines and invoice copies.', icon: ShieldCheck },
              { title: 'Preserving Dignity', desc: 'We deliver relief with absolute respect. No exploitative media or intrusive coverage.', icon: Heart },
              { title: 'Volunteer Powered', desc: 'Direct deployment of student and professional volunteers coordinated through visual tasks.', icon: Users }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-[1px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
              >
                {/* Aceternity border glowing trace background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB] to-[#2ECC71] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]" />
                
                {/* Main Card container with shadow and spacing */}
                <div className="relative bg-white p-8 rounded-[15px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between h-full z-10">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                      <item.icon size={20} />
                    </div>
                    <h3 className="font-bold text-[#0A2540] text-base sm:text-lg font-poppins">{item.title}</h3>
                    <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section with modern interactive buttons */}
        <div className="text-center space-y-6 pt-10 border-t border-slate-100">
          <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] font-poppins tracking-tight">Want to see our financial footprint?</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/transparency"
                className="w-full sm:w-auto px-8 py-4 bg-[#0047AB] hover:bg-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center shadow-md shadow-blue-500/10 block btn-ripple"
              >
                View Transparency Ledger
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/volunteer"
                className="w-full sm:w-auto px-8 py-4 border border-[#0A2540]/30 hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-xl text-xs uppercase tracking-wider text-center block font-semibold"
              >
                Become a Volunteer
              </Link>
            </motion.div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
