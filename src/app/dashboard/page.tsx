'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { User, Heart, Clock, Award, ShieldCheck, Download, Mail, Phone, MessageSquare, Send, CheckCircle2, Moon, Sun, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { state, volunteerCheckIn, volunteerCheckOut, replyToSupportTicket, updateUserProfile } = useDatabase();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Donations' | 'Volunteering' | 'Tickets' | 'Saved' | 'Settings'>('Overview');

  // Form states
  const [profileName, setProfileName] = useState(state.currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(state.currentUser?.phone || '');
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  if (!state.currentUser) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-24 text-center space-y-4 font-inter">
          <span className="text-4xl">🔑</span>
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-slate-500 text-xs">Kindly log in using the header **Login Portal** switcher to access your dashboard.</p>
        </div>
      </PublicLayout>
    );
  }

  const user = state.currentUser;

  // Filter donor transactions
  const userDonations = state.donations.filter(d => d.email.toLowerCase() === user.email.toLowerCase());

  // Filter volunteer records
  const userAttendance = state.attendance.filter(a => a.userId === user.id);
  const activeCheckIn = state.attendance.find(a => a.userId === user.id && !a.checkOut);

  // Tickets
  const userTickets = state.supportTickets.filter(t => t.userId === user.id);

  // Saved Stories
  const savedStories = state.stories.filter(s => user.savedStories.includes(s.id));
  const savedCampaigns = state.campaigns.filter(c => user.savedCampaigns.includes(c.id));

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: profileName, phone: profilePhone });
    alert('Profile updated successfully!');
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReplyText.trim()) return;
    replyToSupportTicket(selectedTicketId, ticketReplyText, 'User');
    setTicketReplyText('');
  };

  const handleDownloadReceipt = (don: any) => {
    // Generate simulated dynamic print PDF window
    const htmlContent = `
      <html>
        <head>
          <title>Receipt - ${don.receiptNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
            .content { margin-top: 30px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>OneHope Confirmation Receipt</h2>
            <p>Verification Ref: ${don.receiptNumber}</p>
          </div>
          <div class="content">
            <div class="row"><strong>Donor:</strong> <span>${don.donorName}</span></div>
            <div class="row"><strong>Amount:</strong> <span>₹${don.amount.toLocaleString()}</span></div>
            <div class="row"><strong>Date:</strong> <span>${don.date}</span></div>
            <div class="row"><strong>Channel:</strong> <span>${don.paymentMethod}</span></div>
            <div class="row"><strong>Receipt Status:</strong> <span>Verified Ground Contribution (100% Sourced)</span></div>
          </div>
          <div class="footer">Thank you for supporting Rishikesh field operations.</div>
        </body>
      </html>
    `;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.print();
    }
  };

  return (
    <PublicLayout>
      <div className="bg-[#091E3A] min-h-screen text-slate-100 font-inter py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Profile Card Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 text-left">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#60A5FA]" style={{ backgroundColor: 'rgba(0, 71, 171, 0.2)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                  {user.role === 'Volunteer' ? 'VOLUNTEER PORTAL' : 'MEMBER PORTAL'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-poppins text-white mt-1.5" style={{ color: '#FFFFFF' }}>
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs font-semibold text-slate-300" style={{ color: '#E2E8F0' }}>{user.email} • Joined {user.joinedDate}</p>
              </div>
            </div>
            
            {/* Points display */}
            <div className="flex gap-4 text-center">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl min-w-[120px]">
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Volunteer Hours</span>
                <span className="text-lg font-bold text-white block mt-0.5" style={{ color: '#FFFFFF' }}>{user.volunteerHours} hrs</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl min-w-[120px]">
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Compassion Points</span>
                <span className="text-lg font-bold text-white block mt-0.5" style={{ color: '#FFFFFF' }}>{user.volunteerPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Dashboard grid columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tabs Menu (Left Column) */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-1">
              {(['Overview', 'Donations', 'Volunteering', 'Tickets', 'Saved', 'Settings'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedTicketId(null);
                    }}
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
                    <span>{tab} Portal</span>
                    <span className="text-[10px] font-bold opacity-50">→</span>
                  </button>
                );
              })}
            </div>

            {/* Core Content slot (Right Column) */}
            <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg min-h-[400px] text-slate-100">
            
            {/* 1. OVERVIEW PORTAL */}
            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Dashboard Summary</h3>
                  <p className="text-slate-500 text-xs">A snapshot of your activity logs, savings and certificates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                    <span className="text-slate-400 text-xs font-bold block">SAVED STORIES</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-poppins">{user.savedStories.length} Items</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                    <span className="text-slate-400 text-xs font-bold block">AUDITED DONATIONS</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-poppins">{userDonations.length} Logs</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
                    <span className="text-slate-400 text-xs font-bold block">OPEN TICKETS</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white font-poppins">{userTickets.filter(t=>t.status!=='Closed').length} Tickets</p>
                  </div>
                </div>

                {/* Achievements block */}
                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">Earned Badges & Achievements</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {user.achievements.map(ach => (
                      <div key={ach.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center border border-slate-100 dark:border-slate-850 space-y-1">
                        <span className="text-3xl block">{ach.icon}</span>
                        <span className="block text-xs font-bold text-slate-850 dark:text-white font-poppins">{ach.title}</span>
                        <span className="block text-[9px] text-slate-450">{ach.date}</span>
                      </div>
                    ))}
                    {user.achievements.length === 0 && (
                      <p className="text-xs text-slate-400 italic col-span-4">Complete volunteer tasks or check-ins to receive badges.</p>
                    )}
                  </div>
                </div>

                {/* Certificates Block */}
                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">Verified Certificates</h4>
                  <div className="space-y-2">
                    {user.certificates.map(cert => (
                      <div key={cert.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white font-poppins block">{cert.title}</span>
                          <span className="text-slate-400 text-[10px] mt-0.5">{cert.category} • Issued {cert.issueDate}</span>
                        </div>
                        <button
                          onClick={() => alert(`Simulating certificate PDF download: ${cert.title}`)}
                          className="p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-500 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                    {user.certificates.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No certificates issued yet. Complete 50+ volunteer hours to qualify.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DONATIONS PORTAL */}
            {activeTab === 'Donations' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Donation Transaction History</h3>
                  <p className="text-slate-500 text-xs">List of audited payments. Click receipt icon to compile PDF receipts.</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-100 dark:border-slate-850">
                        <th className="p-4">Receipt</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                      {userDonations.map(don => (
                        <tr key={don.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-mono font-bold text-blue-600">{don.receiptNumber}</td>
                          <td className="p-4 text-slate-400">{don.date}</td>
                          <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">{don.paymentMethod}</span></td>
                          <td className="p-4 font-bold">₹{don.amount.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDownloadReceipt(don)}
                              className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 rounded-lg"
                              title="Download PDF"
                            >
                              <Download size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {userDonations.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-slate-400 italic">No donations registered under this email.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. VOLUNTEERING PORTAL */}
            {activeTab === 'Volunteering' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Volunteer Status & Controls</h3>
                  <p className="text-slate-500 text-xs">Clock in and check out at Rishikesh campaign sites.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 text-center space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-450 block">Status:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      user.volunteerStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      user.volunteerStatus === 'Pending' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.volunteerStatus}
                    </span>
                  </div>

                  {user.volunteerStatus === 'Approved' ? (
                    <div className="space-y-4 pt-2">
                      <p className="text-slate-500 text-xs">
                        Use the buttons below to log hours at distribution points.
                      </p>
                      
                      <div className="flex justify-center gap-4">
                        {activeCheckIn ? (
                          <div className="space-y-3">
                            <p className="text-xs text-blue-600 font-bold animate-pulse-slow">
                              ⏱️ Active Check-In logged at {activeCheckIn.checkIn}
                            </p>
                            <button
                              onClick={volunteerCheckOut}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
                            >
                              Check Out (End Tasks)
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={volunteerCheckIn}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                          >
                            Check In (Start Tasks)
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2 text-xs text-slate-500">
                      <p>Volunteer check-ins and dashboards unlock once your application status changes to **Approved**.</p>
                      {user.volunteerStatus === 'None' && (
                        <Link href="/volunteer" className="inline-block py-2 px-4 bg-blue-600 text-white font-bold rounded-lg mt-2">
                          Apply to Volunteer
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Volunteer attendance lists */}
                {user.volunteerStatus === 'Approved' && (
                  <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">Recent Attendance Logs</h4>
                    <div className="space-y-2">
                      {userAttendance.map(record => (
                        <div key={record.id} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs text-slate-500">
                          <span>Date: <strong>{record.date}</strong></span>
                          <span>In: <strong>{record.checkIn}</strong></span>
                          <span>Out: <strong>{record.checkOut || 'Active'}</strong></span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">+{record.hoursWorked || 0} hrs</span>
                        </div>
                      ))}
                      {userAttendance.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No attendance records found yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. SUPPORT TICKETS PORTAL */}
            {activeTab === 'Tickets' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Inquiries & Tickets</h3>
                  <p className="text-slate-500 text-xs">Verify ticket progress or reply to message threads.</p>
                </div>

                {selectedTicketId ? (
                  // Single Ticket Thread
                  (() => {
                    const ticket = state.supportTickets.find(t => t.id === selectedTicketId);
                    if (!ticket) return null;
                    return (
                      <div className="space-y-4">
                        <button
                          onClick={() => setSelectedTicketId(null)}
                          className="text-xs font-semibold text-blue-600"
                        >
                          ← Back to Tickets
                        </button>
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900 dark:text-white">{ticket.subject}</span>
                            <span className="font-mono text-slate-400">{ticket.date}</span>
                          </div>
                          <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{ticket.description}</p>
                        </div>

                        {/* Thread message replies */}
                        <div className="space-y-3 pt-2">
                          {ticket.replies.map((rep, idx) => (
                            <div key={idx} className={`p-4 rounded-xl text-xs flex gap-3 max-w-[85%] ${
                              rep.sender === 'Admin' ? 'bg-blue-50/50 text-blue-700 ml-auto border border-blue-100' : 'bg-slate-100 text-slate-700'
                            }`}>
                              <div>
                                <span className="font-bold block">{rep.sender}</span>
                                <p className="leading-relaxed mt-0.5">{rep.text}</p>
                                <span className="block text-[8px] text-slate-400 mt-1">{rep.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleReplyTicket} className="flex gap-2 pt-3 border-t border-slate-50 dark:border-slate-850">
                          <input
                            type="text"
                            placeholder="Type message reply..."
                            value={ticketReplyText}
                            onChange={(e) => setTicketReplyText(e.target.value)}
                            className="flex-grow px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                            required
                          />
                          <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-xl">
                            <Send size={12} />
                          </button>
                        </form>
                      </div>
                    );
                  })()
                ) : (
                  // Tickets List
                  <div className="space-y-3">
                    {userTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-850 cursor-pointer transition-all flex justify-between items-center text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white block font-poppins">{ticket.subject}</span>
                          <span className="text-slate-400 text-[10px]">Opened: {ticket.date} • {ticket.replies.length} replies</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ticket.status === 'Open' ? 'bg-blue-50 text-blue-600' :
                          ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-650'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                    {userTickets.length === 0 && (
                      <p className="text-xs text-slate-450 italic text-center py-10">No support tickets created yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. SAVED PORTAL */}
            {activeTab === 'Saved' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Saved Stories & Campaigns</h3>
                  <p className="text-slate-500 text-xs">Bookmark ledger items for updates followups.</p>
                </div>

                {/* Campaigns Grid */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">Saved Campaigns ({savedCampaigns.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCampaigns.map(camp => (
                      <div key={camp.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block font-poppins line-clamp-1">{camp.title}</span>
                          <span className="text-slate-450 block mt-0.5">{camp.category}</span>
                        </div>
                        <Link href={`/campaigns/${camp.id}`} className="text-blue-500 font-bold hover:underline">Sponsor</Link>
                      </div>
                    ))}
                    {savedCampaigns.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No saved campaigns.</p>
                    )}
                  </div>
                </div>

                {/* Stories Grid */}
                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">Saved Reels Stories ({savedStories.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedStories.map(story => (
                      <div key={story.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block font-poppins line-clamp-1">{story.title}</span>
                          <span className="text-slate-450 block mt-0.5">{story.category}</span>
                        </div>
                        <Link href={`/stories#${story.id}`} className="text-emerald-500 font-bold hover:underline">Play</Link>
                      </div>
                    ))}
                    {savedStories.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No saved reels.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. SETTINGS PORTAL */}
            {activeTab === 'Settings' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">Profile & Settings</h3>
                  <p className="text-slate-500 text-xs">Modify parameters or delete profile credentials.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Profile Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">WhatsApp / Phone Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                  >
                    Save Profile Changes
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-850 space-y-4">
                  <h4 className="font-bold text-red-500 text-sm font-poppins">Danger Zone</h4>
                  <p className="text-slate-500 text-xs">Deleting account will erase all compassion points records, certificates list, and audit entries.</p>
                  <button
                    onClick={() => {
                      if (confirm('Are you absolutely sure you want to delete your account? This is irreversible.')) {
                        alert('Simulation complete. Under production, this triggers an API call that deletes the user profile and redirects to homepage.');
                      }
                    }}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-200"
                  >
                    <Trash2 size={14} />
                    <span>Delete OneHope Account</span>
                  </button>
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
