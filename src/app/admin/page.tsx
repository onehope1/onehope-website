'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/database/supabaseClient';
import { 
  Shield, Settings, Heart, Users, FileText, Globe, Check, X, 
  ShieldAlert, Plus, Edit, Trash, HelpCircle, Image as ImageIcon, 
  MapPin, Link as LinkIcon, DollarSign, Calendar, MessageSquare, ListTodo, Upload 
} from 'lucide-react';
import { Campaign, Blog, Story, FAQ, Testimonial } from '@/types';

export default function AdminDashboard() {
  const { 
    state, 
    updateCMS, 
    updateSettings, 
    approveVolunteerApplication, 
    rejectVolunteerApplication, 
    addCampaign, 
    updateCampaign, 
    deleteCampaign,
    addStory, 
    updateStory, 
    deleteStory, 
    addBlog, 
    updateBlog, 
    deleteBlog,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = useDatabase();
  
  const [activeTab, setActiveTab] = useState<'Overview' | 'Campaigns' | 'Stories' | 'Blogs' | 'Volunteers' | 'CMS' | 'Settings' | 'Testimonials' | 'FAQs' | 'Logs'>('Overview');

  // Upload state
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Edit Mode states
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  // CMS States (Homepage)
  const [heroTitle, setHeroTitle] = useState(state.cms.hero.title || 'Hope Starts With One.');
  const [heroSubtitle, setHeroSubtitle] = useState(state.cms.hero.subtitle || '');
  const [heroCtaDonate, setHeroCtaDonate] = useState(state.cms.hero.ctaDonateText || 'Donate Now');
  const [heroCtaVol, setHeroCtaVol] = useState(state.cms.hero.ctaVolunteerText || 'Become Volunteer');
  const [heroBgImage, setHeroBgImage] = useState(state.cms.hero.backgroundImage || '');

  // CMS States (Other Pages Heroes)
  const [aboutTitle, setAboutTitle] = useState(state.cms.hero.aboutTitle || 'About Our Mission');
  const [aboutSubtitle, setAboutSubtitle] = useState(state.cms.hero.aboutSubtitle || 'We are a transparent team on the ground.');
  const [aboutBg, setAboutBg] = useState(state.cms.hero.aboutBg || '');

  const [campaignsTitle, setCampaignsTitle] = useState(state.cms.hero.campaignsTitle || 'Explore Support Initiatives');
  const [campaignsSubtitle, setCampaignsSubtitle] = useState(state.cms.hero.campaignsSubtitle || 'Help sponsor children, meals, and emergencies.');
  const [campaignsBg, setCampaignsBg] = useState(state.cms.hero.campaignsBg || '');

  const [storiesTitle, setStoriesTitle] = useState(state.cms.hero.storiesTitle || 'Ground Reality Update Stories');
  const [storiesSubtitle, setStoriesSubtitle] = useState(state.cms.hero.storiesSubtitle || 'Watch real vertical video verification.');
  const [storiesBg, setStoriesBg] = useState(state.cms.hero.storiesBg || '');

  const [transparencyTitle, setTransparencyTitle] = useState(state.cms.hero.transparencyTitle || 'Transparency Ledger');
  const [transparencySubtitle, setTransparencySubtitle] = useState(state.cms.hero.transparencySubtitle || 'Real-time audit invoices, transport coordinates.');
  const [transparencyBg, setTransparencyBg] = useState(state.cms.hero.transparencyBg || '');

  const [volunteerTitle, setVolunteerTitle] = useState(state.cms.hero.volunteerTitle || 'Become a Volunteer');
  const [volunteerSubtitle, setVolunteerSubtitle] = useState(state.cms.hero.volunteerSubtitle || 'Join our field squads in Rishikesh.');
  const [volunteerBg, setVolunteerBg] = useState(state.cms.hero.volunteerBg || '');

  const [counterMeals, setCounterMeals] = useState(state.cms.counters.mealsServed);
  const [counterEdu, setCounterEdu] = useState(state.cms.counters.childrenEducated);
  const [counterMed, setCounterMed] = useState(state.cms.counters.medicalSupplies);
  const [counterDis, setCounterDis] = useState(state.cms.counters.disasterResponded);

  // Settings States
  const [brandName, setBrandName] = useState(state.settings.brandName);
  const [tagline, setTagline] = useState(state.settings.tagline);
  const [logoUrl, setLogoUrl] = useState(state.settings.logo);
  const [supportPhone, setSupportPhone] = useState(state.settings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(state.settings.supportEmail);
  const [thanksEmail, setThanksEmail] = useState(state.settings.thanksEmail);
  const [igUrl, setIgUrl] = useState(state.settings.socials.instagram);
  const [ytUrl, setYtUrl] = useState(state.settings.socials.youtube);
  const [fbUrl, setFbUrl] = useState(state.settings.socials.facebook);
  const [seoTitle, setSeoTitle] = useState(state.settings.seo.metaTitle);
  const [seoDesc, setSeoDesc] = useState(state.settings.seo.metaDescription);
  const [seoKeywords, setSeoKeywords] = useState(state.settings.seo.keywords);

  // Campaign Form States
  const [campTitle, setCampTitle] = useState('');
  const [campCat, setCampCat] = useState<'Food' | 'Education' | 'Medical' | 'Disaster Relief' | 'Children' | 'Women' | 'Animals' | 'Environment' | 'Emergency'>('Food');
  const [campGoal, setCampGoal] = useState('');
  const [campRaised, setCampRaised] = useState('');
  const [campImage, setCampImage] = useState('');
  const [campSummary, setCampSummary] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campLoc, setCampLoc] = useState('Rishikesh, India');
  const [campMap, setCampMap] = useState('');
  const [campGallery, setCampGallery] = useState('');
  const [campProvides, setCampProvides] = useState('');
  const [campPriceUnit, setCampPriceUnit] = useState('');
  const [campUnitLabel, setCampUnitLabel] = useState('');
  const [campStatus, setCampStatus] = useState<'Active' | 'Completed' | 'Draft'>('Active');
  const [campSortOrder, setCampSortOrder] = useState('0');
  const [campCreatedAt, setCampCreatedAt] = useState('');

  // Story Form States
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDesc, setStoryDesc] = useState('');
  const [storyCat, setStoryCat] = useState('Ground Relief');
  const [storyAuthor, setStoryAuthor] = useState('OneHope India');
  const [storyMediaUrl, setStoryMediaUrl] = useState('');
  const [storyMediaType, setStoryMediaType] = useState<'image' | 'video'>('image');
  const [storyLoc, setStoryLoc] = useState('Rishikesh, India');
  const [storyDate, setStoryDate] = useState('');

  // Blog Form States
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCover, setBlogCover] = useState('');
  const [blogCat, setBlogCat] = useState('Humanitarian');
  const [blogReadTime, setBlogReadTime] = useState('4 min read');
  const [blogTags, setBlogTags] = useState('Welfare, Rishikesh');
  const [blogDate, setBlogDate] = useState('');

  // Testimonial Form States
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testAvatar, setTestAvatar] = useState('');
  const [testRating, setTestRating] = useState('5');

  // FAQ Form States
  const [faqQuest, setFaqQuest] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCat, setFaqCat] = useState('Donations');

  // File Upload Handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldKey);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldKey}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('onehope-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('onehope-media')
        .getPublicUrl(fileName);

      setter(publicUrl);
      alert('Media file uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message}. Make sure the bucket 'onehope-media' exists and is public in Supabase.`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS('hero', {
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaDonateText: heroCtaDonate,
      ctaVolunteerText: heroCtaVol,
      backgroundImage: heroBgImage,
      aboutTitle,
      aboutSubtitle,
      aboutBg,
      campaignsTitle,
      campaignsSubtitle,
      campaignsBg,
      storiesTitle,
      storiesSubtitle,
      storiesBg,
      transparencyTitle,
      transparencySubtitle,
      transparencyBg,
      volunteerTitle,
      volunteerSubtitle,
      volunteerBg
    });
    updateCMS('counters', {
      mealsServed: Number(counterMeals),
      childrenEducated: Number(counterEdu),
      medicalSupplies: Number(counterMed),
      disasterResponded: Number(counterDis)
    });
    alert('All multi-page Hero config values saved successfully!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brandName,
      tagline,
      logo: logoUrl,
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
        keywords: seoKeywords
      }
    });
    alert('Global settings and branding details saved successfully!');
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle || !campGoal) return;

    const galleryArray = campGallery ? campGallery.split(',').map(url => url.trim()).filter(Boolean) : [];
    const providesArray = campProvides ? campProvides.split(',').map(item => item.trim()).filter(Boolean) : [];

    const campData = {
      title: campTitle,
      category: campCat,
      goalAmount: Number(campGoal),
      raisedAmount: Number(campRaised || 0),
      image: campImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
      summary: campSummary,
      description: campDesc || campSummary,
      location: campLoc || 'Rishikesh, India',
      mapUrl: campMap || undefined,
      gallery: galleryArray,
      videos: [],
      pricePerUnit: campPriceUnit ? Number(campPriceUnit) : undefined,
      unitLabel: campUnitLabel || undefined,
      provides: providesArray,
      status: campStatus,
      sortOrder: Number(campSortOrder || 0),
      volunteersCount: 0,
      updates: [],
      timeline: [],
      comments: [],
      recentDonations: [],
      createdAt: campCreatedAt || new Date().toISOString()
    };

    if (editingCampaignId) {
      updateCampaign({ ...campData, id: editingCampaignId });
      alert('Campaign updated successfully!');
      setEditingCampaignId(null);
    } else {
      addCampaign(campData);
      alert('New campaign created successfully!');
    }

    // Reset Form
    setCampTitle('');
    setCampGoal('');
    setCampRaised('');
    setCampImage('');
    setCampSummary('');
    setCampDesc('');
    setCampLoc('Rishikesh, India');
    setCampMap('');
    setCampGallery('');
    setCampProvides('');
    setCampPriceUnit('');
    setCampUnitLabel('');
    setCampStatus('Active');
    setCampSortOrder('0');
    setCampCreatedAt('');
  };

  const startEditCampaign = (camp: Campaign) => {
    setEditingCampaignId(camp.id);
    setCampTitle(camp.title);
    setCampCat(camp.category as any);
    setCampGoal(String(camp.goalAmount));
    setCampRaised(String(camp.raisedAmount || 0));
    setCampImage(camp.image || '');
    setCampSummary(camp.summary || '');
    setCampDesc(camp.description || '');
    setCampLoc(camp.location || 'Rishikesh, India');
    setCampMap(camp.mapUrl || '');
    setCampGallery(camp.gallery ? camp.gallery.join(', ') : '');
    setCampProvides(camp.provides ? camp.provides.join(', ') : '');
    setCampPriceUnit(camp.pricePerUnit ? String(camp.pricePerUnit) : '');
    setCampUnitLabel(camp.unitLabel || '');
    setCampStatus(camp.status || 'Active');
    setCampCreatedAt(camp.createdAt || '');
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyDesc) return;

    const mediaObj = [{ url: storyMediaUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', type: storyMediaType }];

    if (editingStoryId) {
      updateStory({
        id: editingStoryId,
        title: storyTitle,
        description: storyDesc,
        category: storyCat,
        author: storyAuthor,
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        media: mediaObj,
        location: storyLoc,
        likes: 0,
        likedBy: [],
        bookmarks: [],
        comments: [],
        date: storyDate || new Date().toISOString().split('T')[0]
      } as any);
      alert('Story updated successfully!');
      setEditingStoryId(null);
    } else {
      addStory({
        title: storyTitle,
        description: storyDesc,
        category: storyCat,
        author: storyAuthor,
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        media: mediaObj,
        location: storyLoc,
        date: new Date().toISOString().split('T')[0]
      } as any);
      alert('New reels story added!');
    }

    setStoryTitle('');
    setStoryDesc('');
    setStoryMediaUrl('');
    setStoryLoc('Rishikesh, India');
    setStoryDate('');
  };

  const startEditStory = (story: any) => {
    setEditingStoryId(story.id);
    setStoryTitle(story.title);
    setStoryDesc(story.description);
    setStoryCat(story.category);
    setStoryAuthor(story.author);
    setStoryMediaUrl(story.media?.[0]?.url || '');
    setStoryMediaType(story.media?.[0]?.type || 'image');
    setStoryLoc(story.location);
    setStoryDate(story.date || '');
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogExcerpt) return;

    const blogData = {
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      coverImage: blogCover || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
      author: {
        name: 'OneHope Team',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        bio: 'Ground Aid Administrators.'
      },
      category: blogCat,
      tags: blogTags.split(',').map(t => t.trim()).filter(Boolean),
      readTime: blogReadTime
    };

    if (editingBlogId) {
      updateBlog({ 
        ...blogData, 
        id: editingBlogId, 
        slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 
        date: blogDate || new Date().toISOString().split('T')[0], 
        published: true 
      });
      alert('Blog article updated!');
      setEditingBlogId(null);
    } else {
      addBlog({
        ...blogData,
        slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        date: new Date().toISOString().split('T')[0],
        published: true
      } as any);
      alert('New blog article published!');
    }

    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCover('');
    setBlogDate('');
  };

  const startEditBlog = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    setBlogCover(blog.coverImage || '');
    setBlogCat(blog.category || 'Humanitarian');
    setBlogReadTime(blog.readTime || '3 min read');
    setBlogTags(blog.tags ? blog.tags.join(', ') : '');
    setBlogDate(blog.date || '');
  };

  const handleSaveFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuest || !faqAnswer) return;

    if (editingFaqId) {
      updateFAQ({ id: editingFaqId, question: faqQuest, answer: faqAnswer, category: faqCat });
      alert('FAQ item updated!');
      setEditingFaqId(null);
    } else {
      addFAQ({ question: faqQuest, answer: faqAnswer, category: faqCat });
      alert('FAQ item added!');
    }

    setFaqQuest('');
    setFaqAnswer('');
  };

  const startEditFaq = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setFaqQuest(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCat(faq.category);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testQuote) return;

    const testData = {
      name: testName,
      role: testRole || 'Sponsor',
      avatar: testAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      quote: testQuote,
      rating: Number(testRating)
    };

    if (editingTestimonialId) {
      updateTestimonial({ ...testData, id: editingTestimonialId });
      alert('Testimonial updated!');
      setEditingTestimonialId(null);
    } else {
      addTestimonial(testData);
      alert('Testimonial added!');
    }

    setTestName('');
    setTestRole('');
    setTestQuote('');
    setTestAvatar('');
  };

  const startEditTestimonial = (test: Testimonial) => {
    setEditingTestimonialId(test.id);
    setTestName(test.name);
    setTestRole(test.role || '');
    setTestQuote(test.quote);
    setTestRating(String(test.rating));
    setTestAvatar(test.avatar || '');
  };

  return (
    <PublicLayout>
      <div className="bg-[#051329] min-h-screen py-8" style={{ backgroundColor: '#051329' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Console Banner */}
          <div className="bg-[#0c1e36] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            
            <div className="space-y-2 text-center md:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20" style={{ color: '#60A5FA' }}>
                <Shield size={12} />
                <span>FOUNDER CONTROL PANEL</span>
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-poppins text-white" style={{ color: '#FFFFFF' }}>
                OneHope Admin Console
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-semibold" style={{ color: '#CBD5E1' }}>
                Visually edit and override homepage sections, review donations ledger, verify field applications, and write articles.
              </p>
            </div>

            <div className="flex gap-3 text-xs font-semibold z-10">
              <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-white/5 text-center min-w-[130px] backdrop-blur-sm">
                <span className="block text-slate-400 text-[9px] uppercase font-bold tracking-wider" style={{ color: '#94A3B8' }}>TOTAL DONATIONS LEDGER</span>
                <span className="text-base font-extrabold mt-0.5 block text-white" style={{ color: '#FFFFFF' }}>₹{(state.donations.reduce((acc,d)=>acc+d.amount, 0) + 1250000).toLocaleString()}</span>
              </div>
              <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-white/5 text-center min-w-[130px] backdrop-blur-sm">
                <span className="block text-slate-400 text-[9px] uppercase font-bold tracking-wider" style={{ color: '#94A3B8' }}>AUDITED VOLUNTEERS</span>
                <span className="text-base font-extrabold mt-0.5 block text-white" style={{ color: '#FFFFFF' }}>{state.users.filter(u=>u.volunteerStatus==='Approved').length} Active</span>
              </div>
            </div>
          </div>

          {/* Console Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Tabs Menu */}
            <div className="lg:col-span-3 bg-[#0c1e36] border border-white/5 rounded-3xl p-4 shadow-xl space-y-1">
              {(['Overview', 'Campaigns', 'Stories', 'Blogs', 'Volunteers', 'CMS', 'Settings', 'Testimonials', 'FAQs', 'Logs'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={isActive ? {
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderLeft: '4px solid #1E63FF',
                      borderRadius: '0px 12px 12px 0px'
                    } : {
                      color: '#94A3B8'
                    }}
                    className="w-full text-left px-4 py-3 text-xs font-bold transition-all flex items-center justify-between hover:bg-white/[0.02] rounded-xl"
                  >
                    <span>{tab} Manager</span>
                    <span className="text-[10px] font-bold opacity-30">→</span>
                  </button>
                );
              })}
            </div>

            {/* Active Content Panel */}
            <div className="lg:col-span-9 bg-[#0c1e36] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl min-h-[450px]">
            
              {/* 1. ANALYTICS OVERVIEW */}
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Analytics Overview
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block" style={{ color: '#94A3B8' }}>Audited Transactions count</span>
                      <p className="text-xl font-bold font-poppins text-white mt-1" style={{ color: '#FFFFFF' }}>{state.donations.length} successful</p>
                    </div>
                    <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block" style={{ color: '#94A3B8' }}>Registered users</span>
                      <p className="text-xl font-bold font-poppins text-white mt-1" style={{ color: '#FFFFFF' }}>{state.users.length} accounts</p>
                    </div>
                    <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block" style={{ color: '#94A3B8' }}>Active reels stories</span>
                      <p className="text-xl font-bold font-poppins text-white mt-1" style={{ color: '#FFFFFF' }}>{state.stories.length} vertical items</p>
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl text-xs leading-relaxed text-blue-300" style={{ color: '#93C5FD' }}>
                    <strong>Founder Dashboard Status:</strong> All visual configurations, slider texts, logos, contact info, and campaigns can be modified directly from this panel. Changes are synced dynamically to your Supabase tables in real-time.
                  </div>
                </div>
              )}

              {/* 2. CAMPAIGN MANAGER */}
              {activeTab === 'Campaigns' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Campaign Management
                  </h3>

                  {/* Add / Edit Form */}
                  <form onSubmit={handleSaveCampaign} className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider flex items-center gap-1.5" style={{ color: '#60A5FA' }}>
                      {editingCampaignId ? <Edit size={12} /> : <Plus size={12} />}
                      <span>{editingCampaignId ? 'Edit Campaign Details' : 'Create New Campaign Target'}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Campaign Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Feed 50 Slum Kids Today"
                          value={campTitle}
                          onChange={(e) => setCampTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Funding Goal (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 500000"
                          value={campGoal}
                          onChange={(e) => setCampGoal(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Current Raised (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 150000"
                          value={campRaised}
                          onChange={(e) => setCampRaised(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Category</label>
                        <select
                          value={campCat}
                          onChange={(e) => setCampCat(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                        >
                          {['Food', 'Education', 'Medical', 'Disaster Relief', 'Children', 'Women', 'Animals', 'Environment', 'Emergency'].map(c => (
                            <option key={c} value={c} style={{ backgroundColor: '#0c1e36', color: '#FFFFFF' }}>{c} Relief</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Sort Order Index</label>
                        <input
                          type="number"
                          value={campSortOrder}
                          onChange={(e) => setCampSortOrder(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Thumbnail Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={campImage}
                            onChange={(e) => setCampImage(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                            <Upload size={14} />
                            <span>{uploadingField === 'campImage' ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUpload(e, setCampImage, 'campImage')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Location / City</label>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value !== 'Custom') {
                                setCampLoc(e.target.value);
                              }
                            }}
                            className="px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                            style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                          >
                            <option value="Rishikesh, India">Rishikesh, India</option>
                            <option value="Dehradun, India">Dehradun, India</option>
                            <option value="Haridwar, India">Haridwar, India</option>
                            <option value="Custom">Custom (Type Right)</option>
                          </select>
                          <input
                            type="text"
                            placeholder="e.g. Rishikesh, Uttarakhand"
                            value={campLoc}
                            onChange={(e) => setCampLoc(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Price per Unit (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          value={campPriceUnit}
                          onChange={(e) => setCampPriceUnit(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Unit Label</label>
                        <input
                          type="text"
                          placeholder="e.g. child, meal, family"
                          value={campUnitLabel}
                          onChange={(e) => setCampUnitLabel(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Status</label>
                        <select
                          value={campStatus}
                          onChange={(e) => setCampStatus(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                          style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                        >
                          <option value="Active" style={{ backgroundColor: '#0c1e36' }}>Active</option>
                          <option value="Completed" style={{ backgroundColor: '#0c1e36' }}>Completed</option>
                          <option value="Draft" style={{ backgroundColor: '#0c1e36' }}>Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Gallery Image URLs (Comma Separated)</label>
                      <input
                        type="text"
                        placeholder="https://image1.jpg, https://image2.jpg"
                        value={campGallery}
                        onChange={(e) => setCampGallery(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Provides Items List (Comma Separated)</label>
                      <input
                        type="text"
                        placeholder="Fresh cooked meal, Dal, Safe water bottle"
                        value={campProvides}
                        onChange={(e) => setCampProvides(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Map Embed Link URL</label>
                      <input
                        type="text"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        value={campMap}
                        onChange={(e) => setCampMap(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Summary / Excerpt</label>
                      <input
                        type="text"
                        placeholder="Short summary details of the campaign..."
                        value={campSummary}
                        onChange={(e) => setCampSummary(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Story Description (Detailed description)</label>
                      <textarea
                        rows={4}
                        placeholder="Explain the timeline, ground vendors, and audit details..."
                        value={campDesc}
                        onChange={(e) => setCampDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#1E63FF]"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                      >
                        {editingCampaignId ? 'Update Campaign settings' : 'Add Campaign Target'}
                      </button>
                      {editingCampaignId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCampaignId(null);
                            setCampTitle('');
                            setCampGoal('');
                          }}
                          className="py-2.5 px-5 border border-white/10 text-slate-350 rounded-xl text-xs font-bold hover:bg-white/5"
                          style={{ color: '#CBD5E1' }}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List Campaigns */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-widest block" style={{ color: '#E2E8F0' }}>Active Campaigns List</h4>
                    {state.campaigns.map((camp) => (
                      <div key={camp.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{camp.title}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5" style={{ color: '#94A3B8' }}>{camp.category} • Goal: ₹{camp.goalAmount.toLocaleString()} • Raised: ₹{camp.raisedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => startEditCampaign(camp)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl"
                            title="Edit Campaign"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteCampaign(camp.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"
                            title="Delete Campaign"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 3. STORY MANAGER */}
              {activeTab === 'Stories' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Stories & Reels Manager
                  </h3>

                  <form onSubmit={handleSaveStory} className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider flex items-center gap-1" style={{ color: '#60A5FA' }}>
                      <Plus size={12} />
                      <span>{editingStoryId ? 'Edit Story' : 'Add Reel Story'}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Story Title</label>
                        <input
                          type="text"
                          placeholder="Story Title (e.g. Meet Ravi: Math Champion)"
                          value={storyTitle}
                          onChange={(e) => setStoryTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Category</label>
                        <input
                          type="text"
                          placeholder="e.g. Education Relief"
                          value={storyCat}
                          onChange={(e) => setStoryCat(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Media Type</label>
                        <select
                          value={storyMediaType}
                          onChange={(e) => setStoryMediaType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                        >
                          <option value="image" style={{ backgroundColor: '#0c1e36' }}>Photo Image</option>
                          <option value="video" style={{ backgroundColor: '#0c1e36' }}>Reel Video URL</option>
                        </select>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Media File (Direct Upload / Link)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={storyMediaUrl}
                            onChange={(e) => setStoryMediaUrl(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                            <Upload size={14} />
                            <span>{uploadingField === 'storyMediaUrl' ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleUpload(e, setStoryMediaUrl, 'storyMediaUrl')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Author Name</label>
                        <input
                          type="text"
                          value={storyAuthor}
                          onChange={(e) => setStoryAuthor(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Location</label>
                        <input
                          type="text"
                          value={storyLoc}
                          onChange={(e) => setStoryLoc(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Reel Description Details</label>
                      <textarea
                        rows={3}
                        placeholder="Reel description details..."
                        value={storyDesc}
                        onChange={(e) => setStoryDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                      >
                        {editingStoryId ? 'Save Story' : 'Publish Reel'}
                      </button>
                      {editingStoryId && (
                        <button
                          type="button"
                          onClick={() => { setEditingStoryId(null); setStoryTitle(''); }}
                          className="py-2.5 px-4 border border-white/10 rounded-xl text-xs hover:bg-white/5"
                          style={{ color: '#CBD5E1' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List Reels */}
                  <div className="space-y-3">
                    {state.stories.map((story) => (
                      <div key={story.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{story.title}</span>
                          <span className="text-[10px] text-slate-450 mt-0.5" style={{ color: '#94A3B8' }}>{story.category} • {story.likes} likes • {story.media?.[0]?.type}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditStory(story)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteStory(story.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. BLOG MANAGER */}
              {activeTab === 'Blogs' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Blog & Update Publisher
                  </h3>

                  <form onSubmit={handleSaveBlog} className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider flex items-center gap-1" style={{ color: '#60A5FA' }}>
                      <Plus size={12} />
                      <span>{editingBlogId ? 'Edit Article' : 'Publish Blog'}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Article Header Title</label>
                        <input
                          type="text"
                          placeholder="Article Header Title"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Cover Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={blogCover}
                            onChange={(e) => setBlogCover(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                            <Upload size={14} />
                            <span>{uploadingField === 'blogCover' ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUpload(e, setBlogCover, 'blogCover')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Category</label>
                        <input
                          type="text"
                          value={blogCat}
                          onChange={(e) => setBlogCat(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Read Time (Text)</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 min read"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Tags (Comma Separated)</label>
                        <input
                          type="text"
                          placeholder="Food, India, Rishikesh"
                          value={blogTags}
                          onChange={(e) => setBlogTags(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Excerpt summary details</label>
                      <input
                        type="text"
                        placeholder="Excerpt summary details"
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Rich Article Contents</label>
                      <textarea
                        rows={6}
                        placeholder="Article HTML content..."
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                      >
                        {editingBlogId ? 'Save Changes' : 'Publish Post'}
                      </button>
                      {editingBlogId && (
                        <button
                          type="button"
                          onClick={() => { setEditingBlogId(null); setBlogTitle(''); }}
                          className="py-2.5 px-4 border border-white/10 rounded-xl text-xs hover:bg-white/5"
                          style={{ color: '#CBD5E1' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List blogs */}
                  <div className="space-y-3">
                    {state.blogs.map((b) => (
                      <div key={b.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{b.title}</span>
                          <span className="text-[10px] text-slate-450 mt-0.5" style={{ color: '#94A3B8' }}>{b.category} • {b.date}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditBlog(b)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteBlog(b.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. VOLUNTEER MANAGER */}
              {activeTab === 'Volunteers' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Volunteer Applications Approval
                  </h3>

                  <div className="space-y-4">
                    {state.volunteerApplications.map((app) => (
                      <div key={app.id} className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{app.name}</span>
                            <p className="text-slate-400 text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>Applied: {app.appliedDate} • Email: {app.email} • Ph: {app.phone}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            app.status === 'Pending' ? 'bg-blue-550/20 text-blue-400' :
                            app.status === 'Approved' ? 'bg-emerald-550/20 text-emerald-400' : 'bg-red-550/20 text-red-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="space-y-2 p-3 bg-slate-950/50 border border-white/5 rounded-xl text-slate-300">
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
                              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 rounded-lg font-bold flex items-center gap-1"
                              style={{ color: '#CBD5E1' }}
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {state.volunteerApplications.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-10" style={{ color: '#94A3B8' }}>No pending volunteer registrations.</p>
                    )}
                  </div>
                </div>
              )}

              {/* 6. CMS MULTI-PAGE HERO BUILDER */}
              {activeTab === 'CMS' && (
                <form onSubmit={handleSaveCMS} className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <h3 className="font-bold text-white text-base font-poppins" style={{ color: '#FFFFFF' }}>
                      Homepage & Multi-Page CMS Editor
                    </h3>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                    >
                      Save CMS Override
                    </button>
                  </div>

                  {/* 1. Homepage Hero Section */}
                  <div className="space-y-4 p-5 bg-slate-950/30 border border-white/5 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider" style={{ color: '#60A5FA' }}>Homepage Hero Settings</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Hero Title Heading</label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Hero Subtitle text</label>
                        <textarea
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>CTA Donate Text</label>
                          <input
                            type="text"
                            value={heroCtaDonate}
                            onChange={(e) => setHeroCtaDonate(e.target.value)}
                            className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>CTA Volunteer/Watch Text</label>
                          <input
                            type="text"
                            value={heroCtaVol}
                            onChange={(e) => setHeroCtaVol(e.target.value)}
                            className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Background Media (Image or Video Upload / Link)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={heroBgImage}
                            onChange={(e) => setHeroBgImage(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5">
                            <Upload size={14} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleUpload(e, setHeroBgImage, 'homeHeroBg')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Other Pages Hero Configurations */}
                  <div className="space-y-4 p-5 bg-slate-950/30 border border-white/5 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider" style={{ color: '#60A5FA' }}>Other Pages Hero Headers</h4>
                    <div className="space-y-4 text-xs">
                      
                      {/* About Page Hero */}
                      <div className="p-4 border border-white/5 rounded-xl space-y-2.5">
                        <span className="font-bold text-[10px] uppercase text-slate-350" style={{ color: '#CBD5E1' }}>About Page</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Hero Title"
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <input
                            type="text"
                            placeholder="Background Image/Video URL"
                            value={aboutBg}
                            onChange={(e) => setAboutBg(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={aboutSubtitle}
                          onChange={(e) => setAboutSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>

                      {/* Campaigns Catalog Hero */}
                      <div className="p-4 border border-white/5 rounded-xl space-y-2.5">
                        <span className="font-bold text-[10px] uppercase text-slate-350" style={{ color: '#CBD5E1' }}>Campaigns Page</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Hero Title"
                            value={campaignsTitle}
                            onChange={(e) => setCampaignsTitle(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <input
                            type="text"
                            placeholder="Background Image/Video URL"
                            value={campaignsBg}
                            onChange={(e) => setCampaignsBg(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={campaignsSubtitle}
                          onChange={(e) => setCampaignsSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>

                      {/* Stories Page Hero */}
                      <div className="p-4 border border-white/5 rounded-xl space-y-2.5">
                        <span className="font-bold text-[10px] uppercase text-slate-350" style={{ color: '#CBD5E1' }}>Stories Page</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Hero Title"
                            value={storiesTitle}
                            onChange={(e) => setStoriesTitle(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <input
                            type="text"
                            placeholder="Background Image/Video URL"
                            value={storiesBg}
                            onChange={(e) => setStoriesBg(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={storiesSubtitle}
                          onChange={(e) => setStoriesSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>

                      {/* Transparency Page Hero */}
                      <div className="p-4 border border-white/5 rounded-xl space-y-2.5">
                        <span className="font-bold text-[10px] uppercase text-slate-350" style={{ color: '#CBD5E1' }}>Transparency Page</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Hero Title"
                            value={transparencyTitle}
                            onChange={(e) => setTransparencyTitle(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <input
                            type="text"
                            placeholder="Background Image/Video URL"
                            value={transparencyBg}
                            onChange={(e) => setTransparencyBg(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={transparencySubtitle}
                          onChange={(e) => setTransparencySubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>

                      {/* Volunteer Page Hero */}
                      <div className="p-4 border border-white/5 rounded-xl space-y-2.5">
                        <span className="font-bold text-[10px] uppercase text-slate-350" style={{ color: '#CBD5E1' }}>Volunteer Page</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Hero Title"
                            value={volunteerTitle}
                            onChange={(e) => setVolunteerTitle(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <input
                            type="text"
                            placeholder="Background Image/Video URL"
                            value={volunteerBg}
                            onChange={(e) => setVolunteerBg(e.target.value)}
                            className="px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={volunteerSubtitle}
                          onChange={(e) => setVolunteerSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>

                    </div>
                  </div>

                  {/* Counters CMS config */}
                  <div className="space-y-4 p-5 bg-slate-950/30 border border-white/5 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider" style={{ color: '#60A5FA' }}>Operational Counter Figures</h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Meals Served</label>
                        <input
                          type="number"
                          value={counterMeals}
                          onChange={(e) => setCounterMeals(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl font-bold"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Kids Educated</label>
                        <input
                          type="number"
                          value={counterEdu}
                          onChange={(e) => setCounterEdu(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl font-bold"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Medical Aids</label>
                        <input
                          type="number"
                          value={counterMed}
                          onChange={(e) => setCounterMed(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl font-bold"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Disasters Met</label>
                        <input
                          type="number"
                          value={counterDis}
                          onChange={(e) => setCounterDis(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl font-bold"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>
                  </div>

                </form>
              )}

              {/* 7. SETTINGS MANAGER */}
              {activeTab === 'Settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <h3 className="font-bold text-white text-base font-poppins" style={{ color: '#FFFFFF' }}>
                      Global Settings & SEO Configurations
                    </h3>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                    >
                      Save Global Settings
                    </button>
                  </div>

                  <div className="space-y-4 p-5 bg-slate-950/30 border border-white/5 rounded-2xl text-xs">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider" style={{ color: '#60A5FA' }}>Branding & Contact Info</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Brand name</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Tagline</label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Logo Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                            <Upload size={14} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUpload(e, setLogoUrl, 'logoImage')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>WhatsApp & Call No</label>
                        <input
                          type="text"
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Primary Support Email</label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Donation Notification Email</label>
                        <input
                          type="email"
                          value={thanksEmail}
                          onChange={(e) => setThanksEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Instagram Link</label>
                        <input
                          type="text"
                          value={igUrl}
                          onChange={(e) => setIgUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>YouTube Link</label>
                        <input
                          type="text"
                          value={ytUrl}
                          onChange={(e) => setYtUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Facebook page Link</label>
                        <input
                          type="text"
                          value={fbUrl}
                          onChange={(e) => setFbUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 bg-slate-950/30 border border-white/5 rounded-2xl text-xs">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider" style={{ color: '#60A5FA' }}>SEO Metadata Configurations</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Global Meta Title</label>
                        <input
                          type="text"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>Meta Description</label>
                        <textarea
                          value={seoDesc}
                          onChange={(e) => setSeoDesc(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1" style={{ color: '#94A3B8' }}>SEO Keywords</label>
                        <input
                          type="text"
                          value={seoKeywords}
                          onChange={(e) => setSeoKeywords(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* 8. TESTIMONIALS MANAGER */}
              {activeTab === 'Testimonials' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    Supporter Testimonials Management
                  </h3>

                  <form onSubmit={handleSaveTestimonial} className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider flex items-center gap-1" style={{ color: '#60A5FA' }}>
                      {editingTestimonialId ? <Edit size={12} /> : <Plus size={12} />}
                      <span>{editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Vikram Sharma"
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Role / Designation</label>
                        <input
                          type="text"
                          placeholder="e.g. Sponsor, Delhi Base"
                          value={testRole}
                          onChange={(e) => setTestRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Avatar Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={testAvatar}
                            onChange={(e) => setTestAvatar(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          />
                          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10">
                            <Upload size={14} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUpload(e, setTestAvatar, 'testAvatar')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Rating (1 to 5)</label>
                        <select
                          value={testRating}
                          onChange={(e) => setTestRating(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                        >
                          <option value="5" style={{ backgroundColor: '#0c1e36' }}>5 Stars</option>
                          <option value="4" style={{ backgroundColor: '#0c1e36' }}>4 Stars</option>
                          <option value="3" style={{ backgroundColor: '#0c1e36' }}>3 Stars</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Supporter Quote Details</label>
                      <textarea
                        rows={3}
                        placeholder="Quote content..."
                        value={testQuote}
                        onChange={(e) => setTestQuote(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                      >
                        {editingTestimonialId ? 'Save Quote' : 'Publish Testimonial'}
                      </button>
                      {editingTestimonialId && (
                        <button
                          type="button"
                          onClick={() => { setEditingTestimonialId(null); setTestName(''); }}
                          className="py-2.5 px-4 border border-white/10 rounded-xl text-xs hover:bg-white/5"
                          style={{ color: '#CBD5E1' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List Testimonials */}
                  <div className="space-y-3">
                    {state.testimonials.map((test) => (
                      <div key={test.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{test.name}</span>
                          <span className="text-[10px] text-slate-455 mt-0.5" style={{ color: '#94A3B8' }}>{test.role} • Rating: {test.rating}/5</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditTestimonial(test)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteTestimonial(test.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. FAQs MANAGER */}
              {activeTab === 'FAQs' && (
                <div className="space-y-8">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    FAQs Management
                  </h3>

                  <form onSubmit={handleSaveFAQ} className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs uppercase text-blue-400 tracking-wider flex items-center gap-1" style={{ color: '#60A5FA' }}>
                      {editingFaqId ? <Edit size={12} /> : <Plus size={12} />}
                      <span>{editingFaqId ? 'Edit FAQ Item' : 'Add FAQ'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Question</label>
                        <input
                          type="text"
                          placeholder="e.g. Do I get 80G tax benefit?"
                          value={faqQuest}
                          onChange={(e) => setFaqQuest(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>Category</label>
                        <select
                          value={faqCat}
                          onChange={(e) => setFaqCat(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-white/10 rounded-xl text-xs focus:outline-none"
                          style={{ color: '#FFFFFF', backgroundColor: '#0c1e36' }}
                        >
                          <option value="Donations" style={{ backgroundColor: '#0c1e36' }}>Donations</option>
                          <option value="Transparency" style={{ backgroundColor: '#0c1e36' }}>Transparency</option>
                          <option value="Volunteer" style={{ backgroundColor: '#0c1e36' }}>Volunteer</option>
                          <option value="General" style={{ backgroundColor: '#0c1e36' }}>General Welfare</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: '#94A3B8' }}>FAQ Answer Details</label>
                      <textarea
                        rows={3}
                        placeholder="FAQ Answer details..."
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/10 placeholder-slate-500 rounded-xl text-xs focus:outline-none"
                        style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10"
                      >
                        {editingFaqId ? 'Save FAQ' : 'Add FAQ'}
                      </button>
                      {editingFaqId && (
                        <button
                          type="button"
                          onClick={() => { setEditingFaqId(null); setFaqQuest(''); }}
                          className="py-2.5 px-4 border border-white/10 rounded-xl text-xs hover:bg-white/5"
                          style={{ color: '#CBD5E1' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List FAQs */}
                  <div className="space-y-3">
                    {state.faqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block font-poppins" style={{ color: '#FFFFFF' }}>{faq.question}</span>
                          <span className="text-[10px] text-slate-455 mt-0.5" style={{ color: '#94A3B8' }}>Category: {faq.category}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditFaq(faq)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteFAQ(faq.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. SYSTEM AUDIT LOGS */}
              {activeTab === 'Logs' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-white text-base font-poppins pb-2 border-b border-white/10" style={{ color: '#FFFFFF' }}>
                    System Audit Ledger Logs
                  </h3>
                  
                  <div className="space-y-3 h-96 overflow-y-auto pr-2 scrollbar-none">
                    {state.auditLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-xs space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                          <span>User: <strong className="text-slate-200">{log.userName}</strong></span>
                          <span className="font-mono text-slate-500">{log.timestamp}</span>
                        </div>
                        <p className="font-bold text-white text-sm" style={{ color: '#FFFFFF' }}>{log.action}</p>
                        <p className="text-slate-300 font-medium" style={{ color: '#CBD5E1' }}>{log.details}</p>
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
