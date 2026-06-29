'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Target, Flame, Heart, BookOpen, ShieldCheck } from 'lucide-react';

export default function MissionPage() {
  return (
    <PublicLayout>
      <section className="bg-slate-900 text-white py-16 sm:py-20 text-center font-inter">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <Target size={12} />
            <span>Our Compass</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins">Our Mission & Purpose</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Empowering human lives through transparent charity and structural field relief.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 font-inter text-slate-700 dark:text-slate-350">
        
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-poppins">
            Hope Starts With One
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Our mission is simple yet profound: to help people with absolute honesty, transparency, dignity, and compassion. We believe that global changes start with local action—sponsoring a single school textbook, checking on one sick child, packaging one food packet, or clearing debris in a single storm-hit village.
          </p>
        </div>

        {/* Goal Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {[
            { title: 'Zero Malnutrition Hunger', desc: 'Running active centralized kitchens delivering warm nutritious meals to railway track slums and street kids.', icon: Flame },
            { title: 'Digital Literacy Pods', desc: 'Deploying high-speed mountain learning centers equipped with offline solar devices for mountain kids.', icon: BookOpen },
            { title: 'Emergency Hospital Funds', desc: 'Direct MOUs with key hospitals for cashless chemotherapy, neonatal care, and critical surgeries.', icon: Heart },
            { title: '100% Traceable Charity', desc: 'Proving that technology can remove administrative leaks and rebuild public trust in charity.', icon: ShieldCheck }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center shrink-0">
                <item.icon size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-poppins">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-blue-50 dark:bg-slate-900/40 border border-blue-100 dark:border-slate-800 rounded-2xl text-xs sm:text-sm leading-relaxed text-blue-700 dark:text-blue-300">
          <strong>Founder Note:</strong> OneHope is built as a complete ecosystem. Our dashboards, volunteers check-in maps, ledger lists, and reels are completely dynamic, managed by ground welfare workers, keeping our admin footprint zero-code.
        </div>

      </div>
    </PublicLayout>
  );
}
