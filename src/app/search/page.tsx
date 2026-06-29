'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDatabase } from '@/context/DatabaseContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Tag, ArrowRight, Heart } from 'lucide-react';

export default function GlobalSearch() {
  const { state } = useDatabase();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'All' | 'Campaigns' | 'Stories' | 'Blogs'>('All');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');

  // Synchronize search params from URL on load
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Extract unique categories and locations
  const categories = ['All', ...Array.from(new Set([
    ...state.campaigns.map(c => c.category),
    ...state.stories.map(s => s.category),
    ...state.blogs.map(b => b.category)
  ]))];

  const locations = ['All', ...Array.from(new Set([
    ...state.campaigns.map(c => c.location.split(',')[0].trim()),
    ...state.stories.map(s => s.location.split(',')[0].trim())
  ]))];

  // Filtering Logic
  const filteredCampaigns = state.campaigns.filter(c => {
    const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase()) || 
                         c.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || c.category === category;
    const matchesLocation = location === 'All' || c.location.toLowerCase().includes(location.toLowerCase());
    return matchesQuery && matchesCategory && matchesLocation;
  });

  const filteredStories = state.stories.filter(s => {
    const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || 
                         s.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || s.category === category;
    const matchesLocation = location === 'All' || s.location.toLowerCase().includes(location.toLowerCase());
    return matchesQuery && matchesCategory && matchesLocation;
  });

  const filteredBlogs = state.blogs.filter(b => {
    const matchesQuery = b.title.toLowerCase().includes(query.toLowerCase()) || 
                         b.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || b.category === category;
    return matchesQuery && matchesCategory; // Blogs don't have locations
  });

  const hasResults = 
    (filterType === 'All' || filterType === 'Campaigns') && filteredCampaigns.length > 0 ||
    (filterType === 'All' || filterType === 'Stories') && filteredStories.length > 0 ||
    (filterType === 'All' || filterType === 'Blogs') && filteredBlogs.length > 0;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-inter">
        
        {/* Header Search Bar */}
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-4">
          <h1 className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">
            Global Hub Search
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns, reels stories, blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none text-slate-950 dark:text-white text-base shadow-sm"
            />
            <Search className="absolute left-4 top-4.5 text-slate-400" size={20} />
          </div>
        </div>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-10">
          {/* Main sections */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {(['All', 'Campaigns', 'Stories', 'Blogs'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sub Dropdown Selectors */}
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {filterType !== 'Blogs' && (
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Region</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results Stream */}
        <div className="space-y-12">
          {!hasResults && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3">
              <span className="text-3xl block">🔍</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-poppins">No matches found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                Try searching for other keywords like "Rishikesh", "Education", "Food", "Medical", or check your spelling.
              </p>
            </div>
          )}

          {/* 1. Campaigns Grid */}
          {(filterType === 'All' || filterType === 'Campaigns') && filteredCampaigns.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-poppins border-l-4 border-blue-600 pl-3">
                Active Campaigns ({filteredCampaigns.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCampaigns.map((camp) => (
                  <div key={camp.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col justify-between">
                    <div className="p-5 space-y-3">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {camp.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors font-poppins">
                        <Link href={`/campaigns/${camp.id}`}>{camp.title}</Link>
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {camp.summary}
                      </p>
                    </div>
                    <div className="p-5 border-t border-slate-50 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin size={12} /> {camp.location.split(',')[0]}
                      </span>
                      <Link href={`/campaigns/${camp.id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Reels Stories Grid */}
          {(filterType === 'All' || filterType === 'Stories') && filteredStories.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-poppins border-l-4 border-emerald-600 pl-3">
                Stories Reel ({filteredStories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <div key={story.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col justify-between">
                    <div className="relative aspect-video bg-slate-200">
                      <Image src={story.media[0].url} alt={story.title} fill className="object-cover" />
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 rounded text-[10px] text-white">Reel</div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white font-poppins leading-tight">
                        <Link href={`/stories#${story.id}`}>{story.title}</Link>
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">
                        {story.description}
                      </p>
                    </div>
                    <div className="p-5 border-t border-slate-50 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{story.category}</span>
                      <Link href="/stories" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <span>Play Reel</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Blogs Grid */}
          {(filterType === 'All' || filterType === 'Blogs') && filteredBlogs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-poppins border-l-4 border-amber-500 pl-3">
                Blog Articles ({filteredBlogs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-premium p-6 flex gap-4">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-150">
                      <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
                    </div>
                    <div className="space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Tag size={10} /> {blog.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white font-poppins text-sm sm:text-base leading-tight mt-1">
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1">
                          {blog.excerpt}
                        </p>
                      </div>
                      <Link href={`/blog/${blog.slug}`} className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors flex items-center gap-0.5 mt-2 self-start">
                        <span>Read article</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </PublicLayout>
  );
}
