'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import { Heart, FileText, CheckCircle2, Download, Award, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DonationSuccess() {
  const { state } = useDatabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const donationId = searchParams.get('id') || '';
  const donation = state.donations.find(d => d.id === donationId);

  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  // Trigger celebration on render
  useEffect(() => {
    if (!donation) return;
    
    // Shoot initial confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Secondary delayed stream
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [donation]);

  if (!donation) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 font-inter">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Transaction not found</h2>
          <p className="text-slate-500 text-xs">No active donation matches this reference receipt.</p>
          <Link href="/" className="inline-block py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl text-xs">
            Return Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const relatedCampaign = state.campaigns.find(c => c.id === donation.campaignId);

  const handleDownloadReceipt = () => {
    setDownloadingReceipt(true);
    setTimeout(() => {
      const htmlContent = `
        <html>
          <head>
            <title>Donation Receipt - ${donation.receiptNumber}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
              .logo { font-size: 26px; font-weight: bold; color: #2563eb; }
              .receipt-title { font-size: 20px; font-weight: bold; margin-top: 15px; text-transform: uppercase; color: #0f172a; }
              .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              .table td { border-bottom: 1px solid #f1f5f9; padding: 12px 0; }
              .label { font-weight: bold; color: #475569; width: 40%; }
              .val { text-align: right; font-weight: 500; }
              .tax-note { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin-top: 30px; font-size: 11px; color: #475569; }
              .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">OneHope Rishikesh</div>
              <div class="receipt-title">Official Donation Receipt</div>
              <p style="margin:5px 0 0 0;font-size:12px;color:#64748b;">Mayakund, near Triveni Ghat, Rishikesh, Uttarakhand, India</p>
            </div>
            
            <table class="table">
              <tr>
                <td class="label">Receipt Number</td>
                <td class="val" style="font-family:monospace;font-weight:bold;color:#2563eb;">${donation.receiptNumber}</td>
              </tr>
              <tr>
                <td class="label">Donor Name</td>
                <td class="val">${donation.donorName}</td>
              </tr>
              <tr>
                <td class="label">Donor Email</td>
                <td class="val">${donation.email}</td>
              </tr>
              <tr>
                <td class="label">Contribution Amount</td>
                <td class="val" style="font-weight:bold;font-size:16px;">₹${donation.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td class="label">Payment Date</td>
                <td class="val">${donation.date}</td>
              </tr>
              <tr>
                <td class="label">Payment Method</td>
                <td class="val">${donation.paymentMethod}</td>
              </tr>
              <tr>
                <td class="label">Allocation Target</td>
                <td class="val">${relatedCampaign ? relatedCampaign.title : 'General Welfare Fund'}</td>
              </tr>
            </table>

            <div class="tax-note">
              <strong>TRANSACTION RECEIPT:</strong><br>
              OneHope operates as a direct community initiative in Rishikesh. Every contribution goes entirely to ground supplies. Thank you for your support.
            </div>

            <div class="footer">
              <p>This is a computer-generated transaction receipt issued by the OneHope Team.</p>
              <p>Email: hello@onehope.in | Phone: +91 86300 27341</p>
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
      setDownloadingReceipt(false);
    }, 1200);
  };

  const handleDownloadCertificate = () => {
    setDownloadingCertificate(true);
    setTimeout(() => {
      const htmlContent = `
        <html>
          <head>
            <title>Donation Certificate - ${donation.donorName}</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; color: #1e293b; background-color: #fafaf9; }
              .border-outer { border: 12px double #2563eb; padding: 40px; background-color: #ffffff; border-radius: 4px; text-align: center; }
              .logo { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: bold; color: #2563eb; letter-spacing: 2px; }
              .cert-title { font-size: 32px; color: #1e3a8a; margin-top: 30px; font-weight: 500; }
              .subtitle { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-top: 10px; }
              .present-text { font-size: 16px; font-style: italic; margin-top: 40px; color: #475569; }
              .name { font-size: 28px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #2563eb; display: inline-block; padding: 5px 30px; margin-top: 15px; }
              .reason { font-size: 14px; line-height: 1.8; margin-top: 30px; padding: 0 40px; color: #475569; }
              .date-row { display: flex; justify-content: space-around; margin-top: 50px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; }
              .signature { border-top: 1px solid #cbd5e1; width: 150px; padding-top: 8px; margin: 0 auto; color: #475569; }
            </style>
          </head>
          <body>
            <div class="border-outer">
              <div class="logo">ONEHOPE RISHIKESH</div>
              <div class="cert-title">Certificate of Compassion</div>
              <div class="subtitle">Awarded for humanitarian sponsorship</div>
              
              <p class="present-text">This certificate is proudly presented to</p>
              <div class="name">${donation.donorName}</div>
              
              <p class="reason">
                In deep appreciation for their generous contribution of <strong>₹${donation.amount.toLocaleString()}</strong> towards the <strong>${relatedCampaign ? relatedCampaign.title : 'OneHope General Welfare Relief Fund'}</strong>. Your kindness has directly assisted field programs, providing dignity, sustenance, and hope.
              </p>

              <div class="date-row">
                <div>
                  <p style="font-weight:bold;margin:0;">${donation.date.split(' ')[0]}</p>
                  <p class="signature">Issue Date</p>
                </div>
                <div>
                  <p style="font-weight:bold;margin:0;font-family:cursive;">Vipu Rishikesh</p>
                  <p class="signature">Founder & Organizer</p>
                </div>
              </div>
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
      setDownloadingCertificate(false);
    }, 1500);
  };

  const [copied, setCopied] = useState(false);

  const getEstimatedImpact = () => {
    if (!relatedCampaign) {
      return `Sponsors emergency aid and daily meals where the ground need is greatest in Rishikesh.`;
    }
    if (relatedCampaign.pricePerUnit) {
      const units = Math.floor(donation.amount / relatedCampaign.pricePerUnit);
      if (units > 0) {
        return `Directly provides support for ${units} ${relatedCampaign.unitLabel}${units > 1 ? 's' : ''} in Rishikesh.`;
      }
    }
    return `Supports essential relief operations for ${relatedCampaign.title} in Rishikesh.`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/campaigns');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 font-inter text-center space-y-8 bg-white">
        
        {/* Animated Heart */}
        <div className="inline-flex w-20 h-20 bg-red-50 text-red-600 rounded-full items-center justify-center border-2 border-red-500/20 shadow-lg shadow-red-500/10">
          <Heart size={40} className="stroke-[2] fill-red-500 text-red-600" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black font-poppins text-[#092C5C]">
            Thank You ❤️
          </h1>
          <p className="text-slate-550 text-sm font-semibold max-w-lg mx-auto">
            Your kindness is changing lives.
          </p>
        </div>

        {/* Donation Info Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-[24px] text-left max-w-xl mx-auto shadow-[0_15px_40px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
            <span className="text-slate-400 font-semibold">Donation ID:</span>
            <span className="font-mono font-bold text-blue-600">{donationId}</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm font-semibold">
            <div className="flex justify-between">
              <span className="text-slate-400">Campaign Name:</span>
              <span className="font-bold text-[#092C5C] max-w-[250px] truncate">
                {relatedCampaign ? relatedCampaign.title : 'OneHope General Support Fund'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Donation Amount:</span>
              <span className="font-bold text-slate-900">₹{donation.amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
              <span className="text-slate-400">Estimated Impact:</span>
              <span className="text-[#22C55E] font-bold text-xs sm:text-sm leading-relaxed">
                {getEstimatedImpact()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto pt-4">
          <button
            onClick={handleDownloadReceipt}
            disabled={downloadingReceipt}
            className="w-full sm:w-auto px-6 h-12 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#092C5C] font-bold rounded-[18px] text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {downloadingReceipt ? (
              <div className="w-4 h-4 border-2 border-[#092C5C] border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText size={15} />
            )}
            <span>Receipt PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 h-12 bg-[#1E63FF] hover:bg-[#0047AB] text-white font-bold rounded-[18px] text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10"
          >
            <Share2 size={15} />
            <span>{copied ? 'Link Copied!' : 'Share Support'}</span>
          </button>
        </div>

        <div className="pt-4 flex justify-center gap-8 text-xs text-slate-450 font-bold uppercase tracking-wider font-poppins">
          <Link href="/transparency" className="hover:text-blue-500 hover:underline">Transparency Ledger</Link>
          <Link href="/" className="hover:text-blue-500 hover:underline">Homepage</Link>
        </div>

      </div>
    </PublicLayout>
  );
}
