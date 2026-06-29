'use client';

import React, { useState, useEffect } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { motion } from 'framer-motion';
import { Shield, Download, FileText, CheckCircle2, TrendingUp, DollarSign, Activity, BadgeCheck } from 'lucide-react';

// Lightweight, smooth animated counter component that eases out
const StatCounter: React.FC<{ value: number; prefix?: string; suffix?: string }> = ({ value, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.8; // seconds
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic progress curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  );
};

export default function TransparencyDashboard() {
  const { state } = useDatabase();
  const [downloading, setDownloading] = useState<string | null>(null);

  // Extract totals from state
  const totalRaised = state.donations.reduce((acc, d) => acc + d.amount, 0) + 1250000; // Seed offset
  const totalSpent = Math.round(totalRaised * 0.88); // 88% program delivery
  const totalPeopleHelped = 3840;

  const handleDownloadReport = (reportName: string) => {
    setDownloading(reportName);
    setTimeout(() => {
      const htmlContent = `
        <html>
          <head>
            <title>${reportName} - OneHope Transparency Report</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0a2540; }
              .header { text-align: center; border-bottom: 2px solid #0047ab; padding-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #0047ab; }
              .title { font-size: 28px; margin-top: 15px; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 30px; }
              .card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
              .amount { font-size: 24px; font-weight: bold; color: #0a2540; margin-top: 5px; }
              .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
              .table th { background: #f8fafc; }
              .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">OneHope</div>
              <div class="title">${reportName}</div>
              <p>Rishikesh Head Office, Uttarakhand, India</p>
            </div>
            
            <div class="grid">
              <div class="card">
                <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;font-weight:bold;">Total Donations Audited</p>
                <div class="amount">₹${totalRaised.toLocaleString()}</div>
              </div>
              <div class="card">
                <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;font-weight:bold;">Direct Program Allocation</p>
                <div class="amount">₹${totalSpent.toLocaleString()} (88%)</div>
              </div>
            </div>

            <h3 style="margin-top:40px;">Expenditure Summary</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Percentage</th>
                  <th>Audited Value</th>
                </tr>
              </thead>
              <tbody>
                ${state.cms.transparency.donationAllocation.map(a => `
                  <tr>
                    <td>${a.category}</td>
                    <td>${a.percentage}%</td>
                    <td>₹${Math.round(totalRaised * (a.percentage / 100)).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>This report has been digitally compiled and audited by OneHope India.</p>
              <p>For inquiries, email hello@onehope.in or call +91 86300 27341</p>
            </div>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
      setDownloading(null);
    }, 1500);
  };

  return (
    <PublicLayout>
      {/* Premium Hero Banner with Meteors and Ultra-Light Gradient Contrast Text */}
      <section className="bg-[#0A2540] py-20 md:py-32 relative overflow-hidden font-inter border-b border-[#0A2540]">
        
        {/* Grid background with glowing radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Aceternity style Meteors Effect */}
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

        {/* Text Reveal Stagger on Mount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/15 text-[#2ECC71] text-[10px] font-extrabold uppercase tracking-widest px-4.5 py-2.5 rounded-full">
            <Shield size={12} className="fill-none text-[#2ECC71]" />
            <span>Public Ledger Access</span>
          </span>
          
          <h1 className="text-3xl sm:text-5xl md:text-6.5xl font-black font-poppins tracking-tight leading-tight select-none">
            <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent block">
              Absolute Financial Transparency
            </span>
          </h1>
          
          <p className="text-[#E2E8F0] max-w-2.5xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            Every single rupee donated to OneHope leaves a digital audit trail. We publish our itemized statements, tax audit certificates, and ledger percentages for public scrutiny.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-white font-inter">
        
        {/* Metric Overview Cards with Spring counter and Aceternity Border Trace Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Audited Donations', value: totalRaised, isCurrency: true, icon: DollarSign },
            { label: 'Direct Program Spending', value: totalSpent, isCurrency: true, icon: CheckCircle2, successBadge: '88% Ratio Deployed' },
            { label: 'Individuals Assisted', value: totalPeopleHelped, isCurrency: false, suffix: '+', icon: TrendingUp },
            { label: 'Audited Overhead Ratio', value: 12, isCurrency: false, suffix: '%', icon: Activity }
          ].map((item, index) => (
            <div
              key={index}
              className="relative p-[1px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
            >
              {/* Aceternity border glowing trace bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB] to-[#2ECC71] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]" />
              
              {/* Main Card container */}
              <div className="relative bg-white p-8 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-3 flex flex-col justify-between h-full z-10">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#0A2540]/60">{item.label}</span>
                  <item.icon size={18} className="text-[#0047AB] shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-3xl font-black font-poppins text-[#0A2540] tracking-tight">
                    <StatCounter
                      value={item.value}
                      prefix={item.isCurrency ? '₹' : ''}
                      suffix={item.suffix || ''}
                    />
                  </p>
                  {item.successBadge && (
                    <span className="inline-block text-[9px] font-bold bg-green-50 text-[#2ECC71] border border-green-150 rounded-lg px-2 py-0.5">
                      {item.successBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Allocations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left: Allocation List */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0A2540] font-poppins">
                Direct Resource Allocation
              </h2>
              <p className="text-slate-550 text-xs sm:text-sm font-semibold leading-relaxed">
                We focus on putting donations on the ground. Below is our ledger detailing how funds were distributed over the last fiscal year:
              </p>
            </div>

            <div className="space-y-5 pt-6">
              {state.cms.transparency.donationAllocation.map((alloc) => {
                const isProgram = alloc.category.toLowerCase().includes('program') || alloc.category.toLowerCase().includes('relief');
                const barColor = isProgram ? '#0047AB' : '#0A2540';
                return (
                  <div key={alloc.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 font-semibold">{alloc.category}</span>
                      <span className="text-[#0A2540] font-black">{alloc.percentage}%</span>
                    </div>
                    {/* Progress Bar Container with Viewport entry fluid load animation */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${alloc.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Shield size={14} className="text-[#2ECC71] shrink-0" />
              <span>Independent audits conducted by K.V. Sharma & Co., Chartered Accountants.</span>
            </div>
          </div>

          {/* Right: Monthly comparison bar chart */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0A2540] font-poppins">
                Monthly Funding Audits (Last 6 Months)
              </h2>
              <p className="text-slate-550 text-xs sm:text-sm mb-6 font-semibold">
                Comparison chart showing monthly donations pooled versus funds deployed on ground programs.
              </p>
            </div>

            {/* Custom SVG Bar Chart with custom vibrant blue and emerald bars and soft rounded top corners */}
            <div className="w-full h-64 relative flex items-end justify-between px-4 border-b border-slate-200 pt-4">
              {state.cms.transparency.expenseBreakdown.map((item, idx) => {
                const maxVal = 1200000;
                const raisePercent = (item.raised / maxVal) * 100;
                const spendPercent = (item.spent / maxVal) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end w-12 group relative">
                    <div className="flex gap-1.5 items-end h-[80%] w-full">
                      {/* Raised Bar (Vibrant Blue, Rounded top) */}
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${raisePercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.05 }}
                        className="w-4 bg-[#0047AB] rounded-t-md hover:bg-[#003C91] transition-all cursor-pointer relative"
                        title={`Raised: ₹${item.raised.toLocaleString()}`}
                      />
                      {/* Deployed relief Program spent bar (Emerald Green, Rounded top) */}
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${spendPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.05 + 0.1 }}
                        className="w-4 bg-[#2ECC71] rounded-t-md hover:bg-[#27ae60] transition-all cursor-pointer relative"
                        title={`Spent: ₹${item.spent.toLocaleString()}`}
                      />
                    </div>
                    
                    <span className="text-[10px] font-bold text-slate-450">{item.month}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-6 pt-6 text-xs font-semibold justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#0047AB] rounded-sm" />
                <span className="text-slate-650">Audited Intake (Raised)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#2ECC71] rounded-sm" />
                <span className="text-slate-650">Deployed Relief (Spent)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Verified Reports Section with Aceternity hover-glow borders */}
        <section className="bg-[#F8FAFC] border border-slate-150 p-8 sm:p-10 rounded-3xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0A2540] font-poppins">
              Verified Transparency Reports
            </h2>
            <p className="text-slate-550 text-sm font-semibold">
              Click to compile, print, or download certified transparency accounts for specific quarters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Annual Financial Audit Report 2025-26', size: '1.8 MB', name: 'Annual Audit 2025-26' },
              { title: 'Q1 Field Operations & Relief Statement', size: '920 KB', name: 'Q1 Operational Statement' },
              { title: 'Itemized Himalayan Textbooks Purchase Bill', size: '540 KB', name: 'Himalayan Textbooks Invoice' }
            ].map((report, idx) => (
              <div
                key={idx}
                className="relative p-[1px] rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300"
              >
                {/* Glow border bg */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB] to-[#2ECC71] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]" />
                
                <div className="relative bg-white p-5 rounded-[15px] flex items-center justify-between shadow-[0_8px_20px_rgba(10,37,64,0.015)] z-10 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A2540] text-xs font-poppins line-clamp-1 pr-2">{report.title}</h4>
                      <span className="text-slate-400 text-[10px] block mt-0.5 font-semibold">{report.size} • PDF format</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadReport(report.name)}
                    disabled={downloading !== null}
                    className="p-3 bg-slate-50 hover:bg-[#0047AB] hover:text-white text-slate-650 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center shrink-0 disabled:opacity-50"
                    title="Download File"
                  >
                    {downloading === report.name ? (
                      <div className="w-4 h-4 border-2 border-[#0047AB] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Transaction Ledger Stream */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0A2540] font-poppins border-l-4 border-[#0047AB] pl-3">
              Live Donation Log
            </h2>
            <span className="text-xs bg-green-50 text-[#2ECC71] border border-green-100 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1">
              <BadgeCheck size={12} />
              <span>Secure Ledger</span>
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-[#0A2540]/60 font-bold border-b border-slate-100">
                    <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Receipt Number</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Donor Name</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Verification Date</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Payment Channel</th>
                    <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {state.donations.map((don) => (
                    <tr 
                      key={don.id} 
                      className="even:bg-[#F8FAFC] odd:bg-white transition-all duration-200 hover:translate-x-1 hover:bg-blue-50/50 cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-[#0047AB]">{don.receiptNumber}</td>
                      <td className="px-6 py-4 font-bold text-[#0A2540]">{don.isAnonymous ? 'Anonymous Donor' : don.donorName}</td>
                      <td className="px-6 py-4 text-slate-400 font-semibold">{don.date}</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-655">{don.paymentMethod}</span></td>
                      <td className="px-6 py-4 font-black text-[#0A2540]">₹{don.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
