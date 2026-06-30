'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Heart, ShieldCheck, Check, CreditCard, Smartphone, Award, 
  FileText, Lock, Shield, Star, ChevronDown, CheckCircle2,
  TrendingUp, Users, ChevronRight, HelpCircle
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
  const [selectedImpactId, setSelectedImpactId] = useState<string>('opt-3'); // Default Feed 10 Children (₹1000)
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [targetCampaignId, setTargetCampaignId] = useState<string>(campaignId || 'camp-1');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking'>('UPI');

  // Checkout flow states
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Sticky bar state
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (state.currentUser) {
      setName(state.currentUser.name);
      setEmail(state.currentUser.email);
      setPhone(state.currentUser.phone || '');
    }
  }, [state.currentUser]);

  // Handle scroll to toggle sticky CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const impactOptions = [
    { id: 'opt-1', label: 'Feed 1 Child', amount: 100, unit: 'Child', campaignId: 'camp-1' },
    { id: 'opt-2', label: 'Feed 5 Children', amount: 500, unit: 'Children', campaignId: 'camp-1' },
    { id: 'opt-3', label: 'Feed 10 Children', amount: 1000, unit: 'Children', campaignId: 'camp-1' },
    { id: 'opt-4', label: 'Feed 25 Children', amount: 2500, unit: 'Children', campaignId: 'camp-1' },
    { id: 'opt-5', label: 'Sponsor Family Kit', amount: 5000, unit: 'Family', campaignId: 'camp-3' }
  ];

  const suggestedCustomAmounts = [100, 500, 1000, 2500];

  const handleImpactSelect = (optId: string) => {
    setSelectedImpactId(optId);
    setIsCustomMode(false);
    setCustomAmount('');
    const opt = impactOptions.find(o => o.id === optId);
    if (opt) setTargetCampaignId(opt.campaignId);
  };

  const getFinalAmount = () => {
    if (isCustomMode) {
      const custom = parseInt(customAmount);
      return isNaN(custom) ? 0 : custom;
    }
    const opt = impactOptions.find(o => o.id === selectedImpactId);
    if (!opt) return 0;
    return opt.amount * quantity;
  };

  const getImpactText = () => {
    if (isCustomMode) {
      return `Custom Donation of ₹${getFinalAmount().toLocaleString()}`;
    }
    const opt = impactOptions.find(o => o.id === selectedImpactId);
    if (!opt) return '';
    const totalKids = (opt.id === 'opt-5') ? 1 : (parseInt(opt.label.replace(/\D/g, '')) || 1) * quantity;
    return `${opt.id === 'opt-5' ? 'Sponsor' : 'Feed'} ${totalKids} ${opt.unit}`;
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

  // FAQ Accordion states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    { q: 'Where does my money go?', a: 'Your donation directly funds ground procurement of grain packages, education kits, or medical aid near Triveni slum points. We post geo-tagged photos and purchase invoices for every batch.' },
    { q: 'Will I receive proof?', a: 'Yes! An automated confirmation report containing volunteer photos, timestamped logs, and digital receipts will be generated and sent directly to your email.' },
    { q: 'Can I donate anonymously?', a: 'Yes, absolutely. Check the "Donate Anonymously" box in the form to hide your name on our public donation ledger and scrolling tickers.' },
    { q: 'Is payment secure?', a: 'All transactions are processed through 256-bit bank-grade encryption gateways. We do not store any card or UPI credentials on our servers.' }
  ];

  return (
    <PublicLayout>
      <div className="bg-[#F7FAFF] min-h-screen font-inter select-none overflow-hidden pb-12">
        
        {/* ================= HERO SECTION (COMPACT 30% HEIGHT) ================= */}
        <section className="relative bg-[#092C5C] text-white py-10 md:py-14 -mt-[82px] lg:-mt-[100px] border-b border-[#0D3052] px-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#1E63FF]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 pt-28 lg:pt-32 relative z-10">
            <div className="flex justify-center items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <div className="flex text-amber-400">
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
              </div>
              <span className="text-white opacity-85 ml-1">Trusted by supporters</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-poppins tracking-tight leading-tight text-white" style={{ color: '#FFFFFF' }}>
              ₹100 Can Put Food On Someone's Plate Today.
            </h1>

            <p className="text-slate-350 text-xs sm:text-xs leading-relaxed max-w-lg mx-auto font-medium select-none uppercase tracking-widest text-[#22C55E]">
              Every donation is verified with photos, videos and public updates.
            </p>
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

        {/* ================= MAIN COMPACT FLOW CONTAINER ================= */}
        <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 space-y-12">
          
          {/* URGENCY PROGRESS STRIP */}
          <div className="bg-white border border-[#E5EAF2] rounded-[20px] p-5 shadow-sm space-y-3 font-poppins text-left">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 text-[#1E63FF]">
                <TrendingUp size={14} />
                <span>Today's Sponsoring Goal: Feed 300 Children</span>
              </span>
              <span className="text-[#22C55E]">186 Fed • 114 Remaining</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-[#1E63FF] to-[#22C55E] rounded-full" style={{ width: '62%' }} />
            </div>

            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse select-none">
              🚨 Only 27 children still waiting for meals today
            </p>
          </div>

          {/* SPLIT ROW: DONATION FORM & SIDE INFO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INTERACTIVE FORM (8 COLS) */}
            <div className="lg:col-span-8 bg-white border border-[#E5EAF2] rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <form onSubmit={handleSimulateRazorpay} className="p-6 md:p-8 space-y-6 text-left">
                
                {/* 1. FREQUENCY SELECTOR */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['One-Time', 'Monthly', 'Yearly'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAmountType(type)}
                        className={`h-11 rounded-xl text-xs font-bold transition-all flex flex-col justify-center items-center border ${
                          amountType === type 
                            ? 'bg-[#1E63FF] text-white border-[#1E63FF]' 
                            : 'bg-white text-[#0A2540] border-[#E5EAF2] hover:bg-slate-50'
                        }`}
                      >
                        <span>{type === 'Monthly' ? 'Monthly ❤️' : type}</span>
                        {type === 'Monthly' && <span className="text-[7.5px] opacity-90 font-medium">Recommended</span>}
                      </button>
                    ))}
                  </div>
                  {amountType === 'Monthly' && (
                    <p className="text-[10px] text-[#1E63FF] font-bold">
                      💡 Help a child every month.
                    </p>
                  )}
                </div>

                {/* 2. IMPACT CHOICE (PSYCHOLOGICAL PRESETS) */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">I Want To Help</label>
                  <div className="space-y-2.5">
                    {impactOptions.map((opt) => {
                      const isSelected = !isCustomMode && selectedImpactId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleImpactSelect(opt.id)}
                          className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all text-left ${
                            isSelected
                              ? 'bg-blue-50/50 border-[#1E63FF] text-[#1E63FF] shadow-sm'
                              : 'bg-white border-[#E5EAF2] text-[#0A2540] hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1E63FF] bg-[#1E63FF]' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold">{opt.label}</span>
                          </div>
                          <span className="text-xs font-black">₹{opt.amount}</span>
                        </button>
                      );
                    })}

                    {/* Custom Amount option trigger */}
                    <button
                      type="button"
                      onClick={() => { setIsCustomMode(true); setSelectedImpactId(''); }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all text-left ${
                        isCustomMode
                          ? 'bg-blue-50/50 border-[#1E63FF] text-[#1E63FF] shadow-sm'
                          : 'bg-white border-[#E5EAF2] text-[#0A2540] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isCustomMode ? 'border-[#1E63FF] bg-[#1E63FF]' : 'border-slate-300 bg-white'}`}>
                          {isCustomMode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold">Custom Amount</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">Specify sum</span>
                    </button>
                  </div>
                </div>

                {/* 3. MULTIPLIER OR CUSTOM FIELD INPUT */}
                {!isCustomMode ? (
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Multiply Impact Quantity:</span>
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm font-black font-poppins">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#0A2540] font-black text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full h-11 pl-8 pr-4 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none text-xs font-bold text-[#0A2540]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedCustomAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomAmount(amt.toString())}
                          className="px-3 py-1.5 bg-slate-50 border border-[#E5EAF2] rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-100 transition-colors"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DONOR PARTICULARS */}
                <div className="space-y-4 pt-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Your Particulars</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-11 px-4 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none text-xs font-semibold text-[#0A2540]"
                    />
                    <input
                      type="email"
                      placeholder="Your Email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-4 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none text-xs font-semibold text-[#0A2540]"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number (For Updates)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-[#E5EAF2] rounded-xl focus:outline-none text-xs font-semibold text-[#0A2540]"
                  />
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4.5 h-4.5 accent-[#1E63FF] rounded border-slate-350"
                    />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">Donate Anonymously</span>
                  </label>
                </div>

                {/* 5. PAYMENT METHOD LOGOS SELECTOR */}
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Choose Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['UPI', 'Card', 'Netbanking'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`h-12 rounded-xl border flex flex-col justify-center items-center transition-all ${
                          paymentMethod === method
                            ? 'bg-[#1E63FF]/5 border-[#1E63FF] text-[#1E63FF] shadow-sm'
                            : 'bg-white border-[#E5EAF2] text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold font-poppins">{method}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all pt-1 select-none">
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest my-auto mr-1">Accepting:</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">Google Pay</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">•</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">PhonePe</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">•</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">UPI</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">•</span>
                    <span className="text-slate-400 font-extrabold text-[10px]">Cards</span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="w-full h-13 bg-[#22C55E] hover:bg-[#1CA24C] text-white font-extrabold rounded-xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md"
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Donate ₹{getFinalAmount().toLocaleString()} Now</span>
                </button>

              </form>
            </div>

            {/* RIGHT COLUMN: VERIFICATION BADGES & LIVE SOCIAL PROOF (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* TRUST UTILIZATION BLOCK */}
              <div className="bg-[#0A2540] text-white rounded-[24px] p-6 shadow-sm space-y-4 text-left">
                <span className="text-xs font-bold text-slate-350 uppercase tracking-widest block border-b border-white/10 pb-2">
                  Live Metrics
                </span>
                <div className="space-y-4">
                  <div>
                    <span className="block text-2xl font-black text-[#22C55E]">12,000+</span>
                    <span className="text-xs text-slate-400 font-semibold">Nutritional Meals Served</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">₹42L+</span>
                    <span className="text-xs text-slate-400 font-semibold">Procurement Funds Utilized</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-[#1E63FF]">98%</span>
                    <span className="text-xs text-slate-400 font-semibold">Verified Ground Delivery Rate</span>
                  </div>
                </div>
              </div>

              {/* VERIFICATION ICONS (ONE COLUMN LIST) */}
              <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-6 shadow-sm space-y-3.5 text-left font-semibold text-xs text-slate-700">
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <CheckCircle2 size={16} />
                  <span>✔ Rishikesh Ground Work</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <CheckCircle2 size={16} />
                  <span>✔ Public Transparency Ledger</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <CheckCircle2 size={16} />
                  <span>✔ Mapped Procurement Proofs</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <CheckCircle2 size={16} />
                  <span>✔ 100% Direct Relief</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#22C55E]">
                  <CheckCircle2 size={16} />
                  <span>✔ Secure Bank Encryption</span>
                </div>
              </div>

              {/* RECENT SOCIAL PROOF BAR */}
              <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-5 shadow-sm space-y-3.5 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Last Donations
                </span>
                <div className="space-y-3 text-xs font-semibold text-slate-650">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-800">Aman S.</span>
                    <span className="text-slate-500 font-bold">₹500 <span className="text-[10px] text-slate-400 ml-1">2m ago</span></span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-slate-800">Riya J.</span>
                    <span className="text-slate-500 font-bold">₹1000 <span className="text-[10px] text-slate-400 ml-1">8m ago</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800">Rahul M.</span>
                    <span className="text-slate-500 font-bold">₹200 <span className="text-[10px] text-slate-400 ml-1">15m ago</span></span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= EVERY DONATION INCLUDES (TRUST INFO) ================= */}
          <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-6 shadow-sm text-left">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 block">
              Every Donation Includes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-4 text-xs font-bold text-slate-700 text-center">
              <div className="space-y-1">
                <span className="text-xl block">📸</span>
                <span className="text-slate-600 block">Photos</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl block">🎥</span>
                <span className="text-slate-600 block">Videos</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl block">🧾</span>
                <span className="text-slate-600 block">Expense Proof</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl block">📍</span>
                <span className="text-slate-600 block">Location Tag</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl block">📅</span>
                <span className="text-slate-600 block">Date Proof</span>
              </div>
              <div className="space-y-1">
                <span className="text-xl block">👤</span>
                <span className="text-slate-600 block">Volunteer Sign</span>
              </div>
            </div>
          </div>

          {/* ================= ONE SINGLE EMOTIONAL STORY ================= */}
          <div className="bg-white border border-[#E5EAF2] rounded-[24px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 text-left">
            <div className="md:col-span-5 relative h-48 md:h-auto bg-slate-100">
              <Image 
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
                alt="Help Priya continue school"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7 p-6 space-y-3.5">
              <span className="text-[#1E63FF] text-[10px] font-black uppercase tracking-wider">Beneficiary Focus</span>
              <h3 className="text-lg font-bold text-[#0A2540] font-poppins">Help Priya Continue School</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                Priya, 9, lives in a temporary Rishikesh shelter. Your gift sponsors study books, uniform kits, and local tuition support to prevent dropping out.
              </p>
              <a href="/stories" className="text-[#1E63FF] text-xs font-bold inline-flex items-center gap-1 hover:underline">
                <span>Read Full Story</span>
                <ChevronRight size={13} />
              </a>
            </div>
          </div>

          {/* ================= FAQ SECTION (4 SIMPLE QUESTIONS) ================= */}
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-bold text-[#0A2540] font-poppins">Frequently Asked Questions</h3>
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="text-xs font-bold text-[#0A2540]">{faq.q}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs font-medium text-slate-550 border-t border-slate-50 pt-2 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </main>

        {/* ================= MINIMAL FOOTER FOR CONVERSION ================= */}
        <footer className="max-w-4xl mx-auto px-4 pt-16 pb-8 border-t border-slate-200 mt-16 text-center select-none font-inter">
          <div className="flex justify-center gap-6 text-xs font-semibold text-slate-400">
            <a href="/privacy" className="hover:text-[#0A2540] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-[#0A2540] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/contact" className="hover:text-[#0A2540] transition-colors">Contact Support</a>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-4 select-none">
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
              className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 p-3.5 z-40 shadow-xl flex items-center justify-between px-6 sm:px-12 select-none"
            >
              <div className="text-left font-poppins">
                <span className="text-[9.5px] text-slate-450 uppercase tracking-widest block">Sponsorship Active</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1E63FF] text-xs font-black">❤️ {getImpactText()}</span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-[#22C55E] text-xs font-black">₹{getFinalAmount().toLocaleString()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#1CA24C] text-white font-extrabold rounded-lg text-[10px] uppercase tracking-wider transition-colors shadow-sm"
              >
                Donate Now
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
                {/* Razorpay simulation brand tag */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Razorpay Secure</span>
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
