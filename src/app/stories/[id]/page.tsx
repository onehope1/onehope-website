'use client';

import React, { use } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, MapPin, Heart, MessageSquare } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoryDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { state } = useDatabase();
  
  const story = state.stories.find(s => s.id === id);

  if (!story) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-24 text-center space-y-4 font-inter">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold font-poppins text-slate-900 dark:text-white">Story not found</h2>
          <p className="text-slate-500 text-xs">The story reference ID does not exist in the database.</p>
          <Link href="/stories" className="inline-block py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl text-xs">
            Open Reels Player
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const relatedCampaign = state.campaigns.find(c => c.id === story.campaignId);

  return (
    <PublicLayout>
      <div className="max-w-xl mx-auto px-4 py-12 font-inter space-y-6">
        
        {/* Back Link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={14} />
          <span>Back to Stories Reels</span>
        </Link>

        {/* Story Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-premium">
          <div className="relative aspect-[4/5] bg-slate-200 w-full">
            <Image src={story.media[0].url} alt={story.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Control badge */}
            <Link
              href="/stories"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:scale-105 transition-all"
            >
              <Play size={14} className="fill-white translate-x-0.5" />
            </Link>

            {/* Float Info */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/25">
                  <Image src={story.authorAvatar} alt={story.author} fill className="object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{story.author}</span>
                  <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {story.location}</span>
                </div>
              </div>

              <h2 className="font-poppins font-extrabold text-base sm:text-lg text-emerald-400">{story.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{story.description}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1"><Heart size={14} /> {story.likes} Likes</span>
              <span className="flex items-center gap-1"><MessageSquare size={14} /> {story.comments.length} Comments</span>
            </div>

            {relatedCampaign && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Related Action Campaign</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">{relatedCampaign.title}</p>
                </div>
                <Link
                  href={`/campaigns/${relatedCampaign.id}`}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap"
                >
                  Sponsor
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
