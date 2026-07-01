'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Heart, ShieldCheck, Check, CreditCard, Smartphone, Award, 
  FileText, Lock, Shield, ChevronDown, CheckCircle2,
  TrendingUp, Users, ChevronRight, HelpCircle
} from 'lucide-react';

const liveTickerDonations = [
  { id: 1, name: 'Aman S.', amount: 500, time: '2m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80' },
  { id: 2, name: 'Riya J.', amount: 1000, time: '8m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
  { id: 3, name: 'Rahul M.', amount: 200, time: '15m ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80' },
  { id: 4, name: 'Neha S.', amount: 1200, time: '30m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
  { id: 5, name: 'Vikram A.', amount: 2500, time: '45m ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' }
];

const coreCampaigns = [
  { id: 'camp-1', label: 'Feed Hungry Children', unitPrice: 100, unitLabel: 'children', desc: 'hot nutritious meals and fresh water bottles' },
  { id: 'camp-2', label: 'School Supplies for Children', unitPrice: 500, unitLabel: 'students', desc: 'textbooks, school uniforms, and stationary kits' },
  { id: 'camp-3', label: 'Family Ration Kit', unitPrice: 2500, unitLabel: 'families', desc: 'monthly grocery packages and raw kitchen staples' },
  { id: 'camp-4', label: 'New Clothes for Children', unitPrice: 800, unitLabel: 'children', desc: 'new protective garments and warm outfits' },
  { id: 'camp-5', label: 'Animal Feed & Care', unitPrice: 150, unitLabel: 'animals', desc: 'nutritious feed, clean shelter water, and medical care' },
  { id: 'camp-6', label: 'Celebrate Your Special Day', unitPrice: 1000, unitLabel: 'celebrations', desc: 'festive distributions and ground meals sharing' },
  { id: 'camp-7', label: 'Emergency Medical Fund', unitPrice: 1, unitLabel: 'contributions', desc: 'critical operations and life-saving diagnosis support', isCustom: true }
];

export default function DonatePage() {
  const { state, addDonation } = useDatabase();
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramCampaign = searchParams.get('campaign') || searchParams.get('campaignId') || '';

  // Form states
  const [amountType, setAmountType] = useState<'One-Time' | 'Monthly' | 'Yearly'>('One-Time');
  const [targetCampaignId, setTargetCampaignId] = useState<string>('camp-1');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(10); // Default set to 10
  const [customQuantity, setCustomQuantity] = useState<string>('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking'>('UPI');

  // Checkout flow states
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Sticky bar states
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [rotateIndex, setRotateIndex] = useState(0);

  // Rotate dynamic urgency labels every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRotateIndex(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll to toggle sticky CTA bar and handle shrink collapse
  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 550) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }

      if (currentScroll > lastScroll && currentScroll > 600) {
        setIsShrunk(false); // scrolling down -> expand info
      } else if (currentScroll < lastScroll && currentScroll > 600) {
        setIsShrunk(true); // scrolling up -> collapse
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (state.currentUser) {
      setName(state.currentUser.name);
      setEmail(state.currentUser.email);
      setPhone(state.currentUser.phone || '');
    }
  }, [state.currentUser]);

  // Listen to campaign parameter to pre-select and lock active form state
  useEffect(() => {
    if (paramCampaign) {
      const found = coreCampaigns.find(
        c => c.id === paramCampaign || c.label.toLowerCase().includes(paramCampaign.toLowerCase())
      );
      if (found) {
        setTargetCampaignId(found.id);
        setIsLocked(true);
      }
    }
  }, [paramCampaign]);

  const handleMultiplierClick = (num: number) => {
    setQuantity(num);
    setCustomQuantity('');
  };

  const handleCustomQuantityChange = (val: string) => {
    setCustomQuantity(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(parsed);
    } else {
      setQuantity(1);
    }
  };

  const getFinalAmount = () => {
    const opt = coreCampaigns.find(o => o.id === targetCampaignId);
    if (!opt) return 0;
    return opt.unitPrice * quantity;
  };

  const getImpactText = () => {
    const opt = coreCampaigns.find(o => o.id === targetCampaignId);
    if (!opt) return '';
    if (opt.isCustom) {
      return `Emergency Medical Support`;
    }
    return `Sponsor ${quantity} ${opt.unitLabel}`;
  };

  const getMathString = () => {
    const selectedCamp = coreCampaigns.find(c => c.id === targetCampaignId) || coreCampaigns[0];
    const totalAmount = getFinalAmount();
    if (selectedCamp.isCustom) {
      return `You are contributing to the Emergency Medical Fund. Total: INR ${totalAmount.toLocaleString()}`;
    }
    return `You are sponsoring ${selectedCamp.desc} for ${quantity} ${selectedCamp.unitLabel}. Total: INR ${totalAmount.toLocaleString()}`;
  };

  const handleSimulateRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = getFinalAmount();
    if (finalAmount <= 0) return alert('Please specify a donation amount.');
    if (!name || !email) return alert('Please provide your name and email.');

    setPaymentStatus('processing');
    setShowRazorpay(true);
    
    setTimeout(() => {
      setPaymentStatus('success');
      
      const donationRecord = addDonation({
        donorName: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
        email: email || 'donor@onehope.in',
        phone: phone || '',
        amount: finalAmount,
        isAnonymous,
        campaignId: targetCampaignId || undefined,
        paymentMethod: paymentMethod,
        isMonthly: amountType !== 'One-Time'
      });

      setTimeout(() => {
        setShowRazorpay(false);
        router.push(`/donate/success?id=${donationRecord.id}`);
      }, 1000);
      
    }, 2000);
  };

  return (
    <PublicLayout>
      <div className="bg-[#F8FBFF] min-h-screen font-inter select-none overflow-hidden pb-12">
        
        {/* ================= 1. PREMIUM SPLIT-GRID HERO BANNER ================= */}
        <section className="relative bg-[#0A2540] text-white pt-24 pb-16 md:pt-28 md:pb-20 border-b border-[#0D3052] px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-[#1E63FF]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Premium Title & Navigation */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                100% Traceable Ground Sponsoring
              </span>
              
              <h1 className="text-3xl sm:text-5xl font-black font-poppins tracking-tight leading-[1.1]">
                <span className="text-white block font-black">Your Kindness Can</span>
                <span className="bg-gradient-to-r from-[#1E63FF] via-[#00A86B] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                  Save a Life Today.
                </span>
              </h1>
              
              <p className="text-slate-350 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Every purchase is logged on a public ledger with photos, invoices, and GPS tags. Sponsor food, study materials, or medical aid directly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    const formElem = document.getElementById('donation-core-widget');
                    if (formElem) formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full sm:w-auto px-8 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center transition-all hover:scale-102 active:scale-98 shadow-sm font-poppins"
                >
                  Start Sponsoring
                </button>
                <button
                  onClick={() => {
                    const metricsElem = document.getElementById('trust-verification-assets');
                    if (metricsElem) metricsElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 h-12 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center transition-all hover:scale-102 active:scale-98 font-poppins"
                >
                  See Live Verification Loop
                </button>
              </div>
            </div>

            {/* Right Column: Premium Video Container */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(30,99,255,0.25)] border border-white/10 bg-slate-900 group">
                <iframe
                  className="w-full h-full object-cover pointer-events-none group-hover:pointer-events-auto"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=0"
                  title="OneHope Ground Sponsoring Verification"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </section>

        {/* ================= LIVE TICKER RIBBON ================= */}
        <section className="bg-slate-50 border-b border-slate-150 py-3 font-inter select-none overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee gap-8">
            {liveTickerDonations.map((d, index) => (
              <div key={index} className="inline-flex items-center gap-2 text-xs text-slate-650 font-semibold shrink-0">
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                  <Image src={d.avatar} alt={d.name} fill className="object-cover" />
                </div>
                <span>{d.name} donated <strong className="text-[#1E63FF]">INR {d.amount}</strong></span>
                <span className="text-[10px] text-slate-400 font-bold">• {d.time}</span>
              </div>
            ))}
            {liveTickerDonations.map((d, index) => (
              <div key={`dup-${index}`} className="inline-flex items-center gap-2 text-xs text-slate-650 font-semibold shrink-0">
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                  <Image src={d.avatar} alt={d.name} fill className="object-cover" />
                </div>
                <span>{d.name} donated <strong className="text-[#1E63FF]">INR {d.amount}</strong></span>
                <span className="text-[10px] text-slate-400 font-bold">• {d.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 2. THE ULTIMATE DYNAMIC DONATION WIDGET ================= */}
        <main className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="donation-core-widget">
          
          {/* LEFT COLUMN: THE INTERACTIVE WIDGET CARD (7 COLS) */}
          <div className="lg:col-span-8 bg-white border border-[#E5EAF2] rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.05)] overflow-hidden">
            <form onSubmit={handleSimulateRazorpay} className="p-6 md:p-8 space-y-6 text-left">
              
              {/* FREQUENCY SELECTOR */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sponsorship Cycle</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['One-Time', 'Monthly', 'Yearly'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAmountType(type)}
                      className={`h-11 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center border ${
                        amountType === type 
                          ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-[0_2px_10px_rgba(0,71,171,0.15)]' 
                          : 'bg-white text-[#0A2540] border-[#E5EAF2] hover:bg-slate-50'
                      }`}
                    >
                      <span>{type === 'Monthly' ? 'Monthly' : type}</span>
                      {type === 'Monthly' && <span className="text-[7.5px] opacity-90 font-medium uppercase tracking-wider">Recommended</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC CAUSE SELECTION LOGIC */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sponsorship Cause</label>
                {isLocked ? (
                  <div className="w-full h-11 px-4 bg-slate-50 border border-[#E5EAF2] rounded-xl flex items-center justify-between text-xs font-bold text-[#0A2540]">
                    <span>{coreCampaigns.find(c => c.id === targetCampaignId)?.label}</span>
                    <span className="px-2 py-0.5 bg-[#0047AB] text-white rounded text-[8px] uppercase font-black tracking-wider">Pre-Selected Cause</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={targetCampaignId}
                      onChange={(e) => {
                        setTargetCampaignId(e.target.value);
                        setQuantity(10); // Reset quantity to default on swap
                      }}
                      className="w-full h-11 px-4 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#0047AB] text-xs font-semibold text-[#0A2540] appearance-none"
                    >
                      {coreCampaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.label} (Base: INR {c.unitPrice})</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* SLEEK MULTIPLIER QUANTITY GRID */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Quantity</label>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 20, 50, 100].map((num) => {
                    const isActive = quantity === num && !customQuantity;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleMultiplierClick(num)}
                        className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                          isActive 
                            ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-[0_2px_10px_rgba(0,71,171,0.15)]'
                            : 'bg-white text-[#0A2540] border-[#E5EAF2] hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                  
                  {/* Custom Number numerical input box */}
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customQuantity}
                    onChange={(e) => handleCustomQuantityChange(e.target.value)}
                    className="h-11 px-3 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#0047AB] text-xs font-bold text-[#0A2540] text-center placeholder-slate-400"
                  />
                </div>
              </div>

              {/* REAL-TIME MATH STRING TRACKING */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-[#E5EAF2] text-left select-none">
                <p className="text-xs font-bold text-[#0A2540] leading-relaxed">
                  {getMathString()}
                </p>
              </div>

              {/* PARTICULARS (STREAMLINED FLOATING-LABEL FORMS) */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Particulars</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      id="fullName"
                      className="w-full h-12 px-4 pt-4 pb-1 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#0047AB] text-xs font-semibold text-[#0A2540] placeholder-transparent peer"
                    />
                    <label
                      htmlFor="fullName"
                      className="absolute left-4 top-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px]"
                    >
                      Full Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      id="emailAddress"
                      className="w-full h-12 px-4 pt-4 pb-1 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#0047AB] text-xs font-semibold text-[#0A2540] placeholder-transparent peer"
                    />
                    <label
                      htmlFor="emailAddress"
                      className="absolute left-4 top-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px]"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="phoneNumber"
                    className="w-full h-12 px-4 pt-4 pb-1 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#0047AB] text-xs font-semibold text-[#0A2540] placeholder-transparent peer"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-4 top-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px]"
                  >
                    Phone Number
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#0047AB] rounded border-slate-350"
                  />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">Donate Anonymously</span>
                </label>
              </div>

              {/* PAYMENT SEGMENTS */}
              <div className="space-y-3.5 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-[#E5EAF2]">
                  {(['UPI', 'Card', 'Netbanking'] as const).map((method) => {
                    const isActive = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          isActive 
                            ? 'bg-[#0047AB] text-white shadow-[0_2px_10px_rgba(0,71,171,0.2)]'
                            : 'text-slate-650 hover:text-slate-800'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BLOCK (SPRING SCALE HOVER MICRO-INTERACTION) */}
              <button
                type="submit"
                className="w-full h-12 bg-[#0047AB] hover:bg-[#003C91] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md font-poppins"
              >
                <span>Donate INR {getFinalAmount().toLocaleString()} Now</span>
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: CORE METRICS & VERIFIED AUDITS PANEL (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AUDITED DISBURSEMENTS SUMMARY */}
            <div className="bg-[#0A2540] text-white rounded-[24px] p-6 shadow-sm space-y-5 text-left select-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-white/10 pb-2.5">
                Audit Statistics
              </span>
              <div className="space-y-4 font-poppins">
                <div>
                  <span className="block text-2xl font-black text-[#22C55E]">12,500+</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-inter uppercase tracking-wider">Lives Helped</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">INR 28L+</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-inter uppercase tracking-wider">Raised & Mapped</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-[#1E63FF]">98%</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-inter uppercase tracking-wider font-bold">Verified Sponsoring Success</span>
                </div>
              </div>
            </div>

            {/* LIVE VERIFICATION TIMELINE STEPS (CONDENSED) */}
            <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-5 shadow-sm space-y-4 text-left select-none" id="trust-verification-assets">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Verification Steps
              </span>
              <div className="space-y-3.5 text-xs font-semibold text-slate-700 font-inter">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22C55E]" />
                  <span>1. Sponsorship Lodged & Hashed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22C55E]" />
                  <span>2. Registered on Ledger</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22C55E]" />
                  <span>3. Ground Sourcing in Rishikesh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-[#22C55E]" />
                  <span>4. GPS Verification Uploaded</span>
                </div>
              </div>
            </div>

          </div>

        </main>

        {/* ================= COMPACT TRUST ASSETS ROW ================= */}
        <section className="py-8 border-t border-[#E5EAF2] select-none text-slate-600 font-inter" id="trust-verification-assets">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-150">
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider">Verified Sponsoring</span>
                <span className="block text-[10px] text-slate-400">Audited procurement receipts</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider">Public Ledger Log</span>
                <span className="block text-[10px] text-slate-400">All disbursements are traceable</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider">Secure Gateways</span>
                <span className="block text-[10px] text-slate-400">256-bit bank-grade encryption</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider">100% Direct Sourced</span>
                <span className="block text-[10px] text-slate-400">Zero middleman administrative loss</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MINIMAL FOOTER FOR CONVERSION ================= */}
        <footer className="max-w-4xl mx-auto px-4 pt-10 pb-8 border-t border-[#E5EAF2] mt-4 text-center select-none font-inter">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
            © {new Date().getFullYear()} OneHope Sponsoring. All Rights Reserved.
          </p>
        </footer>

        {/* ================= FLOATING STICKY BOTTOM BAR (CONVERSION BOOSTER) ================= */}
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md bg-slate-950/95 text-white backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl z-40 flex items-center justify-between px-5 select-none transition-all duration-300 ${
                isShrunk ? 'h-[50px] py-1.5' : 'h-[62px] py-2.5'
              }`}
            >
              <div className="text-left font-poppins flex flex-col justify-center">
                {!isShrunk && (
                  <span className="text-[8px] sm:text-[9px] text-[#3575FF] uppercase tracking-widest block font-black animate-fade-in">
                    {rotateIndex === 0 && '❤️ 12 sponsorships today'}
                    {rotateIndex === 1 && '🍛 120 meals delivered'}
                    {rotateIndex === 2 && '🛡️ 100% Secure & Audited'}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-white ${isShrunk ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                    {getImpactText()}
                  </span>
                  <span className="text-slate-500 font-bold">•</span>
                  <span className={`font-black text-white ${isShrunk ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                    ₹{getFinalAmount().toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const formElem = document.getElementById('donation-core-widget');
                  if (formElem) formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-extrabold rounded-xl uppercase tracking-wider flex items-center justify-center transition-all hover:translate-y-[-1px] active:translate-y-[1px] shadow-lg shadow-blue-500/20 border-t border-white/10 font-poppins ${
                  isShrunk ? 'px-3 py-1.5 text-[9px]' : 'px-4.5 py-2.5 text-[10px]'
                }`}
              >
                Sponsor Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= RAZORPAY SIMULATION POPUP ================= */}
        <AnimatePresence>
          {showRazorpay && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#092C5C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-inter"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative border border-slate-100"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Razorpay Secure</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1E63FF] rounded text-[8px] font-black uppercase">Sandbox Mode</span>
                </div>

                <div className="w-16 h-16 bg-[#1E63FF]/5 rounded-full flex items-center justify-center mx-auto text-[#1E63FF]">
                  <CreditCard size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0A2540] font-poppins">Processing Transaction</h3>
                  <p className="text-slate-400 text-xs font-semibold px-2">
                    Simulating secure gateway keys. Please do not close or reload this window.
                  </p>
                </div>

                {paymentStatus === 'processing' ? (
                  <div className="space-y-4">
                    <div className="w-8 h-8 border-3 border-[#1E63FF] border-t-transparent rounded-full animate-spin mx-auto" />
                    <span className="text-[10px] text-slate-500 font-semibold block">Authorizing secure node verification...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto text-[#22C55E]">
                      <Check size={20} />
                    </div>
                    <span className="text-xs font-bold text-[#22C55E] block">Sponsorship Lodged Successfully!</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PublicLayout>
  );
}
