'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MessageSquare, Send, CheckCircle2, MapPin, 
  Clock, Shield, Heart, FileText, ChevronRight, Share2, 
  Award, ShieldCheck, HelpCircle, Info, ExternalLink,
  Eye, Lock
} from 'lucide-react';

export default function ContactPage() {
  const { state, addSupportTicket, addNewsletterSubscriber } = useDatabase();
  const contactTitle = state.cms.hero.contactTitle || 'Need Help?';
  const contactSubtitle = state.cms.hero.contactSubtitle || 'Whether you have questions about donations, volunteering, partnerships, or transparency, our team is ready to assist.';
  const contactBg = state.cms.hero.contactBg || '';
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Donation Support');
  const [priority, setPriority] = useState('Medium');
  const [submitted, setSubmitted] = useState(false);

  // Newsletter states
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.currentUser) return alert('Kindly log in using the header Login Portal first to file support tickets.');
    if (!subject || !description) return;

    const combinedDesc = `[Category: ${category} | Priority: ${priority}] ${description}`;
    addSupportTicket(subject, combinedDesc);
    setSubmitted(true);
    setSubject('');
    setDescription('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeError('');
    const success = addNewsletterSubscriber(email);
    if (success) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      setSubscribeError('This email is already subscribed.');
    }
  };

  const contactCards = [
    { title: 'Call Support', detail: '+91 8630027341', actionText: 'Call Now', href: 'tel:+918630027341', icon: Phone, color: 'text-blue-600 bg-blue-50' },
    { title: 'WhatsApp Live', detail: 'Replies in 10 mins', actionText: 'Chat Now', href: 'https://wa.me/918630027341', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Email Desk', detail: 'hello@onehope.in', actionText: 'Email Us', href: 'mailto:hello@onehope.in', icon: Mail, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Visit Office', detail: 'Mayakund, Rishikesh', actionText: 'Get Directions', href: 'https://www.google.com/maps/search/?api=1&query=Mayakund+Triveni+Ghat+Rishikesh', icon: MapPin, color: 'text-red-600 bg-red-50' }
  ];

  const supportFaqs = [
    { q: 'Do you provide transaction receipts?', a: 'Yes, we provide itemized transaction receipts detailing ground materials and distributions. Once your contribution is processed, your receipt is automatically generated and can be downloaded from your Dashboard.' },
    { q: 'Can I volunteer virtually or is it on-site only?', a: 'We offer both options. Ground volunteers help prepare kits at our Rishikesh base, while digital volunteers assist with documentation, portal updates, and copywriting.' },
    { q: 'How do I trace my donation on the public ledger?', a: 'Every donation is assigned a transaction hash. You can search this hash on the Transparency page to view ground invoices, procurement details, and photo proof linked to your contribution.' },
    { q: 'What payment methods do you support?', a: 'We support international and local payments including UPI, Net Banking, Credit/Debit cards, and direct bank transfers managed securely via Razorpay.' },
    { q: 'Can I modify or cancel my recurring donation?', a: 'Yes. You can manage, pause, or adjust your monthly recurring donations anytime from your User Dashboard profile page.' },
    { q: 'Is the payment gateway secure?', a: 'Absolutely. All transactions are fully encrypted using 256-bit bank-grade keys processed through certified payment partners.' },
    { q: 'How quickly are relief materials dispatched?', a: 'Flash flood and emergency relief supplies are dispatched within 24 hours. General monthly kitchen sponsorships are distributed every morning.' },
    { q: 'Can we visit the Rishikesh base office?', a: 'Yes! We maintain an open-door policy at our headquarters in Mayakund near Triveni Ghat. You can visit us Monday to Saturday between 9 AM and 6 PM to review operational ledger logs.' }
  ];

  const trustBadges = [
    { title: 'Verified Platform', desc: 'Transparent ground welfare.', icon: ShieldCheck },
    { title: 'Public Ledger', desc: 'Every rupee accounted for.', icon: Eye },
    { title: 'Secure Payments', desc: 'Encrypted tokenized gateways.', icon: Lock },
    { title: 'Audited Reports', desc: 'Monthly transparency reviews.', icon: FileText }
  ];

  const socialChannels = [
    { name: 'Instagram', handle: '@onehope.in', href: 'https://instagram.com/onehope.in', icon: () => (
      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ), hoverColor: 'hover:text-[#E1306C] hover:border-[#E1306C]/25' },
    { name: 'YouTube', handle: '@onehopeindia', href: 'https://youtube.com/@onehopeindia', icon: () => (
      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ), hoverColor: 'hover:text-[#FF0000] hover:border-[#FF0000]/25' }
  ];

  return (
    <PublicLayout>
      <div className="bg-[#F8FBFF] font-inter select-none overflow-hidden pb-16 md:pb-0 text-[16px] text-[#1A202C]">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="relative flex items-center justify-center overflow-hidden bg-[#0A2540] text-white py-16 md:py-20 border-b border-[#E5EAF2]">
          {contactBg && (
            contactBg.includes('.mp4') || contactBg.includes('vimeo') || contactBg.includes('video') ? (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-20" key={contactBg}>
                <source src={contactBg} type="video/mp4" />
              </video>
            ) : (
              <img src={contactBg} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-20" key={contactBg} />
            )
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#1E63FF]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[#1E63FF] text-[10px] font-bold uppercase tracking-wider">
              <Clock size={12} className="text-[#1E63FF]" />
              <span>Support Desk Live</span>
            </span>

            <h1 className="text-[34px] md:text-5xl font-black font-poppins tracking-tight leading-tight text-white" style={{ color: '#FFFFFF' }}>
              {contactTitle}
            </h1>

            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
              {contactSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <a
                  href="https://wa.me/918630027341"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#1EAF53] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 h-12"
                >
                  <MessageSquare size={13} className="fill-white text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <a
                  href="tel:+918630027341"
                  className="px-6 py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 h-12 font-semibold transition-colors"
                >
                  <Phone size={13} />
                  <span>Call Now</span>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= 2. QUICK CONTACT CARDS ================= */}
        <section className="py-16 bg-white border-b border-[#E5EAF2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
                Direct Channels
              </span>
              <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight mb-2">
                Quick Contact
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {contactCards.map((card, idx) => (
                <motion.a
                  key={idx}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  whileHover={{ y: -4 }}
                  className="bg-white p-5 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between space-y-4 hover:shadow-lg transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center border border-slate-200/50 shrink-0`}>
                    <card.icon size={16} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-[18px] font-black text-[#0A2540] font-poppins leading-tight">{card.title}</h3>
                    <p className="text-[#667085] text-[13px] leading-normal font-semibold">{card.detail}</p>
                  </div>

                  <div className="text-[#1E63FF] text-[11px] font-bold uppercase tracking-wider flex items-center gap-0.5 pt-1.5 border-t border-slate-100 group-hover:text-[#0047AB]">
                    <span>{card.actionText}</span>
                    <ChevronRight size={12} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 3. OFFICE INFO vs SUPPORT FORM GRID ================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Office Details Card */}
              <div className="bg-white p-5.5 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-4">
                <div className="relative w-full h-[140px] rounded-xl overflow-hidden bg-slate-150">
                  <Image 
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600" 
                    alt="Rishikesh HQ"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[18px] font-black text-[#0A2540] font-poppins">Rishikesh Base Office</h3>
                  <p className="text-[#667085] text-[13px] leading-relaxed font-semibold">
                    Mayakund, near Triveni Ghat, Rishikesh, Uttarakhand, 249201, India.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold text-[#667085]">
                  <div className="flex justify-between">
                    <span>Monday–Saturday:</span>
                    <span className="text-[#0A2540] font-bold">9 AM – 6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-[#22C55E] font-bold">Emergency Only</span>
                  </div>
                </div>
              </div>

              {/* Response Time Indicator Card */}
              <div className="bg-white p-5.5 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-3.5">
                <h4 className="text-[13px] font-bold text-[#0A2540] uppercase tracking-wider border-b border-slate-100 pb-2">Response Benchmarks</h4>
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><MessageSquare size={13} className="text-emerald-500" /> WhatsApp Support:</span>
                    <span className="text-slate-500 font-bold">~10 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><FileText size={13} className="text-blue-500" /> Support Ticket:</span>
                    <span className="text-slate-500 font-bold">~12 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-indigo-500" /> Email Response:</span>
                    <span className="text-slate-500 font-bold">~24 hours</span>
                  </div>
                </div>
              </div>

              {/* Map Embed Card */}
              <div className="bg-white p-4 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-3">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.9230559388334!2d78.2937989!3d30.1250262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909162464b58e77%3A0xe5eb6c429074d2a1!2sTriveni%20Ghat%20Rishikesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="170" 
                  style={{ border: 0, borderRadius: '18px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Triveni+Ghat+Rishikesh"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#0A2540] border border-[#E5EAF2] rounded-[18px] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Open in Google Maps</span>
                </a>
              </div>

            </div>

            {/* Right Column: Support Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[24px] border border-[#E5EAF2] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between">
              
              <div className="space-y-4">
                <h3 className="text-[18px] font-black text-[#0A2540] font-poppins pb-3 border-b border-slate-100">
                  Create Support Ticket
                </h3>

                {submitted && (
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Support ticket successfully filed! Confirmation has been logged on the ledger.</span>
                  </div>
                )}

                {state.currentUser ? (
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Inquiry Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 border border-[#E5EAF2] rounded-[16px] text-xs font-bold text-[#0A2540] focus:outline-none"
                        >
                          <option>Donation Support</option>
                          <option>Volunteer Support</option>
                          <option>Technical Support</option>
                          <option>Partnership</option>
                          <option>General Questions</option>
                          <option>Emergency Relief</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Priority Level</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 border border-[#E5EAF2] rounded-[16px] text-xs font-bold text-[#0A2540] focus:outline-none"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Subject / Query Topic</label>
                      <input
                        type="text"
                        placeholder="e.g. Need monthly receipt duplicate copy"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-11 px-4 bg-slate-50 border border-[#E5EAF2] rounded-[16px] text-xs sm:text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Explain Inquiry Details</label>
                      <textarea
                        rows={5}
                        placeholder="Provide transactional hashes, monthly references, or detail questions so our coordinators can pull the receipts..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-[#E5EAF2] rounded-[16px] text-xs sm:text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-[#1E63FF] to-[#0047AB] hover:from-[#3575FF] hover:to-[#003C91] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 btn-ripple font-poppins"
                    >
                      <Send size={12} />
                      <span>Submit Support Ticket</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-12 text-center text-xs text-[#667085] bg-slate-50 rounded-[24px] border border-slate-100 flex flex-col justify-center items-center space-y-4">
                    <Info size={24} className="text-[#1E63FF]" />
                    <p className="max-w-md font-semibold leading-relaxed">
                      Please log in using the header **Login Portal** switcher at the top right to verify your identity and submit support tickets.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* ================= 4. TRUST SECTION ================= */}
        <section className="py-12 bg-[#F8FBFF] border-t border-b border-[#E5EAF2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3.5 bg-white p-4.5 rounded-[24px] border border-[#E5EAF2] shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF3FA] flex items-center justify-center text-[#1E63FF]">
                    <badge.icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A2540] text-xs font-poppins uppercase tracking-wider">{badge.title}</h4>
                    <p className="text-[#667085] text-[11px] font-semibold">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 5. FAQ ACCORDION ================= */}
        <section className="py-16 max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 font-inter space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[#1E63FF] text-xs font-bold uppercase tracking-widest block font-poppins">
              FAQ Portal
            </span>
            <h2 className="text-[28px] font-black text-[#0A2540] font-poppins tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {supportFaqs.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div 
                  key={index}
                  className="border border-[#E5EAF2] rounded-[24px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center text-slate-800 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#0A2540]">{faq.q}</span>
                    <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight size={16} />
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#667085] leading-relaxed border-t border-slate-100 pt-3.5 font-semibold">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 6. SOCIAL MEDIA CARDS ================= */}
        <section className="py-12 bg-white border-t border-b border-[#E5EAF2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h4 className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Follow Our Field Diaries
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {socialChannels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-4 bg-[#F8FBFF] border border-[#E5EAF2] rounded-[24px] flex items-center gap-3.5 transition-all duration-350 ${channel.hoverColor} group`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#667085] border border-[#E5EAF2] group-hover:text-current shrink-0">
                    <channel.icon />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0A2540] text-[13px]">{channel.name}</h5>
                    <p className="text-slate-400 text-[10px] font-semibold">{channel.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. NEWSLETTER SECTION ================= */}
        <section className="py-16 bg-white font-inter">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8 sm:p-10 bg-[#0A2540] text-white rounded-[24px] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#1E63FF]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-poppins text-white select-none">Stay Updated on Relief</h3>
                  <p className="text-slate-350 text-xs sm:text-[13px] font-semibold max-w-md mx-auto select-none">
                    Subscribe to receive verified reports, ledger updates, and photos direct from coordinates.
                  </p>
                </div>

                {subscribed ? (
                  <div className="p-4.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-[#22C55E] flex items-center justify-center gap-2 select-none">
                    <CheckCircle2 size={16} />
                    <span>Subscribed! Thank you for staying connected.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow h-12 px-4.5 bg-white/5 border border-white/15 rounded-[16px] text-xs sm:text-sm focus:outline-none text-white placeholder-slate-400 font-semibold"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-xs uppercase tracking-wider transition-colors shrink-0 font-poppins"
                    >
                      Subscribe
                    </button>
                  </form>
                )}

                {subscribeError && (
                  <p className="text-red-400 text-[11px] font-semibold mt-2">{subscribeError}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. NEED MORE HELP FOOTER CTA ================= */}
        <section className="relative bg-[#0A2540] text-white py-16 text-center overflow-hidden border-t border-[#0A2540]">
          {/* Subtle grid pattern background illustration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />
          
          <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-[28px] font-black font-poppins tracking-tight leading-tight text-white !text-white select-none">
              Need More Help?
            </h2>
            <p className="text-slate-350 text-xs sm:text-[13px] font-semibold max-w-md mx-auto select-none">
              Our support team is available via email, phone, or live chat. Reach out anytime.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 font-poppins text-xs font-bold uppercase tracking-wider">
              <a href="tel:+918630027341" className="flex items-center gap-1.5 hover:text-[#1E63FF] transition-colors">
                <Phone size={13} className="text-[#1E63FF]" />
                <span>Call Now</span>
              </a>
              <span className="text-white/20">•</span>
              <a href="https://wa.me/918630027341" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#22C55E] transition-colors">
                <MessageSquare size={13} className="text-[#22C55E] fill-current" />
                <span>WhatsApp Chat</span>
              </a>
              <span className="text-white/20">•</span>
              <a href="mailto:hello@onehope.in" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                <Mail size={13} className="text-indigo-400" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
