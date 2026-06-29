'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';

export default function CookiePolicy() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 font-inter">
        <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mb-6">
          Cookie Policy
        </h1>
        <p className="text-slate-400 text-xs mb-8">Last Updated: June 28, 2026</p>
        
        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            This website uses cookies to enhance your experience. Cookies are small text files stored on your browser to recall login sessions, active donations, theme selection (dark vs light mode), and CMS settings parameters.
          </p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">1. How We Use Cookies</h2>
          <p>
            We use strictly necessary cookies to keep you signed into your dashboard, save preferences (such as bookmarking stories or saving campaigns), and secure our mock transaction APIs against CSRF attacks.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-poppins pt-4">2. Disabling Cookies</h2>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser. However, disabling cookies may downgrade or break certain elements of the OneHope visual CMS and dashboard portals.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
