'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useDatabase } from '@/context/DatabaseContext';

export default function TermsConditions() {
  const { state } = useDatabase();
  
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 font-inter">
        <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mb-6">
          Terms & Conditions
        </h1>
        <p className="text-slate-400 text-xs mb-8">Last Updated: June 28, 2026</p>
        
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Welcome to <strong>{state.settings.brandName}</strong>! These terms and conditions outline the rules and regulations for the use of OneHope\'s Website, located at <a href="https://onehope.in" className="text-blue-500 hover:underline">https://onehope.in</a>.
          </p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use OneHope if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">2. Donations & Refunds</h2>
          <p>
            All donations made through OneHope are voluntary. Donors are requested to verify campaign categories and details before proceeding. Transactions are processed securely. Please refer to our Refund Policy for donation cancellation queries.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">3. Volunteer Responsibilities</h2>
          <p>
            Volunteers agree to provide true identity details during verification. Field attendance check-ins and check-outs must be logged truthfully at campaign locations in Rishikesh and other active sites.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">4. Governing Law</h2>
          <p>
            These terms are governed by the laws of India and the jurisdiction of courts in Dehradun/Rishikesh, Uttarakhand.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
