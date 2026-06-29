'use client';

import React from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', caption: 'Textbooks & uniform distributions, Rishikesh mountains' },
    { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400', caption: 'slum food packages distribution, Dehradun' },
    { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400', caption: 'Daily fruit distribution program shield' },
    { url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400', caption: 'Clinical testing kit deployment' },
    { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400', caption: 'Sita Devi postoperative health checkup' },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400', caption: 'Mountain school digital laboratory pods setup' }
  ];

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-12 font-inter space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon size={28} className="text-blue-600" />
            <span>Operational Field Gallery</span>
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm">
            Real snapshots captured by our field coordinators documenting textbooks distribution, centralized kitchens cooking, and surgical recovery checks.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div key={index} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                <Image src={img.url} alt={img.caption} fill className="object-cover group-hover:scale-103 transition-transform duration-500" />
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20">
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PublicLayout>
  );
}
