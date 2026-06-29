'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Award, CheckCircle2, Clock, Users, ArrowRight, UserCheck } from 'lucide-react';

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Award: Award,
  Clock: Clock,
  Calendar: Calendar,
  ShieldCheck: ShieldCheck
};

export default function VolunteerPortal() {
  const { state, applyVolunteer } = useDatabase();
  const searchParams = useSearchParams();
  
  const [showApplyForm, setShowApplyForm] = useState(searchParams.get('apply') === 'true');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const [whyJoinCards, setWhyJoinCards] = useState<any[]>([]);
  const [loadingPillars, setLoadingPillars] = useState(true);

  useEffect(() => {
    if (searchParams.get('apply') === 'true') {
      setShowApplyForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadCMSPillars = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setWhyJoinCards([
          { title: 'Authenticated Certificates', desc: 'Gain official certificates signed by trustees upon completing 50+ volunteer hours.', icon: 'Award' },
          { title: 'Leaderboards & Points', desc: 'Earn points for check-ins, tasks completion, and stand out on our leaderboards.', icon: 'Clock' },
          { title: 'Direct Field Operations', desc: 'Actively pack boxes, handle mountain digital setups, and participate on target dates.', icon: 'Calendar' },
          { title: 'Complete Verification', desc: 'Safe verified workspaces. Identity documents checks shield the integrity of our trust.', icon: 'ShieldCheck' }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPillars(false);
      }
    };
    loadCMSPillars();
  }, []);

  const skillOptions = [
    'Teaching & Tutoring',
    'Food Preparation & Packing',
    'Logistics & Carrying',
    'Medical Screening Helper',
    'Content Writing & SEO',
    'Graphic Design & Media'
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
    if (!state.currentUser) return alert('Kindly log in using the header portal first.');
    if (skills.length === 0) return alert('Please select at least one skill.');

    applyVolunteer(skills, experience);
    setApplied(true);
  };

  const leaderboard = [...state.users]
    .filter(u => u.volunteerStatus === 'Approved')
    .sort((a, b) => b.volunteerPoints - a.volunteerPoints);

  const bentoSpans = ['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-2'];

  return (
    <PublicLayout>
      <div className="bg-[#091E3A] min-h-screen text-slate-100 font-inter">
        
        {/* Hero Header Banner */}
        <section className="bg-slate-900 py-20 md:py-32 relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10"
          >
            <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-[#60A5FA] text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm shadow-md" style={{ backgroundColor: 'rgba(0, 71, 171, 0.2)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
              <UserCheck size={12} />
              <span>VOLUNTEER NETWORK</span>
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black font-poppins tracking-tight leading-tight text-white" style={{ color: '#FFFFFF' }}>
              OneHope Volunteer Network
            </h1>
            
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-semibold" style={{ color: '#E2E8F0' }}>
              Support local schools, central kitchens, and medical checkups. Log hours, complete targets, and earn authenticated certificates.
            </p>
          </motion.div>
        </section>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {applied ? (
            <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-[#2ECC71] rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-lg font-poppins" style={{ color: '#FFFFFF' }}>Application Submitted!</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold" style={{ color: '#E2E8F0' }}>
                  Your volunteer application is registered under status <strong className="text-blue-400">Pending</strong>.
                </p>
              </div>
              
              <div className="p-5 bg-slate-950 rounded-2xl text-left border border-slate-800 space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">Founder Demo Walkthrough:</span>
                <p className="text-slate-400 font-semibold" style={{ color: '#94A3B8' }}>
                  To simulate volunteer approval without waiting:
                </p>
                <ol className="list-decimal pl-4 text-slate-300 space-y-1.5 font-medium">
                  <li>Click <strong className="text-white">Portal Login</strong> in top header menu.</li>
                  <li>Select <strong className="text-white">Super Admin</strong> to log in as founder.</li>
                  <li>Go to the <strong className="text-white">Admin Dashboard</strong>.</li>
                  <li>Approve your application under the <strong className="text-white">Volunteers</strong> tab!</li>
                  <li>Switch back to test your volunteer dashboard.</li>
                </ol>
              </div>
            </div>
          ) : showApplyForm ? (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 text-left">
              <h3 className="font-bold text-white text-lg font-poppins pb-3 border-b border-slate-800" style={{ color: '#F8FAFC' }}>
                Apply As Field Volunteer
              </h3>

              {state.currentUser ? (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex justify-between font-semibold">
                    <span>Name: <strong className="text-white" style={{ color: '#FFFFFF' }}>{state.currentUser.name}</strong></span>
                    <span>Email: <strong className="text-white" style={{ color: '#FFFFFF' }}>{state.currentUser.email}</strong></span>
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
                            className={`p-3.5 text-left border rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                              selected
                                ? 'border-[#1E63FF] bg-blue-900/20 text-white shadow-sm'
                                : 'border-slate-850 text-slate-350 hover:bg-slate-950'
                            }`}
                          >
                            <span>{option}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selected ? 'border-[#1E63FF] bg-[#1E63FF] text-white' : 'border-slate-700'
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
                      placeholder="Tell us about any past social service, tutoring, or distribution campaigns..."
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm focus:border-[#1E63FF] focus:ring-1 focus:ring-[#1E63FF] focus:outline-none text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identity Verification Document</label>
                    <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
                      {docUploaded ? (
                        <div className="text-[#2ECC71] font-semibold space-y-1">
                          <p>✓ Aadhaar_Verification_Mock.pdf uploaded</p>
                          <button type="button" onClick={() => setDocUploaded(false)} className="text-[10px] underline text-slate-400">Remove</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDocUploaded(true)}
                          className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl font-bold uppercase tracking-wider text-[10px]"
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
                      className="w-full h-12 border border-slate-800 hover:border-slate-650 text-slate-300 rounded-[18px] text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white rounded-[18px] text-xs font-bold shadow-md shadow-blue-500/10 uppercase tracking-wider"
                    >
                      Submit Application
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-10 text-center space-y-4">
                  <p className="text-slate-350 text-xs sm:text-sm font-semibold">Kindly log in using the header **Login Portal** switcher first to verify your identity.</p>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-6 py-3 border border-slate-800 hover:bg-slate-950 rounded-xl text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
              
              {/* Left Column: Bento pillars */}
              <div className="lg:col-span-7 space-y-8">
                <h2 className="text-3xl font-black font-poppins text-white" style={{ color: '#FFFFFF' }}>Why Join OneHope?</h2>
                
                {loadingPillars ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-40 bg-slate-900 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {whyJoinCards.map((item, idx) => {
                      const span = bentoSpans[idx];
                      const IconComp = IconMap[item.icon] || ShieldCheck;
                      return (
                        <div
                          key={idx}
                          className={`bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-md ${span}`}
                        >
                          <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 text-[#1E63FF] border border-slate-800 flex items-center justify-center shrink-0">
                              <IconComp size={18} />
                            </div>
                            <h4 className="font-bold text-white text-sm sm:text-base font-poppins" style={{ color: '#F8FAFC' }}>{item.title}</h4>
                            <p className="text-slate-400 text-xs leading-relaxed font-semibold" style={{ color: '#94A3B8' }}>{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="px-8 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white rounded-[18px] font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                  >
                    <span>Apply Online Now</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Right Column: Leaderboard */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-lg space-y-6">
                <div>
                  <h3 className="font-bold text-white text-lg font-poppins" style={{ color: '#FFFFFF' }}>Volunteer Leaderboard</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1" style={{ color: '#94A3B8' }}>Ranked based on checked-in field hours and verified task completions.</p>
                </div>
                
                <div className="space-y-3.5 pt-2">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-500 w-6 text-sm" style={{ color: '#94A3B8' }}>{index + 1}</span>
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-850 border border-slate-800 shadow-sm shrink-0">
                          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block" style={{ color: '#FFFFFF' }}>{user.name}</span>
                          <span className="text-[10px] text-slate-500 font-semibold" style={{ color: '#94A3B8' }}>{user.volunteerHours} hours logged</span>
                        </div>
                      </div>
                      <span className="font-black text-[#1E63FF] text-sm shrink-0">{user.volunteerPoints} pts</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
}
