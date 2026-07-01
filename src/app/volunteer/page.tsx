'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Calendar, Award, CheckCircle2, Clock, 
  Users, ArrowRight, UserCheck, Play, ArrowUpRight, Check,
  Sparkles, Award as MedalIcon
} from 'lucide-react';

export default function VolunteerPortal() {
  const { state, applyVolunteer } = useDatabase();
  const searchParams = useSearchParams();
  
  const [showApplyForm, setShowApplyForm] = useState(searchParams.get('apply') === 'true');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (searchParams.get('apply') === 'true') {
      setShowApplyForm(true);
    }
  }, [searchParams]);

  const skillOptions = [
    'Teaching & Tutoring',
    'Food Preparation & Packing',
    'Logistics & Carrying',
    'Medical Screening Helper',
    'Content Writing & Media',
    'Animal Feed & Welfare'
  ];

  const handleSkillToggle = (s: string) => {
    if (skills.includes(s)) {
      setSkills(skills.filter(i => i !== s));
    } else {
      setSkills([...skills, s]);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.currentUser) return alert('Kindly log in using the Portal Login first.');
    if (skills.length === 0) return alert('Please select at least one skill.');

    applyVolunteer(skills, experience);
    setApplied(true);
  };

  const leaderboard = [...state.users]
    .filter(u => u.volunteerStatus === 'Approved')
    .sort((a, b) => b.volunteerPoints - a.volunteerPoints);

  const top3 = leaderboard.slice(0, 3);
  const restLeaderboard = leaderboard.slice(3);

  // Medal indicator style helper
  const getMedalStyle = (rank: number) => {
    if (rank === 0) return { emoji: '🥇', label: 'Gold', border: 'border-amber-400 bg-amber-50/50 text-amber-700' };
    if (rank === 1) return { emoji: '🥈', label: 'Silver', border: 'border-slate-400 bg-slate-50/50 text-slate-700' };
    return { emoji: '🥉', label: 'Bronze', border: 'border-amber-600 bg-amber-50/20 text-amber-900' };
  };

  return (
    <PublicLayout>
      <div className="bg-white font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        
        {/* ================= 1. CINEMATIC HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white pt-24 pb-20 md:pt-28 md:pb-28 min-h-[75vh]">
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
              <span className="text-white block">Become Someone's</span>
              <span className="bg-gradient-to-r from-[#1E63FF] via-[#00A86B] to-[#22C55E] bg-clip-text text-transparent block mt-1">
                Hope Today.
              </span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm tracking-widest font-black uppercase font-poppins max-w-xl mx-auto leading-relaxed">
              Join verified ground missions in Rishikesh and create real impact with OneHope.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowApplyForm(true)}
                className="w-full max-w-[90%] sm:max-w-none sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-lg shadow-blue-500/10 btn-ripple font-poppins h-12 flex items-center justify-center"
              >
                Apply Now
              </motion.button>
              
              <motion.a 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                href="/stories"
                className="w-full max-w-[90%] sm:max-w-none sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all font-semibold h-12 flex items-center justify-center"
              >
                Watch Stories
              </motion.a>
            </div>

            {/* Bottom trust badges - Verification only, no NGO/Trust mentions */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-6 text-[10px] font-bold text-slate-350 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Verified Missions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-[#2ECC71]" />
                <span>Certificate Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. WHY JOIN ONEHOPE ================= */}
        <section className="py-24 bg-white font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Grow With Us
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Why Join OneHope
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: 'Verified Certificate', desc: 'Gain official work credentials logged per completed hour.', icon: Award },
                { title: 'Leadership Experience', desc: 'Manage digital ledgers and lead direct distribution routes.', icon: Clock },
                { title: 'Direct Field Work', desc: 'Participate actively inside ground kitchens and slum nodes.', icon: Calendar },
                { title: 'Verified Volunteer Profile', desc: 'Get a public dashboard profile tracking your exact hours.', icon: ShieldCheck }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200/60 p-6 rounded-[22px] flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E63FF] flex items-center justify-center shrink-0">
                      <card.icon size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[#0A2540] text-sm font-poppins leading-snug">{card.title}</h4>
                      <p className="text-[#667085] text-[10px] leading-relaxed font-semibold">{card.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#1E63FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. LEADERBOARD ================= */}
        <section className="py-24 bg-[#F8FBFF] border-t border-b border-[#E5EAF2] font-inter">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Top Contributors
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
                Volunteer Leaderboard
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                Ranked based on verified checked-in field hours and task logs.
              </p>
            </div>

            {/* Top 3 Special Podiums Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {top3.map((user, idx) => {
                const medal = getMedalStyle(idx);
                return (
                  <div 
                    key={user.id}
                    className={`bg-white border rounded-[24px] p-6 text-center relative overflow-hidden shadow-sm flex flex-col justify-between items-center h-[230px] border-t-4 ${medal.border}`}
                  >
                    <div className="absolute top-3 right-3 text-lg font-bold">{medal.emoji}</div>
                    
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      </div>
                      
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-[#0A2540] text-base font-poppins">{user.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">{medal.label} Medalist</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-500 font-bold">{user.volunteerHours} Hours Logged</span>
                      <span className="text-sm font-black text-[#1E63FF]">{user.volunteerPoints} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of the leaderboard list */}
            {restLeaderboard.length > 0 && (
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-100">
                {restLeaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 px-6 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-400 w-5">{index + 4}</span>
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm shrink-0">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-[#0A2540] text-sm block">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{user.volunteerHours} hours logged</span>
                      </div>
                    </div>
                    <span className="font-black text-[#1E63FF] text-sm">{user.volunteerPoints} pts</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center pt-2">
              <Link 
                href="/dashboard"
                className="px-6 py-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[#0A2540] font-bold rounded-xl text-xs uppercase tracking-wider transition-all inline-block font-semibold"
              >
                View Full Leaderboard
              </Link>
            </div>

          </div>
        </section>

        {/* ================= 4. CTA SECTION ================= */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-emerald-50/50 text-[#0A2540] text-center relative overflow-hidden font-inter border-t border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
            <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
              Start Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-poppins leading-tight">
              Every Helping Hand Creates Hope.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
              Join our growing volunteer community and start making a real difference today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/donate"
                  className="w-full px-8 py-3.5 bg-[#0047AB] hover:bg-[#003C91] text-white font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-lg transition-all h-12 flex items-center justify-center font-semibold"
                >
                  Donate Now
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowApplyForm(true)}
                className="w-full sm:w-auto px-8 py-3.5 border border-[#0A2540]/20 hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-xl text-xs uppercase tracking-wider block text-center transition-all h-12 flex items-center justify-center font-semibold"
              >
                Become Volunteer
              </motion.button>
            </div>
          </div>
        </section>

        {/* ================= VOLUNTEER REGISTRATION MODAL FORM ================= */}
        <AnimatePresence>
          {showApplyForm && (
            <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowApplyForm(false)}
                className="absolute inset-0"
              />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl z-10 border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar text-left space-y-6"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-[#0A2540] text-lg font-poppins">
                    Apply As Field Volunteer
                  </h3>
                  <button 
                    onClick={() => setShowApplyForm(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                {applied ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-md">
                      <Check size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#0A2540] font-poppins">Application Logged!</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                        Your application is logged. Go to the dashboard to monitor verification stages.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setApplied(false);
                        setShowApplyForm(false);
                      }}
                      className="px-6 py-2.5 bg-[#0047AB] hover:bg-[#003C91] text-white rounded-xl text-xs uppercase font-bold tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                ) : state.currentUser ? (
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="bg-[#F8FBFF] p-4 rounded-xl border border-slate-200/60 text-xs text-slate-500 flex justify-between font-semibold">
                      <span>Name: <strong className="text-[#0A2540]">{state.currentUser.name}</strong></span>
                      <span>Email: <strong className="text-[#0A2540]">{state.currentUser.email}</strong></span>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Your Skills</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {skillOptions.map(option => {
                          const selected = skills.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSkillToggle(option)}
                              className={`p-3 text-left border rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                selected
                                  ? 'border-[#1E63FF] bg-blue-50/50 text-[#1E63FF] shadow-sm'
                                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              <span>{option}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selected ? 'border-[#1E63FF] bg-[#1E63FF] text-white' : 'border-slate-350'
                              }`}>
                                {selected && <span className="text-[9px] font-bold">✓</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Relevant Experience (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about any past social service or tutoring work..."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-[#1E63FF] focus:ring-1 focus:ring-[#1E63FF] focus:outline-none text-[#0A2540] font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identity Verification Document</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                        {docUploaded ? (
                          <div className="text-[#2ECC71] font-semibold space-y-1">
                            <p>✓ Aadhaar_Verification_Mock.pdf uploaded</p>
                            <button type="button" onClick={() => setDocUploaded(false)} className="text-[10px] underline text-slate-400">Remove</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDocUploaded(true)}
                            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-wider text-[10px]"
                          >
                            Upload Identity File
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="w-full h-12 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-[18px] text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] text-white rounded-[18px] text-xs font-bold shadow-md shadow-blue-500/10 uppercase tracking-wider"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-8 text-center space-y-4">
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold">Kindly log in using the header **Portal Login** switcher first to verify your identity.</p>
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PublicLayout>
  );
}
