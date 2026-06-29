'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseState, UserProfile, Campaign, Story, Blog, Donation, VolunteerApplication, VolunteerTask, AttendanceRecord, Testimonial, FAQ, SupportTicket, AuditLog, SiteSettings, UserRole } from '../types';
import { initialDatabaseState } from '../database/defaultData';

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

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DatabaseState>(initialDatabaseState);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('onehope_db');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Self-healing migration check for new campaigns structure
        const needsUpgrade = !parsed.campaigns || parsed.campaigns.length !== 7 || !parsed.campaigns[0].pricePerUnit;
        if (needsUpgrade) {
          parsed.campaigns = initialDatabaseState.campaigns;
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
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('onehope_db', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save local DB', e);
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
  };

  const login = (email: string, role?: UserRole) => {
    // Basic dynamic simulator
    const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updatedUser = role ? { ...existing, role } : existing;
      setState(prev => ({
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === existing.id ? updatedUser : u)
      }));
      addAuditLog('User Login', `Logged in as ${email} (${updatedUser.role})`);
      return true;
    } else {
      // Create new user on the fly
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

    setState(prev => {
      // 1. Add to donation history
      const donations = [newDon, ...prev.donations];
      
      // 2. Update campaigns raised amount
      let campaigns = prev.campaigns;
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
            return {
              ...c,
              raisedAmount: c.raisedAmount + donation.amount,
              recentDonations: recent
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        donations,
        campaigns
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
    addAuditLog('Campaign Created', `Created campaign: ${campaign.title}`);
  };

  const updateCampaign = (campaign: Campaign) => {
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => c.id === campaign.id ? campaign : c)
    }));
    addAuditLog('Campaign Updated', `Updated campaign: ${campaign.title}`);
  };

  const deleteCampaign = (id: string) => {
    const name = state.campaigns.find(c => c.id === id)?.title || id;
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.filter(c => c.id !== id)
    }));
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
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            updates: [newUpdate, ...c.updates]
          };
        }
        return c;
      })
    }));
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
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            timeline: [...c.timeline, newTimeline]
          };
        }
        return c;
      })
    }));
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
    setState(prev => ({
      ...prev,
      campaigns: prev.campaigns.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            comments: [newComment, ...c.comments]
          };
        }
        return c;
      })
    }));
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
    addAuditLog('Story Created', `Created reels story: ${story.title}`);
  };

  const updateStory = (story: Story) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(s => s.id === story.id ? story : s)
    }));
  };

  const deleteStory = (id: string) => {
    setState(prev => ({
      ...prev,
      stories: prev.stories.filter(s => s.id !== id)
    }));
  };

  const likeStory = (storyId: string) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(s => {
        if (s.id === storyId) {
          const hasLiked = s.likedBy.includes(userId);
          const likedBy = hasLiked ? s.likedBy.filter(id => id !== userId) : [...s.likedBy, userId];
          return {
            ...s,
            likes: hasLiked ? s.likes - 1 : s.likes + 1,
            likedBy
          };
        }
        return s;
      })
    }));
  };

  const bookmarkStory = (storyId: string) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;
    setState(prev => {
      const isBookmarked = state.currentUser?.savedStories.includes(storyId);
      const savedStories = isBookmarked
        ? prev.currentUser!.savedStories.filter(id => id !== storyId)
        : [...prev.currentUser!.savedStories, storyId];
      const updatedUser = { ...prev.currentUser!, savedStories };

      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === userId ? updatedUser : u),
        stories: prev.stories.map(s => {
          if (s.id === storyId) {
            const bookmarks = s.bookmarks.includes(userId)
              ? s.bookmarks.filter(id => id !== userId)
              : [...s.bookmarks, userId];
            return { ...s, bookmarks };
          }
          return s;
        })
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
    setState(prev => ({
      ...prev,
      stories: prev.stories.map(s => {
        if (s.id === storyId) {
          return { ...s, comments: [newComment, ...s.comments] };
        }
        return s;
      })
    }));
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
    addAuditLog('Blog Added', `Created blog article: ${blog.title}`);
  };

  const updateBlog = (blog: Blog) => {
    setState(prev => ({
      ...prev,
      blogs: prev.blogs.map(b => b.id === blog.id ? blog : b)
    }));
    addAuditLog('Blog Updated', `Updated blog: ${blog.title}`);
  };

  const deleteBlog = (id: string) => {
    setState(prev => ({
      ...prev,
      blogs: prev.blogs.filter(b => b.id !== id)
    }));
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
          return { ...u, volunteerStatus: 'Approved' as const, role: 'Volunteer' as UserRole };
        }
        return u;
      });
      const currentUser = prev.currentUser && prev.currentUser.id === app.userId
        ? { ...prev.currentUser, volunteerStatus: 'Approved' as const, role: 'Volunteer' as UserRole }
        : prev.currentUser;

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
          return { ...u, volunteerStatus: 'Rejected' as const };
        }
        return u;
      });
      const currentUser = prev.currentUser && prev.currentUser.id === app.userId
        ? { ...prev.currentUser, volunteerStatus: 'Rejected' as const }
        : prev.currentUser;

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
  };

  const updateVolunteerTaskStatus = (taskId: string, status: 'Assigned' | 'In Progress' | 'Completed') => {
    setState(prev => ({
      ...prev,
      volunteerTasks: prev.volunteerTasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;

    setState(prev => {
      const updatedUser = { ...prev.currentUser!, ...profile };
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
    addAuditLog('Ticket Created', `Opened support ticket: ${subject}`);
  };

  const replyToSupportTicket = (ticketId: string, text: string, sender: string) => {
    const reply = {
      sender,
      text,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
    setState(prev => ({
      ...prev,
      supportTickets: prev.supportTickets.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            replies: [...t.replies, reply],
            status: sender === 'Admin' ? ('In Progress' as const) : ('Open' as const)
          };
        }
        return t;
      })
    }));
  };

  const addFAQ = (faq: Omit<FAQ, 'id'>) => {
    const newFaq = { ...faq, id: `faq-${Date.now()}` };
    setState(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
  };

  const updateFAQ = (faq: FAQ) => {
    setState(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === faq.id ? faq : f)
    }));
  };

  const deleteFAQ = (id: string) => {
    setState(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }));
  };

  const addTestimonial = (test: Omit<Testimonial, 'id'>) => {
    const newTest = { ...test, id: `test-${Date.now()}` };
    setState(prev => ({ ...prev, testimonials: [...prev.testimonials, newTest] }));
  };

  const updateTestimonial = (test: Testimonial) => {
    setState(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === test.id ? test : t)
    }));
  };

  const deleteTestimonial = (id: string) => {
    setState(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
  };

  const addNewsletterSubscriber = (email: string) => {
    if (state.newsletterSubscribers.includes(email)) return false;
    setState(prev => ({
      ...prev,
      newsletterSubscribers: [...prev.newsletterSubscribers, email]
    }));
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
