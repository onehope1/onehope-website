'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Heart, ShieldCheck, Check, CreditCard, Smartphone, Award, 
  FileText, Lock, Shield, Star, ChevronLeft, ChevronRight, 
  ArrowRight, Clock, Eye, ShoppingCart, Truck, UploadCloud, 
  TrendingUp, Users, CheckCircle2
} from 'lucide-react';

const liveTickerDonations = [
  { id: 1, name: 'Ayesha K.', amount: 2500, time: '8m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80' },
  { id: 2, name: 'Vikram A.', amount: 1500, time: '12m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
  { id: 3, name: 'Rohan M.', amount: 5000, time: '24m ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80' },
  { id: 4, name: 'Neha S.', amount: 1000, time: '35m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
  { id: 5, name: 'Priya D.', amount: 3000, time: '48m ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' }
];

export default function DonatePage() {
  const { state, addDonation } = useDatabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const campaignId = searchParams.get('campaignId') || '';

  // Form states
  const [amountType, setAmountType] = useState<'One-Time' | 'Monthly' | 'Yearly'>('One-Time');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [targetCampaignId, setTargetCampaignId] = useState<string>(campaignId);
  const [quantity, setQuantity] = useState<number>(5);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(0);

  // Set initial default quantity for specific campaigns
  useEffect(() => {
    if (targetCampaignId === 'camp-1') setQuantity(5);
    else if (targetCampaignId === 'camp-2') setQuantity(2);
    else if (targetCampaignId === 'camp-3') setQuantity(1);
    else if (targetCampaignId === 'camp-4') setQuantity(2);
    else if (targetCampaignId === 'camp-5') setQuantity(10);
    else setQuantity(1);
    setSelectedLevelIndex(0);
  }, [targetCampaignId]);

  // Load amount from query params if specified
  useEffect(() => {
    const amtParam = searchParams.get('amount');
    if (amtParam) {
      const parsedAmt = parseInt(amtParam);
      if (!isNaN(parsedAmt) && parsedAmt > 0) {
        setSelectedAmount(0);
        setCustomAmount(parsedAmt.toString());
      }
    }
  }, [searchParams]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking'>('UPI');
  
  // Checkout flow states
  const [step, setStep] = useState<1 | 2>(1);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Live metrics simulation
  const [liveDonationsCount, setLiveDonationsCount] = useState(0);
  const [liveMealsServed, setLiveMealsServed] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setLiveDonationsCount(state.donations.length + 1540);
        setLiveMealsServed(state.cms.counters.mealsServed || 45200);
      }
    }, 500);
    return () => { isMounted = false; };
  }, [state.donations, state.cms.counters.mealsServed]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (state.currentUser) {
      setName(state.currentUser.name);
      setEmail(state.currentUser.email);
      setPhone(state.currentUser.phone || '');
    }
  }, [state.currentUser]);

  // Sponsorship presets mapped strictly to our 7 permanent campaigns
  const presetTiers = [
    { amount: 100, label: 'Feed a Hungry Child', desc: 'Sponsors 1 hot nutritious meal for a child in Rishikesh.', impact: 'Feed 1 Child', campaignId: 'camp-1', tag: '' },
    { amount: 500, label: 'Help a Child Continue Education', desc: 'Provides textbooks, uniforms, and stationary to a child.', impact: 'Sponsor 1 Student', campaignId: 'camp-2', tag: 'Most Popular' },
    { amount: 2500, label: 'Family Ration Kit', desc: 'Delivers a full month of groceries and raw supplies to a migrant family.', impact: 'Sponsor 1 Family', campaignId: 'camp-3', tag: '' },
    { amount: 100, label: 'Care for Stray Animals', desc: 'Provides fresh food, clean water, and basic treatment to stray animals.', impact: 'Care 1 Animal', campaignId: 'camp-5', tag: '' }
  ];

  const trustCards = [
    { title: 'Public Blockchain Ledger', desc: 'Every single rupee is logged on our public digital transparency ledger.', icon: ShieldCheck },
    { title: 'Instant PDF Receipts', desc: 'Download itemized ground transaction confirmation receipts instantly.', icon: FileText },
    { title: 'Direct Ground Sourcing', desc: 'We source grains directly from local farmers, minimizing middleman loss.', icon: Truck },
    { title: 'Zero Admin Padding', desc: 'We sponsor admin fees internally, leaving 100% of your funds for direct impact.', icon: Award }
  ];

  const timelineSteps = [
    { title: 'Sponsorship Lodged', desc: 'Your contribution is processed via bank-grade keys and logged.', icon: Heart, color: 'bg-[#1E63FF]' },
    { title: 'Digital Verification', desc: 'Transaction is verified on the transparency ledger with a unique hash.', icon: Eye, color: 'bg-[#22C55E]' },
    { title: 'Bulk Sourcing Sourced', desc: 'Supplies are purchased directly from verified local suppliers.', icon: ShoppingCart, color: 'bg-[#1E63FF]' },
    { title: 'Ground Field Delivery', desc: 'Volunteer squads distribute items to targets at field points.', icon: Truck, color: 'bg-[#22C55E]' },
    { title: 'Proof Disclosed Online', desc: 'Photos, videos, and distribution audit receipts uploaded live.', icon: UploadCloud, color: 'bg-[#1E63FF]' }
  ];

  const testimonials = [
    { name: 'Dr. Gauri Sharma', role: 'Medical Volunteer', quote: 'Sponsoring operations at OneHope is different because of the direct visual proofs. I can trace exactly where the medicine boxes went.', rating: 5, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
    { name: 'Aakash Mehta', role: 'Monthly Supporter', quote: 'The monthly ledger reports have set a new benchmark for transparency. The confirmation receipt was processed automatically in 2 minutes.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { name: 'Prerna Joshi', role: 'CSR Director', quote: 'Our corporate network has partnered with OneHope for rural tablet setup. Flawless tracking and verified field execution.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleAmountSelect = (tier: typeof presetTiers[0]) => {
    setSelectedAmount(tier.amount);
    setCustomAmount('');
    if (tier.campaignId) {
      setTargetCampaignId(tier.campaignId);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const getCalculatorAmount = () => {
    const camp = state.campaigns.find(c => c.id === targetCampaignId);
    if (!camp) return 0;
    if (camp.pricePerUnit) {
      return camp.pricePerUnit * quantity;
    }
    if (camp.donationLevels) {
      const base = camp.donationLevels[selectedLevelIndex]?.amount || 0;
      return base * quantity;
    }
    return 0;
  };

  const getFinalAmount = () => {
    if (customAmount) {
      const custom = parseInt(customAmount);
      return isNaN(custom) ? 0 : custom;
    }
    if (targetCampaignId) {
      return getCalculatorAmount();
    }
    return selectedAmount;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (getFinalAmount() <= 0) return alert('Please specify a donation amount.');
    if (!name || !email) return alert('Please provide your name and email.');
    setStep(2);
  };

  const handleSimulateRazorpay = () => {
    setShowRazorpay(true);
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('success');
      
      const finalAmount = getFinalAmount();
      const donationRecord = addDonation({
        donorName: name || 'Anonymous',
        email: email || 'donor@onehope.in',
        phone: phone || '',
        amount: finalAmount,
        isAnonymous,
        campaignId: targetCampaignId || undefined,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI' : paymentMethod === 'Card' ? 'Card' : 'Netbanking',
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
      <div className="bg-[#F7FAFF] min-h-screen font-inter overflow-hidden">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative bg-[#092C5C] text-white py-16 md:py-24 lg:py-32 overflow-hidden border-b border-[#092C5C] px-4 md:px-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#1E63FF]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Emotion Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[#22C55E] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>100% Verified Ground Procurement</span>
              </span>
              
              <h1 className="text-3xl sm:text-5xl font-black font-poppins tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent block">
                  Transform Compassion
                </span>
                <span className="bg-gradient-to-r from-[#1E63FF] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                  Into Audited Impact.
                </span>
              </h1>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-semibold max-w-2xl mx-auto lg:mx-0">
                Every single rupee feeds families, sponsors classrooms, or supplies medical packages. Direct, audited, and mapped live on our digital transparency ledger.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    const formElem = document.getElementById('donation-interactive-grid');
                    if (formElem) formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Sponsoring
                </button>
                <button
                  onClick={() => {
                    const blockElem = document.getElementById('transparency-timeline');
                    if (blockElem) blockElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                >
                  See Verification Loop
                </button>
              </div>
            </motion.div>

            {/* Right Column: Hero Image & Floating Impact Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[32px] overflow-hidden border border-white/10 bg-slate-800 shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600"
                  alt="Child nutrition campaign ground photos"
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#092C5C]/50 to-transparent" />
              </div>

              {/* Floating Impact Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 sm:-left-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-slate-100/50 text-[#092C5C] space-y-2 max-w-[240px] select-none text-left"
              >
                <div className="flex gap-2 items-center text-[#22C55E]">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Live Metrics</span>
                </div>
                <div className="text-2xl font-black font-poppins tracking-tight text-[#092C5C]">
                  {liveMealsServed.toLocaleString()}+
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  Nutritional meals distributed to slums and schools this month.
                </p>
              </motion.div>
            </motion.div>

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

        {/* ================= TRUST METRICS ROW ================= */}
        <section className="py-8 bg-white border-b border-slate-100 font-inter px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-x divide-slate-100 text-center">
              <div className="space-y-0.5">
                <span className="block text-2xl sm:text-3xl font-black font-poppins text-[#092C5C] tracking-tight">{liveDonationsCount.toLocaleString()}</span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Donations</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-2xl sm:text-3xl font-black font-poppins text-[#092C5C] tracking-tight">₹12.4M+</span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Audited Disbursements</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-2xl sm:text-3xl font-black font-poppins text-[#092C5C] tracking-tight">100%</span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Transparency</span>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-0">
                <span className="block text-2xl sm:text-3xl font-black font-poppins text-[#092C5C] tracking-tight">₹0</span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Admin Cost Deduct</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN INTERACTIVE AREA: SPLIT-SCREEN LAYOUT ================= */}
        <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-12" id="donation-interactive-grid">
          
          {/* Header Title */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
              Sponsorship Setup
            </span>
            <h2 className="text-3xl font-black text-[#092C5C] font-poppins tracking-tight">
              {targetCampaignId ? 'Configure Your Ground Sponsoring' : 'Select Sponsorship Target'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">
              Select one of our 4 preset tiers, customize using our steppers, or enter a custom details amount below.
            </p>
          </div>

          {/* Tiers Block (Horizontal Grid on desktop, horizontal scroll on mobile) */}
          <div className="relative">
            {!targetCampaignId ? (
              <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {presetTiers.map((tier) => {
                  const isSelected = selectedAmount === tier.amount;
                  const hasTag = tier.tag !== '';
                  return (
                    <motion.div
                      key={tier.label}
                      onClick={() => handleAmountSelect(tier)}
                      whileHover={{ y: -6 }}
                      className={`shrink-0 w-[280px] snap-center lg:w-auto p-6 rounded-[24px] border cursor-pointer h-full flex flex-col justify-between transition-all bg-white relative overflow-hidden group select-none shadow-[0_4px_15px_rgba(0,0,0,0.01)] ${
                        isSelected 
                          ? 'border-[#1E63FF] ring-2 ring-[#1E63FF]/20' 
                          : 'border-slate-200 hover:border-slate-350 hover:shadow-md'
                      }`}
                    >
                      {hasTag && (
                        <div className="absolute top-4 right-4 bg-[#1E63FF] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          {tier.tag}
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="space-y-1 text-left">
                          <span className="text-2xl font-black font-poppins text-[#092C5C] block">₹{tier.amount.toLocaleString()}</span>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block ${
                            isSelected ? 'bg-green-50 text-[#22C55E]' : 'bg-slate-50 text-slate-400'
                          }`}>
                            {tier.impact}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#092C5C] text-sm font-poppins leading-snug text-left">{tier.label}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed text-left">{tier.desc}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-50 mt-5 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{amountType} Gift</span>
                        {isSelected ? <span className="text-[#22C55E] font-bold">✓ Selected</span> : <span className="text-slate-300">Select Tier</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // If a campaign is selected, render its calculator panel horizontally/cohesively
              (() => {
                const selectedCampaign = state.campaigns.find(c => c.id === targetCampaignId);
                if (!selectedCampaign) return null;
                const hasPrice = !!selectedCampaign.pricePerUnit;
                const hasLevels = !!selectedCampaign.donationLevels;
                return (
                  <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E63FF] flex items-center justify-center font-bold text-lg">
                          {selectedCampaign.id === 'camp-1' ? '🍽' : selectedCampaign.id === 'camp-2' ? '📚' : selectedCampaign.id === 'camp-3' ? '🛒' : selectedCampaign.id === 'camp-4' ? '👕' : selectedCampaign.id === 'camp-5' ? '🐶' : selectedCampaign.id === 'camp-6' ? '🎂' : '🚑'}
                        </div>
                        <div>
                          <span className="px-2.5 py-0.5 bg-blue-550/10 text-[#1E63FF] rounded-lg text-[9px] font-extrabold uppercase tracking-wider block w-max mb-0.5">📍 Currently Serving Rishikesh</span>
                          <h4 className="font-bold text-[#092C5C] text-sm sm:text-base font-poppins leading-tight">{selectedCampaign.title}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTargetCampaignId('')}
                        className="text-xs font-bold text-blue-600 hover:underline text-left"
                      >
                        ← Back to Preset Tiers
                      </button>
                    </div>

                    <p className="text-slate-500 text-xs sm:text-sm font-semibold">{selectedCampaign.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Calculator Stepper controls */}
                      {hasPrice && (
                        <div className="space-y-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-poppins">Option 1: Impact Stepper</span>
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs text-slate-500 font-semibold block">Sponsor Cost:</span>
                              <span className="font-extrabold text-sm text-[#092C5C]">₹{selectedCampaign.pricePerUnit} per {selectedCampaign.unitLabel}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-9 h-9 rounded-lg border border-slate-250 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center shadow-sm select-none"
                              >
                                -
                              </button>
                              <span className="font-extrabold text-sm text-[#092C5C] w-6 text-center">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="w-9 h-9 rounded-lg border border-slate-250 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center shadow-sm select-none"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-500">Calculated Sponsorship:</span>
                            <span className="font-black text-[#22C55E] text-sm">₹{(selectedCampaign.pricePerUnit || 0) * quantity}</span>
                          </div>
                        </div>
                      )}

                      {/* Package selections */}
                      {hasLevels && (
                        <div className="space-y-3 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-poppins">Option 1: Sponsorship Packages</span>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedCampaign.donationLevels?.map((lvl, index) => {
                              const isLvlSelected = selectedLevelIndex === index;
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedLevelIndex(index)}
                                  className={`p-2.5 rounded-lg border text-left transition-all ${
                                    isLvlSelected 
                                      ? 'bg-[#1E63FF] border-[#1E63FF] text-white shadow-sm' 
                                      : 'bg-white border-slate-250 text-[#092C5C] hover:bg-slate-50'
                                  }`}
                                >
                                  <span className={`text-[9px] font-black uppercase tracking-wider block ${isLvlSelected ? 'text-white/80' : 'text-[#1E63FF]'}`}>{lvl.label}</span>
                                  <span className="font-extrabold text-xs block mt-0.5">₹{lvl.amount.toLocaleString()}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Ground supplies provided checklist */}
                      {selectedCampaign.provides && (
                        <div className="space-y-2.5 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                          <h5 className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest font-poppins">What Your Donation Provides</h5>
                          <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                            {selectedCampaign.provides.map((prov, index) => (
                              <div key={index} className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-[#22C55E] shrink-0" />
                                <span>{prov}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Checkout Form Split-Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            
            {/* LEFT COLUMN: Selected Summary Box (Sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 text-left">
              <div className="bg-slate-900 text-white rounded-[28px] p-6 shadow-md border border-slate-800 space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Sponsorship Target</span>
                  <h3 className="font-bold text-base font-poppins text-white" style={{ color: '#FFFFFF' }}>
                    {targetCampaignId 
                      ? state.campaigns.find(c => c.id === targetCampaignId)?.title 
                      : 'General Support Fund'
                    }
                  </h3>
                </div>
                
                <div className="space-y-2 border-t border-b border-slate-800 py-4 text-xs font-semibold text-slate-300">
                  <div className="flex justify-between">
                    <span>Donation Mode:</span>
                    <span className="text-white">{amountType} support</span>
                  </div>
                  {targetCampaignId && (
                    <div className="flex justify-between">
                      <span>Calculated Units:</span>
                      <span className="text-white">{quantity} unit{quantity > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 text-xs font-bold uppercase">Estimated Amount:</span>
                  <span className="text-2xl font-black text-[#22C55E]">₹{getFinalAmount().toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-150 flex items-center gap-3.5 text-xs text-slate-500 font-semibold shadow-sm">
                  <Lock size={18} className="text-[#22C55E] shrink-0" />
                  <span>Encrypted secure gateway connection with SSL authentication.</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-150 flex items-center gap-3.5 text-xs text-slate-500 font-semibold shadow-sm">
                  <ShieldCheck size={18} className="text-[#1E63FF] shrink-0" />
                  <span>Public audit ledger reference generated dynamically.</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Donor Details form */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-[30px] p-6 sm:p-8 shadow-sm text-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1 ? 'bg-[#1E63FF] text-white' : 'bg-[#22C55E] text-white'
                  }`}>
                    {step === 1 ? '1' : <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-[#092C5C]">
                    Information
                  </span>
                </div>
                <div className="h-[1px] w-6 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2 ? 'bg-[#1E63FF] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    2
                  </span>
                  <span className={`text-xs font-black uppercase tracking-wider ${step === 2 ? 'text-[#092C5C]' : 'text-slate-400'}`}>
                    Payment
                  </span>
                </div>
              </div>

              {step === 1 && (
                <div className="bg-slate-50 p-1.5 rounded-xl flex gap-1 border border-slate-150 mb-6">
                  {(['One-Time', 'Monthly', 'Yearly'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAmountType(type)}
                      className={`flex-grow text-center py-2 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-all ${
                        amountType === type 
                          ? 'bg-white text-[#1E63FF] shadow-sm border border-slate-100' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleNextStep} className="space-y-5">
                {step === 1 ? (
                  <div className="space-y-5">
                    
                    {/* Custom Amount field */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Custom Amount Override (₹)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="Or enter any custom amount override"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] rounded-xl text-xs text-slate-800 transition-all font-semibold"
                        />
                      </div>
                    </div>

                    {/* Target Campaign selector */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Direct donation to campaign</label>
                      <select
                        value={targetCampaignId}
                        onChange={(e) => setTargetCampaignId(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] rounded-xl text-xs text-slate-800 transition-all font-bold"
                      >
                        <option value="">General Support Fund</option>
                        {state.campaigns.map((camp) => (
                          <option key={camp.id} value={camp.id}>
                            {camp.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Personal Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Full Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] rounded-xl text-xs text-slate-800 transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Email Address</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] rounded-xl text-xs text-slate-800 transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-extrabold text-slate-455 uppercase tracking-widest">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="Mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E63FF] focus:border-[#1E63FF] rounded-xl text-xs text-slate-800 transition-all font-semibold"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 pt-5 sm:pt-7 select-none">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 text-[#1E63FF] focus:ring-[#1E63FF] border-slate-250 rounded cursor-pointer"
                        />
                        <label htmlFor="anonymous" className="text-xs text-slate-500 font-bold cursor-pointer">
                          Keep donation anonymous
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/10 flex items-center justify-center"
                    >
                      Continue to Payment Setup
                    </button>

                  </div>
                ) : (
                  <div className="space-y-5">
                    
                    {/* Summary lists */}
                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3 text-xs text-slate-550 font-semibold">
                      <div className="flex justify-between">
                        <span>Donation Mode:</span>
                        <span className="font-bold text-[#092C5C]">{amountType} support</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/60 pt-3 text-sm">
                        <span className="font-bold text-[#092C5C]">Final Amount:</span>
                        <span className="font-black text-[#22C55E]">₹{getFinalAmount().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Gateway */}
                    <div className="space-y-2.5">
                      <label className="block text-[9px] font-extrabold text-slate-450 uppercase tracking-widest">Select Payment Method</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(['UPI', 'Card', 'Netbanking'] as const).map((method) => {
                          const isSel = paymentMethod === method;
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-[9px] font-bold uppercase tracking-wider ${
                                isSel 
                                  ? 'border-[#1E63FF] bg-blue-50/20 text-[#1E63FF]' 
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                              }`}
                            >
                              {method === 'UPI' ? <Smartphone size={15} /> : method === 'Card' ? <CreditCard size={15} /> : <FileText size={15} />}
                              <span>{method}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 h-12 border border-slate-250 text-[#092C5C] hover:bg-slate-50 font-bold rounded-xl text-xs uppercase tracking-wider"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateRazorpay}
                        className="w-2/3 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/10 flex items-center justify-center"
                      >
                        Simulate Pay (Razorpay)
                      </button>
                    </div>

                    {/* Payment Partners & Security Trust row */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <Lock size={12} className="text-[#22C55E]" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold font-poppins tracking-wider">
                        <span>UPI</span>
                        <span>•</span>
                        <span>VISA</span>
                        <span>•</span>
                        <span>MASTERCARD</span>
                        <span>•</span>
                        <span className="text-blue-600 font-extrabold uppercase">Razorpay</span>
                      </div>
                    </div>

                  </div>
                )}
              </form>
            </div>

          </div>
        </section>

        {/* ================= VERIFICATION BADGES (2x2 Grid or 4-Column Row) ================= */}
        <section className="py-16 md:py-20 bg-white border-t border-b border-slate-100 font-inter px-4 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Complete Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092C5C] font-poppins tracking-tight">
                Our Verification System
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                Building confidence through direct verification loops, audited data releases, and blockchain mappings.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trustCards.map((card, idx) => (
                <div key={idx} className="p-6 bg-[#F7FAFF] rounded-[20px] border border-slate-150 flex flex-col justify-between space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.015)] text-left">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 text-[#1E63FF] shadow-sm">
                    <card.icon size={16} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#092C5C] text-xs sm:text-sm font-poppins leading-tight">{card.title}</h4>
                    <p className="text-slate-550 text-[11px] leading-relaxed font-semibold">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROCESS TIMELINE ================= */}
        <section className="py-16 md:py-20 bg-[#F7FAFF] font-inter overflow-hidden px-4 md:px-12" id="transparency-timeline">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Tracking Loop
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092C5C] font-poppins tracking-tight">
                How Your Donation Reaches the Ground
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                An auto-verifying, cyclical vertical distribution timeline mapping procurement directly to proof.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto pl-8 sm:pl-0">
              <div className="absolute left-[15px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 -translate-x-1/2" />

              <div className="space-y-10 relative">
                {timelineSteps.map((step, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center relative"
                    >
                      <div className={`w-full pr-8 text-right hidden sm:block ${isEven ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {isEven && (
                          <div className="space-y-1">
                            <h4 className="font-bold text-[#092C5C] text-sm font-poppins">{step.title}</h4>
                            <p className="text-slate-500 text-xs leading-normal font-semibold">{step.desc}</p>
                          </div>
                        )}
                      </div>

                      <div className={`absolute left-0 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center shadow-md z-10 shrink-0`}>
                        <step.icon size={13} />
                      </div>

                      <div className={`w-full pl-8 text-left ${!isEven ? 'opacity-100' : 'opacity-100 sm:opacity-0 pointer-events-none'}`}>
                        {(!isEven || true) && (
                          <div className="space-y-1 sm:hidden block">
                            <h4 className="font-bold text-[#092C5C] text-sm font-poppins">{step.title}</h4>
                            <p className="text-slate-500 text-xs leading-normal font-semibold">{step.desc}</p>
                          </div>
                        )}
                        {!isEven && (
                          <div className="space-y-1 hidden sm:block">
                            <h4 className="font-bold text-[#092C5C] text-sm font-poppins">{step.title}</h4>
                            <p className="text-slate-500 text-xs leading-normal font-semibold">{step.desc}</p>
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

        {/* ================= STORY SECTION ================= */}
        <section className="py-16 md:py-20 bg-white font-inter border-t border-b border-slate-100 px-4 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden border border-slate-100 shadow-md bg-slate-50">
                <Image
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
                  alt="Rural student receiving tablets in Rishikesh school"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Field Story
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#092C5C] font-poppins tracking-tight">
                How Priya Gained Access to Digital Schooling
              </h3>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold">
                &ldquo;Before the tablet camps, my studies stopped after sunset because we had no books or electricity at home. Now, I prepare for secondary school entrance exams with checked-in tablets. My scores are verified on the camp record page.&rdquo;
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    const formElem = document.getElementById('donation-interactive-grid');
                    if (formElem) formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Sponsor Pediatric & School kits
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section className="py-16 md:py-20 bg-[#F7FAFF] font-inter overflow-hidden px-4 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Endorsements
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#092C5C] font-poppins tracking-tight">
                Trusted by Supporters
              </h2>
              <p className="text-slate-550 text-xs sm:text-sm font-semibold">
                Hear from active field volunteers and monthly transparent donors globally.
              </p>
            </div>

            <div className="max-w-2xl mx-auto relative px-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-[28px] border border-slate-200/60 shadow-sm space-y-6 text-center"
                >
                  <div className="flex justify-center gap-1 text-[#22C55E]">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" stroke="none" />
                    ))}
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold italic">
                    &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-center gap-3.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-100 shadow-sm shrink-0">
                      <Image 
                        src={testimonials[activeTestimonial].avatar} 
                        alt={testimonials[activeTestimonial].name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-[#092C5C] text-xs block">{testimonials[activeTestimonial].name}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{testimonials[activeTestimonial].role}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#092C5C] hover:bg-slate-50 shadow-sm flex items-center justify-center"
                aria-label="Previous review"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#092C5C] hover:bg-slate-50 shadow-sm flex items-center justify-center"
                aria-label="Next review"
              >
                <ChevronRight size={15} />
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* Razorpay Simulated sandbox overlay */}
      <AnimatePresence>
        {showRazorpay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl z-10 border border-slate-100 text-slate-900 text-center space-y-6"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 border border-blue-100">
                <CreditCard size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Razorpay Secure Sandbox</span>
                <h3 className="text-lg font-bold font-poppins text-slate-900">Processing Encrypted Transfer</h3>
                <p className="text-slate-550 text-xs leading-relaxed max-w-xs mx-auto font-medium">
                  Authorizing transaction of <strong className="text-[#092C5C] font-extrabold">₹{getFinalAmount().toLocaleString()}</strong> via tokenized gateway credentials...
                </p>
              </div>

              <div className="flex justify-center pt-2">
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-green-50 border border-green-100 text-[#22C55E] rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 font-bold">Secure Gateway ref: Razorpay SEC-74639 • Rishikesh Initiative</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
}
