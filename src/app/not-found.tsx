'use client';

import React from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 font-inter">
        <div className="inline-flex w-16 h-16 bg-blue-50 dark:bg-slate-900 text-blue-600 rounded-full items-center justify-center border border-blue-200 dark:border-slate-800">
          <Heart size={28} className="fill-none" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-poppins text-slate-900 dark:text-white">404</h1>
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            We couldn't find the page you are looking for. However, hope is never lost!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10"
          >
            Return Home
          </Link>
          <Link
            href="/campaigns"
            className="py-3 px-6 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold rounded-xl text-xs"
          >
            Explore Campaigns
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
