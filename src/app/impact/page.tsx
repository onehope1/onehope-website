'use client';

import React from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { CheckCircle2, Shield, Calendar, Users } from 'lucide-react';

export default function ImpactPage() {
  const { state } = useDatabase();

  return (
    <PublicLayout>
      <section className="bg-slate-900 text-white py-16 sm:py-20 text-center font-inter">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <Users size={12} />
            <span>Audited Performance</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins">Our Audited Impact</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
            Visual statistics of families fed, children educated, and operations completed.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 font-inter text-slate-700 dark:text-slate-350">
        
        {/* Metric grids */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Nutritious Meals Served', count: state.cms.counters.mealsServed.toLocaleString() },
            { label: 'Children Educated', count: state.cms.counters.childrenEducated.toLocaleString() },
            { label: 'Emergency Surgery Funding', count: state.cms.counters.medicalSupplies.toLocaleString() },
            { label: 'Disaster Responses', count: state.cms.counters.disasterResponded.toLocaleString() }
          ].map((c, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
              <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-poppins">{c.count}+</span>
              <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Detailed Description */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-poppins border-l-4 border-emerald-500 pl-3">
            Ganga Valley Foothills Deployment
          </h2>
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <p>
              In our core sector around Rishikesh, OneHope coordinates textbook deliveries, digital equipment installations, and seasonal warm clothing drives. Over 15 mountain schools are currently actively serviced by our field workers.
            </p>
            <p>
              Additionally, our central kitchen cooks and packages balanced lunches distributed daily across slum areas. We maintain complete lists of raw ingredients purchased, food truck paths, and volunteer checkpoints to provide absolute transparency.
            </p>
          </div>
        </div>

        {/* Accountability callout */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl flex items-center gap-3">
          <Shield className="text-emerald-500 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-poppins">100% Traceability Standard</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Every relief activity maps back to bank audits. Visit our Transparency Page to trace transaction flows.</p>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
