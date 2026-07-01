-- Enable JSONB support and disable RLS restrictions temporarily to let initial admin test connection
-- In production, RLS can be configured with open select and authenticated-only mutate permissions.

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS volunteer_tasks CASCADE;
DROP TABLE IF EXISTS volunteer_applications CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cms_configs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- 1. Users Table (handles profile information, badges, achievements)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'User',
  avatar TEXT,
  joinedDate TEXT NOT NULL,
  savedStories JSONB DEFAULT '[]'::jsonb,
  savedCampaigns JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  certificates JSONB DEFAULT '[]'::jsonb,
  volunteerStatus TEXT NOT NULL DEFAULT 'None',
  volunteerHours NUMERIC DEFAULT 0,
  volunteerPoints NUMERIC DEFAULT 0
);

-- 2. Campaigns Table
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  goalAmount NUMERIC NOT NULL,
  raisedAmount NUMERIC DEFAULT 0,
  image TEXT,
  summary TEXT,
  description TEXT,
  location TEXT,
  mapUrl TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  updates JSONB DEFAULT '[]'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  recentDonations JSONB DEFAULT '[]'::jsonb,
  volunteersCount INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  pricePerUnit NUMERIC,
  unitLabel TEXT,
  provides JSONB DEFAULT '[]'::jsonb,
  donationLevels JSONB DEFAULT '[]'::jsonb,
  sortOrder INTEGER DEFAULT 0
);

-- 3. Stories (Reels / Gallery / Videos)
CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  authorAvatar TEXT,
  media JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  category TEXT,
  likes INTEGER DEFAULT 0,
  likedBy JSONB DEFAULT '[]'::jsonb,
  bookmarks JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  date TEXT NOT NULL,
  campaignId TEXT
);

-- 4. Blogs Table
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  coverImage TEXT,
  author JSONB NOT NULL,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  readTime TEXT,
  date TEXT NOT NULL,
  published BOOLEAN DEFAULT false
);

-- 5. Donations & Transparency Ledger (Includes Audit/GPS columns)
CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  donorName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount NUMERIC NOT NULL,
  isAnonymous BOOLEAN DEFAULT false,
  campaignId TEXT,
  paymentMethod TEXT NOT NULL,
  date TEXT NOT NULL,
  isMonthly BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Success',
  receiptNumber TEXT NOT NULL,
  auditNotes TEXT,
  gpsUpload TEXT,
  receiptUpload TEXT,
  beforeImage TEXT,
  afterImage TEXT
);

-- 6. Volunteer Applications
CREATE TABLE volunteer_applications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  experience TEXT,
  identityDocUrl TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  appliedDate TEXT NOT NULL
);

-- 7. Volunteer Tasks
CREATE TABLE volunteer_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  campaignId TEXT,
  campaignTitle TEXT,
  status TEXT NOT NULL DEFAULT 'Assigned',
  hoursAssigned NUMERIC DEFAULT 0,
  date TEXT NOT NULL
);

-- 8. Attendance Records
CREATE TABLE attendance_records (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  checkIn TEXT NOT NULL,
  checkOut TEXT,
  hoursWorked NUMERIC
);

-- 9. Testimonials Table
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  avatar TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5
);

-- 10. FAQs Table
CREATE TABLE faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 11. Support Tickets
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  date TEXT NOT NULL,
  replies JSONB DEFAULT '[]'::jsonb
);

-- 12. Audit Logs Table
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  userName TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TEXT NOT NULL
);

-- 13. Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  email TEXT PRIMARY KEY
);

-- 14. CMS Configuration settings (Single Row Config)
CREATE TABLE cms_configs (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero JSONB NOT NULL,
  counters JSONB NOT NULL,
  transparency JSONB NOT NULL
);

-- 15. Site General Settings (Single Row Config)
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brandName TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  supportPhone TEXT,
  supportEmail TEXT,
  thanksEmail TEXT,
  socials JSONB NOT NULL,
  seo JSONB NOT NULL,
  navigation JSONB NOT NULL,
  footer JSONB NOT NULL
);

--------------------------------------------------------------------------------
-- SEED INITIAL DATA (MATCHING defaultData.ts)
--------------------------------------------------------------------------------

-- Seed Site Settings
INSERT INTO site_settings (id, brandName, tagline, logo, supportPhone, supportEmail, thanksEmail, socials, seo, navigation, footer) VALUES (
  'default',
  'OneHope',
  'Hope Starts With One.',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?auto=format&fit=crop&q=80&w=150',
  '+91 8630027341',
  'hello@onehope.in',
  'thanks@onehope.in',
  '{"instagram": "https://instagram.com/onehope.in", "youtube": "https://youtube.com/@onehopeindia", "facebook": "https://www.facebook.com/people/OneHope/61591051727841/", "whatsapp": "https://wa.me/918630027341"}'::jsonb,
  '{"metaTitle": "OneHope | Hope Starts With One", "metaDescription": "OneHope is an international-level humanitarian platform helping street children, families, and disaster zones with honesty, transparency, and dignity from Rishikesh, India.", "keywords": "Rishikesh charity, relief India, help children, emergency relief, transparent charity, become volunteer"}'::jsonb,
  '[{"label": "Home", "href": "/"}, {"label": "About Us", "href": "/about"}, {"label": "Campaigns", "href": "/campaigns"}, {"label": "Stories (Reels)", "href": "/stories"}, {"label": "Transparency", "href": "/transparency"}, {"label": "Blog", "href": "/blog"}, {"label": "Contact", "href": "/contact"}]'::jsonb,
  '[{"label": "About Us", "href": "/about"}, {"label": "Our Mission", "href": "/mission"}, {"label": "Our Impact", "href": "/impact"}, {"label": "Gallery", "href": "/gallery"}, {"label": "Videos", "href": "/videos"}, {"label": "Privacy Policy", "href": "/privacy"}, {"label": "Terms & Conditions", "href": "/terms"}, {"label": "Refund Policy", "href": "/refund"}, {"label": "Cookie Policy", "href": "/cookies"}]'::jsonb
);

-- Seed CMS Configurations
INSERT INTO cms_configs (id, hero, counters, transparency) VALUES (
  'default',
  '{"title": "Hope Starts With One.", "subtitle": "Welcome to OneHope, an international-level humanitarian platform dedicated to helping children, families, and communities with absolute transparency, integrity, and compassion.", "ctaDonateText": "Donate Now", "ctaVolunteerText": "Become Volunteer", "backgroundImage": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1800"}'::jsonb,
  '{"mealsServed": 124500, "childrenEducated": 4800, "medicalSupplies": 12500, "disasterResponded": 14}'::jsonb,
  '{"donationAllocation": [{"color": "#2563EB", "category": "Direct Program Relief", "percentage": 85}, {"color": "#22C55E", "category": "Program Deployment & Field Staff", "percentage": 9}, {"color": "#F59E0B", "category": "Administration & Governance", "percentage": 4}, {"color": "#EF4444", "category": "Fundraising & Technology Infrastructure", "percentage": 2}], "expenseBreakdown": [{"month": "Jan", "spent": 390000, "raised": 450000}, {"month": "Feb", "spent": 480000, "raised": 520000}, {"month": "Mar", "spent": 540000, "raised": 610000}, {"month": "Apr", "spent": 780000, "raised": 850000}, {"month": "May", "spent": 890000, "raised": 920000}, {"month": "Jun", "spent": 950000, "raised": 1100000}]}'::jsonb
);

-- Seed Seed Users
INSERT INTO users (id, name, email, phone, role, avatar, joinedDate, volunteerStatus, volunteerHours, volunteerPoints, achievements, certificates) VALUES 
('usr-1', 'Vipu Rishikesh', 'vipu@onehope.in', '+91 8630027341', 'Super Admin', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', '2026-01-01', 'Approved', 120, 1200, '[{"id": "ach-1", "date": "2026-01-01", "icon": "🌟", "title": "Founding Member"}, {"id": "ach-2", "date": "2026-01-01", "icon": "🔑", "title": "Super Admin Access"}]'::jsonb, '[]'::jsonb),
('usr-2', 'Aanya Sharma', 'aanya@gmail.com', NULL, 'Volunteer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', '2026-03-15', 'Approved', 54, 540, '[{"id": "ach-3", "date": "2026-03-20", "icon": "⏱️", "title": "First Check-in"}, {"id": "ach-4", "date": "2026-05-10", "icon": "🏆", "title": "50 Hours Served"}]'::jsonb, '[{"id": "cert-1", "pdfUrl": "#", "category": "Disaster Relief", "issueDate": "2026-05-12", "title": "Certified Field Responder"}]'::jsonb),
('usr-3', 'Rahul Verma', 'rahul@gmail.com', NULL, 'User', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', '2026-05-01', 'None', 0, 0, '[]'::jsonb, '[]'::jsonb);

-- Seed Campaigns
INSERT INTO campaigns (id, title, category, goalAmount, raisedAmount, image, summary, description, location, mapUrl, gallery, videos, updates, timeline, comments, recentDonations, volunteersCount, createdAt, status, pricePerUnit, unitLabel, provides, donationLevels, sortOrder) VALUES
('camp-1', 'Feed 50 Hungry Children Today', 'Food', 300000, 185000, 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200', 'Many children sleep hungry in Rishikesh. Your contribution helps provide freshly prepared nutritious meals and clean drinking water.', 'Many children in Rishikesh sleep hungry every day. Your contribution helps provide freshly prepared nutritious meals and clean drinking water.', 'Rishikesh, India', NULL, '["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id": "t-1", "date": "2026-06-01", "title": "Route Sourcing", "completed": true, "description": "Map out targeted slum nodes and schools near Triveni Ghat."}, {"id": "t-2", "date": "2026-06-15", "title": "Daily Sponsoring Live", "completed": true, "description": "Start meals distribution."}]'::jsonb, '[]'::jsonb, '[{"id": "d-1", "date": "2026-06-25", "amount": 500, "donorName": "Aakash Mehta", "isAnonymous": false}]'::jsonb, 12, '2026-06-01', 'Active', 100, 'child', '["Fresh cooked meal", "Rice or Roti", "Dal", "Seasonal Vegetable", "Fresh Fruit (when available)", "Safe Drinking Water Bottle", "Hygienic serving"]'::jsonb, '[]'::jsonb, 0),
('camp-2', 'Help Priya Continue Her Education', 'Education', 500000, 245000, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200', 'Many children cannot attend school because they lack basic educational supplies.', 'Many children cannot attend school because they lack basic educational supplies. Help sponsor essentials to keep them enrolled.', 'Rishikesh, India', NULL, '["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id": "t-3", "date": "2026-06-05", "title": "Logistics Setup", "completed": true, "description": "Procure bags, notebooks and geometry kits from suppliers."}, {"id": "t-4", "date": "2026-06-20", "title": "Field Distribution", "completed": true, "description": "Deliver study materials directly to students."}]'::jsonb, '[]'::jsonb, '[{"id": "d-2", "date": "2026-06-27", "amount": 1500, "donorName": "Dr. Gauri Sharma", "isAnonymous": false}]'::jsonb, 6, '2026-06-05', 'Active', 500, 'child', '["School Bag", "Notebooks", "Pens & Pencils", "Eraser", "Sharpener", "Geometry Box", "Water Bottle", "Educational Essentials"]'::jsonb, '[]'::jsonb, 1),
('camp-3', 'Support Mayakund Families with Ration Kits', 'Food', 800000, 410000, 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200', 'Help struggling families receive essential groceries for daily survival.', 'Help struggling families receive essential groceries for daily survival. Designed to support one family with essential groceries.', 'Rishikesh, India', NULL, '["https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[{"id": "t-5", "date": "2026-06-08", "title": "Wholesale Sourcing", "completed": true, "description": "Procure bulk grains, sugar, spices, and hygiene soaps."}]'::jsonb, '[]'::jsonb, '[]'::jsonb, 9, '2026-06-08', 'Active', 2500, 'family', '["Rice", "Wheat Flour (Atta)", "Dal", "Cooking Oil", "Salt", "Sugar", "Tea", "Basic Spices", "Biscuits for Children", "Soap & Hygiene Essentials"]'::jsonb, '[]'::jsonb, 2);

-- Seed Testimonials
INSERT INTO testimonials (id, name, role, avatar, quote, rating) VALUES
('test-1', 'Meera K.', 'Sponsor of Sonu, Rishikesh Base', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', 'Direct sponsoring is real. Sonu got his winter school uniform, and I received the delivery photo hash via email within 24 hours of payment.', 5),
('test-2', 'Vikram S.', 'Sponsor, Dehradun (Ganga Ghat Kitchen)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'The level of transparency here is unmatched. I can audit the direct vendor invoice matching my monthly grain sponsorship on the public database ledger.', 5),
('test-3', 'Preeti R.', 'Sponsor, Delhi (Family Ration Kits)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'Knowing that 100% of my donation is going directly to buy wheat and rice from local suppliers without middleman leakage is why I trust OneHope.', 5);

-- Seed FAQs
INSERT INTO faqs (id, question, answer, category) VALUES
('faq-1', 'Do I get a receipt for my donation?', 'Yes! Every contribution instantly generates a digital confirmation receipt showing the breakdown of materials or services sponsored on the ground in Rishikesh.', 'Donations'),
('faq-2', 'How do you verify where my money goes?', 'We post granular financial entries, audited expenses, monthly reports, and geo-tagged images of our distribution campaigns on our real-time Transparency Page.', 'Transparency'),
('faq-3', 'Can I volunteer offline in Rishikesh?', 'Absolutely! Rishikesh is our founding base. You can register through the "Become Volunteer" portal, undergo identity verification, and join our active field teams.', 'Volunteer');
