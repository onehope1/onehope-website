'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Settings, Heart, Users, FileText, Globe, Check, X, ShieldAlert, Plus, Edit, Trash, HelpCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { state, updateCMS, updateSettings, approveVolunteerApplication, rejectVolunteerApplication, addCampaign, deleteCampaign, addStory, deleteStory, addBlog, deleteBlog } = useDatabase();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Campaigns' | 'Stories' | 'Blogs' | 'Volunteers' | 'CMS' | 'Settings' | 'Logs'>('Overview');

  // CMS States
  const [heroTitle, setHeroTitle] = useState(state.cms.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(state.cms.hero.subtitle);
  const [heroCtaDonate, setHeroCtaDonate] = useState(state.cms.hero.ctaDonateText);
  const [heroCtaVol, setHeroCtaVol] = useState(state.cms.hero.ctaVolunteerText);
  const [heroBgImage, setHeroBgImage] = useState(state.cms.hero.backgroundImage);

  const [counterMeals, setCounterMeals] = useState(state.cms.counters.mealsServed);
  const [counterEdu, setCounterEdu] = useState(state.cms.counters.childrenEducated);
  const [counterMed, setCounterMed] = useState(state.cms.counters.medicalSupplies);
  const [counterDis, setCounterDis] = useState(state.cms.counters.disasterResponded);

  // Settings States
  const [supportPhone, setSupportPhone] = useState(state.settings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(state.settings.supportEmail);
  const [thanksEmail, setThanksEmail] = useState(state.settings.thanksEmail);
  const [igUrl, setIgUrl] = useState(state.settings.socials.instagram);
  const [ytUrl, setYtUrl] = useState(state.settings.socials.youtube);
  const [fbUrl, setFbUrl] = useState(state.settings.socials.facebook);
  const [seoTitle, setSeoTitle] = useState(state.settings.seo.metaTitle);
  const [seoDesc, setSeoDesc] = useState(state.settings.seo.metaDescription);

  // Manager Forms
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCat, setNewCampCat] = useState<'Food' | 'Education' | 'Medical' | 'Disaster Relief'>('Food');
  const [newCampGoal, setNewCampGoal] = useState('');
  const [newCampSummary, setNewCampSummary] = useState('');

  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [newStoryCat, setNewStoryCat] = useState('Education');

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');

  if (!state.currentUser || !state.currentUser.role.includes('Admin')) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-24 text-center space-y-4 font-inter">
          <ShieldAlert size={40} className="text-red-500 mx-auto animate-pulse-slow" />
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Admin Credentials Required</h2>
          <p className="text-slate-500 text-xs">Kindly use the header **Login Portal** switcher to sign in as **Super Admin** or founder.</p>
        </div>
      </PublicLayout>
    );
  }

  // Handle updates
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('hero', {
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaDonateText: heroCtaDonate,
      ctaVolunteerText: heroCtaVol,
      backgroundImage: heroBgImage
    });
    updateCMS('counters', {
      mealsServed: Number(counterMeals),
      childrenEducated: Number(counterEdu),
      medicalSupplies: Number(counterMed),
      disasterResponded: Number(counterDis)
    });
    alert('Homepage CMS sections updated successfully!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      supportPhone,
      supportEmail,
      thanksEmail,
      socials: {
        instagram: igUrl,
        youtube: ytUrl,
        facebook: fbUrl,
        whatsapp: `https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}`
      },
      seo: {
        metaTitle: seoTitle,
        metaDescription: seoDesc,
        keywords: state.settings.seo.keywords
      }
    });
    alert('Global settings and branding details saved!');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampGoal) return;
    addCampaign({
      title: newCampTitle,
      category: newCampCat as any,
      goalAmount: Number(newCampGoal),
      summary: newCampSummary,
      description: newCampSummary,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
      location: 'Rishikesh, Uttarakhand, India',
      gallery: [],
      videos: [],
      status: 'Active'
    });
    alert('New campaign created!');
    setNewCampTitle('');
    setNewCampGoal('');
    setNewCampSummary('');
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle || !newStoryDesc) return;
    addStory({
      title: newStoryTitle,
      description: newStoryDesc,
      category: newStoryCat,
      author: 'OneHope Admin',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      media: [{ url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', type: 'image' }],
      location: 'Rishikesh, India'
    });
    alert('New reels story added!');
    setNewStoryTitle('');
    setNewStoryDesc('');
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogExcerpt) return;
    addBlog({
      title: newBlogTitle,
      excerpt: newBlogExcerpt,
      content: `<p>${newBlogContent}</p>`,
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
      author: {
        name: 'Vipu Rishikesh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        bio: 'Founder & Organizer.'
      },
      category: 'Welfare',
      tags: ['Welfare Update'],
      readTime: '3 min read'
    });
    alert('Blog article published!');
    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
  };

  return (
    <PublicLayout>
      <div className="bg-[#091E3A] min-h-screen text-slate-100 font-inter py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Console details */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            
            <div className="space-y-2 text-center md:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(0, 71, 171, 0.2)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                <Shield size={12} />
                <span>FOUNDER CONTROL PANEL</span>
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-poppins text-white" style={{ color: '#FFFFFF' }}>
                OneHope Admin Console
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                Visually edit and override homepage sections, review donations ledger, verify field applications, and write articles.
              </p>
            </div>

            <div className="flex gap-3 text-xs font-semibold z-10">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center min-w-[130px]">
                <span className="block text-slate-400 text-[9px] uppercase font-bold tracking-wider" style={{ color: '#94A3B8' }}>TOTAL DONATIONS LEDGER</span>
                <span className="text-base font-extrabold mt-0.5 block text-white" style={{ color: '#FFFFFF' }}>₹{(state.donations.reduce((acc,d)=>acc+d.amount, 0) + 1250000).toLocaleString()}</span>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center min-w-[130px]">
                <span className="block text-slate-400 text-[9px] uppercase font-bold tracking-wider" style={{ color: '#94A3B8' }}>AUDITED VOLUNTEERS</span>
                <span className="text-base font-extrabold mt-0.5 block text-white" style={{ color: '#FFFFFF' }}>{state.users.filter(u=>u.volunteerStatus==='Approved').length} Active</span>
              </div>
            </div>
          </div>

          {/* Console layout grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Admin Tabs Menu (Left Column) */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-1">
              {(['Overview', 'Campaigns', 'Stories', 'Blogs', 'Volunteers', 'CMS', 'Settings', 'Logs'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={isActive ? {
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderLeft: '4px solid #0047AB',
                      borderRadius: '0px 12px 12px 0px'
                    } : {
                      color: '#94A3B8'
                    }}
                    className="w-full text-left px-4 py-3 text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>{tab} Manager</span>
                    <span className="text-[10px] font-bold opacity-50">→</span>
                  </button>
                );
              })}
            </div>

            {/* Admin Managers console panel (Right Column) */}
            <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg min-h-[450px] text-slate-100">
            
            {/* 1. ANALYTICS OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins pb-2 border-b border-slate-50 dark:border-slate-850">
                  Analytics Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Audited Transactions count</span>
                    <p className="text-xl font-bold font-poppins text-slate-900 dark:text-white mt-1">{state.donations.length} successful</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registered users</span>
                    <p className="text-xl font-bold font-poppins text-slate-900 dark:text-white mt-1">{state.users.length} accounts</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active reels stories</span>
                    <p className="text-xl font-bold font-poppins text-slate-900 dark:text-white mt-1">{state.stories.length} vertical items</p>
                  </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-slate-950/30 p-5 border border-blue-100 dark:border-slate-850 rounded-2xl text-xs leading-relaxed text-blue-750 dark:text-blue-300">
                  <strong>Founder Dashboard status:</strong> Switch to different tabs to update homepage sections visually or manage field programs. Your updates are saved locally in the browser's persistent registry.
                </div>
              </div>
            )}

            {/* 2. CAMPAIGN MANAGER */}
            {activeTab === 'Campaigns' && (
              <div className="space-y-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins pb-2 border-b border-slate-50 dark:border-slate-850">
                  Campaign Management
                </h3>

                {/* Add Form */}
                <form onSubmit={handleCreateCampaign} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider flex items-center gap-1"><Plus size={12} /> Create Campaign</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Campaign Title (e.g. Flood Relief Uttarakhand)"
                      value={newCampTitle}
                      onChange={(e) => setNewCampTitle(e.target.value)}
                      className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                      required
                    />
                    
                    <input
                      type="number"
                      placeholder="Funding Goal (₹)"
                      value={newCampGoal}
                      onChange={(e) => setNewCampGoal(e.target.value)}
                      className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={newCampCat}
                      onChange={(e) => setNewCampCat(e.target.value as any)}
                      className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-550"
                    >
                      <option value="Food">Food Category</option>
                      <option value="Education">Education Category</option>
                      <option value="Medical">Medical Category</option>
                      <option value="Disaster Relief">Disaster Relief Category</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Summary Details (Short description)"
                      value={newCampSummary}
                      onChange={(e) => setNewCampSummary(e.target.value)}
                      className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Add Campaign Target
                  </button>
                </form>

                {/* List Campaigns */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Active Campaigns List</h4>
                  {state.campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-poppins">{camp.title}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{camp.category} • Goal: ₹{camp.goalAmount.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => deleteCampaign(camp.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                        title="Delete Campaign"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 3. STORY MANAGER */}
            {activeTab === 'Stories' && (
              <div className="space-y-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins pb-2 border-b border-slate-50 dark:border-slate-850">
                  Instagram Reels Story Manager
                </h3>

                <form onSubmit={handleCreateStory} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider flex items-center gap-1"><Plus size={12} /> Add Reel Story</h4>
                  
                  <input
                    type="text"
                    placeholder="Story Title (e.g. Meet Ravi: Math Champion)"
                    value={newStoryTitle}
                    onChange={(e) => setNewStoryTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    required
                  />

                  <textarea
                    rows={3}
                    placeholder="Reel description details..."
                    value={newStoryDesc}
                    onChange={(e) => setNewStoryDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    required
                  />

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Publish Reel
                  </button>
                </form>

                {/* List Reels */}
                <div className="space-y-3">
                  {state.stories.map((story) => (
                    <div key={story.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-poppins">{story.title}</span>
                        <span className="text-[10px] text-slate-450 mt-0.5">{story.category} • {story.likes} likes</span>
                      </div>
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BLOG MANAGER */}
            {activeTab === 'Blogs' && (
              <div className="space-y-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins pb-2 border-b border-slate-50 dark:border-slate-850">
                  Blog & Update Publisher
                </h3>

                <form onSubmit={handleCreateBlog} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider flex items-center gap-1"><Plus size={12} /> Publish Blog</h4>
                  
                  <input
                    type="text"
                    placeholder="Article Header Title"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Excerpt summary details"
                    value={newBlogExcerpt}
                    onChange={(e) => setNewBlogExcerpt(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    required
                  />

                  <textarea
                    rows={4}
                    placeholder="Rich article contents (HTML supported)..."
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Publish Post
                  </button>
                </form>

                {/* List blogs */}
                <div className="space-y-3">
                  {state.blogs.map((b) => (
                    <div key={b.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block font-poppins">{b.title}</span>
                        <span className="text-[10px] text-slate-450 mt-0.5">{b.category} • {b.date}</span>
                      </div>
                      <button
                        onClick={() => deleteBlog(b.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. VOLUNTEER MANAGER */}
            {activeTab === 'Volunteers' && (
              <div className="space-y-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins pb-2 border-b border-slate-50 dark:border-slate-850">
                  Volunteer Applications Approval
                </h3>

                <div className="space-y-4">
                  {state.volunteerApplications.map((app) => (
                    <div key={app.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block font-poppins">{app.name}</span>
                          <p className="text-slate-400 text-[10px] mt-0.5">Applied: {app.appliedDate} • Email: {app.email} • Ph: {app.phone}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          app.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-650'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-500">
                        <p><strong>Skills:</strong> {app.skills.join(', ')}</p>
                        <p><strong>Experience:</strong> {app.experience}</p>
                      </div>

                      {app.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveVolunteerApplication(app.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                          >
                            <Check size={12} />
                            <span>Approve Application</span>
                          </button>
                          
                          <button
                            onClick={() => rejectVolunteerApplication(app.id)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 rounded-lg font-bold flex items-center gap-1"
                          >
                            <X size={12} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {state.volunteerApplications.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-10">No pending volunteer registrations.</p>
                  )}
                </div>
              </div>
            )}

            {/* 6. CMS HOMEPAGE BUILDER */}
            {activeTab === 'CMS' && (
              <form onSubmit={handleSaveCMS} className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                    Homepage CMS visual editor
                  </h3>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Save CMS Override
                  </button>
                </div>

                {/* Hero section CMS config */}
                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider">Hero Banner Content</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Hero Title Heading</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Hero Subtitle</label>
                      <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">CTA Donate Text</label>
                        <input
                          type="text"
                          value={heroCtaDonate}
                          onChange={(e) => setHeroCtaDonate(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">CTA Volunteer Text</label>
                        <input
                          type="text"
                          value={heroCtaVol}
                          onChange={(e) => setHeroCtaVol(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Background Banner Image URL</label>
                      <input
                        type="text"
                        value={heroBgImage}
                        onChange={(e) => setHeroBgImage(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Counters CMS config */}
                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider">Operational Counter Figures</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Meals Served</label>
                      <input
                        type="number"
                        value={counterMeals}
                        onChange={(e) => setCounterMeals(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Kids Educated</label>
                      <input
                        type="number"
                        value={counterEdu}
                        onChange={(e) => setCounterEdu(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Medical Aids</label>
                      <input
                        type="number"
                        value={counterMed}
                        onChange={(e) => setCounterMed(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Disasters Met</label>
                      <input
                        type="number"
                        value={counterDis}
                        onChange={(e) => setCounterDis(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

              </form>
            )}

            {/* 7. SETTINGS MANAGER */}
            {activeTab === 'Settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-850">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                    Global settings & SEO Configuration
                  </h3>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Save Global Settings
                  </button>
                </div>

                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider">Contact & Social handles</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">WhatsApp & Call No</label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Primary Support Email</label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Donation Notification Email</label>
                      <input
                        type="email"
                        value={thanksEmail}
                        onChange={(e) => setThanksEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Instagram Link</label>
                      <input
                        type="text"
                        value={igUrl}
                        onChange={(e) => setIgUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">YouTube Link</label>
                      <input
                        type="text"
                        value={ytUrl}
                        onChange={(e) => setYtUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Facebook page Link</label>
                      <input
                        type="text"
                        value={fbUrl}
                        onChange={(e) => setFbUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs">
                  <h4 className="font-bold text-xs uppercase text-slate-450 tracking-wider">SEO Metadata (Apple & Google crawler optimization)</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Global Meta Title</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Meta Description</label>
                      <textarea
                        value={seoDesc}
                        onChange={(e) => setSeoDesc(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* 8. SYSTEM AUDIT LOGS */}
            {activeTab === 'Logs' && (
              <div className="space-y-6">
                <h3 className="font-bold text-base font-poppins pb-2 border-b border-slate-800" style={{ color: '#F8FAFC' }}>
                  System Audit Ledger Logs
                </h3>
                
                <div className="space-y-3 h-96 overflow-y-auto pr-2 scrollbar-none">
                  {state.auditLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                        <span>User: <strong className="text-slate-200" style={{ color: '#E2E8F0' }}>{log.userName}</strong></span>
                        <span className="font-mono text-slate-500" style={{ color: '#94A3B8' }}>{log.timestamp}</span>
                      </div>
                      <p className="font-bold text-white text-sm" style={{ color: '#FFFFFF' }}>{log.action}</p>
                      <p className="text-slate-300 font-medium" style={{ color: '#E2E8F0' }}>{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
      </div>
    </PublicLayout>
  );
}
