'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Users, Heart, Sparkles, Filter, 
  ArrowUpDown, X, Layers, Flame, BookOpen, Shield, 
  Trees, Clock, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

export default function CampaignsCatalog() {
  const { state } = useDatabase();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Urgent');
  const [visibleCount, setVisibleCount] = useState(6);

  // Categories list mapped with matching icons
  const categoriesList = [
    { label: 'All', icon: Layers },
    { label: 'Food', icon: Heart },
    { label: 'Education', icon: BookOpen },
    { label: 'Medical', icon: Shield },
    { label: 'Disaster Relief', icon: Trees },
    { label: 'Children', icon: Users },
    { label: 'Emergency', icon: Flame }
  ];

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(6);
  }, [search, category, sortBy]);

  // Filters logic
  const activeCampaigns = state.campaigns.filter((c) => c.status === 'Active');

  const filtered = activeCampaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.summary.toLowerCase().includes(search.toLowerCase()) ||
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'Most Urgent') {
      // Urgent campaigns are those with higher progress gap or Emergency category
      const aEmergency = a.category === 'Emergency' ? 2 : 1;
      const bEmergency = b.category === 'Emergency' ? 2 : 1;
      if (bEmergency !== aEmergency) return bEmergency - aEmergency;
      return (a.raisedAmount / a.goalAmount) - (b.raisedAmount / b.goalAmount);
    }
    if (sortBy === 'Ending Soon') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'Most Funded') {
      return b.raisedAmount - a.raisedAmount;
    }
    if (sortBy === 'Recently Updated') {
      return b.updates.length - a.updates.length;
    }
    return 0;
  });

  // Split featured campaign from grid listing
  const featuredCampaign = sorted[0];
  const gridCampaigns = sorted.slice(1, visibleCount);

  // Helpers to get days left and donor counts deterministically
  const getDaysLeft = (createdAtStr: string) => {
    const days = 30 - Math.floor((Date.now() - new Date(createdAtStr).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(3, days);
  };

  const getDonorsCount = (campId: string, seed: number) => {
    const campaign = state.campaigns.find(c => c.id === campId);
    const count = (campaign?.recentDonations?.length || 0) + (seed % 17) + 12;
    return count;
  };

  return (
    <PublicLayout>
      <div className="bg-[#F8FBFF] font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white py-16 md:py-20 border-b border-[#E5EAF2]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#1E63FF]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#1E63FF] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-[#1E63FF]" />
              <span>100% Traceable Sponsoring</span>
            </span>

            <h1 className="text-[34px] md:text-5xl font-black font-poppins tracking-tight leading-tight text-white" style={{ color: '#FFFFFF' }}>
              Direct Welfare Sponsoring.
              <span className="bg-gradient-to-r from-[#1E63FF] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                Zero Middlemen Loss.
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
              Every campaign represents an active, audited ground action in Rishikesh. Track purchases, download receipts, and view geo-tagged media proof.
            </p>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4 border-t border-white/10">
              <div className="text-center space-y-0.5">
                <span className="text-[18px] md:text-xl font-bold text-white block">12.8K+</span>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Lives Helped</span>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[18px] md:text-xl font-bold text-white block">{activeCampaigns.length}</span>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Active Causes</span>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[18px] md:text-xl font-bold text-white block">100%</span>
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Direct Relief</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. STICKY FILTER & SEARCH TOOLBAR ================= */}
        <section className="sticky top-[58px] md:top-[72px] bg-[#F8FBFF]/80 backdrop-blur-md border-b border-[#E5EAF2] z-30 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search campaigns, food, education..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 px-4 pl-11 pr-10 bg-white border border-[#E5EAF2] rounded-[16px] focus:outline-none text-xs font-semibold text-[#0A2540] placeholder-slate-400 shadow-sm"
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={14} />
                {search && (
                  <button 
                    onClick={() => setSearch('')} 
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#0A2540]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sorting & Count */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <div className="text-[#667085] text-xs font-semibold">
                  <span className="text-[#0A2540] font-bold">{filtered.length}</span> campaigns found
                </div>

                <div className="flex items-center gap-1.5">
                  <ArrowUpDown size={13} className="text-[#667085]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-2 bg-white border border-[#E5EAF2] rounded-xl text-xs font-bold text-[#0A2540] focus:outline-none shadow-sm"
                  >
                    <option>Most Urgent</option>
                    <option>Newest</option>
                    <option>Ending Soon</option>
                    <option>Most Funded</option>
                    <option>Recently Updated</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Horizontal Scrollable Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {categoriesList.map((cat) => {
                const CatIcon = cat.icon;
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 border shadow-sm ${
                      isSelected
                        ? 'bg-[#1E63FF] text-white border-[#1E63FF]'
                        : 'bg-white text-[#0A2540] border-[#E5EAF2] hover:bg-slate-50'
                    }`}
                  >
                    <CatIcon size={12} className={isSelected ? 'text-white' : 'text-[#1E63FF]'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= 3. FEATURED CAMPAIGN HIGHLIGHT ================= */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {featuredCampaign && (
              <motion.div
                key={featuredCampaign.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-[24px] border border-[#E5EAF2] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] grid grid-cols-1 lg:grid-cols-12 gap-0 group"
              >
                {/* Left side: Image */}
                <div className="lg:col-span-6 relative h-[250px] sm:h-[320px] lg:h-auto overflow-hidden bg-slate-50">
                  <Image
                    src={featuredCampaign.image}
                    alt={featuredCampaign.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-white/95 rounded-xl text-[9px] font-bold text-[#0A2540] shadow-sm border border-slate-100/50 uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-xl text-[9px] font-bold shadow-sm uppercase tracking-wider">
                      📍 Currently Serving Rishikesh
                    </span>
                  </div>
                </div>

                {/* Right side: Progress & details */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#667085]">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-[#1E63FF]" /> {featuredCampaign.location}</span>
                      <span className="flex items-center gap-1 text-[#22C55E]"><CheckCircle2 size={12} /> Verified Relief</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] font-poppins leading-tight group-hover:text-[#1E63FF] transition-colors">
                      <Link href={`/campaigns/${featuredCampaign.id}`}>{featuredCampaign.title}</Link>
                    </h2>

                    <p className="text-[#667085] text-xs sm:text-sm leading-relaxed font-semibold">
                      {featuredCampaign.summary}
                    </p>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-100">
                    {(() => {
                      const percent = Math.min(100, Math.round((featuredCampaign.raisedAmount / featuredCampaign.goalAmount) * 100));
                      const daysLeft = getDaysLeft(featuredCampaign.createdAt);
                      const donorsCount = getDonorsCount(featuredCampaign.id, featuredCampaign.goalAmount);
                      return (
                        <>
                          <div className="flex justify-between items-end text-xs font-bold font-poppins">
                            <span className="text-[#22C55E]">Raised: ₹{featuredCampaign.raisedAmount.toLocaleString()}</span>
                            <span className="text-[#667085]">Goal: ₹{featuredCampaign.goalAmount.toLocaleString()}</span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#1E63FF] to-[#0047AB] rounded-full relative"
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#22C55E]" />
                            </motion.div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-[#667085] font-bold">
                            <span>{percent}% Completed</span>
                            <span className="flex items-center gap-3">
                              <span>👥 {donorsCount} Donors</span>
                              <span>📅 {daysLeft} Days Left</span>
                            </span>
                          </div>
                        </>
                      );
                    })()}

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Link
                        href={`/campaigns/${featuredCampaign.id}`}
                        className="h-11 border border-[#E5EAF2] hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-colors"
                      >
                        Learn More
                      </Link>
                      <Link
                        href={{ pathname: '/donate', query: { campaignId: featuredCampaign.id } }}
                        className="h-11 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-colors shadow-sm font-poppins"
                      >
                        Donate Now
                      </Link>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ================= 4. CAMPAIGNS GRID ================= */}
        <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {gridCampaigns.map((camp, idx) => {
                const percent = Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100));
                const daysLeft = getDaysLeft(camp.createdAt);
                const donorsCount = getDonorsCount(camp.id, camp.goalAmount);
                return (
                  <motion.div
                    key={camp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[24px] overflow-hidden border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-350"
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
                        <Image
                          src={camp.image}
                          alt={camp.title}
                          fill
                          sizes="(max-w-7xl) 33vw, 100vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[90%]">
                          <span className="px-2 py-0.5 bg-white/95 rounded-lg text-[9px] font-bold text-[#0A2540] shadow-sm border border-slate-100/50 uppercase tracking-wider">
                            {camp.category}
                          </span>
                          <span className="px-2 py-0.5 bg-[#1E63FF]/90 text-white rounded-lg text-[9px] font-bold shadow-sm uppercase tracking-wider flex items-center gap-0.5">
                            ✔ Verified
                          </span>
                          <span className="px-2 py-0.5 bg-blue-600 text-white rounded-lg text-[9px] font-bold shadow-sm uppercase tracking-wider">
                            📍 Currently Serving Rishikesh
                          </span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-5.5 space-y-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs text-[#667085] font-semibold">
                          <MapPin size={11} className="text-[#1E63FF]" />
                          <span>{camp.location}</span>
                        </div>

                        <h3 className="text-[18px] font-black text-[#0A2540] leading-snug group-hover:text-[#1E63FF] transition-colors font-poppins line-clamp-2">
                          <Link href={`/campaigns/${camp.id}`}>{camp.title}</Link>
                        </h3>
                        
                        <p className="text-[#667085] text-xs leading-relaxed line-clamp-3 font-semibold">
                          {camp.summary}
                        </p>
                      </div>
                    </div>

                    {/* Progress & Actions */}
                    <div className="p-5.5 pt-0 space-y-4 mt-auto">
                      <div className="space-y-2.5 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-end text-xs font-bold font-poppins">
                          <span className="text-[#22C55E]">Raised: ₹{camp.raisedAmount.toLocaleString()}</span>
                          <span className="text-slate-400">Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-[#1E63FF] rounded-full relative"
                            style={{ width: `${percent}%` }}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#22C55E]" />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-[#667085] font-bold pt-0.5">
                          <span>{percent}% Completed</span>
                          <span className="flex items-center gap-2">
                            <span>👥 {donorsCount}</span>
                            <span>📅 {daysLeft} Days Left</span>
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <Link
                          href={`/campaigns/${camp.id}`}
                          className="h-9.5 border border-[#E5EAF2] hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-[18px] text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors"
                        >
                          Learn More
                        </Link>
                        <Link
                          href={{ pathname: '/donate', query: { campaignId: camp.id } }}
                          className="h-9.5 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors shadow-sm font-poppins"
                        >
                          Donate
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {sorted.length > visibleCount && (
            <div className="text-center pt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-3 border border-[#E5EAF2] hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-[18px] text-[11px] uppercase tracking-wider transition-colors shadow-sm font-poppins"
              >
                Load More Campaigns
              </button>
            </div>
          )}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white border border-[#E5EAF2] rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                <HelpCircle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[18px] font-black text-[#0A2540] font-poppins">No campaigns found</h3>
                <p className="text-[#667085] text-xs font-semibold px-4">
                  We couldn't find any active campaigns in the "{category}" category matching your search.
                </p>
              </div>
              <button
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="px-5 py-2.5 bg-[#1E63FF] text-white text-[10px] font-bold uppercase tracking-wider rounded-[18px]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* ================= 5. FOOTER GENERAL RELIEF FUND CTA ================= */}
        <section className="relative bg-[#0A2540] text-white py-16 text-center overflow-hidden border-t border-[#0A2540]">
          {/* Subtle grid pattern background illustration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#1E63FF]/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-[28px] font-black font-poppins tracking-tight leading-tight text-white !text-white select-none">
              Support Our General Sponsoring Fund
            </h2>
            <p className="text-slate-300 text-xs sm:text-[13px] font-semibold max-w-md mx-auto select-none">
              Directly finances ground procurement for emergency items, disaster relief, and school supplies across all active Rishikesh slum nodes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto font-poppins">
              <Link
                href="/donate"
                className="w-full sm:w-auto px-6 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-colors shadow-md shadow-blue-500/10"
              >
                Donate Now
              </Link>
              <Link
                href={{ pathname: '/donate', query: { recurring: 'monthly' } }}
                className="w-full sm:w-auto px-6 h-12 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-all"
              >
                Become a Monthly Donor
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
