export type UserRole = 'Guest' | 'User' | 'Volunteer' | 'Moderator' | 'Admin' | 'Super Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  savedStories: string[]; // storyIds
  savedCampaigns: string[]; // campaignIds
  achievements: { id: string; title: string; icon: string; date: string }[];
  certificates: { id: string; title: string; category: string; issueDate: string; pdfUrl: string }[];
  volunteerStatus: 'None' | 'Pending' | 'Approved' | 'Rejected';
  volunteerHours: number;
  volunteerPoints: number;
}

export interface CampaignCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export interface CampaignTimeline {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface RecentDonation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  isAnonymous: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  category: 'Food' | 'Education' | 'Medical' | 'Disaster Relief' | 'Children' | 'Women' | 'Animals' | 'Environment' | 'Emergency';
  goalAmount: number;
  raisedAmount: number;
  image: string;
  description: string;
  summary: string;
  location: string;
  mapUrl?: string;
  gallery: string[];
  videos: string[];
  updates: CampaignUpdate[];
  timeline: CampaignTimeline[];
  comments: Comment[];
  recentDonations: RecentDonation[];
  volunteersCount: number;
  createdAt: string;
  status: 'Active' | 'Completed' | 'Draft';
  pricePerUnit?: number;
  unitLabel?: string;
  provides?: string[];
  donationLevels?: { amount: number; label: string; includes?: string[] }[];
}

export interface StoryMedia {
  url: string;
  type: 'image' | 'video';
}

export interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  media: StoryMedia[];
  description: string;
  category: string;
  likes: number;
  likedBy: string[]; // userIds
  bookmarks: string[]; // userIds
  comments: Comment[];
  location: string;
  date: string;
  campaignId?: string; // Optional related campaign
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: { name: string; avatar: string; bio: string };
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  published: boolean;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  isAnonymous: boolean;
  campaignId?: string; // empty means general donation
  paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'Bank Transfer';
  date: string;
  isMonthly: boolean;
  status: 'Success' | 'Pending' | 'Failed';
  receiptNumber: string;
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  identityDocUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  campaignId: string;
  campaignTitle: string;
  status: 'Assigned' | 'Completed' | 'In Progress';
  hoursAssigned: number;
  date: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  date: string;
  replies: { sender: string; text: string; date: string }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

// Visual CMS Configuration Settings
export interface HeroCMS {
  title: string;
  subtitle: string;
  ctaDonateText: string;
  ctaVolunteerText: string;
  backgroundImage: string;
  [key: string]: any;
}

export interface CounterCMS {
  mealsServed: number;
  childrenEducated: number;
  medicalSupplies: number;
  disasterResponded: number;
}

export interface TransparencyCMS {
  donationAllocation: { category: string; percentage: number; color: string }[];
  expenseBreakdown: { month: string; raised: number; spent: number }[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logo: string;
  supportPhone: string;
  supportEmail: string;
  thanksEmail: string;
  socials: {
    instagram: string;
    youtube: string;
    facebook: string;
    whatsapp: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  navigation: { label: string; href: string }[];
  footer: { label: string; href: string }[];
}

export interface DatabaseState {
  users: UserProfile[];
  currentUser: UserProfile | null;
  campaigns: Campaign[];
  stories: Story[];
  blogs: Blog[];
  donations: Donation[];
  volunteerApplications: VolunteerApplication[];
  volunteerTasks: VolunteerTask[];
  attendance: AttendanceRecord[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  newsletterSubscribers: string[];
  cms: {
    hero: HeroCMS;
    counters: CounterCMS;
    transparency: TransparencyCMS;
  };
  settings: SiteSettings;
}
