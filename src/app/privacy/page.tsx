'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useDatabase } from '@/context/DatabaseContext';

export default function PrivacyPolicy() {
  const { state } = useDatabase();
  
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 font-inter">
        <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-xs mb-8">Last Updated: June 28, 2026</p>
        
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            At <strong>{state.settings.brandName}</strong>, accessible from <a href="https://onehope.in" className="text-blue-500 hover:underline">https://onehope.in</a>, one of our main priorities is the privacy of our visitors and donors. This Privacy Policy document contains types of information that is collected and recorded by OneHope and how we use it.
          </p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">1. Information We Collect</h2>
          <p>
            If you make a donation or sign up as a volunteer, we collect personal information you provide such as your name, email address, phone number, and billing details. Payment credentials (card details, UPI handles) are processed securely via our payments partner (Razorpay) and are never stored directly on our servers.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to process donations, send 80G tax certificates, manage volunteer hours, verify identities, and distribute monthly newsletters and campaign reports.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">3. Transparency & Public Ledger</h2>
          <p>
            To fulfill our 100% transparency mission, public donations show the donor name and amount on our campaigns page. However, you can toggle the "Anonymous Donation" checkbox at checkout to hide your identity from the public while still receiving tax receipts in private.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">4. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>{state.settings.supportEmail}</strong> or call <strong>{state.settings.supportPhone}</strong>.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
