'use client';

import React, { useState, useEffect, use } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, MapPin, Users, Calendar, AlertCircle, Share2, 
  MessageSquare, Clock, ArrowLeft, Send, CheckCircle2 
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetails({ params }: PageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { state, addCampaignComment } = useDatabase();
  
  const campaign = state.campaigns.find(c => c.id === id);

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  // Donation calculator states
  const [quantity, setQuantity] = useState<number>(5);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');

  useEffect(() => {
    if (!campaign) return;
    if (campaign.id === 'camp-1') setQuantity(5);
    else if (campaign.id === 'camp-2') setQuantity(2);
    else if (campaign.id === 'camp-3') setQuantity(1);
    else if (campaign.id === 'camp-4') setQuantity(2);
    else if (campaign.id === 'camp-5') setQuantity(10);
    else setQuantity(1);
  }, [campaign]);

  if (!campaign) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-24 text-center space-y-4 font-inter">
          <AlertCircle size={40} className="text-red-500 mx-auto" />
          <h2 className="text-xl font-bold font-poppins text-[#0A2540]">Campaign not found</h2>
          <p className="text-slate-550 text-xs">The requested campaign reference ID does not exist.</p>
          <Link href="/campaigns" className="inline-block py-2.5 px-6 bg-[#0047AB] text-white font-bold rounded-xl text-xs">
            Back to Campaigns
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const percent = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/campaigns/${campaign.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.currentUser) return alert('Kindly log in to post comments.');
    if (!commentText.trim()) return;

    addCampaignComment(campaign.id, commentText);
    setCommentText('');
  };

  const getCalculatorAmount = () => {
    if (campaign.pricePerUnit) {
      return campaign.pricePerUnit * quantity;
    }
    if (campaign.donationLevels) {
      const base = campaign.donationLevels[selectedLevelIndex]?.amount || 0;
      return base * quantity;
    }
    return 0;
  };

  const getFinalAmount = () => {
    if (customAmount) {
      const parsed = parseInt(customAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return getCalculatorAmount();
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 font-inter bg-white">
        
        {/* Back Link */}
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB] mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to Campaigns</span>
        </Link>

        {/* Top Grid: Media vs Action Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Media & Story (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Image */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg bg-slate-50">
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                sizes="(max-w-7xl) 66vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Campaign Identity info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="px-3 py-1 bg-blue-50 text-[#0047AB] rounded-lg">{campaign.category}</span>
                <span className="flex items-center gap-1 text-[#0A2540]/60"><MapPin size={12} /> {campaign.location}</span>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg">📍 Currently Serving Rishikesh</span>
                <span className="flex items-center gap-1 text-[#0A2540]/60"><Clock size={12} /> Created: {campaign.createdAt}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black font-poppins text-[#0A2540] tracking-tight leading-tight">
                {campaign.title}
              </h1>
            </div>

            {/* Gallery Section */}
            {campaign.gallery.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#0A2540] text-base font-poppins">Field Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                  {campaign.gallery.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                      <Image src={img} alt={`Gallery ${index}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Story Description */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-base font-poppins">About Campaign</h3>
              <p className="text-slate-550 text-sm sm:text-base leading-relaxed font-medium">
                {campaign.description}
              </p>
            </div>

            {/* What Your Donation Provides (Checklist Section) */}
            {campaign.provides && campaign.provides.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-[#0A2540] text-base font-poppins">What Your Donation Provides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {campaign.provides.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Transparency Section */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-base font-poppins">Delivery Transparency & Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#1E63FF] block">Verified Delivery Log</span>
                  <p className="text-xs text-slate-600 leading-normal font-semibold">
                    Every rupee spent is tracked. We upload copies of purchasing invoices, transport logs, and distribution photos directly to the public disclosure ledger.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#22C55E] block">Weekly Progress Audits</span>
                  <p className="text-xs text-slate-600 leading-normal font-semibold">
                    Our ground coordinators in Rishikesh submit weekly execution logs, audit receipts, and field reports detailing beneficiaries and items delivered.
                  </p>
                </div>
              </div>
            </div>

            {/* Updates Timeline */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-base font-poppins">Updates Timeline</h3>
              
              {campaign.updates.length === 0 ? (
                <p className="text-slate-400 text-xs italic font-medium">No operational updates posted yet. Updates will appear as the field campaigns execute.</p>
              ) : (
                <div className="space-y-6">
                  {campaign.updates.map((up) => (
                    <div key={up.id} className="relative pl-6 border-l-2 border-[#0047AB] space-y-2">
                      <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#0047AB]" />
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="font-bold text-[#0A2540]">{up.title}</span>
                        <span className="font-semibold">{up.date}</span>
                      </div>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{up.content}</p>
                      {up.image && (
                        <div className="relative aspect-video max-w-sm rounded-2xl overflow-hidden border border-slate-100 mt-2">
                          <Image src={up.image} alt={up.title} fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Integration */}
            {campaign.mapUrl && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-[#0A2540] text-base font-poppins">Relief Target Location</h3>
                <div className="w-full h-64 rounded-3xl overflow-hidden border border-slate-100 relative bg-slate-50">
                  <iframe
                    src={campaign.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Campaign Location"
                  />
                </div>
              </div>
            )}

            {/* Comments Feed */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-base font-poppins flex items-center gap-1.5">
                <MessageSquare size={18} className="text-[#0047AB]" />
                <span>Comments ({campaign.comments.length})</span>
              </h3>

              {state.currentUser ? (
                <form onSubmit={handlePostComment} className="flex gap-3 items-end">
                  <input
                    type="text"
                    placeholder="Write a message of support..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0047AB] focus:border-[#0047AB] rounded-xl text-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    className="p-3.5 bg-[#0047AB] hover:bg-[#003C91] text-white rounded-xl"
                    title="Send Comment"
                  >
                    <Send size={14} />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-center text-slate-500 font-semibold">
                  Please log in using the header Login Portal to post support messages.
                </div>
              )}

              <div className="space-y-4">
                {campaign.comments.map((comm) => (
                  <div key={comm.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                      <Image src={comm.userAvatar} alt={comm.userName} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-slate-400 gap-2">
                        <span className="font-bold text-[#0A2540]">{comm.userName}</span>
                        <span className="font-medium">{comm.date}</span>
                      </div>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{comm.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Widget (Right Column) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-6 text-left">
              
              {/* Target progress tracker */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Donations Status</span>
                
                <div className="flex justify-between items-end text-sm font-extrabold text-[#0A2540]">
                  <span>₹{campaign.raisedAmount.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs font-semibold">Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#1E63FF] rounded-full relative"
                    style={{ width: `${percent}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#22C55E]" />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-450 pt-1 font-semibold">
                  <span>{percent}% Completed</span>
                  <span className="font-bold text-[#0A2540]">{campaign.recentDonations.length + 12} transactions</span>
                </div>
              </div>

              {/* Dynamic Impact Calculator Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Donation Setup</span>

                {/* Option 1: Impact Calculator / Packages */}
                {campaign.pricePerUnit && (
                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-poppins">Option 1: Impact Calculator</span>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Quantity ({campaign.unitLabel}s):</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-7 h-7 bg-white hover:bg-slate-100 text-[#0A2540] border border-slate-200 font-bold rounded-lg flex items-center justify-center text-xs select-none"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-sm w-5 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="w-7 h-7 bg-white hover:bg-slate-100 text-[#0A2540] border border-slate-200 font-bold rounded-lg flex items-center justify-center text-xs select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px] font-bold text-[#0A2540]">
                      <span>Stepper Total:</span>
                      <span className="text-[#22C55E]">₹{campaign.pricePerUnit * quantity}</span>
                    </div>
                  </div>
                )}

                {campaign.donationLevels && (
                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-poppins">Option 1: Packages</span>
                    <div className="space-y-1.5">
                      {campaign.donationLevels.map((lvl, index) => {
                        const isLvlSelected = selectedLevelIndex === index;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => { setSelectedLevelIndex(index); setCustomAmount(''); }}
                            className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                              isLvlSelected 
                                ? 'bg-[#1E63FF] border-[#1E63FF] text-white shadow-sm' 
                                : 'bg-white border-slate-200 text-[#0A2540] hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider">{lvl.label}</span>
                            <span className="font-extrabold text-xs">₹{lvl.amount.toLocaleString()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Option 2: Custom Amount */}
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-poppins font-semibold">Option 2: Custom Amount</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full h-8 pl-6 pr-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total computation display */}
                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                  <span className="text-[#0A2540]">Final Amount:</span>
                  <span className="text-[#22C55E] text-base font-black">₹{getFinalAmount().toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Link
                  href={{ pathname: '/donate', query: { campaignId: campaign.id, amount: getFinalAmount() } }}
                  className="w-full h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 transition-colors font-poppins"
                >
                  <Heart size={13} className="fill-white text-[#1E63FF]" />
                  <span>Donate to Campaign</span>
                </Link>

                <button
                  onClick={handleShare}
                  className="w-full h-11 border border-slate-200 hover:border-[#0A2540] hover:bg-slate-50 text-[#0A2540] font-bold rounded-[18px] text-xs flex items-center justify-center gap-1.5 transition-all select-none"
                >
                  <Share2 size={13} />
                  <span>{copied ? 'Link Copied!' : 'Share Campaign'}</span>
                </button>
              </div>

              {/* Active volunteers list badge */}
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2ECC71] flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div>
                  <p className="font-bold text-[#0A2540]">{campaign.volunteersCount} Active Volunteers</p>
                  <p className="text-slate-450 text-[10px] mt-0.5 font-medium">Assigned to field packaging & distribution</p>
                </div>
              </div>
            </div>

            {/* Recent Donations list widget */}
            <div className="bg-white border border-[#E5EAF2] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] space-y-4">
              <h3 className="font-bold text-[#0A2540] text-sm font-poppins">Recent Donations</h3>
              
              {campaign.recentDonations.length === 0 ? (
                <p className="text-slate-450 text-xs italic font-semibold">Be the first to back this campaign!</p>
              ) : (
                <div className="space-y-3.5 text-left">
                  {campaign.recentDonations.map((don) => (
                    <div key={don.id} className="flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0A2540]">
                          {don.isAnonymous ? 'Anonymous' : don.donorName}
                        </span>
                        <span className="text-slate-450 block text-[10px] font-semibold">{don.date}</span>
                      </div>
                      <span className="font-extrabold text-[#0A2540]">₹{don.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </PublicLayout>
  );
}
