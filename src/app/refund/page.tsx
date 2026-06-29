'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useDatabase } from '@/context/DatabaseContext';

export default function RefundPolicy() {
  const { state } = useDatabase();
  
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 font-inter">
        <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mb-6">
          Refund & Cancellation Policy
        </h1>
        <p className="text-slate-400 text-xs mb-8">Last Updated: June 28, 2026</p>
        
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            At <strong>{state.settings.brandName}</strong>, we are committed to absolute honesty and transparency. Since contributions are immediately channeled to active food, education, medical, and disaster campaigns, refunds are generally not permitted.
          </p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">1. Erroneous Donations</h2>
          <p>
            If you made an accidental duplicate donation or entered an incorrect amount, please contact our support team at <strong>{state.settings.supportEmail}</strong> within 7 days of the transaction. You must provide the transaction reference and receipt number from your dashboard.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">2. Processing Time</h2>
          <p>
            Once approved by our screening panel, refunds are processed back to the original payment source (Credit Card/UPI/Netbanking) within 5 to 7 working days.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">3. Recurring Donations</h2>
          <p>
            Monthly/recurring donations can be paused or cancelled at any time directly from your User Dashboard settings, or by emailing <strong>{state.settings.supportEmail}</strong>.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
