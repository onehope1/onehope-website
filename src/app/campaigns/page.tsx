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
const liveTickerDonations = [
  { id: 1, name: 'Ayesha K.', amount: 2500, time: '8m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80' },
  { id: 2, name: 'Vikram A.', amount: 1500, time: '12m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
  { id: 3, name: 'Rohan M.', amount: 5000, time: '24m ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80' },
  { id: 4, name: 'Neha S.', amount: 1000, time: '35m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
  { id: 5, name: 'Priya D.', amount: 3000, time: '48m ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' }
];

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

  // Helper to map category to emoji badge styling
  const getCategoryBadge = (cat: string) => {
    if (cat === 'Food') return { emoji: '🍛', text: 'Food', bg: 'bg-orange-50 text-orange-600 border-orange-100' };
    if (cat === 'Education') return { emoji: '📚', text: 'Education', bg: 'bg-blue-50 text-blue-600 border-blue-100' };
    if (cat === 'Medical') return { emoji: '🩺', text: 'Medical', bg: 'bg-red-50 text-red-600 border-red-100' };
    if (cat === 'Animals') return { emoji: '🐶', text: 'Animal', bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (cat === 'Emergency') return { emoji: '🚨', text: 'Emergency', bg: 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse border-2' };
    return { emoji: '🌱', text: cat, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

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

  // Featured Campaign & Grid Campaigns
  const featuredCampaign = sorted[0];
  const gridCampaigns = sorted.slice(1, visibleCount);

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
        
        {/* ================= 1. COMPACT HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white py-10 md:py-14 -mt-[82px] lg:-mt-[100px] border-b border-[#0D3052] min-h-[50vh]">
          {/* Grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#1E63FF]/10 rounded-full blur-[110px] pointer-events-none" />

          {/* Meteors Effect (Like About Page) */}
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

          <div className="max-w-4xl mx-auto px-6 text-center space-y-5 pt-28 lg:pt-32 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#1E63FF] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-[#1E63FF]" />
              <span>100% Traceable Sponsoring</span>
            </span>

            <h1 className="text-3xl md:text-5xl font-black font-poppins tracking-tight leading-tight">
              <span className="text-white block">One Small Gift.</span>
              <span className="bg-gradient-to-r from-[#1E63FF] via-[#00A86B] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                One Big Impact.
              </span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
              Support verified campaigns for children, elderly people, animals and families in need across Rishikesh.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-2">
              <motion.a 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                href="#campaigns-grid"
                className="w-full max-w-[90%] sm:max-w-none sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-lg shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center"
              >
                Explore Campaigns
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                href="/stories"
                className="w-full max-w-[90%] sm:max-w-none sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
              >
                Watch Impact
              </motion.a>
            </div>
          </div>
        </section>

        {/* ================= LIVE DONATIONS TICKER BAR ================= */}
        <section className="bg-slate-50 border-b border-slate-150 py-3 font-inter select-none overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee gap-8">
            {liveTickerDonations.map((d, index) => (
              <div key={index} className="inline-flex items-center gap-2 text-xs text-slate-650 font-semibold shrink-0">
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                  <Image src={d.avatar} alt={d.name} fill className="object-cover" />
                </div>
                <span>{d.name} donated <strong className="text-[#1E63FF]">₹{d.amount}</strong></span>
                <span className="text-[10px] text-slate-400 font-bold">• {d.time}</span>
              </div>
            ))}
            {/* Repeat list for seamless infinite loop */}
            {liveTickerDonations.map((d, index) => (
              <div key={`dup-${index}`} className="inline-flex items-center gap-2 text-xs text-slate-650 font-semibold shrink-0">
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                  <Image src={d.avatar} alt={d.name} fill className="object-cover" />
                </div>
                <span>{d.name} donated <strong className="text-[#1E63FF]">₹{d.amount}</strong></span>
                <span className="text-[10px] text-slate-400 font-bold">• {d.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 2. LIVE IMPACT METRICS STRIP ================= */}
        <div className="bg-white border-b border-[#E5EAF2] py-4.5 select-none font-poppins">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-2.5 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5"><span className="text-[#1E63FF] text-sm font-black">12.5K+</span> <span className="text-slate-500 text-[10px] uppercase tracking-wider font-inter font-bold">Lives Helped</span></div>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5"><span className="text-[#1E63FF] text-sm font-black">₹28L+</span> <span className="text-slate-500 text-[10px] uppercase tracking-wider font-inter font-bold">Raised</span></div>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5"><span className="text-[#1E63FF] text-sm font-black">125+</span> <span className="text-slate-500 text-[10px] uppercase tracking-wider font-inter font-bold">Campaigns</span></div>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5"><span className="text-[#22C55E] text-sm font-black">98%</span> <span className="text-slate-500 text-[10px] uppercase tracking-wider font-inter font-bold">Delivered</span></div>
          </div>
        </div>

        {/* ================= 3. STICKY FILTER & SEARCH TOOLBAR ================= */}
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

        {/* ================= 4. FEATURED CAMPAIGN HIGHLIGHT ================= */}
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
                <div className="lg:col-span-6 relative h-[260px] sm:h-[340px] lg:h-auto overflow-hidden bg-slate-50">
                  <Image
                    src={featuredCampaign.image}
                    alt={featuredCampaign.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-700 brightness-[0.96]"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-white/95 rounded-xl text-[9px] font-bold text-[#0A2540] shadow-sm border border-slate-100/50 uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-xl text-[9px] font-bold shadow-sm uppercase tracking-wider">
                      📍 Rishikesh Ground Work
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

                    <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] font-poppins leading-tight group-hover:text-[#1E63FF] transition-colors text-left">
                      <Link href={`/campaigns/${featuredCampaign.id}`}>{featuredCampaign.title}</Link>
                    </h2>

                    <p className="text-[#667085] text-xs sm:text-sm leading-relaxed font-semibold text-left line-clamp-2">
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
                            <span className="text-[#22C55E]">{percent}% Funded</span>
                            <span className="text-slate-450">Goal: ₹{featuredCampaign.goalAmount.toLocaleString()}</span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#1E63FF] to-[#22C55E] rounded-full relative"
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-[#667085] font-bold">
                            <span className="text-[#2ECC71]">₹{featuredCampaign.raisedAmount.toLocaleString()} raised of ₹{featuredCampaign.goalAmount.toLocaleString()}</span>
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
                        className="h-11 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-all hover:scale-102 active:scale-98 shadow-sm font-poppins"
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

        {/* ================= 5. CAMPAIGNS GRID ================= */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="campaigns-grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
                      <div className="relative w-full h-[210px] overflow-hidden bg-slate-50 rounded-t-[24px]">
                        <Image
                          src={camp.image}
                          alt={camp.title}
                          fill
                          sizes="(max-w-7xl) 33vw, 100vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-500 brightness-[0.96]"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[90%]">
                          {(() => {
                            const badge = getCategoryBadge(camp.category);
                            return (
                              <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold shadow-sm border uppercase tracking-wider flex items-center gap-1.5 ${badge.bg}`}>
                                <span>{badge.emoji}</span>
                                <span>{badge.text}</span>
                              </span>
                            );
                          })()}
                          <span className="px-2 py-0.5 bg-[#1E63FF] text-white rounded-lg text-[9px] font-bold shadow-sm uppercase tracking-wider flex items-center gap-0.5">
                            ✔ Verified
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
                        
                        <p className="text-[#667085] text-xs leading-relaxed line-clamp-2 font-semibold">
                          {camp.summary}
                        </p>
                      </div>
                    </div>

                    {/* Progress & Actions */}
                    <div className="p-5.5 pt-0 space-y-4 mt-auto">
                      <div className="space-y-2.5 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-end text-xs font-bold font-poppins">
                          <span className="text-[#22C55E]">{percent}% Funded</span>
                          <span className="text-slate-450">Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-[#1E63FF] to-[#22C55E] rounded-full relative"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-[#667085] font-bold pt-0.5">
                          <span className="text-[#2ECC71]">₹{camp.raisedAmount.toLocaleString()} raised of ₹{camp.goalAmount.toLocaleString()}</span>
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
                          className="h-9.5 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[10px] uppercase tracking-wider flex items-center justify-center transition-all hover:scale-102 active:scale-98 shadow-sm font-poppins"
                        >
                          Donate Now
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

        {/* ================= 6. GENERAL DONATION CTA ================= */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-emerald-50/50 text-[#0A2540] text-center relative overflow-hidden font-inter border-t border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
            <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
              General Fund
            </span>
            <h2 className="text-2xl sm:text-[28px] font-black font-poppins tracking-tight leading-tight text-[#0A2540] select-none">
              Can't Decide Where To Help?
            </h2>
            <p className="text-slate-500 text-xs sm:text-[13px] font-semibold max-w-md mx-auto leading-relaxed select-none">
              Your donation will automatically support the most urgent verified campaign.
            </p>
            
            <div className="flex justify-center pt-2">
              <Link
                href="/donate"
                className="px-8 h-12 bg-[#0047AB] hover:bg-[#003C91] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center transition-colors shadow-md shadow-blue-500/10 font-semibold"
              >
                Donate Where Needed Most
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
