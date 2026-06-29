'use client';

import React from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowLeft, Video, Play } from 'lucide-react';

export default function VideosPage() {
  const { state } = useDatabase();

  const mockVideos = [
    { id: 'v-1', title: 'Himalayan Education Field Drive 2026', desc: 'A short documentary following our volunteers as they deliver school kits, computers, and uniforms to Ganga Primary School in remote Rishikesh villages.', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600', length: '5:42' },
    { id: 'v-2', title: 'Nutrition Shield: slum distribution walk', desc: 'Watch a step-by-step walkthrough of Gauri delivering fresh food packs and apples to kids along the Dehradun railway slums.', cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600', length: '3:15' },
    { id: 'v-3', title: 'Sita Devi recovery report', desc: 'A short update capturing Sita Devi recovery at home after undergoing cardiac surgery funded by our Emergency Medical Aid.', cover: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600', length: '2:40' }
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
            <Video size={28} className="text-blue-600" />
            <span>Latest Field Videos</span>
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm">
            Watch real-time operational clips, documentary walkthroughs, and updates recorded directly by our teams in Rishikesh.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockVideos.map((vid) => (
            <div key={vid.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                <Image src={vid.cover} alt={vid.title} fill className="object-cover group-hover:scale-103 transition-all" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={18} className="fill-blue-600 translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-[9px] text-white font-bold">{vid.length}</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-poppins line-clamp-1 leading-snug group-hover:text-blue-600">{vid.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-3">{vid.desc}</p>
              </div>
              <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-850 mt-auto bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => alert(`Simulating playback for video: ${vid.title}. Under a live build, this runs directly inside a popup player.`)}
                  className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400 rounded-xl text-xs font-bold"
                >
                  Play Document
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </PublicLayout>
  );
}
