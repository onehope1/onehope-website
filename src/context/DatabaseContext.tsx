'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseState, UserProfile, Campaign, Story, Blog, Donation, VolunteerApplication, VolunteerTask, AttendanceRecord, Testimonial, FAQ, SupportTicket, AuditLog, SiteSettings, UserRole } from '../types';
import { initialDatabaseState } from '../database/defaultData';
import { supabase } from '../database/supabaseClient';

interface DatabaseContextType {
  state: DatabaseState;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  updateCMS: (section: 'hero' | 'counters' | 'transparency', data: any) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'date' | 'receiptNumber' | 'status'>) => Donation;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'raisedAmount' | 'volunteersCount' | 'recentDonations' | 'updates' | 'timeline' | 'comments'>) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addCampaignUpdate: (campaignId: string, title: string, content: string, image?: string) => void;
  addCampaignTimeline: (campaignId: string, title: string, description: string, date: string) => void;
  addCampaignComment: (campaignId: string, text: string) => void;
  addStory: (story: Omit<Story, 'id' | 'likes' | 'likedBy' | 'bookmarks' | 'comments' | 'date'>) => void;
  updateStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  likeStory: (storyId: string) => void;
  bookmarkStory: (storyId: string) => void;
  addStoryComment: (storyId: string, text: string) => void;
  addBlog: (blog: Omit<Blog, 'id' | 'slug' | 'date' | 'published'>) => void;
  updateBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
  applyVolunteer: (skills: string[], experience: string) => void;
  approveVolunteerApplication: (appId: string) => void;
  rejectVolunteerApplication: (appId: string) => void;
  volunteerCheckIn: () => void;
  volunteerCheckOut: () => void;
  addVolunteerTask: (task: Omit<VolunteerTask, 'id' | 'status' | 'date'>) => void;
  updateVolunteerTaskStatus: (taskId: string, status: 'Assigned' | 'In Progress' | 'Completed') => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addSupportTicket: (subject: string, description: string) => void;
  replyToSupportTicket: (ticketId: string, text: string, sender: string) => void;
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (faq: FAQ) => void;
  deleteFAQ: (id: string) => void;
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (test: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  addNewsletterSubscriber: (email: string) => boolean;
  addAuditLog: (action: string, details: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Helper mapping functions to reconcile lowercase PostgreSQL columns with TypeScript camelCase properties safely
const mapUser = (u: any): UserProfile => {
  if (!u) return u;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatar: u.avatar,
    joinedDate: u.joineddate || u.joinedDate,
    savedStories: u.savedstories || u.savedStories || [],
    savedCampaigns: u.savedcampaigns || u.savedCampaigns || [],
    achievements: u.achievements || [],
    certificates: u.certificates || [],
    volunteerStatus: u.volunteerstatus || u.volunteerStatus || 'None',
    volunteerHours: Number(u.volunteerhours || u.volunteerHours || 0),
    volunteerPoints: Number(u.volunteerpoints || u.volunteerPoints || 0)
  };
};

const mapCampaign = (c: any): Campaign => {
  if (!c) return c;
  return {
    id: c.id,
    title: c.title,
    category: c.category,
    goalAmount: Number(c.goalamount || c.goalAmount || 0),
    raisedAmount: Number(c.raisedamount || c.raisedAmount || 0),
    image: c.image,
    summary: c.summary,
    description: c.description,
    location: c.location,
    mapUrl: c.mapurl || c.mapUrl,
    gallery: c.gallery || [],
    videos: c.videos || [],
    updates: c.updates || [],
    timeline: c.timeline || [],
    comments: c.comments || [],
    recentDonations: c.recentdonations || c.recentDonations || [],
    volunteersCount: Number(c.volunteerscount || c.volunteersCount || 0),
    createdAt: c.createdat || c.createdAt,
    status: c.status || 'Active',
    pricePerUnit: c.priceperunit !== undefined && c.priceperunit !== null ? Number(c.priceperunit) : undefined,
    unitLabel: c.unitlabel || c.unitLabel,
    provides: c.provides || [],
    donationLevels: c.donationlevels || c.donationLevels || []
  };
};

const mapStory = (s: any): Story => {
  if (!s) return s;
  return {
    id: s.id,
    title: s.title,
    author: s.author,
    authorAvatar: s.authoravatar || s.authorAvatar,
    media: s.media || [],
    description: s.description,
    category: s.category,
    likes: Number(s.likes || 0),
    likedBy: s.likedby || s.likedBy || [],
    bookmarks: s.bookmarks || [],
    comments: s.comments || [],
    location: s.location,
    date: s.date,
    campaignId: s.campaignid || s.campaignId
  };
};

const mapBlog = (b: any): Blog => {
  if (!b) return b;
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverimage || b.coverImage,
    author: b.author,
    category: b.category,
    tags: b.tags || [],
    readTime: b.readtime || b.readTime,
    date: b.date,
    published: !!b.published
  };
};

const mapDonation = (d: any): Donation => {
  if (!d) return d;
  return {
    id: d.id,
    donorName: d.donorname || d.donorName,
    email: d.email,
    phone: d.phone,
    amount: Number(d.amount || 0),
    isAnonymous: !!(d.isanonymous !== undefined ? d.isanonymous : d.isAnonymous),
    campaignId: d.campaignid || d.campaignId,
    paymentMethod: d.paymentmethod || d.paymentMethod,
    date: d.date,
    isMonthly: !!(d.ismonthly !== undefined ? d.ismonthly : d.isMonthly),
    status: d.status || 'Success',
    receiptNumber: d.receiptnumber || d.receiptNumber
  };
};

const mapVolunteerApp = (v: any): VolunteerApplication => {
  if (!v) return v;
  return {
    id: v.id,
    userId: v.userid || v.userId,
    name: v.name,
    email: v.email,
    phone: v.phone,
    skills: v.skills || [],
    experience: v.experience,
    identityDocUrl: v.identitydocurl || v.identityDocUrl,
    status: v.status || 'Pending',
    appliedDate: v.applieddate || v.appliedDate
  };
};

const mapVolunteerTask = (t: any): VolunteerTask => {
  if (!t) return t;
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    campaignId: t.campaignid || t.campaignId,
    campaignTitle: t.campaigntitle || t.campaignTitle,
    status: t.status || 'Assigned',
    hoursAssigned: Number(t.hoursassigned || t.hoursAssigned || 0),
    date: t.date
  };
};

const mapAttendance = (a: any): AttendanceRecord => {
  if (!a) return a;
  return {
    id: a.id,
    userId: a.userid || a.userId,
    date: a.date,
    checkIn: a.checkin || a.checkIn,
    checkOut: a.checkout || a.checkOut,
    hoursWorked: a.hoursworked !== undefined && a.hoursworked !== null ? Number(a.hoursworked) : undefined
  };
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DatabaseState>(initialDatabaseState);
  const [loaded, setLoaded] = useState(false);

  const isSupabaseReal = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  // Load from Supabase (or localStorage fallback) on mount
  useEffect(() => {
    const loadDatabase = async () => {
      if (isSupabaseReal) {
        try {
          // Fetch site settings
          const { data: settingsData } = await supabase.from('site_settings').select('*').single();
          // Fetch CMS visual configs
          const { data: cmsData } = await supabase.from('cms_configs').select('*').single();
          // Fetch all entity arrays
          const { data: campaigns } = await supabase.from('campaigns').select('*').order('sortOrder', { ascending: true });
          const { data: stories } = await supabase.from('stories').select('*').order('date', { ascending: false });
          const { data: blogs } = await supabase.from('blogs').select('*').order('date', { ascending: false });
          const { data: testimonials } = await supabase.from('testimonials').select('*');
          const { data: faqs } = await supabase.from('faqs').select('*');
          const { data: users } = await supabase.from('users').select('*');
          const { data: donations } = await supabase.from('donations').select('*').order('date', { ascending: false });
          const { data: volunteerApps } = await supabase.from('volunteer_applications').select('*');
          const { data: volunteerTasks } = await supabase.from('volunteer_tasks').select('*');
          const { data: attendance } = await supabase.from('attendance_records').select('*');
          const { data: supportTickets } = await supabase.from('support_tickets').select('*');
          const { data: auditLogs } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
          const { data: subscribers } = await supabase.from('newsletter_subscribers').select('email');

          // Check if local storage has an existing active session user
          let activeUser: UserProfile | null = null;
          try {
            const stored = localStorage.getItem('onehope_db');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.currentUser) {
                activeUser = parsed.currentUser;
              }
            }
          } catch (_) {}

          const hydratedState: DatabaseState = {
            users: (users || []).map(mapUser),
            currentUser: activeUser ? (users || []).map(mapUser).find((u: UserProfile) => u.id === activeUser?.id) || activeUser : null,
            campaigns: (campaigns || []).map(mapCampaign),
            stories: (stories || []).map(mapStory),
            blogs: (blogs || []).map(mapBlog),
            donations: (donations || []).map(mapDonation),
            volunteerApplications: (volunteerApps || []).map(mapVolunteerApp),
            volunteerTasks: (volunteerTasks || []).map(mapVolunteerTask),
            attendance: (attendance || []).map(mapAttendance),
            testimonials: testimonials || [],
            faqs: faqs || [],
            supportTickets: supportTickets || [],
            auditLogs: auditLogs || [],
            newsletterSubscribers: (subscribers || []).map((s: any) => s.email),
            cms: {
              hero: cmsData?.hero || initialDatabaseState.cms.hero,
              counters: cmsData?.counters || initialDatabaseState.cms.counters,
              transparency: cmsData?.transparency || initialDatabaseState.cms.transparency,
            },
            settings: settingsData ? {
              brandName: settingsData.brandname || settingsData.brandName,
              tagline: settingsData.tagline,
              logo: settingsData.logo,
              supportPhone: settingsData.supportphone || settingsData.supportPhone,
              supportEmail: settingsData.supportemail || settingsData.supportEmail,
              thanksEmail: settingsData.thanksemail || settingsData.thanksEmail,
              socials: settingsData.socials,
              seo: settingsData.seo,
              navigation: settingsData.navigation,
              footer: settingsData.footer
            } : initialDatabaseState.settings
          };

          setState(hydratedState);
          setLoaded(true);
          return;
        } catch (e) {
          console.error('Supabase load failed, reverting to localStorage fallback:', e);
        }
      }

      // Fallback local storage execution
      try {
        const stored = localStorage.getItem('onehope_db');
        if (stored) {
          const parsed = JSON.parse(stored);
          const needsUpgrade = !parsed.campaigns || parsed.campaigns.length !== 7 || !parsed.campaigns[0].pricePerUnit || !parsed.testimonials || parsed.testimonials.length !== 3;
          if (needsUpgrade) {
            parsed.campaigns = initialDatabaseState.campaigns;
            parsed.testimonials = initialDatabaseState.testimonials;
            parsed.faqs = initialDatabaseState.faqs;
            localStorage.setItem('onehope_db', JSON.stringify(parsed));
          }
          setState(parsed);
        } else {
          localStorage.setItem('onehope_db', JSON.stringify(initialDatabaseState));
        }
      } catch (e) {
        console.error('Failed to load local DB', e);
      }
      setLoaded(true);
    };

    loadDatabase();
  }, [isSupabaseReal]);

  // Sync back to local storage whenever local React state updates (offline backup caching)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('onehope_db', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save local DB to localStorage', e);
    }
  }, [state, loaded]);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: state.currentUser?.id || 'guest',
      userName: state.currentUser?.name || 'Guest User',
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));

    if (isSupabaseReal) {
      supabase.from('audit_logs').insert({
        id: newLog.id,
        userid: newLog.userId,
        username: newLog.userName,
        action: newLog.action,
        details: newLog.details,
        timestamp: newLog.timestamp
      }).then();
    }
  };

  const login = (email: string, role?: UserRole) => {
    const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updatedUser = role ? { ...existing, role } : existing;
      setState(prev => ({
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === existing.id ? updatedUser : u)
      }));

      if (isSupabaseReal) {
        supabase.from('users').update({ role: updatedUser.role }).eq('id', existing.id).then();
      }

      addAuditLog('User Login', `Logged in as ${email} (${updatedUser.role})`);
      return true;
    } else {
      const name = email.split('@')[0];
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role: role || 'User',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
        joinedDate: new Date().toISOString().split('T')[0],
        savedStories: [],
        savedCampaigns: [],
        achievements: [],
        certificates: [],
        volunteerStatus: 'None',
        volunteerHours: 0,
        volunteerPoints: 0
      };

      setState(prev => ({
        ...prev,
        users: [...prev.users, newUser],
        currentUser: newUser
      }));

      if (isSupabaseReal) {
        supabase.from('users').insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          joineddate: newUser.joinedDate,
          volunteerstatus: newUser.volunteerStatus,
          volunteerhours: newUser.volunteerHours,
          volunteerpoints: newUser.volunteerPoints
        }).then();
      }

      addAuditLog('User Registration', `Registered and logged in as ${email}`);
      return true;
    }
  };

  const logout = () => {
    addAuditLog('User Logout', `Logged out`);
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const updateCMS = (section: 'hero' | 'counters' | 'transparency', data: any) => {
    setState(prev => ({
      ...prev,
      cms: {
        ...prev.cms,
        [section]: data
      }
    }));

    if (isSupabaseReal) {
      supabase.from('cms_configs').update({ [section]: data }).eq('id', 'default').then();
    }

    addAuditLog('CMS Edit', `Updated homepage section: ${section}`);
  };

  const updateSettings = (settings: Partial<SiteSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings
      }
    }));

    if (isSupabaseReal) {
      const pgSettings: any = {};
      if (settings.brandName !== undefined) pgSettings.brandname = settings.brandName;
      if (settings.tagline !== undefined) pgSettings.tagline = settings.tagline;
      if (settings.logo !== undefined) pgSettings.logo = settings.logo;
      if (settings.supportPhone !== undefined) pgSettings.supportphone = settings.supportPhone;
      if (settings.supportEmail !== undefined) pgSettings.supportemail = settings.supportEmail;
      if (settings.thanksEmail !== undefined) pgSettings.thanksemail = settings.thanksEmail;
      if (settings.socials !== undefined) pgSettings.socials = settings.socials;
      if (settings.seo !== undefined) pgSettings.seo = settings.seo;
      if (settings.navigation !== undefined) pgSettings.navigation = settings.navigation;
      if (settings.footer !== undefined) pgSettings.footer = settings.footer;

      supabase.from('site_settings').update(pgSettings).eq('id', 'default').then();
    }

    addAuditLog('Settings Update', `Updated global settings`);
  };

  const addDonation = (donation: Omit<Donation, 'id' | 'date' | 'receiptNumber' | 'status'>) => {
    const id = `don-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5);
    const receiptNumber = `OH-REC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newDon: Donation = {
      ...donation,
      id,
      date,
      receiptNumber,
      status: 'Success'
    };

    // Recalculate and update campaigns, visual stats dynamically
    setState(prev => {
      const donations = [newDon, ...prev.donations];
      let campaigns = prev.campaigns;
      let mealsIncrement = 0;

      if (donation.campaignId) {
        campaigns = prev.campaigns.map(c => {
          if (c.id === donation.campaignId) {
            const recent = [
              {
                id: `rc-${Date.now()}`,
                donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
                amount: donation.amount,
                date: date.split(' ')[0],
                isAnonymous: donation.isAnonymous
              },
              ...c.recentDonations
            ].slice(0, 10);

            if (c.category === 'Food') {
              mealsIncrement = Math.floor(donation.amount / 100);
            }

            return {
              ...c,
              raisedAmount: c.raisedAmount + donation.amount,
              recentDonations: recent
            };
          }
          return c;
        });
      }

      const updatedCounters = mealsIncrement > 0
        ? { ...prev.cms.counters, mealsServed: prev.cms.counters.mealsServed + mealsIncrement }
        : prev.cms.counters;

      if (isSupabaseReal) {
        // Save donation transaction row
        supabase.from('donations').insert({
          id: newDon.id,
          donorname: newDon.donorName,
          email: newDon.email,
          phone: newDon.phone,
          amount: newDon.amount,
          isanonymous: newDon.isAnonymous,
          campaignid: newDon.campaignId,
          paymentmethod: newDon.paymentMethod,
          date: newDon.date,
          ismonthly: newDon.isMonthly,
          status: newDon.status,
          receiptnumber: newDon.receiptNumber
        }).then();

        // Increment campaign variables
        if (donation.campaignId) {
          const camp = campaigns.find(c => c.id === donation.campaignId);
          if (camp) {
            supabase.from('campaigns').update({
              raisedamount: camp.raisedAmount,
              recentdonations: camp.recentDonations
            }).eq('id', donation.campaignId).then();
          }
        }

        // Update home page statistics
        if (mealsIncrement > 0) {
          supabase.from('cms_configs').update({ counters: updatedCounters }).eq('id', 'default').then();
        }
      }

      return {
        ...prev,
        donations,
        campaigns,
        cms: {
          ...prev.cms,
          counters: updatedCounters
        }
      };
    });

    addAuditLog('Donation Made', `₹${donation.amount} donated by ${donation.isAnonymous ? 'Anonymous' : donation.donorName}`);
    return newDon;
  };

  const addCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt' | 'raisedAmount' | 'volunteersCount' | 'recentDonations' | 'updates' | 'timeline' | 'comments'>) => {
    const newCamp: Campaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      raisedAmount: 0,
      volunteersCount: 0,
      recentDonations: [],
      updates: [],
      timeline: [],
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setState(prev => ({
      ...prev,
      campaigns: [newCamp, ...prev.campaigns]
    }));

    if (isSupabaseReal) {
      supabase.from('campaigns').insert({
        id: newCamp.id,
        title: newCamp.title,
        category: newCamp.category,
        goalamount: newCamp.goalAmount,
        raisedamount: newCamp.raisedAmount,
        image: newCamp.image,
        summary: newCamp.summary,
        description: newCamp.description,
        location: newCamp.location,
        mapurl: newCamp.mapUrl,
        gallery: newCamp.gallery,
        videos: newCamp.videos,
        updates: newCamp.updates,
        timeline: newCamp.timeline,
        comments: newCamp.comments,
        recentdonations: newCamp.recentDonations,
        volunteerscount: newCamp.volunteersCount,
        createdat: newCamp.createdAt,
        status: newCamp.status,
        priceperunit: newCamp.pricePerUnit,
        unitlabel: newCamp.unitLabel,
        provides: newCamp.provides,
        donationlevels: newCamp.donationLevels,
        sortOrder: state.campaigns.length
      }).then();
    }

    addAuditLog('Campaign Created', `Created campaign: ${campaign.title}`);
  };

  const updateCampaign = (campaign: Campaign) => {
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => c.id === campaign.id ? campaign : c)
    }));

    if (isSupabaseReal) {
      supabase.from('campaigns').update({
        title: campaign.title,
        category: campaign.category,
        goalamount: campaign.goalAmount,
        raisedamount: campaign.raisedAmount,
        image: campaign.image,
        summary: campaign.summary,
        description: campaign.description,
        location: campaign.location,
        mapurl: campaign.mapUrl,
        gallery: campaign.gallery,
        videos: campaign.videos,
        updates: campaign.updates,
        timeline: campaign.timeline,
        comments: campaign.comments,
        recentdonations: campaign.recentDonations,
        volunteerscount: campaign.volunteersCount,
        status: campaign.status,
        priceperunit: campaign.pricePerUnit,
        unitlabel: campaign.unitLabel,
        provides: campaign.provides,
        donationlevels: campaign.donationLevels
      }).eq('id', campaign.id).then();
    }

    addAuditLog('Campaign Updated', `Updated campaign: ${campaign.title}`);
  };

  const deleteCampaign = (id: string) => {
    const name = state.campaigns.find(c => c.id === id)?.title || id;
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter(c => c.id !== id)
    }));

    if (isSupabaseReal) {
      supabase.from('campaigns').delete().eq('id', id).then();
    }

    addAuditLog('Campaign Deleted', `Deleted campaign: ${name}`);
  };

  const addCampaignUpdate = (campaignId: string, title: string, content: string, image?: string) => {
    const newUpdate = {
      id: `up-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      image
    };

    setState(prev => {
      const campaigns = prev.campaigns.map(c => {
        if (c.id === campaignId) {
          const updates = [newUpdate, ...c.updates];
          if (isSupabaseReal) {
            supabase.from('campaigns').update({ updates }).eq('id', campaignId).then();
          }
          return { ...c, updates };
        }
        return c;
      });
      return { ...prev, campaigns };
    });

    addAuditLog('Campaign Update Added', `Added update "${title}" to campaign ID ${campaignId}`);
  };

  const addCampaignTimeline = (campaignId: string, title: string, description: string, date: string) => {
    const newTimeline = {
      id: `t-${Date.now()}`,
      title,
      description,
      date,
      completed: false
    };

    setState(prev => {
      const campaigns = prev.campaigns.map(c => {
        if (c.id === campaignId) {
          const timeline = [...c.timeline, newTimeline];
          if (isSupabaseReal) {
            supabase.from('campaigns').update({ timeline }).eq('id', campaignId).then();
          }
          return { ...c, timeline };
        }
        return c;
      });
      return { ...prev, campaigns };
    });
  };

  const addCampaignComment = (campaignId: string, text: string) => {
    if (!state.currentUser) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    setState(prev => {
      const campaigns = prev.campaigns.map(c => {
        if (c.id === campaignId) {
          const comments = [newComment, ...c.comments];
          if (isSupabaseReal) {
            supabase.from('campaigns').update({ comments }).eq('id', campaignId).then();
          }
          return { ...c, comments };
        }
        return c;
      });
      return { ...prev, campaigns };
    });
  };

  const addStory = (story: Omit<Story, 'id' | 'likes' | 'likedBy' | 'bookmarks' | 'comments' | 'date'>) => {
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      likes: 0,
      likedBy: [],
      bookmarks: [],
      comments: [],
      date: new Date().toISOString().split('T')[0]
    };

    setState(prev => ({
      ...prev,
      stories: [newStory, ...prev.stories]
    }));

    if (isSupabaseReal) {
      supabase.from('stories').insert({
        id: newStory.id,
        title: newStory.title,
        author: newStory.author,
        authoravatar: newStory.authorAvatar,
        media: newStory.media,
        description: newStory.description,
        category: newStory.category,
        likes: newStory.likes,
        likedby: newStory.likedBy,
        bookmarks: newStory.bookmarks,
        comments: newStory.comments,
        location: newStory.location,
        date: newStory.date,
        campaignid: newStory.campaignId
      }).then();
    }

    addAuditLog('Story Created', `Created reels story: ${story.title}`);
  };

  const updateStory = (story: Story) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(s => s.id === story.id ? story : s)
    }));

    if (isSupabaseReal) {
      supabase.from('stories').update({
        title: story.title,
        author: story.author,
        authoravatar: story.authorAvatar,
        media: story.media,
        description: story.description,
        category: story.category,
        likes: story.likes,
        likedby: story.likedBy,
        bookmarks: story.bookmarks,
        comments: story.comments,
        location: story.location,
        campaignid: story.campaignId
      }).eq('id', story.id).then();
    }
  };

  const deleteStory = (id: string) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.filter(s => s.id !== id)
    }));

    if (isSupabaseReal) {
      supabase.from('stories').delete().eq('id', id).then();
    }
  };

  const likeStory = (storyId: string) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;

    setState(prev => {
      const stories = prev.stories.map(s => {
        if (s.id === storyId) {
          const hasLiked = s.likedBy.includes(userId);
          const likedBy = hasLiked ? s.likedBy.filter(id => id !== userId) : [...s.likedBy, userId];
          const likes = hasLiked ? s.likes - 1 : s.likes + 1;
          
          if (isSupabaseReal) {
            supabase.from('stories').update({ likes, likedby: likedBy }).eq('id', storyId).then();
          }

          return { ...s, likes, likedBy };
        }
        return s;
      });
      return { ...prev, stories };
    });
  };

  const bookmarkStory = (storyId: string) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;

    setState(prev => {
      const isBookmarked = prev.currentUser!.savedStories.includes(storyId);
      const savedStories = isBookmarked
        ? prev.currentUser!.savedStories.filter(id => id !== storyId)
        : [...prev.currentUser!.savedStories, storyId];
      const updatedUser = { ...prev.currentUser!, savedStories };

      const stories = prev.stories.map(s => {
        if (s.id === storyId) {
          const bookmarks = s.bookmarks.includes(userId)
            ? s.bookmarks.filter(id => id !== userId)
            : [...s.bookmarks, userId];

          if (isSupabaseReal) {
            supabase.from('stories').update({ bookmarks }).eq('id', storyId).then();
          }

          return { ...s, bookmarks };
        }
        return s;
      });

      if (isSupabaseReal) {
        supabase.from('users').update({ savedstories: savedStories }).eq('id', userId).then();
      }

      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === userId ? updatedUser : u),
        stories
      };
    });
  };

  const addStoryComment = (storyId: string, text: string) => {
    if (!state.currentUser) return;
    const newComment = {
      id: `sc-${Date.now()}`,
      userName: state.currentUser.name,
      userAvatar: state.currentUser.avatar,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    setState(prev => {
      const stories = prev.stories.map(s => {
        if (s.id === storyId) {
          const comments = [newComment, ...s.comments];
          if (isSupabaseReal) {
            supabase.from('stories').update({ comments }).eq('id', storyId).then();
          }
          return { ...s, comments };
        }
        return s;
      });
      return { ...prev, stories };
    });
  };

  const addBlog = (blog: Omit<Blog, 'id' | 'slug' | 'date' | 'published'>) => {
    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBlog: Blog = {
      ...blog,
      id: `blog-${Date.now()}`,
      slug,
      date: new Date().toISOString().split('T')[0],
      published: true
    };

    setState(prev => ({
      ...prev,
      blogs: [newBlog, ...prev.blogs]
    }));

    if (isSupabaseReal) {
      supabase.from('blogs').insert({
        id: newBlog.id,
        title: newBlog.title,
        slug: newBlog.slug,
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        coverimage: newBlog.coverImage,
        author: newBlog.author,
        category: newBlog.category,
        tags: newBlog.tags,
        readtime: newBlog.readTime,
        date: newBlog.date,
        published: newBlog.published
      }).then();
    }

    addAuditLog('Blog Added', `Created blog article: ${blog.title}`);
  };

  const updateBlog = (blog: Blog) => {
    setState(prev => ({
      ...prev,
      blogs: prev.blogs.map(b => b.id === blog.id ? blog : b)
    }));

    if (isSupabaseReal) {
      supabase.from('blogs').update({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverimage: blog.coverImage,
        author: blog.author,
        category: blog.category,
        tags: blog.tags,
        readtime: blog.readTime,
        published: blog.published
      }).eq('id', blog.id).then();
    }

    addAuditLog('Blog Updated', `Updated blog: ${blog.title}`);
  };

  const deleteBlog = (id: string) => {
    setState(prev => ({
      ...prev,
      blogs: prev.blogs.filter(b => b.id !== id)
    }));

    if (isSupabaseReal) {
      supabase.from('blogs').delete().eq('id', id).then();
    }
  };

  const applyVolunteer = (skills: string[], experience: string) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;
    const newApp: VolunteerApplication = {
      id: `vol-app-${Date.now()}`,
      userId,
      name: state.currentUser.name,
      email: state.currentUser.email,
      phone: state.currentUser.phone || '',
      skills,
      experience,
      identityDocUrl: '#',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setState(prev => {
      const updatedUser = { ...prev.currentUser!, volunteerStatus: 'Pending' as const };
      
      if (isSupabaseReal) {
        supabase.from('volunteer_applications').insert({
          id: newApp.id,
          userid: newApp.userId,
          name: newApp.name,
          email: newApp.email,
          phone: newApp.phone,
          skills: newApp.skills,
          experience: newApp.experience,
          identitydocurl: newApp.identityDocUrl,
          status: newApp.status,
          applieddate: newApp.appliedDate
        }).then();

        supabase.from('users').update({ volunteerstatus: 'Pending' }).eq('id', userId).then();
      }

      return {
        ...prev,
        volunteerApplications: [...prev.volunteerApplications, newApp],
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === userId ? updatedUser : u)
      };
    });

    addAuditLog('Volunteer Apply', `${state.currentUser.name} applied for volunteering`);
  };

  const approveVolunteerApplication = (appId: string) => {
    const app = state.volunteerApplications.find(a => a.id === appId);
    if (!app) return;

    setState(prev => {
      const users = prev.users.map(u => {
        if (u.id === app.userId) {
          if (isSupabaseReal) {
            supabase.from('users').update({ volunteerstatus: 'Approved', role: 'Volunteer' }).eq('id', app.userId).then();
          }
          return { ...u, volunteerStatus: 'Approved' as const, role: 'Volunteer' as UserRole };
        }
        return u;
      });

      const currentUser = prev.currentUser && prev.currentUser.id === app.userId
        ? { ...prev.currentUser, volunteerStatus: 'Approved' as const, role: 'Volunteer' as UserRole }
        : prev.currentUser;

      if (isSupabaseReal) {
        supabase.from('volunteer_applications').update({ status: 'Approved' }).eq('id', appId).then();
      }

      return {
        ...prev,
        volunteerApplications: prev.volunteerApplications.map(a => a.id === appId ? { ...a, status: 'Approved' as const } : a),
        users,
        currentUser
      };
    });

    addAuditLog('Volunteer Approved', `Approved application for ${app.name}`);
  };

  const rejectVolunteerApplication = (appId: string) => {
    const app = state.volunteerApplications.find(a => a.id === appId);
    if (!app) return;

    setState(prev => {
      const users = prev.users.map(u => {
        if (u.id === app.userId) {
          if (isSupabaseReal) {
            supabase.from('users').update({ volunteerstatus: 'Rejected' }).eq('id', app.userId).then();
          }
          return { ...u, volunteerStatus: 'Rejected' as const };
        }
        return u;
      });

      const currentUser = prev.currentUser && prev.currentUser.id === app.userId
        ? { ...prev.currentUser, volunteerStatus: 'Rejected' as const }
        : prev.currentUser;

      if (isSupabaseReal) {
        supabase.from('volunteer_applications').update({ status: 'Rejected' }).eq('id', appId).then();
      }

      return {
        ...prev,
        volunteerApplications: prev.volunteerApplications.map(a => a.id === appId ? { ...a, status: 'Rejected' as const } : a),
        users,
        currentUser
      };
    });
  };

  const volunteerCheckIn = () => {
    if (!state.currentUser || state.currentUser.volunteerStatus !== 'Approved') return;
    const userId = state.currentUser.id;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].substring(0, 5);

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId,
      date,
      checkIn: time
    };

    setState(prev => ({
      ...prev,
      attendance: [...prev.attendance, record]
    }));

    if (isSupabaseReal) {
      supabase.from('attendance_records').insert({
        id: record.id,
        userid: record.userId,
        date: record.date,
        checkin: record.checkIn
      }).then();
    }

    addAuditLog('Volunteer Check-In', `${state.currentUser.name} checked in at ${time}`);
  };

  const volunteerCheckOut = () => {
    if (!state.currentUser || state.currentUser.volunteerStatus !== 'Approved') return;
    const userId = state.currentUser.id;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].substring(0, 5);

    setState(prev => {
      const recordIndex = prev.attendance.findIndex(a => a.userId === userId && a.date === date && !a.checkOut);
      if (recordIndex === -1) return prev;

      const record = prev.attendance[recordIndex];
      const checkInMin = parseInt(record.checkIn.split(':')[0]) * 60 + parseInt(record.checkIn.split(':')[1]);
      const checkOutMin = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
      const diffHrs = Math.max(0.5, Math.round(((checkOutMin - checkInMin) / 60) * 10) / 10);

      const updatedRecord = {
        ...record,
        checkOut: time,
        hoursWorked: diffHrs
      };

      const updatedUser = {
        ...prev.currentUser!,
        volunteerHours: prev.currentUser!.volunteerHours + diffHrs,
        volunteerPoints: prev.currentUser!.volunteerPoints + Math.floor(diffHrs * 10)
      };

      if (isSupabaseReal) {
        supabase.from('attendance_records').update({
          checkout: updatedRecord.checkOut,
          hoursworked: updatedRecord.hoursWorked
        }).eq('id', record.id).then();

        supabase.from('users').update({
          volunteerhours: updatedUser.volunteerHours,
          volunteerpoints: updatedUser.volunteerPoints
        }).eq('id', userId).then();
      }

      return {
        ...prev,
        attendance: prev.attendance.map((a, i) => i === recordIndex ? updatedRecord : a),
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === userId ? updatedUser : u)
      };
    });

    addAuditLog('Volunteer Check-Out', `${state.currentUser.name} checked out at ${time}`);
  };

  const addVolunteerTask = (task: Omit<VolunteerTask, 'id' | 'status' | 'date'>) => {
    const newTask: VolunteerTask = {
      ...task,
      id: `task-${Date.now()}`,
      status: 'Assigned',
      date: new Date().toISOString().split('T')[0]
    };

    setState(prev => ({
      ...prev,
      volunteerTasks: [...prev.volunteerTasks, newTask]
    }));

    if (isSupabaseReal) {
      supabase.from('volunteer_tasks').insert({
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        campaignid: newTask.campaignId,
        campaigntitle: newTask.campaignTitle,
        status: newTask.status,
        hoursassigned: newTask.hoursAssigned,
        date: newTask.date
      }).then();
    }
  };

  const updateVolunteerTaskStatus = (taskId: string, status: 'Assigned' | 'In Progress' | 'Completed') => {
    setState(prev => ({
      ...prev,
      volunteerTasks: prev.volunteerTasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));

    if (isSupabaseReal) {
      supabase.from('volunteer_tasks').update({ status }).eq('id', taskId).then();
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;

    setState(prev => {
      const updatedUser = { ...prev.currentUser!, ...profile };
      
      if (isSupabaseReal) {
        const pgUser: any = {};
        if (profile.name !== undefined) pgUser.name = profile.name;
        if (profile.phone !== undefined) pgUser.phone = profile.phone;
        if (profile.avatar !== undefined) pgUser.avatar = profile.avatar;
        if (profile.volunteerHours !== undefined) pgUser.volunteerhours = profile.volunteerHours;
        if (profile.volunteerPoints !== undefined) pgUser.volunteerpoints = profile.volunteerPoints;
        if (profile.achievements !== undefined) pgUser.achievements = profile.achievements;
        if (profile.certificates !== undefined) pgUser.certificates = profile.certificates;
        
        supabase.from('users').update(pgUser).eq('id', userId).then();
      }

      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === userId ? updatedUser : u)
      };
    });

    addAuditLog('Profile Update', `Updated user profile details`);
  };

  const addSupportTicket = (subject: string, description: string) => {
    if (!state.currentUser) return;
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      userId: state.currentUser.id,
      subject,
      description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      replies: []
    };

    setState(prev => ({
      ...prev,
      supportTickets: [...prev.supportTickets, newTicket]
    }));

    if (isSupabaseReal) {
      supabase.from('support_tickets').insert({
        id: newTicket.id,
        userid: newTicket.userId,
        subject: newTicket.subject,
        description: newTicket.description,
        status: newTicket.status,
        date: newTicket.date,
        replies: newTicket.replies
      }).then();
    }

    addAuditLog('Ticket Created', `Opened support ticket: ${subject}`);
  };

  const replyToSupportTicket = (ticketId: string, text: string, sender: string) => {
    const reply = {
      sender,
      text,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
    };

    setState(prev => {
      const tickets = prev.supportTickets.map(t => {
        if (t.id === ticketId) {
          const replies = [...t.replies, reply];
          const status = sender === 'Admin' ? ('In Progress' as const) : ('Open' as const);

          if (isSupabaseReal) {
            supabase.from('support_tickets').update({ replies, status }).eq('id', ticketId).then();
          }

          return { ...t, replies, status };
        }
        return t;
      });
      return { ...prev, supportTickets: tickets };
    });
  };

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFaq = { ...faq, id: `faq-${Date.now()}` };
    setState(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));

    if (isSupabaseReal) {
      supabase.from('faqs').insert({
        id: newFaq.id,
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category
      }).then();
    }
  };

  const updateFAQ = (faq: FAQ) => {
    setState(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === faq.id ? faq : f)
    }));

    if (isSupabaseReal) {
      supabase.from('faqs').update({
        question: faq.question,
        answer: faq.answer,
        category: faq.category
      }).eq('id', faq.id).then();
    }
  };

  const deleteFAQ = (id: string) => {
    setState(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }));

    if (isSupabaseReal) {
      supabase.from('faqs').delete().eq('id', id).then();
    }
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest = { ...test, id: `test-${Date.now()}` };
    setState(prev => ({ ...prev, testimonials: [...prev.testimonials, newTest] }));

    if (isSupabaseReal) {
      supabase.from('testimonials').insert({
        id: newTest.id,
        name: newTest.name,
        role: newTest.role,
        avatar: newTest.avatar,
        quote: newTest.quote,
        rating: newTest.rating
      }).then();
    }
  };

  const updateTestimonial = (test: Testimonial) => {
    setState(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === test.id ? test : t)
    }));

    if (isSupabaseReal) {
      supabase.from('testimonials').update({
        name: test.name,
        role: test.role,
        avatar: test.avatar,
        quote: test.quote,
        rating: test.rating
      }).eq('id', test.id).then();
    }
  };

  const deleteTestimonial = (id: string) => {
    setState(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));

    if (isSupabaseReal) {
      supabase.from('testimonials').delete().eq('id', id).then();
    }
  };

  const addNewsletterSubscriber = (email: string) => {
    if (state.newsletterSubscribers.includes(email)) return false;
    
    setState(prev => ({
      ...prev,
      newsletterSubscribers: [...prev.newsletterSubscribers, email]
    }));

    if (isSupabaseReal) {
      supabase.from('newsletter_subscribers').insert({ email }).then();
    }

    addAuditLog('Newsletter Subscription', `Subscribed email: ${email}`);
    return true;
  };

  return (
    <DatabaseContext.Provider
      value={{
        state,
        login,
        logout,
        updateCMS,
        updateSettings,
        addDonation,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        addCampaignUpdate,
        addCampaignTimeline,
        addCampaignComment,
        addStory,
        updateStory,
        deleteStory,
        likeStory,
        bookmarkStory,
        addStoryComment,
        addBlog,
        updateBlog,
        deleteBlog,
        applyVolunteer,
        approveVolunteerApplication,
        rejectVolunteerApplication,
        volunteerCheckIn,
        volunteerCheckOut,
        addVolunteerTask,
        updateVolunteerTaskStatus,
        updateUserProfile,
        addSupportTicket,
        replyToSupportTicket,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addNewsletterSubscriber,
        addAuditLog
      }}
    >
      {loaded ? children : <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
